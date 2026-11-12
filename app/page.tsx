import { createSupabaseServer } from "@/lib/supabase/server";
import { CheckoutButton } from "@/components/checkout-button";
import { catalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Array<{id:string;catalog_key:string|null;title:string;description:string|null;price_minor:number;currency:string;stores:Array<{name:string}>}> = [];
  try {
    const supabase = await createSupabaseServer();
    const result = await supabase.from("products").select("id,catalog_key,title,description,price_minor,currency,stores(name)").eq("status", "published").order("created_at", { ascending: false });
    products = (result.data ?? []) as unknown as typeof products;
  } catch {}
  const publishedByCatalogKey=new Map(products.filter((product)=>product.catalog_key).map((product)=>[product.catalog_key,product]));
  const categories=[...new Set(catalog.map((item)=>item.category))];
  return <main><section className="hero"><div className="eyebrow">Practical systems for small businesses</div><h1>Start free. Upgrade when you need the full system.</h1><p>Ten useful MicroGuides give you a quick win today. Each has a matched full toolkit with an implementation guide, editable workbook and reusable templates.</p></section><section><div className="row"><div><div className="eyebrow">Free library</div><h2>Choose your business category</h2></div><span className="muted">No payment required for MicroGuides.</span></div>{categories.map((category)=><section key={category}><h2 className="category-title">{category}</h2><div className="grid">{catalog.filter((item)=>item.category===category).flatMap((item)=>{const paid=publishedByCatalogKey.get(item.key);return [<article className="card free-card" key={item.free.title}><span className="badge">Free MicroGuide</span><h2>{item.free.title}</h2><p className="muted">{item.free.hook}</p><a className="button secondary" href={`/free-guides/${item.free.file}`} download>Download free PDF</a></article>,<article className="card" key={item.paid.title}><span className="badge paid">Full toolkit</span><h2>{item.paid.title}</h2><p className="muted">{item.paid.benefits}</p><div className="price">€{(item.paid.priceMinor/100).toFixed(2)}</div>{paid?<CheckoutButton productId={paid.id}/>:<p className="notice">Secure checkout becomes available after this toolkit is published.</p>}</article>]})}</div></section>)}</section></main>;
}
