import Link from "next/link";
import {notFound} from "next/navigation";
import {getLocale} from "@/lib/i18n-server";
import {findCuratedCourse,curatedLaunchProducts} from "@/lib/launch-preview";
export const dynamic="force-dynamic";
export async function generateStaticParams(){return curatedLaunchProducts("nl").filter(p=>p.shopSlug==="plainwork-ai-studio").map(p=>({slug:p.slug}));}
export default async function FreeMicrocoursePreview({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,locale=await getLocale(),nl=locale==="nl";
 const full=findCuratedCourse(slug,locale);if(!full)notFound();
 return <main className="explore-detail">
  <nav className="detail-breadcrumb"><Link href="/explore">{nl?"Ontdek producten":"Explore products"}</Link><span>/</span><span>{nl?"Gratis minicursus":"Free microcourse"}</span></nav>
  <section className="explore-detail-grid">
    <div className="explore-detail-cover"><span>PLAINWORK AI STUDIO</span><strong>{nl?"Gratis minicursus":"Free microcourse"}: {full.title}</strong><small>{full.category.toUpperCase()}</small></div>
    <div className="explore-detail-info">
      <p className="guide-eyebrow">{nl?"GRATIS INTRODUCTIE · BINNENKORT":"FREE INTRODUCTION · COMING SOON"}</p>
      <h1>{nl?"Gratis minicursus":"Free microcourse"}: {full.title}</h1>
      <p>{full.description}</p>
      <p>{nl?"De Nederlandstalige en Engelstalige introductie zijn voorbereid. Downloaden is pas mogelijk nadat de bestanden veilig zijn geplaatst en gecontroleerd.":"Dutch and English introductory editions are prepared. Downloads will open after the files are securely uploaded and verified."}</p>
      <p className="preview-pending">{nl?"Binnenkort gratis beschikbaar":"Coming soon, free"}</p>
      <p><Link href={`/courses/${slug}`}>{nl?"Bekijk de volledige cursus →":"View the full course →"}</Link></p>
    </div>
  </section>
 </main>;
}
