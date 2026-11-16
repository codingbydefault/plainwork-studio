import {createSupabaseServer} from "@/lib/supabase/server";
import {marketplaceBooks,type MarketplaceBook} from "@/lib/marketplace-books";
import type {Locale} from "@/lib/i18n";

type PublicProduct={id:string;slug:string;catalog_key:string|null;price_minor:number;currency:string;stores:{slug:string}|{slug:string}[]|null};
export async function getMarketplaceBooks(locale:Locale):Promise<MarketplaceBook[]>{
 const books=marketplaceBooks(locale);
 try{
  const supabase=await createSupabaseServer();
  const {data,error}=await supabase.from("products")
   .select("id,slug,catalog_key,price_minor,currency,stores!inner(slug,status)")
   .eq("status","published").eq("stores.status","active").limit(500);
  if(error)return books;
  for(const product of (data??[]) as unknown as PublicProduct[]){
   const store=Array.isArray(product.stores)?product.stores[0]:product.stores;
   if(!store)continue;
   const match=books.find(p=>p.kind==="paid"&&p.shopSlug===store.slug&&
      (p.slug===product.slug||(store.slug==="codedbydefault"&&p.slug===product.catalog_key)));
   if(match){
    match.available=true;
    match.priceMinor=product.price_minor;
    match.currency=product.currency;
    match.href=`/products/${product.id}`;
   }
  }
 }catch{ /* Editorial previews remain available when Supabase is temporarily unavailable. */ }
 return books;
}
