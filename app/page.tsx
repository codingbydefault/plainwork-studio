import { createSupabaseServer } from "@/lib/supabase/server";
import { catalog } from "@/lib/catalog";
import { GuideCarousel } from "@/components/guide-carousel";
import { getCopy, getLocale } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale=await getLocale(); const t=await getCopy();
  let products: Array<{ id: string; catalog_key: string | null }> = [];
  try {
    const supabase = await createSupabaseServer();
    const result = await supabase.from("products").select("id,catalog_key").eq("status", "published").order("created_at", { ascending: false });
    products = (result.data ?? []) as typeof products;
  } catch {
    // Keep the editorial catalog available even if product lookup fails.
  }
  const published = Object.fromEntries(products.filter(p => p.catalog_key).map(p => [p.catalog_key as string, p.id]));
  return <main className="modern-marketplace">
    <section className="market-hero clear-market-hero" aria-labelledby="marketplace-heading">
      <div className="clear-hero-intro">
        <div className="clear-hero-kicker"><span className="clear-kicker-mark" aria-hidden="true">✳</span> {t.marketEyebrow}</div>
        <h1 id="marketplace-heading">{t.marketHeading}<br/><span>{t.marketHighlight}</span></h1>
        <p className="clear-hero-slogan">{t.marketSlogan}</p>
        <p className="clear-hero-explainer">{t.marketExplainer}</p>
      </div>
      <div className="hero-journeys" aria-label={locale==="nl"?"Kies hoe je Plainwork Studio gebruikt":"Choose how to use Plainwork Studio"}>
        <div className="hero-journey hero-journey-seller">
          <span className="hero-journey-label">{t.creator}</span>
          <h2>{t.creatorHeading}</h2>
          <p>{t.creatorDescription}</p>
          <a href="/create-shop" className="hero-journey-cta hero-seller-cta">{t.creatorCTA} <span aria-hidden="true">↗</span></a>
        </div>
        <div className="hero-journey hero-journey-buyer">
          <span className="hero-journey-label">{t.buyer}</span>
          <h2>{t.buyerHeading}</h2>
          <p>{t.buyerDescription}</p>
          <a href="/explore" className="hero-journey-cta hero-buyer-cta">{t.buyerCTA} <span aria-hidden="true">→</span></a>
          <a href="#premium-guides" className="hero-buyer-link">{t.paidCTA} →</a>
        </div>
      </div>
      <p className="clear-fee-note">{t.fees}</p>
    </section>
    <div className="market-benefits"><span>✳ {locale==="nl"?"Gratis zakelijke gidsen":"Free business guides"}</span><span>↗ {locale==="nl"?"Uitgebreide digitale cursussen":"Premium digital toolkits"}</span><span>◎ {locale==="nl"?"Toegang tot je aankopen":"Access to your purchases"}</span><span>✓ {locale==="nl"?"Verkoop je eigen producten":"Sell your own digital products"}</span></div>
    <GuideCarousel items={catalog} kind="free" published={published} locale={locale}/>
    <aside className="market-break"><div><span className="market-break-label">{locale==="nl"?"KLAAR VOOR MEER?":"READY FOR MORE?"}</span><h2>{locale==="nl"?"Van een eerste stap naar je eigen systeem.":"From your first step to your full system."}</h2><p>{locale==="nl"?"Van een snelle kennismaking naar een volledig werkproces.":"Go from a quick win to a complete, ready-to-use workflow."}</p></div><a href="#premium-guides">{locale==="nl"?"Bekijk de volledige cursussen ↗":"Explore full toolkits ↗"}</a></aside>
    <GuideCarousel items={catalog} kind="paid" published={published} locale={locale}/>
    <section id="sell-your-work" className="seller-spotlight"><div className="seller-copy"><span className="seller-label">{locale==="nl"?"VOOR DIGITALE MAKERS":"FOR DIGITAL CREATORS"}</span><h2>{locale==="nl"?"Heb je waardevolle kennis?":"Made something valuable?"}<br/><span>{locale==="nl"?"Behoud 99% van je omzet.":"Keep 99% of your revenue."}</span></h2><p>{locale==="nl"?"Maak van je kennis een digitaal product. Verkoop gidsen, sjablonen en cursussen via Plainwork Studio.":"Turn your knowledge into income. List digital guides, templates and toolkits on Plainwork Studio and reach buyers looking for practical solutions."}</p><p className="seller-note">{locale==="nl"?"Je behoudt 99% van de verkoopprijs vóór transactiekosten, terugbetalingen en belastingen. Verkopersregistratie kan tijdens de lancering beperkt zijn.":"You keep 99% of each sale price before payment-processing fees, refunds and applicable taxes. Availability of seller onboarding may vary during launch."}</p><a href="/create-shop" className="seller-cta">{locale==="nl"?"Maak je eigen shop":"Explore creator dashboard"} <span aria-hidden="true">↗</span></a></div><div className="seller-highlight" aria-label="99 percent of the sale price before other applicable costs"><strong>99<span>%</span></strong><small>{locale==="nl"?"JOUW AANDEEL PER VERKOOP*":"YOUR SHARE OF EACH SALE*"}</small><span className="seller-highlight-bottom">{locale==="nl"?"Jouw producten. Jouw klanten.":"Your products. Your audience. Your upside."}</span></div></section>
    <section className="market-close"><span>PLAINWORK STUDIO</span><h2>{locale==="nl"?"Ontdek wat je nodig hebt.":"Discover what you need."}<br/><em>{locale==="nl"?"Deel wat je weet.":"Share what you know."}</em></h2><p>{locale==="nl"?"Praktische digitale producten voor kopers. Een marktplaats voor makers.":"Practical digital products for buyers. A creator-first marketplace for sellers."}</p><a href="#free-guides">{locale==="nl"?"Ontdek je eerste gratis gids ↗":"Find your first free guide ↗"}</a></section>
  </main>;
}
