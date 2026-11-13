import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { CheckoutButton } from "@/components/checkout-button";

export const dynamic = "force-dynamic";

type Product = {
  id: string; title: string; description: string | null; price_minor: number;
  currency: string; category: string | null; status: string;
  stores: { name: string; slug: string; status: string } | { name: string; slug: string; status: string }[] | null;
};
function seller(product: Product) { return Array.isArray(product.stores) ? product.stores[0] : product.stores; }
function price(product: Product) {
  return new Intl.NumberFormat("en", { style: "currency", currency: product.currency.toUpperCase() }).format(product.price_minor / 100);
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from("products")
    .select("id,title,description,price_minor,currency,category,status,stores!inner(name,slug,status)")
    .eq("id", id).eq("status", "published").eq("stores.status", "active").maybeSingle();
  if (!data) notFound();
  const product = data as unknown as Product;
  const store = seller(product);
  if (!store) notFound();
  let relatedQuery = supabase.from("products")
    .select("id,title,price_minor,currency,category,stores!inner(name,slug,status)")
    .eq("status", "published").eq("stores.status", "active").neq("id", product.id);
  if (product.category) relatedQuery = relatedQuery.eq("category", product.category);
  const { data: related } = await relatedQuery.order("created_at", { ascending: false }).limit(4);
  const suggestions = (related ?? []) as unknown as Product[];

  return <main className="explore-detail">
    <nav className="detail-breadcrumb" aria-label="Breadcrumb"><Link href="/explore">Marketplace</Link><span>/</span><span>{product.category ?? "Digital product"}</span></nav>
    <section className="explore-detail-grid">
      <div className="explore-detail-cover"><span>PLAINWORK STUDIO</span><strong>{product.title}</strong><small>{product.category ?? "DIGITAL PRODUCT"}</small></div>
      <div className="explore-detail-info"><p className="guide-eyebrow">{product.category ?? "DIGITAL DOWNLOAD"}</p><h1>{product.title}</h1>
        <p>Created by <Link href={`/store/${store.slug}`}>{store.name}</Link></p>
        <p className="explore-detail-description">{product.description || "Practical digital content from an independent creator."}</p>
        <p className="explore-detail-delivery">Digital purchase · available in your library after confirmed payment</p>
        <div className="explore-detail-buy"><strong>{price(product)}</strong><CheckoutButton productId={product.id}/></div>
      </div>
    </section>
    <section className="explore-related"><div className="guide-heading"><div><p className="guide-eyebrow">DISCOVER MORE</p><h2>More products to explore</h2></div><Link href="/explore">Browse all →</Link></div>
      {suggestions.length ? <div className="explore-grid">{suggestions.map(item => <Link href={`/products/${item.id}`} className="explore-related-tile" key={item.id}><span>{item.category ?? "Digital product"}</span><strong>{item.title}</strong><small>{price(item)}</small></Link>)}</div> : <p className="muted">More published products are coming soon.</p>}
    </section>
  </main>;
}
