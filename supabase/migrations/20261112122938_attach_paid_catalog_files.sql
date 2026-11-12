insert into public.product_files(product_id,storage_path,filename,mime_type,size_bytes)
select p.id,v.archive,v.archive,'application/zip',v.size_bytes
from (values
 ('cleaning-quotes','01_AI_Cleaning_Quotes.zip',85027::bigint),
 ('mobile-detailing','02_Mobile_Detailing_Pricing.zip',84701::bigint),
 ('installer-quotes','03_Installer_Quotation_Changes.zip',84548::bigint),
 ('event-rentals','04_Event_Rental_Control.zip',84443::bigint),
 ('airbnb-turnover','05_Airbnb_Turnover_System.zip',84245::bigint),
 ('custom-cakes','06_Custom_Cake_Pricing.zip',84615::bigint),
 ('dog-grooming','07_Dog_Grooming_Pricing.zip',84341::bigint),
 ('wedding-photography','08_Wedding_Photography_Pricing.zip',84448::bigint),
 ('food-truck','09_Food_Truck_Event_Profit.zip',84710::bigint),
 ('web-agency-care','10_Web_Agency_Care_Plans.zip',84464::bigint)
) as v(catalog_key,archive,size_bytes)
join public.products p on p.catalog_key=v.catalog_key
on conflict(storage_path) do update set product_id=excluded.product_id,filename=excluded.filename,mime_type=excluded.mime_type,size_bytes=excluded.size_bytes;
