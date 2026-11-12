import { createSupabaseServer } from "@/lib/supabase/server";
import { CheckoutButton } from "@/components/checkout-button";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Array<{id:string;title:string;description:string|null;price_minor:number;currency:string;stores:Array<{name:string}>}> = [];
  try {
    const supabase = await createSupabaseServer();
    const result = await supabase.from("products").select("id,title,description,price_minor,currency,stores(name)").eq("status", "published").order("created_at", { ascending: false });
    products = (result.data ?? []) as unknown as typeof products;
  } catch {}
  return <main><section className="hero"><div className="eyebrow">Creator-first digital marketplace</div><h1>Creators keep 99%. Great work finds its audience.</h1><p>Independent creators sell secure digital products with transparent payment costs and a platform commission of exactly 1% per successful sale.</p></section><section><div className="row"><div><div className="eyebrow">Marketplace</div><h2>Digital products</h2></div><span className="muted">Processing fees and taxes are separate.</span></div><div className="grid">{products.length ? products.map((product)=><article className="card" key={product.id}><span className="eyebrow">{product.stores[0]?.name ?? "Independent creator"}</span><h2>{product.title}</h2><p className="muted">{product.description}</p><div className="price">{new Intl.NumberFormat("en",{style:"currency",currency:product.currency}).format(product.price_minor/100)}</div><CheckoutButton productId={product.id}/></article>) : <div className="panel"><h2>Marketplace foundation ready</h2><p className="muted">Run the Supabase migration and publish a product to show it here. The original Plainwork guides can then be entered through the creator dashboard.</p></div>}</div></section></main>;
}
