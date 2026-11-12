begin;
alter table public.lead_contacts alter column email type text using email::text;
alter table public.lead_contacts add constraint lead_contacts_email_lowercase check(email=lower(email));
drop extension if exists citext;
create or replace function public.capture_lead_magnet(p_email text,p_guide_key text,p_marketing_consent boolean,p_privacy_policy_version text)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_lead_id uuid;v_now timestamptz:=now();
begin
  if p_email is null or char_length(trim(p_email)) not between 3 and 254 then raise exception 'Invalid email';end if;
  if p_guide_key is null or p_guide_key!~'^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'Invalid guide';end if;
  insert into public.lead_contacts(email,marketing_consent,marketing_consented_at,privacy_policy_version)
  values(lower(trim(p_email)),p_marketing_consent,case when p_marketing_consent then v_now end,p_privacy_policy_version)
  on conflict(email) do update set
    marketing_consent=public.lead_contacts.marketing_consent or excluded.marketing_consent,
    marketing_consented_at=coalesce(public.lead_contacts.marketing_consented_at,excluded.marketing_consented_at),
    privacy_policy_version=excluded.privacy_policy_version,updated_at=v_now
  returning id into v_lead_id;
  insert into public.lead_downloads(lead_id,guide_key) values(v_lead_id,p_guide_key)
  on conflict(lead_id,guide_key) do update set request_count=public.lead_downloads.request_count+1,last_requested_at=v_now;
  return v_lead_id;
end$$;
revoke all on function public.capture_lead_magnet(text,text,boolean,text) from public,anon,authenticated;
grant execute on function public.capture_lead_magnet(text,text,boolean,text) to service_role;
commit;
