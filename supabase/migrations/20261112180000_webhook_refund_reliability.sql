-- Additive migration for payment reliability. Apply after the creator marketplace migration.
-- This migration does not recreate existing tables.
begin;

with ranked as (
  select id, max(amount_minor) over (partition by payment_id, provider_refund_reference) as max_amount,
         row_number() over (partition by payment_id, provider_refund_reference order by created_at, id) as rn
  from public.refunds
  where provider_refund_reference is not null
)
update public.refunds r set amount_minor = ranked.max_amount
from ranked where r.id = ranked.id and ranked.rn = 1;

with ranked as (
  select id, row_number() over (partition by payment_id, provider_refund_reference order by created_at, id) as rn
  from public.refunds where provider_refund_reference is not null
)
delete from public.refunds r using ranked
where r.id = ranked.id and ranked.rn > 1;

create unique index if not exists refunds_payment_charge_unique
on public.refunds(payment_id, provider_refund_reference)
where provider_refund_reference is not null;

-- Retry failed webhook events and reclaim abandoned processing claims after five minutes.
create or replace function public.claim_webhook_event(
  p_provider text, p_event_id text, p_event_type text, p_connected_account_id text
) returns boolean language plpgsql security definer set search_path = '' as $$
begin
  insert into public.webhook_events (
    provider, event_id, event_type, connected_account_id, status, received_at,
    processed_at, error_message
  ) values (
    p_provider, p_event_id, p_event_type, p_connected_account_id, 'processing', now(), null, null
  ) on conflict (provider, event_id) do update
    set status = 'processing', received_at = now(), processed_at = null, error_message = null
    where public.webhook_events.event_type = excluded.event_type
      and public.webhook_events.connected_account_id is not distinct from excluded.connected_account_id
      and (
        public.webhook_events.status = 'failed'
        or (public.webhook_events.status = 'processing'
            and public.webhook_events.received_at < now() - interval '5 minutes')
      );
  return found;
end;
$$;
revoke all on function public.claim_webhook_event(text,text,text,text) from public, anon, authenticated;
grant execute on function public.claim_webhook_event(text,text,text,text) to service_role;

-- Enforce order/account/session identity before granting entitlements.
create or replace function public.fulfill_paid_order(
  p_order_id uuid, p_checkout_session_id text, p_payment_intent_id text,
  p_connected_account_id text, p_amount_minor integer, p_currency text
) returns void language plpgsql security definer set search_path = '' as $$
declare v_order public.orders%rowtype; v_expected_account text;
begin
  if p_checkout_session_id is null or p_payment_intent_id is null or p_connected_account_id is null then
    raise exception 'Missing Stripe payment identifiers';
  end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  select sa.account_id into v_expected_account
    from public.stripe_accounts sa where sa.store_id = v_order.store_id;
  if v_expected_account is distinct from p_connected_account_id then
    raise exception 'Connected account mismatch';
  end if;
  if v_order.total_minor <> p_amount_minor or v_order.currency <> p_currency then
    raise exception 'Order amount or currency mismatch';
  end if;
  if v_order.stripe_checkout_session_id is not null
    and v_order.stripe_checkout_session_id <> p_checkout_session_id then
    raise exception 'Checkout session mismatch';
  end if;
  if v_order.stripe_payment_intent_id is not null
    and v_order.stripe_payment_intent_id <> p_payment_intent_id then
    raise exception 'Payment intent mismatch';
  end if;
  if v_order.status in ('paid','partially_refunded','refunded') then return; end if;
  if v_order.status <> 'pending' then raise exception 'Order not pending'; end if;

  update public.orders set status = 'paid',
    stripe_checkout_session_id = p_checkout_session_id,
    stripe_payment_intent_id = p_payment_intent_id,
    stripe_connected_account_id = p_connected_account_id,
    paid_at = now() where id = p_order_id;
  insert into public.payments(order_id,provider,provider_payment_id,connected_account_id,status,amount_minor,currency)
    values(p_order_id,'stripe',p_payment_intent_id,p_connected_account_id,'succeeded',p_amount_minor,p_currency)
    on conflict(order_id) do nothing;
  insert into public.entitlements(order_item_id,buyer_id,product_id)
    select oi.id,v_order.buyer_id,oi.product_id from public.order_items oi
    where oi.order_id = p_order_id on conflict(order_item_id) do nothing;
end;
$$;
revoke all on function public.fulfill_paid_order(uuid,text,text,text,integer,text) from public, anon, authenticated;
grant execute on function public.fulfill_paid_order(uuid,text,text,text,integer,text) to service_role;

-- Stripe charge.amount_refunded is cumulative; keep monotonic totals per charge.
create or replace function public.record_refund(
  p_charge_id text, p_payment_intent_id text,
  p_amount_refunded_minor integer, p_status text, p_connected_account_id text
) returns void language plpgsql security definer set search_path = '' as $$
declare v_payment public.payments%rowtype; v_order public.orders%rowtype;
        v_previous integer; v_cumulative integer;
begin
  if p_charge_id is null or p_payment_intent_id is null or p_connected_account_id is null then
    raise exception 'Missing refund identifiers';
  end if;
  if p_amount_refunded_minor < 0 then raise exception 'Invalid refund amount'; end if;
  select * into v_payment from public.payments
    where provider_payment_id = p_payment_intent_id for update;
  if not found then
    raise exception 'Payment not yet recorded';
  end if;
  if v_payment.connected_account_id <> p_connected_account_id then
    raise exception 'Refund account mismatch';
  end if;
  select * into v_order from public.orders where id = v_payment.order_id for update;
  if p_amount_refunded_minor > v_payment.amount_minor then
    raise exception 'Refund exceeds payment amount';
  end if;
  select amount_minor into v_previous from public.refunds
    where payment_id = v_payment.id and provider_refund_reference = p_charge_id;
  v_cumulative := greatest(coalesce(v_previous,0),p_amount_refunded_minor);
  if v_cumulative = 0 then return; end if;

  insert into public.refunds(payment_id,provider_refund_reference,amount_minor,status)
    values(v_payment.id,p_charge_id,v_cumulative,
      case when v_cumulative = v_payment.amount_minor then 'succeeded' else 'partial' end)
    on conflict (payment_id,provider_refund_reference)
      where provider_refund_reference is not null
    do update set amount_minor = greatest(public.refunds.amount_minor,excluded.amount_minor),
      status = case when greatest(public.refunds.amount_minor,excluded.amount_minor) = v_payment.amount_minor
        then 'succeeded' else 'partial' end;
  if v_cumulative >= v_payment.amount_minor then
    update public.orders set status = 'refunded' where id = v_order.id;
    update public.payments set status = 'refunded' where id = v_payment.id;
    update public.entitlements set status = 'revoked' where order_item_id in
      (select id from public.order_items where order_id = v_order.id);
  elsif v_order.status <> 'refunded' then
    update public.orders set status = 'partially_refunded' where id = v_order.id;
    update public.payments set status = 'partially_refunded' where id = v_payment.id;
  end if;
end;
$$;
revoke all on function public.record_refund(text,text,integer,text,text) from public, anon, authenticated;
grant execute on function public.record_refund(text,text,integer,text,text) to service_role;
drop function if exists public.record_refund(text,text,integer,text);
commit;
