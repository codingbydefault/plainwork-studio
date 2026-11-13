import Link from "next/link";
import {createSupabaseServer} from "@/lib/supabase/server";
import {getLocale} from "@/lib/i18n-server";
import {curatedLaunchProducts} from "@/lib/launch-preview";
import {translatedProduct} from "@/lib/ai-courses-i18n";

export const dynamic="force-dynamic";
const PAGE_SIZE=20;
type PublicProduct={id:string;title:string;slug:string;catalog_key:string|null;description:string|null;price_minor:number;currency:string;category:string|null;created_at:string;stores:{name:string;slug:string;status:string}|{name:string;slug:string;status:string}[]|null};
type DisplayProduct={key:string;title:string;description:string;category:string;priceMinor:number;currency:string;shop:string;shopSlug:string;slug:string;href:string;available:boolean;createdAt:string};
function storeOf(p:PublicProduct){return Array.isArray(p.stores)?p.stores[0]:p.stores;}
export default async function Explore({searchParams}:{searchParams:Promise<{q?:string;category?:string;sort?:string;page?:string}>}){
 const locale=await getLocale(),nl=locale==="nl",params=await searchParams;
 const query=(params.q??"").trim().slice(0,80).toLocaleLowerCase(locale==="nl"?"nl-NL":"en-GB");
 const category=(params.category??"").trim().slice(0,80).toLocaleLowerCase(locale==="nl"?"nl-NL":"en-GB");
 const sort=["newest","oldest","price-low","price-high"].includes(params.sort??"")?params.sort!:"newest";
 const requested=Number(params.page??"1"),page=Number.isSafeInteger(requested)&&requested>0?requested:1;
 const previews=curatedLaunchProducts(locale);
 let products:DisplayProduct[]=previews.map((p,i)=>({
   ...p,currency:"eur",available:false,createdAt:new Date(Date.UTC(2026,10,13,0,0,i)).toISOString()
 }));
 let dataError=false;
 try{
   const supabase=await createSupabaseServer();
   const {data,error}=await supabase.from("products")
     .select("id,title,slug,catalog_key,description,price_minor,currency,category,created_at,stores!inner(name,slug,status)")
     .eq("status","published").eq("stores.status","active").limit(500);
   if(error)throw error;
   const live=(data??[]) as unknown as PublicProduct[];
   for(const product of live){
     const shop=storeOf(product);if(!shop)continue;
     const known=products.findIndex(p=>p.shopSlug===shop.slug&&(p.slug===product.slug||(shop.slug==="codedbydefault"&&p.slug===product.catalog_key)));
     const translated=translatedProduct(product.slug,product.title,product.description,locale);
     if(known>=0){
       products[known]={...products[known],available:true,href:`/products/${product.id}`,priceMinor:product.price_minor,currency:product.currency,createdAt:product.created_at};
     }else{
       products.push({key:"live:"+product.id,title:translated.title,description:translated.description??"",category:product.category??(nl?"Digitale producten":"Digital products"),priceMinor:product.price_minor,currency:product.currency,shop:shop.name,shopSlug:shop.slug,slug:product.slug,href:`/products/${product.id}`,available:true,createdAt:product.created_at});
     }
   }
 }catch{dataError=true;}
 products=products.filter(p=>{
  const text=(p.title+" "+p.description+" "+p.category+" "+p.shop).toLocaleLowerCase(locale==="nl"?"nl-NL":"en-GB");
  return (!query||text.includes(query))&&(!category||p.category.toLocaleLowerCase(locale==="nl"?"nl-NL":"en-GB").includes(category));
 });
 if(sort==="price-low")products.sort((a,b)=>a.priceMinor-b.priceMinor);
 else if(sort==="price-high")products.sort((a,b)=>b.priceMinor-a.priceMinor);
 else if(sort==="oldest")products.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
 else products.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
 const total=products.length,totalPages=Math.ceil(total/PAGE_SIZE),current=products.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
 function href(next:number){const x=new URLSearchParams();if(query)x.set("q",query);if(category)x.set("category",category);if(sort!=="newest")x.set("sort",sort);x.set("page",String(next));return "/explore?"+x.toString();}
 return <main className="explore-page">
  <header className="explore-intro"><p className="guide-eyebrow">{nl?"DE PLAINWORK MARKTPLAATS":"THE PLAINWORK MARKETPLACE"}</p>
   <h1>{nl?"Ontdek praktische digitale producten.":"Discover practical digital products."}</h1>
   <p>{nl?"Ontdek 20 geplande boeken en cursussen van CodedByDefault en Plainwork AI Studio. Begin met onze":"Explore 20 planned guides and courses from CodedByDefault and Plainwork AI Studio. Start with our"} <Link href="/#free-guides">{nl?"gratis gidsen":"free guides"}</Link>.</p>
  </header>
  <div className="explore-preview-info"><strong>{nl?"Onze startcollectie is zichtbaar.":"Our launch collection is visible."}</strong> {nl?"Producten met ‘Binnenkort’ zijn voorproefjes en kunnen nog niet besteld worden.":"Products marked ‘Coming soon’ are previews and cannot be purchased yet."}</div>
  <form className="explore-filters" method="get" action="/explore" role="search">
   <label>{nl?"Zoek producten":"Search products"}<input name="q" defaultValue={params.q??""} placeholder={nl?"Bijvoorbeeld offertes, AI of fotografie":"Try quotations, AI or photography"}/></label>
   <label>{nl?"Categorie":"Category"}<input name="category" defaultValue={params.category??""} placeholder={nl?"Alle categorieën":"All categories"}/></label>
   <label>{nl?"Sorteer op":"Sort by"}<select name="sort" defaultValue={sort}>
     <option value="newest">{nl?"Nieuwste eerst":"Newest first"}</option>
     <option value="oldest">{nl?"Oudste eerst":"Oldest first"}</option>
     <option value="price-low">{nl?"Prijs: laag naar hoog":"Price: low to high"}</option>
     <option value="price-high">{nl?"Prijs: hoog naar laag":"Price: high to low"}</option>
   </select></label><button className="button" type="submit">{nl?"Zoeken":"Search"}</button>
  </form>
  <div className="explore-results-heading"><strong>{total} {nl?(total===1?"product":"producten"):(total===1?"product":"products")}</strong><span>{nl?"Twee shops · gratis introducties en betaalde cursussen":"Two shops · free introductions and paid courses"}</span></div>
  {dataError&&<p className="privacy-copy">{nl?"De live productstatus is tijdelijk niet beschikbaar; je ziet de geplande collectie.":"Live product status is temporarily unavailable; showing the planned collection."}</p>}
  {current.length===0?<div className="explore-empty"><h2>{nl?"Geen overeenkomende producten.":"No matching products."}</h2><Link href="/explore">{nl?"Toon alle producten":"Show all products"}</Link></div>:
   <div className="explore-grid">{current.map((item,index)=><article className="explore-product" key={item.key}>
    <Link href={item.href} className="explore-product-visual">
     <span>{item.category}</span><strong>{item.title}</strong><small>{item.shop==="CodedByDefault"?"CODEDBYDEFAULT":"PLAINWORK AI STUDIO"} · {nl?"DIGITALE CURSUS":"DIGITAL COURSE"}</small>
    </Link>
    <div className="explore-product-content">
     <p className="explore-seller">{nl?"Van":"By"} <strong>{item.shop}</strong></p>
     <h2><Link href={item.href}>{item.title}</Link></h2>
     <p className="explore-description">{item.description}</p>
     <div className="explore-product-bottom"><strong>{new Intl.NumberFormat(nl?"nl-NL":"en-GB",{style:"currency",currency:item.currency.toUpperCase()}).format(item.priceMinor/100)}</strong>
       {item.available?<Link href={item.href}>{nl?"Meer informatie →":"See details →"}</Link>:<span className="explore-coming-soon">{nl?"Binnenkort beschikbaar":"Coming soon"}</span>}
     </div>
    </div>
   </article>)}</div>}
  {totalPages>1&&<nav className="explore-pagination" aria-label={nl?"Productpagina's":"Product pages"}>
    {page>1&&<Link href={href(page-1)}>{nl?"← Vorige":"← Previous"}</Link>}
    <span>{nl?"Pagina":"Page"} {page} {nl?"van":"of"} {totalPages}</span>
    {page<totalPages&&<Link href={href(page+1)}>{nl?"Volgende →":"Next →"}</Link>}
  </nav>}
  <aside className="explore-seller-cta"><div><h2>{nl?"Heb jij een nuttig digitaal product?":"Have a useful digital product?"}</h2>
   <p>{nl?"Open een shop en behoud 99% van je verkoopprijs, vóór bijkomende kosten.":"Open a shop and keep 99% of the sale price before other costs."}</p></div>
   <Link href="/create-shop" className="market-primary">{nl?"Maak je shop ↗":"Create your shop ↗"}</Link>
  </aside>
 </main>;
}
