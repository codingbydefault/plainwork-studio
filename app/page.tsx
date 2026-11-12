import { createSupabaseServer } from "@/lib/supabase/server";
import { catalog } from "@/lib/catalog";
import { GuideCarousel } from "@/components/guide-carousel";

export const dynamic = "force-dynamic";

export default async function Home() {
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
    <section className="market-hero">
      <div className="market-copy">
        <span className="market-kicker"><span className="market-spark">✳</span> DIGITAL GUIDES, TEMPLATES & TOOLKITS</span>
        <h1>Learn it. Build it.<br/><span>Sell what you know.</span></h1>
        <p>Plainwork Studio is a marketplace for practical digital products. Download free business guides, shop ready-to-use toolkits, or sell your own digital creations.</p>
        <div className="market-actions"><a className="market-primary" href="#free-guides">Get free guides <span aria-hidden="true">↗</span></a><a className="market-link" href="#premium-guides">Shop digital toolkits <span aria-hidden="true">→</span></a><a className="market-link" href="#sell-your-work">Sell your work <span aria-hidden="true">→</span></a></div>
        <div className="market-highlights"><span>✓ Free downloads</span><span>✓ Ready-to-use templates</span><span>✓ A place for creators</span></div>
      </div>
      <div className="market-feature" aria-hidden="true">
        <div className="market-decor decor-one"></div><div className="market-decor decor-two"></div>
        <div className="market-feature-book book-left"><span>PLAINWORK STUDIO</span><strong>YOUR NEXT<br/>BIG IDEA.</strong><small>THE FREE STARTER GUIDE</small></div>
        <div className="market-feature-book book-right"><span>PLAINWORK STUDIO</span><strong>MAKE<br/>IT REAL.</strong><small>THE COMPLETE TOOLKIT</small></div>
        <span className="market-feature-star">✳</span>
      </div>
    </section>
    <div className="market-benefits"><span>✳ Free business guides</span><span>↗ Premium digital toolkits</span><span>◎ Instant access to your purchases</span><span>✓ Sell your own digital products</span></div>
    <GuideCarousel items={catalog} kind="free" published={published}/>
    <aside className="market-break"><div><span className="market-break-label">READY FOR MORE?</span><h2>From your first step to your full system.</h2><p>Go from a quick win to a complete, ready-to-use workflow.</p></div><a href="#premium-guides">Explore full toolkits ↗</a></aside>
    <GuideCarousel items={catalog} kind="paid" published={published}/>
    <section id="sell-your-work" className="seller-spotlight"><div className="seller-copy"><span className="seller-label">FOR DIGITAL CREATORS</span><h2>Made something valuable?<br/><span>Keep 99% of your revenue.</span></h2><p>Turn your knowledge into income. List digital guides, templates and toolkits on Plainwork Studio and reach buyers looking for practical solutions.</p><p className="seller-note">You keep 99% of each sale price before payment-processing fees, refunds and applicable taxes. Availability of seller onboarding may vary during launch.</p><a href="/dashboard" className="seller-cta">Explore creator dashboard <span aria-hidden="true">↗</span></a></div><div className="seller-highlight" aria-label="99 percent of the sale price before other applicable costs"><strong>99<span>%</span></strong><small>YOUR SHARE OF EACH SALE*</small><span className="seller-highlight-bottom">Your products. Your audience. Your upside.</span></div></section>
    <section className="market-close"><span>PLAINWORK STUDIO</span><h2>Discover what you need.<br/><em>Share what you know.</em></h2><p>Practical digital products for buyers. A creator-first marketplace for sellers.</p><a href="#free-guides">Find your first free guide ↗</a></section>
  </main>;
}
