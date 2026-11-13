import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import {getLocale} from "@/lib/i18n-server";

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
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: currency.toUpperCase() }).format(minor / 100);
}

export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  const nl=(await getLocale())==="nl";
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
      <p className="guide-eyebrow">{nl?"DE PLAINWORK MARKTPLAATS":"THE PLAINWORK MARKETPLACE"}</p>
      <h1>{nl?"Ontdek iets waar je echt wat aan hebt.":"Discover something useful."}</h1>
      <p>{nl?"Ontdek praktische digitale cursussen, sjablonen en werkboeken van verschillende makers. Bekijk het aanbod of begin met een":"Find downloadable guides, templates and business toolkits from creators. Browse published listings or explore our"} <Link href="/#free-guides">{nl?"gratis gids":"free guide collection"}</Link>.</p>
    </header>
    <form className="explore-filters" method="get" action="/explore" role="search">
      <label>{nl?"Zoek producten":"Search products"}<input name="q" defaultValue={query} maxLength={80} placeholder={nl?"Bijvoorbeeld prijzen, fotografie of schoonmaak…":"Try pricing, photography, cleaning…"}/></label>
      <label>{nl?"Categorie":"Category"}<input name="category" defaultValue={category} maxLength={80} placeholder={nl?"Alle categorieën":"All categories"}/></label>
      <label>{nl?"Sorteer op":"Sort by"}<select name="sort" defaultValue={sort}>
        <option value="newest">{nl?"Nieuwste eerst":"Newest first"}</option><option value="oldest">{nl?"Oudste eerst":"Oldest first"}</option>
        <option value="price-low">{nl?"Prijs: laag naar hoog":"Price: low to high"}</option><option value="price-high">{nl?"Prijs: hoog naar laag":"Price: high to low"}</option>
      </select></label>
      <button className="button" type="submit">{nl?"Zoeken":"Find products"}</button>
    </form>
    <div className="explore-results-heading"><strong>{count ?? 0} {nl?"gepubliceerde": "published"} {count===1?"product":"products"}</strong>{query && <span>{nl?"Zoekopdracht":"Search"}: “{query}”</span>}</div>
    {error ? <p className="notice" role="alert">{nl?"De producten konden niet worden geladen. Probeer opnieuw.":"Products could not be loaded right now. Please try again."}</p>
      : products.length === 0 ? <div className="explore-empty"><h2>{nl?"Nog geen producten gevonden.":"No matching products yet."}</h2><p>{nl?"Probeer een andere zoekopdracht of bekijk de gratis gidsen.":"Try a broader search, or browse our free guides while creators build their shops."}</p><Link href="/#free-guides" className="button">{nl?"Bekijk gratis gidsen":"Explore free guides"}</Link></div>
      : <div className="explore-grid">{products.map(product => {
        const store = storeInfo(product.stores);
        return <article className="explore-product" key={product.id}>
          <Link className="explore-product-visual" href={`/products/${product.id}`}>
            <span>{product.category || (nl?"Digitale producten":"Digital products")}</span>
            <strong>{product.title}</strong>
            <small>PLAINWORK STUDIO · {nl?"DIGITALE DOWNLOAD":"DIGITAL DOWNLOAD"}</small>
          </Link>
          <div className="explore-product-content">
            <p className="explore-seller">{nl?"Van":"By"} <Link href={`/store/${store?.slug}`}>{store?.name ?? (nl?"Maker":"Creator")}</Link></p>
            <h2><Link href={`/products/${product.id}`}>{product.title}</Link></h2>
            <p className="explore-description">{product.description || (nl?"Een praktisch digitaal product van een zelfstandige maker.":"A practical digital product from an independent creator.")}</p>
            <div className="explore-product-bottom"><strong>{formatMoney(product.price_minor, product.currency)}</strong><Link href={`/products/${product.id}`}>{nl?"Meer informatie →":"See details →"}</Link></div>
          </div>
        </article>;
      })}</div>}
    {totalPages > 1 && <nav className="explore-pagination" aria-label="Product pages">
      {page > 1 && <Link href={href(page - 1)}>{nl?"← Vorige":"← Previous"}</Link>}
      <span>{nl?"Pagina":"Page"} {page} {nl?"van":"of"} {totalPages}</span>
      {page < totalPages && <Link href={href(page + 1)}>{nl?"Volgende →":"Next →"}</Link>}
    </nav>}
    <aside className="explore-seller-cta"><div><h2>{nl?"Heb je een handig digitaal product?":"Have a useful digital product?"}</h2><p>{nl?"Open een shop, bereik kopers en behoud 99% van je verkoopprijs vóór bijkomende kosten.":"Open a shop, reach new buyers and keep 99% of your sale price before other costs."}</p></div><Link className="market-primary" href="/create-shop">{nl?"Maak je shop ↗":"Create your shop ↗"}</Link></aside>
  </main>;
}
