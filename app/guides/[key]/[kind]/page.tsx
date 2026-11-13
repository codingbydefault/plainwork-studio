import { getLocale, getCopy } from "@/lib/i18n-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { catalog, catalogByKey } from "@/lib/catalog";
import {localCatalog} from "@/lib/catalog-i18n";
import { LeadMagnetForm } from "@/components/lead-magnet-form";
import { CheckoutButton } from "@/components/checkout-button";
import { createSupabaseServer } from "@/lib/supabase/server";

type Params = { key: string; kind: string };
const images: Record<string, string> = {"cleaning-quotes":"photo-1581578731548-c64695cc6952","mobile-detailing":"photo-1492144534655-ae79c964c9d7","installer-quotes":"photo-1504307651254-35680f356dfd","event-rentals":"photo-1511795409834-ef04bbd61622","airbnb-turnover":"photo-1611892440504-42a792e24d32","custom-cakes":"photo-1578985545062-69928b1d9587","dog-grooming":"photo-1517849845537-4d257902454a","wedding-photography":"photo-1519741497674-611481863552","food-truck":"photo-1565123409695-7b5ef63a2efb","web-agency-care":"photo-1460925895917-afdab827c52f"};

function coverStyle(key: string) {
  return { backgroundImage: `linear-gradient(180deg, rgba(10,25,40,.08),rgba(10,25,40,.25) 42%,rgba(10,25,40,.92)),url("https://images.unsplash.com/${images[key]}?auto=format&fit=crop&w=800&q=85")` };
}

export function generateStaticParams(): Params[] {
  return catalog.flatMap(item => [{ key: item.key, kind: "free" }, { key: item.key, kind: "paid" }]);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { key, kind } = await params;
  const item = catalogByKey.get(key);
  if (!item || (kind !== "free" && kind !== "paid")) return { title: "Guide not found | Plainwork Studio" };
  const guide = kind === "free" ? item.free : item.paid;
  return { title: `${guide.title} | Plainwork Studio`, description: kind === "free" ? item.free.hook : item.paid.benefits };
}

