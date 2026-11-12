begin;

create extension if not exists citext;
create table public.lead_contacts(
  id uuid primary key default gen_random_uuid(),
  email citext not null unique check(char_length(email::text) between 3 and 254),
  marketing_consent boolean not null default false,
  marketing_consented_at timestamptz,
  unsubscribed_at timestamptz,
  privacy_policy_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.lead_downloads(
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.lead_contacts(id) on delete cascade,
  guide_key text not null check(guide_key~'^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  request_count integer not null default 1 check(request_count>0),
  first_requested_at timestamptz not null default now(),
  last_requested_at timestamptz not null default now(),
  unique(lead_id,guide_key)
);
create index lead_downloads_guide_idx on public.lead_downloads(guide_key,last_requested_at desc);
alter table public.lead_contacts enable row level security;
alter table public.lead_downloads enable row level security;
revoke all on public.lead_contacts,public.lead_downloads from anon,authenticated;

create or replace function public.capture_lead_magnet(p_email text,p_guide_key text,p_marketing_consent boolean,p_privacy_policy_version text)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_lead_id uuid;v_now timestamptz:=now();
begin
  if p_email is null or char_length(trim(p_email)) not between 3 and 254 then raise exception 'Invalid email';end if;
  if p_guide_key is null or p_guide_key!~'^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'Invalid guide';end if;
  insert into public.lead_contacts(email,marketing_consent,marketing_consented_at,privacy_policy_version)
  values(lower(trim(p_email))::citext,p_marketing_consent,case when p_marketing_consent then v_now end,p_privacy_policy_version)
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

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('free-guides','free-guides',false,10485760,array['application/pdf'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

commit;
