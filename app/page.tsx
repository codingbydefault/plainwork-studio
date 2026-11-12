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
        <span className="market-kicker"><span className="market-spark">✳</span> PRACTICAL GUIDES FOR REAL BUSINESSES</span>
        <h1>Small steps.<br/><span>Big ambitions.</span></h1>
        <p>Learn a useful skill, price your services, or put your business in order. Discover guides made for people who want to get things done.</p>
        <div className="market-actions"><a className="market-primary" href="#free-guides">Explore free books <span aria-hidden="true">↗</span></a><a className="market-link" href="#premium-guides">Browse paid toolkits <span aria-hidden="true">→</span></a></div>
        <div className="market-highlights"><span>✓ Practical tools</span><span>✓ Start for free</span><span>✓ Made for doers</span></div>
      </div>
      <div className="market-feature" aria-hidden="true">
        <div className="market-decor decor-one"></div><div className="market-decor decor-two"></div>
        <div className="market-feature-book book-left"><span>PLAINWORK STUDIO</span><strong>YOUR NEXT<br/>BIG IDEA.</strong><small>THE FREE STARTER GUIDE</small></div>
        <div className="market-feature-book book-right"><span>PLAINWORK STUDIO</span><strong>MAKE<br/>IT REAL.</strong><small>THE COMPLETE TOOLKIT</small></div>
        <span className="market-feature-star">✳</span>
      </div>
    </section>
    <div className="market-benefits"><span>✳ Real-world topics</span><span>↗ Actionable from day one</span><span>◎ Fast digital delivery</span><span>✓ Tools, not just theory</span></div>
    <GuideCarousel items={catalog} kind="free" published={published}/>
    <aside className="market-break"><div><span className="market-break-label">READY FOR MORE?</span><h2>From your first step to your full system.</h2><p>Go from a quick win to a complete, ready-to-use workflow.</p></div><a href="#premium-guides">Explore full toolkits ↗</a></aside>
    <GuideCarousel items={catalog} kind="paid" published={published}/>
    <section className="market-close"><span>PLAINWORK STUDIO</span><h2>Good ideas deserve<br/><em>great execution.</em></h2><p>Find the right guide and make progress today.</p><a href="#free-guides">Find your first free guide ↗</a></section>
  </main>;
}