export default async function GuideDetailPage({ params }: { params: Promise<Params> }) {
  const locale=await getLocale(); const t=await getCopy();
  const { key, kind } = await params;
  const item = catalogByKey.get(key);
  if (!item || (kind !== "free" && kind !== "paid")) notFound();
  const free = kind === "free";
  const localized=localCatalog(item,locale);
  const guide=free?localized.free:localized.paid;
  let productId: string | null = null;

  if (!free) {
    try {
      const supabase = await createSupabaseServer();
      const { data } = await supabase.from("products").select("id").eq("catalog_key", key).eq("status", "published").maybeSingle();
      productId = data?.id ?? null;
    } catch {
      // Unpublished products must never offer checkout.
    }
  }

  const related = catalog.filter(candidate => candidate.key !== key)
    .sort((a, b) => Number(b.category === item.category) - Number(a.category === item.category))
    .slice(0, 3);

  return <main className="guide-detail-page">
    <nav className="detail-breadcrumb" aria-label="Breadcrumb"><Link href="/">{locale==="nl"?"Marktplaats":"Marketplace"}</Link><span>/</span><Link href={free ? "/#free-guides" : "/#premium-guides"}>{locale==="nl"?(free?"Gratis gidsen":"Betaalde cursussen"):(free?"Free guides":"Paid toolkits")}</Link><span>/</span><span>{localized.category}</span></nav>
    <section className="detail-hero">
      <div className="detail-photo-cover" style={coverStyle(key)}>
        <span className="detail-cover-brand">PLAINWORK STUDIO</span>
        <span className="detail-cover-tag">{locale==="nl"?(free?"GRATIS GIDS":"VOLLEDIGE CURSUS"):(free?"FREE GUIDE":"FULL TOOLKIT")}</span>
        <div className="detail-cover-bottom"><span>{item.category}</span><h2>{guide.title}</h2></div>
      </div>
      <div className="detail-copy">
        <span className="guide-eyebrow">{locale==="nl"?(free?"GRATIS DIGITALE GIDS":"UITGEBREIDE DIGITALE CURSUS"):(free?"FREE DIGITAL GUIDE":"PREMIUM DIGITAL TOOLKIT")} · {item.category}</span>
        <h1>{guide.title}</h1>
        <p className="detail-lead">{free ? localized.free.hook : localized.paid.benefits}</p>
        <div className="detail-points">
          <p><strong>{locale==="nl"?"Praktisch gericht.":"Practical focus."}</strong> {locale==="nl"?"Bruikbare tips voor je onderneming.":"Real-world advice for your business."}</p>
          <p><strong>{locale==="nl"?"Digitaal product.":"Digital product."}</strong> {locale==="nl"?"Geen verzending of fysieke levering nodig.":"No shipping or physical delivery required."}</p>
          <p><strong>{locale==="nl"?"Ontdek meer.":"Explore more."}</strong> {locale==="nl"?"Bekijk hieronder verwante cursussen en gidsen.":"Find matching toolkits and related guides below."}</p>
        </div>
        {free ? <div className="detail-action"><strong>{locale==="nl"?"Gratis downloaden":"Free download"}</strong><LeadMagnetForm guideKey={item.key}/></div> :
          <div className="detail-action"><strong>€{(item.paid.priceMinor / 100).toFixed(2)}</strong>
            {productId ? <CheckoutButton productId={productId} locale={locale}/> : <p className="book-unavailable">{locale==="nl"?"Deze cursus is nog niet gepubliceerd. Betalen is nog niet mogelijk.":"Checkout is not available yet. This toolkit has not been published."}</p>}
          </div>}
      </div>
    </section>
    {free ? <section className="detail-upsell"><span className="seller-label">{locale==="nl"?"JE VOLGENDE STAP":"YOUR NEXT STEP"}</span><h2>{locale==="nl"?"Wil je meer dan de gratis gids?":"Want more than the free guide?"}</h2><p>{locale==="nl"?"Bekijk de volledige betaalde cursus met extra uitleg en bewerkbare hulpmiddelen.":"Explore the complete paid toolkit for this topic, with more detailed resources and editable tools."}</p><div className="detail-upsell-actions"><Link href={`/guides/${key}/paid`} className="market-primary">{locale==="nl"?"Bekijk de volledige cursus ↗":"Explore the full toolkit ↗"}</Link><span>{localized.paid.title}</span></div></section>
      : <section className="detail-upsell"><span className="seller-label">{locale==="nl"?"BEGIN GRATIS":"TRY THE TOPIC FIRST"}</span><h2>{locale==="nl"?"Begin met de gratis versie.":"Start with the free version."}</h2><p>{locale==="nl"?"Bekijk eerst de gratis minigids voordat je een volledige cursus koopt.":"See the matching free mini-guide before deciding whether the toolkit is right for you."}</p><Link href={`/guides/${key}/free`} className="market-primary">{locale==="nl"?"Bekijk de gratis gids ↗":"View free guide ↗"}</Link></section>}
    <section className="detail-related"><div className="guide-heading"><div><span className="guide-eyebrow">{locale==="nl"?"MISSCHIEN OOK INTERESSANT":"YOU MIGHT ALSO LIKE"}</span><h2>{locale==="nl"?"Meer nuttige gidsen.":"More guides worth exploring."}</h2></div><Link href="/" className="market-link">{locale==="nl"?"Bekijk alle boeken →":"Browse all books →"}</Link></div>
      <div className="detail-related-grid">{related.map(rec => <Link href={`/guides/${rec.key}/${free ? "free" : "paid"}`} className="detail-related-card" key={rec.key}><div className="detail-related-cover" style={coverStyle(rec.key)}><span>{rec.category}</span><strong>{free ? localCatalog(rec,locale).free.title : localCatalog(rec,locale).paid.title}</strong></div><span className="detail-related-link">{locale==="nl"?"Bekijk de details →":"View book details →"}</span></Link>)}</div>
    </section>
  </main>;
}
