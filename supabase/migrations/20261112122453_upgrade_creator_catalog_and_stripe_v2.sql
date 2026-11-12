begin;

alter table public.products
  add column if not exists catalog_key text,
  add column if not exists category text,
  add column if not exists stripe_product_id text,
  add column if not exists stripe_price_id text;
alter table public.products drop constraint if exists products_catalog_key_check;
alter table public.products add constraint products_catalog_key_check check(catalog_key is null or catalog_key~'^[a-z0-9]+(?:-[a-z0-9]+)*$');

create unique index if not exists products_store_catalog_key_uidx on public.products(store_id,catalog_key) where catalog_key is not null;
create unique index if not exists products_stripe_product_id_uidx on public.products(stripe_product_id) where stripe_product_id is not null;
create unique index if not exists products_stripe_price_id_uidx on public.products(stripe_price_id) where stripe_price_id is not null;

create table if not exists public.creator_subscriptions(
  id uuid primary key default gen_random_uuid(), store_id uuid not null unique references public.stores(id),
  stripe_subscription_id text not null unique, stripe_price_id text, status text not null,
  quantity integer not null default 1, cancel_at_period_end boolean not null default false,
  current_period_end timestamptz, updated_at timestamptz not null default now()
);
alter table public.creator_subscriptions enable row level security;
grant select on public.creator_subscriptions to authenticated;
drop policy if exists "owners read subscriptions" on public.creator_subscriptions;
create policy "owners read subscriptions" on public.creator_subscriptions for select to authenticated
  using(exists(select 1 from public.stores s where s.id=store_id and s.owner_id=(select auth.uid())));

update public.products set
  catalog_key=case title
    when 'Build Your AI Cleaning Quotation System in Just 3 Days' then 'cleaning-quotes'
    when 'Price Your Mobile Detailing Services Like a Pro in 48 Hours' then 'mobile-detailing'
    when 'Build Your AI Installation Quotation System in Just 3 Days' then 'installer-quotes'
    when 'Organize Your Event Rental Business in Just 7 Days' then 'event-rentals'
    when 'Build Your Airbnb Cleaning & Turnover System in 48 Hours' then 'airbnb-turnover'
    when 'Learn to Price Your Custom Cakes Like a Pro in Just 24 Hours' then 'custom-cakes'
    when 'Build Your Mobile Dog Grooming Business System in 3 Days' then 'dog-grooming'
    when 'Create Your Wedding Photography Pricing & Booking System in 7 Days' then 'wedding-photography'
    when 'Build Your Food Truck Pricing & Profit System in Just 3 Days' then 'food-truck'
    when 'Launch Your Website Maintenance Packages in Just 7 Days' then 'web-agency-care' end,
  category=case title
    when 'Build Your AI Cleaning Quotation System in Just 3 Days' then 'Cleaning & Property'
    when 'Price Your Mobile Detailing Services Like a Pro in 48 Hours' then 'Automotive Services'
    when 'Build Your AI Installation Quotation System in Just 3 Days' then 'Trades & Contracting'
    when 'Organize Your Event Rental Business in Just 7 Days' then 'Events & Rentals'
    when 'Build Your Airbnb Cleaning & Turnover System in 48 Hours' then 'Cleaning & Property'
    when 'Learn to Price Your Custom Cakes Like a Pro in Just 24 Hours' then 'Food & Hospitality'
    when 'Build Your Mobile Dog Grooming Business System in 3 Days' then 'Pet Services'
    when 'Create Your Wedding Photography Pricing & Booking System in 7 Days' then 'Creative Services'
    when 'Build Your Food Truck Pricing & Profit System in Just 3 Days' then 'Food & Hospitality'
    when 'Launch Your Website Maintenance Packages in Just 7 Days' then 'Digital Agencies' end,
  price_minor=1499
where title in (
  'Build Your AI Cleaning Quotation System in Just 3 Days','Price Your Mobile Detailing Services Like a Pro in 48 Hours',
  'Build Your AI Installation Quotation System in Just 3 Days','Organize Your Event Rental Business in Just 7 Days',
  'Build Your Airbnb Cleaning & Turnover System in 48 Hours','Learn to Price Your Custom Cakes Like a Pro in Just 24 Hours',
  'Build Your Mobile Dog Grooming Business System in 3 Days','Create Your Wedding Photography Pricing & Booking System in 7 Days',
  'Build Your Food Truck Pricing & Profit System in Just 3 Days','Launch Your Website Maintenance Packages in Just 7 Days'
);

drop function if exists public.record_refund(text,text,integer,text);
create or replace function public.record_refund(p_charge_id text,p_payment_intent_id text,p_amount_refunded_minor integer,p_status text,p_connected_account_id text)
returns void language plpgsql security definer set search_path='' as $$
declare v_payment public.payments%rowtype;v_order public.orders%rowtype;
begin
  select * into v_payment from public.payments where provider_payment_id=p_payment_intent_id and connected_account_id=p_connected_account_id for update;
  if not found then return;end if;
  select * into v_order from public.orders where id=v_payment.order_id for update;
  insert into public.refunds(payment_id,provider_refund_reference,amount_minor,status) values(v_payment.id,p_charge_id,p_amount_refunded_minor,p_status);
  if p_amount_refunded_minor>=v_order.total_minor then
    update public.orders set status='refunded' where id=v_order.id;update public.payments set status='refunded' where id=v_payment.id;
    update public.entitlements set status='revoked' where order_item_id in(select id from public.order_items where order_id=v_order.id);
  else
    update public.orders set status='partially_refunded' where id=v_order.id;update public.payments set status='partially_refunded' where id=v_payment.id;
  end if;
end$$;
revoke all on function public.record_refund(text,text,integer,text,text) from public,anon,authenticated;
grant execute on function public.record_refund(text,text,integer,text,text) to service_role;

create index if not exists stores_owner_idx on public.stores(owner_id);
create index if not exists product_files_product_idx on public.product_files(product_id);
create index if not exists order_items_product_idx on public.order_items(product_id);
create index if not exists entitlements_product_idx on public.entitlements(product_id);
create index if not exists download_events_entitlement_idx on public.download_events(entitlement_id);
create index if not exists download_events_buyer_idx on public.download_events(buyer_id);
create index if not exists download_events_product_file_idx on public.download_events(product_file_id);

commit;
