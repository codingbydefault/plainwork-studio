import {catalog} from "@/lib/catalog";
import {localCatalog} from "@/lib/catalog-i18n";
import {curatedLaunchProducts} from "@/lib/launch-preview";
import type {Locale} from "@/lib/i18n";

export type MarketplaceBook={
 key:string;slug:string;title:string;category:string;shop:string;shopSlug:string;
 description:string;href:string;priceMinor:number;currency:string;available:boolean;kind:"free"|"paid";
};
export function marketplaceBooks(locale:Locale):MarketplaceBook[]{
 const paid:MarketplaceBook[]=curatedLaunchProducts(locale).map(p=>({...p,currency:"eur",available:false,kind:"paid" as const}));
 const freeCoded:MarketplaceBook[]=catalog.map(item=>{
   const t=localCatalog(item,locale);
   return {key:"free-coded:"+item.key,slug:item.key,title:t.free.title,category:t.category,shop:"CodedByDefault",
     shopSlug:"codedbydefault",description:t.free.hook,href:`/guides/${item.key}/free`,priceMinor:0,currency:"eur",available:false,kind:"free"};
 });
 const freeAI:MarketplaceBook[]=paid.filter(p=>p.shopSlug==="plainwork-ai-studio").map(p=>({
   ...p,key:"free-"+p.key,title:locale==="nl"?`Gratis minicursus: ${p.title}`:`Free microcourse: ${p.title}`,
   href:`/courses/${p.slug}/free`,priceMinor:0,available:false,kind:"free" as const
 }));
 return [...freeCoded,...freeAI,...paid];
}
