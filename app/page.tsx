import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { MarketplaceCatalog } from "@/components/marketplace-catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Array<{id:string;catalog_key:string|null;title:string;description:string|null;price_minor:number;currency:string;stores:Array<{name:string}>}> = [];
  try {
    const supabase = await createSupabaseServer();
    const result = await supabase.from("products").select("id,catalog_key,title,description,price_minor,currency,stores(name)").eq("status", "published").order("created_at", { ascending: false });
    products = (result.data ?? []) as unknown as typeof products;
  } catch {}
  return <main><section className="market-hero"><div className="hero-copy"><div className="eyebrow">The marketplace for practical business systems</div><h1>Build smarter.<br/><em>Start with a system.</em></h1><p>Ready-to-use guides, workbooks, calculators, and templates created for independent businesses. Start with a free MicroGuide, then upgrade when you&apos;re ready.</p><div className="hero-actions"><a className="button large" href="#marketplace">Explore products</a><Link className="button secondary large" href="/dashboard">Open your shop</Link></div><div className="hero-proof"><span><strong>1%</strong> creator fee</span><span><strong>Secure</strong> Stripe checkout</span><span><strong>Instant</strong> digital access</span></div></div><div className="hero-showcase" aria-hidden="true"><div className="showcase-card card-back"><span>BUSINESS TOOLKIT</span><strong>Turn expertise<br/>into a system.</strong></div><div className="showcase-card card-front"><span>PLAINWORK ORIGINAL</span><strong>Practical tools.<br/>Real progress.</strong><small>Guides · Workbooks · Templates</small></div></div></section><section className="trust-strip"><span>Built for independent creators</span><span>•</span><span>Private file delivery</span><span>•</span><span>Buyer purchase library</span><span>•</span><span>Creator-first 1% commission</span></section><MarketplaceCatalog products={products.map(({id,catalog_key})=>({id,catalog_key}))}/><section className="seller-banner"><div><div className="eyebrow">Sell on Plainwork</div><h2>Your expertise deserves a storefront.</h2><p>Create your shop, connect Stripe, upload your product, and keep 99% of the sale before payment costs.</p></div><Link className="button light large" href="/auth">Start selling</Link></section></main>;
}
