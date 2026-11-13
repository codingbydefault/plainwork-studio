import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { CheckoutButton } from "@/components/checkout-button";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 18;

type ExploreProduct = {
  id: string;
  title: string;
  description: string | null;
  price_minor: number;
  currency: string;
  category: string | null;
  created_at: string;
  stores: { name: string; slug: string; status: string } | { name: string; slug: string; status: string }[] | null;
};

function storeInfo(stores: ExploreProduct["stores"]) {
  return Array.isArray(stores) ? stores[0] : stores;
}

function formatMoney(minor: number, currency: string) {
  return new Intl.NumberFormat("en", { style: "currency", currency: currency.toUpperCase() }).format(minor / 100);
}

export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().slice(0, 80);
  const category = (params.category ?? "").trim().slice(0, 80);
  const sort = params.sort === "oldest" ? "oldest" : params.sort === "price-low" ? "price-low" : params.sort === "price-high" ? "price-high" : "newest";
  const requestedPage = Number(params.page ?? "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, 1000) : 1;
  const supabase = await createSupabaseServer();

  // Only public, published products of active storefronts can enter discovery.
  let builder = supabase.from("products")
    .select("id,title,description,price_minor,currency,category,created_at,stores!inner(name,slug,status)", { count: "exact" })
    .eq("status", "published")
    .eq("stores.status", "active");
  if (query) builder = builder.ilike("title", `%${query.replace(/[%_\\]/g, "")}%`);
  if (category) builder = builder.eq("category", category);
  if (sort === "price-low") builder = builder.order("price_minor", { ascending: true });
  else if (sort === "price-high") builder = builder.order("price_minor", { ascending: false });
  else builder = builder.order("created_at", { ascending: sort === "oldest" });
  const { data, count, error } = await builder.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  const products = (data ?? []) as unknown as ExploreProduct[];
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  function href(nextPage: number) {
    const out = new URLSearchParams();
    if (query) out.set("q", query);
    if (category) out.set("category", category);
    if (sort !== "newest") out.set("sort", sort);
    out.set("page", String(nextPage));
    return `/explore?${out.toString()}`;
  }

  return <main className="explore-page">
    <header className="explore-intro">
      <p className="guide-eyebrow">THE PLAINWORK MARKETPLACE</p>
      <h1>Discover something useful.</h1>
      <p>Find downloadable guides, templates and business toolkits from creators. Browse published listings or explore our <Link href="/#free-guides">free guide collection</Link>.</p>
    </header>
    <form className="explore-filters" method="get" action="/explore" role="search">
      <label>Search products<input name="q" defaultValue={query} maxLength={80} placeholder="Try pricing, photography, cleaning…"/></label>
      <label>Category<input name="category" defaultValue={category} maxLength={80} placeholder="All categories"/></label>
      <label>Sort by<select name="sort" defaultValue={sort}>
        <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
        <option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
      </select></label>
      <button className="button" type="submit">Find products</button>
    </form>
    <div className="explore-results-heading"><strong>{count ?? 0} published {count === 1 ? "product" : "products"}</strong>{query && <span>Search: “{query}”</span>}</div>
    {error ? <p className="notice" role="alert">Products could not be loaded right now. Please try again.</p>
      : products.length === 0 ? <div className="explore-empty"><h2>No matching products yet.</h2><p>Try a broader search, or browse our free guides while creators build their shops.</p><Link href="/#free-guides" className="button">Explore free guides</Link></div>
      : <div className="explore-grid">{products.map(product => {
        const store = storeInfo(product.stores);
        return <article className="explore-product" key={product.id}>
          <Link className="explore-product-visual" href={`/products/${product.id}`}>
            <span>{product.category || "Digital products"}</span>
            <strong>{product.title}</strong>
            <small>PLAINWORK STUDIO · DIGITAL DOWNLOAD</small>
          </Link>
          <div className="explore-product-content">
            <p className="explore-seller">By <Link href={`/store/${store?.slug}`}>{store?.name ?? "Creator"}</Link></p>
            <h2><Link href={`/products/${product.id}`}>{product.title}</Link></h2>
            <p className="explore-description">{product.description || "A practical digital product from an independent creator."}</p>
            <div className="explore-product-bottom"><strong>{formatMoney(product.price_minor, product.currency)}</strong><Link href={`/products/${product.id}`}>See details →</Link></div>
          </div>
        </article>;
      })}</div>}
    {totalPages > 1 && <nav className="explore-pagination" aria-label="Product pages">
      {page > 1 && <Link href={href(page - 1)}>← Previous</Link>}
      <span>Page {page} of {totalPages}</span>
      {page < totalPages && <Link href={href(page + 1)}>Next →</Link>}
    </nav>}
    <aside className="explore-seller-cta"><div><h2>Have a useful digital product?</h2><p>Open a shop, reach new buyers and keep 99% of your sale price before other costs.</p></div><Link className="market-primary" href="/create-shop">Create your shop ↗</Link></aside>
  </main>;
}
