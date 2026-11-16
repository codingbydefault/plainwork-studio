import {getDisplayCurrency,getFxQuote} from "@/lib/currency-server";
import {displayPrice} from "@/lib/currency";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getLocale} from "@/lib/i18n-server";
import {findCuratedCourse,curatedLaunchProducts} from "@/lib/launch-preview";
export const dynamic="force-dynamic";
export async function generateStaticParams(){return curatedLaunchProducts("nl").filter(p=>p.shopSlug==="plainwork-ai-studio").map(p=>({slug:p.slug}));}
export default async function CoursePreview({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params,locale=await getLocale(),nl=locale==="nl";const [selectedCurrency,fx]=await Promise.all([getDisplayCurrency(),getFxQuote()]);
  const item=findCuratedCourse(slug,locale);
  if(!item)notFound();
  return <main className="explore-detail">
    <nav className="detail-breadcrumb"><Link href="/explore">{nl?"Ontdek producten":"Explore products"}</Link><span>/</span><span>{item.shop}</span></nav>
    <section className="explore-detail-grid">
      <div className="explore-detail-cover"><span>PLAINWORK AI STUDIO</span><strong>{item.title}</strong><small>{item.category.toUpperCase()}</small></div>
      <div className="explore-detail-info">
        <p className="guide-eyebrow">{nl?"CONCEPTCOLLECTIE · BINNENKORT":"PREVIEW COLLECTION · COMING SOON"}</p>
        <h1>{item.title}</h1>
        <p>{nl?"Van":"By"} <strong>{item.shop}</strong></p>
        <p className="explore-detail-description">{item.description}</p>
        <p className="explore-detail-delivery">{nl?"Geplande cursus met gratis minicursus en volledige betaalde versie in Nederlands en Engels.": "Planned course with a free microcourse and paid full version in Dutch and English."}</p>
        <div className="explore-detail-buy"><strong>{displayPrice(item.priceMinor,"EUR",selectedCurrency,fx,locale).value}</strong><span className="preview-pending">{nl?"Binnenkort beschikbaar — nog niet te koop":"Coming soon — not on sale yet"}</span></div>
        <p className="muted">{nl?"We openen de verkoop pas na controle van de bestanden, taalversies en betaalfunctie.":"Sales open only after files, language editions and checkout are verified."}</p>
      </div>
    </section>
    <div className="detail-related"><Link className="market-link" href="/explore">{nl?"Bekijk de volledige collectie →":"Browse the collection →"}</Link></div>
  </main>;
}
