import Link from "next/link";
import {getLocale} from "@/lib/i18n-server";
import {getMarketplaceBooks} from "@/lib/marketplace-books-server";
import {MarketplaceCarousel} from "@/components/marketplace-carousel";
import {getDisplayCurrency,getFxQuote} from "@/lib/currency-server";
export const dynamic="force-dynamic";
export default async function Explore({searchParams}:{searchParams:Promise<{q?:string;category?:string;sort?:string}>}){
 const locale=await getLocale(),nl=locale==="nl",params=await searchParams;
 const [books,currency,fx]=await Promise.all([getMarketplaceBooks(locale),getDisplayCurrency(),getFxQuote()]);
 const query=(params.q??"").trim().slice(0,80).toLocaleLowerCase(locale==="nl"?"nl-NL":"en-GB");
 const category=(params.category??"").trim().slice(0,80).toLocaleLowerCase(locale==="nl"?"nl-NL":"en-GB");
 const sort=["title","price-low","price-high"].includes(params.sort??"")?params.sort!:"title";
 const filtered=books.filter(p=>{
  const text=(p.title+" "+p.description+" "+p.category+" "+p.shop).toLocaleLowerCase(locale==="nl"?"nl-NL":"en-GB");
  return (!query||text.includes(query))&&(!category||p.category.toLocaleLowerCase(locale==="nl"?"nl-NL":"en-GB").includes(category));
 });
 filtered.sort((a,b)=>{
   if(sort==="title")return a.title.localeCompare(b.title,locale);
   function comparable(p:typeof a){return p.currency.toUpperCase()==="GBP"&&fx?p.priceMinor/fx.gbpPerEur:p.priceMinor}
   const difference=comparable(a)-comparable(b);
   return sort==="price-low"?difference:-difference;
 });
 const freebies=filtered.filter(b=>b.kind==="free"),paid=filtered.filter(b=>b.kind==="paid");
 const conversionUsed=currency==="GBP"&&!!fx&&filtered.some(p=>p.currency.toUpperCase()!=="GBP");
 return <main className="explore-page compact-explore">
  <header className="explore-intro"><p className="guide-eyebrow">{nl?"DE PLAINWORK MARKTPLAATS":"THE PLAINWORK MARKETPLACE"}</p>
    <h1>{nl?"Ontdek onze digitale boeken.":"Explore our digital books."}</h1>
    <p>{nl?"Bekijk 20 gratis minicursussen en 20 volledige cursussen, allemaal in overzichtelijke carrousels.":"Explore 20 free microcourses and 20 full courses in easy-to-browse carousels."}</p>
  </header>
  <form className="explore-filters" method="get" action="/explore" role="search">
    <label>{nl?"Zoeken":"Search"}<input name="q" defaultValue={params.q??""} placeholder={nl?"Bijvoorbeeld AI, offertes, fotografie":"Try AI, quotations, photography"}/></label>
    <label>{nl?"Categorie":"Category"}<input name="category" defaultValue={params.category??""} placeholder={nl?"Alle categorieën":"All categories"}/></label>
    <label>{nl?"Sorteren":"Sort"}<select name="sort" defaultValue={sort}><option value="title">{nl?"Titel A–Z":"Title A–Z"}</option><option value="price-low">{nl?"Prijs laag–hoog":"Price low–high"}</option><option value="price-high">{nl?"Prijs hoog–laag":"Price high–low"}</option></select></label>
    <button className="button" type="submit">{nl?"Zoeken":"Search"}</button>
  </form>
  <div className="explore-results-heading"><strong>{filtered.length} {nl?"boeken en minicursussen":"books and microcourses"}</strong><Link href="/explore">{nl?"Alle boeken tonen":"Show all"}</Link></div>
  <div className="explore-preview-info">{nl?"Boeken die nog in concept staan, zijn gemarkeerd als ‘Binnenkort’ en kunnen nog niet gekocht worden.":"Draft books are marked ‘Coming soon’ and cannot be purchased yet."}</div>
  <MarketplaceCarousel items={freebies} kind="free" id="explore-free-guides" locale={locale} currency={currency} fx={fx}/>
  <MarketplaceCarousel items={paid} kind="paid" id="explore-premium-guides" locale={locale} currency={currency} fx={fx}/>
  <p className="currency-price-note">{conversionUsed?(nl?`Getoonde pondprijzen zijn indicatief, omgerekend met de referentiekoers van ${fx?.date}. Afrekenen gebeurt in de valuta van het product (meestal euro).`:`Pound prices are estimates using the ${fx?.date} reference rate. Checkout uses the product currency (usually euros).`):(nl?"De valutakeuze wijzigt de weergegeven prijzen, niet automatisch de afrekenvaluta.":"The currency selector changes displayed prices, not necessarily checkout currency.")}</p>
  <aside className="explore-seller-cta"><div><h2>{nl?"Heb je zelf een digitaal product?":"Have your own digital product?"}</h2><p>{nl?"Open een shop en behoud 99% van de verkoopprijs vóór bijkomende kosten.":"Open a shop and keep 99% of the sale price before other costs."}</p></div><Link className="market-primary" href="/create-shop">{nl?"Maak je shop ↗":"Create your shop ↗"}</Link></aside>
 </main>;
}
