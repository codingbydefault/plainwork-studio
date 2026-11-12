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
    <section className="market-hero clear-market-hero" aria-labelledby="marketplace-heading">
      <div className="clear-hero-intro">
        <div className="clear-hero-kicker"><span className="clear-kicker-mark" aria-hidden="true">✳</span> THE MARKETPLACE FOR DIGITAL PRODUCTS</div>
        <h1 id="marketplace-heading">Sell your digital products.<br/><span>Keep 99% of your revenue.</span></h1>
        <p className="clear-hero-slogan">Turn your knowledge, into cash!</p>
        <p className="clear-hero-explainer">One place to share what you create and discover useful digital products from others.</p>
      </div>
      <div className="hero-journeys" aria-label="Choose how to use Plainwork Studio">
        <div className="hero-journey hero-journey-seller">
          <span className="hero-journey-label">I'M A CREATOR</span>
          <h2>Turn what you know into income.</h2>
          <p>List your guides, e-books, templates and toolkits. Keep 99% of the sale price before other fees and costs.</p>
          <a href="/create-shop" className="hero-journey-cta hero-seller-cta">Turn your knowledge, into cash! <span aria-hidden="true">↗</span></a>
        </div>
        <div className="hero-journey hero-journey-buyer">
          <span className="hero-journey-label">I'M HERE TO EXPLORE</span>
          <h2>Find your next useful idea.</h2>
          <p>Browse free guides and ready-to-use paid toolkits to learn a skill or grow your business.</p>
          <a href="#free-guides" className="hero-journey-cta hero-buyer-cta">Explore digital products <span aria-hidden="true">→</span></a>
          <a href="#premium-guides" className="hero-buyer-link">Or browse premium toolkits →</a>
        </div>
      </div>
      <p className="clear-fee-note">*99% refers to your share of the sale price before payment-processing fees, refunds and applicable taxes. Earnings are not guaranteed.</p>
    </section>
    <div className="market-benefits"><span>✳ Free business guides</span><span>↗ Premium digital toolkits</span><span>◎ Instant access to your purchases</span><span>✓ Sell your own digital products</span></div>
    <GuideCarousel items={catalog} kind="free" published={published}/>
    <aside className="market-break"><div><span className="market-break-label">READY FOR MORE?</span><h2>From your first step to your full system.</h2><p>Go from a quick win to a complete, ready-to-use workflow.</p></div><a href="#premium-guides">Explore full toolkits ↗</a></aside>
    <GuideCarousel items={catalog} kind="paid" published={published}/>
    <section id="sell-your-work" className="seller-spotlight"><div className="seller-copy"><span className="seller-label">FOR DIGITAL CREATORS</span><h2>Made something valuable?<br/><span>Keep 99% of your revenue.</span></h2><p>Turn your knowledge into income. List digital guides, templates and toolkits on Plainwork Studio and reach buyers looking for practical solutions.</p><p className="seller-note">You keep 99% of each sale price before payment-processing fees, refunds and applicable taxes. Availability of seller onboarding may vary during launch.</p><a href="/create-shop" className="seller-cta">Explore creator dashboard <span aria-hidden="true">↗</span></a></div><div className="seller-highlight" aria-label="99 percent of the sale price before other applicable costs"><strong>99<span>%</span></strong><small>YOUR SHARE OF EACH SALE*</small><span className="seller-highlight-bottom">Your products. Your audience. Your upside.</span></div></section>
    <section className="market-close"><span>PLAINWORK STUDIO</span><h2>Discover what you need.<br/><em>Share what you know.</em></h2><p>Practical digital products for buyers. A creator-first marketplace for sellers.</p><a href="#free-guides">Find your first free guide ↗</a></section>
  </main>;
}
