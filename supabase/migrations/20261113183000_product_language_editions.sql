-- Per-product language editions and immutable purchased-language selection.
-- Database migration only. Do not publish or backfill missing translations.
begin;
alter table public.product_files add column if not exists language text not null default 'und'
  check (language in ('nl','en','und'));
-- Legacy assets stay unclassified until their actual language is verified.
alter table public.order_items add column if not exists selected_language text not null default 'en'
  check (selected_language in ('nl','en'));
create index if not exists product_files_product_language_idx on public.product_files(product_id,language);
-- More than one supporting file per language is allowed (e.g. PDF + workbook).
comment on column public.order_items.selected_language is
  'Buyer-selected edition, persisted at purchase. Downloads must only return files of this language.';
comment on column public.product_files.language is
  'Verified language of the actual uploaded private file. Legacy records default to und (unclassified) for safety.';
commit;
