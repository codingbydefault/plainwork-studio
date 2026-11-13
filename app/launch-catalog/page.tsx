import { launchGuides } from "@/content/launch-guides";
import { catalogByKey } from "@/lib/catalog";
import { localCatalog } from "@/lib/catalog-i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata = {
 title: "Cursuscatalogus | Plainwork Studio",
 description: "Bekijk 10 betaalde praktische cursussen en hun gratis introductiegidsen.",
};
export default async function LaunchCatalog(){
 const locale=await getLocale(),nl=locale==="nl";
 const paid=launchGuides.filter(g=>g.kind==="paid");
 const free=launchGuides.filter(g=>g.kind==="lead_magnet");
 function title(guide:(typeof launchGuides)[number]){
   const item=catalogByKey.get(guide.series);
   if(!item)return guide.title;
   const text=localCatalog(item,locale);
   return guide.kind==="paid"?text.paid.title:text.free.title;
 }
 function desc(guide:(typeof launchGuides)[number]){
  const item=catalogByKey.get(guide.series);
  if(!item)return guide.description;
  const text=localCatalog(item,locale);
  return guide.kind==="paid"?text.paid.benefits:text.free.hook;
 }
 return <main><section className="hero">
  <div className="eyebrow">CodedByDefault · {nl?"introductiecollectie":"launch collection"}</div>
  <h1>{nl?"20 praktische gidsen. Van gratis introductie naar een volledig systeem.":"20 practical guides. From a free start to a complete system."}</h1>
  <p>{nl?"Bekijk tien geplande betaalde cursussen en hun gratis introductiegidsen. Dit is een conceptcatalogus: downloads en betalingen worden pas beschikbaar na controle van inhoud en prijs.":"Explore ten planned paid guides and their free introductions. This is a draft catalog; downloads and checkout follow content and price verification."}</p>
 </section>
 {([{entries:free,free:true},{entries:paid,free:false}] as const).map(group=><section key={group.free?"free":"paid"}>
  <div className="row"><h2>{nl?(group.free?"Gratis minigidsen":"Volledige betaalde cursussen"):(group.free?"Free micro-guides":"Complete paid courses")}</h2>
   <span className="muted">{nl?"10 producten · bestanden in controle":"10 products · files under review"}</span></div>
  <div className="grid">{group.entries.map(guide=><article className="card" key={guide.slug}>
   <div className="eyebrow">{catalogByKey.has(guide.series)?localCatalog(catalogByKey.get(guide.series)!,locale).category:guide.category}</div>
   <h2>{title(guide)}</h2><p className="muted">{desc(guide)}</p>
   <p className="notice">{nl?"Alleen voorbeeld · nog niet te downloaden of te kopen.":"Preview only · not available to download or purchase."}</p>
  </article>)}</div>
 </section>)}
 </main>;
}
