import Link from "next/link";
import {getLocale} from "@/lib/i18n-server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Order = { id: string; status: string; total_minor: number; platform_fee_minor: number; currency: string; created_at: string };

export default async function CreatorInsights({searchParams}:{searchParams:Promise<{shop?:string}>}) {
  const nl=(await getLocale())==="nl";
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <main className="account-shell"><div className="account-card"><h1>{nl?"Resultaten van je shop":"Creator insights"}</h1><p>{nl?"Log in om je shopresultaten te bekijken.":"Please log in to view your shop activity."}</p><Link href="/login" className="button">{nl?"Inloggen":"Log in"}</Link></div></main>;

  const {shop:requestedShop}=await searchParams;
  let storeQuery=supabase.from("stores").select("id,name,slug,status").eq("owner_id",user.id);
  if(requestedShop)storeQuery=storeQuery.eq("slug",requestedShop);
  else storeQuery=storeQuery.order("created_at",{ascending:true}).limit(1);
  const {data:store}=await storeQuery.maybeSingle();
  if (!store) return <main className="account-shell"><div className="account-card"><h1>{nl?"Begin met je eigen shop":"Start your creator journey"}</h1><p>{nl?"Maak een shop om producten en verkopen te volgen.":"Open your shop to start tracking your products and sales."}</p><Link href="/create-shop" className="button">{nl?"Maak je shop":"Create your shop"}</Link></div></main>;

  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - 30);
  const from = startDate.toISOString();
  const [productResult, publishedResult, salesResult] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", store.id),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", store.id).eq("status","published"),
    supabase.from("orders").select("id,status,total_minor,platform_fee_minor,currency,created_at")
      .eq("store_id", store.id).gte("created_at", from).order("created_at", { ascending: false }).limit(1000),
  ]);

  const orders = (salesResult.data ?? []) as Order[];
  const paid = orders.filter(o => o.status === "paid");
  const currencies = [...new Set(paid.map(o => o.currency))];
  // Never add numbers from different currencies together.
  const totals = currencies.map(currency => {
    const subset = paid.filter(o => o.currency === currency);
    const total = subset.reduce((sum,o)=>sum+o.total_minor,0);
    const fees = subset.reduce((sum,o)=>sum+o.platform_fee_minor,0);
    return { currency, total, creator: total - fees };
  });
  const money = (minor: number, currency: string) => new Intl.NumberFormat(nl?"nl-NL":"en-GB",{style:"currency",currency:currency.toUpperCase()}).format(minor/100);
  const hasError = Boolean(productResult.error || publishedResult.error || salesResult.error);
  const incomplete = orders.length === 1000;
  const statusMessages = [
    { title: nl?"Shop aangemaakt":"Shop created", done: true, href: "/dashboard", desc: nl?"Je shop is geregistreerd.":"Your storefront is registered." },
    { title: nl?"Publiceer een product":"Publish a product", done: (publishedResult.count ?? 0) > 0, href: "/dashboard", desc: nl?"Maak een compleet product en publiceer het na controle.":"Add a complete digital product and publish it when ready." },
    { title: nl?"Deel je shop":"Share your shop", done: store.status === "active", href: `/store/${store.slug}`, desc: store.status === "active" ? nl?"Je shop is actief en deelbaar.":"Your storefront is active and shareable." : nl?"Je shop is nog niet actief. Rond eerst de registratie af.":"Your store is not active yet. Complete onboarding first." },
    { title: nl?"Behaal je eerste verkoop":"Reach your first sale", done: paid.length > 0, href: "/dashboard", desc: nl?"Laat je producten zien en verdien vertrouwen met kwaliteit.":"Promote your listings and earn trust with useful products." },
  ];
  return <main className="insights-page">
    <div className="insights-header"><div><p className="guide-eyebrow">{nl?"RESULTATEN VAN MAKERS":"CREATOR SUCCESS"}</p><h1>{nl?"Je shop in één oogopslag.":"Your shop at a glance."}</h1><p className="muted">{store.name} · {nl?"laatste 30 dagen · alleen betaalde bestellingen":"last 30 days · paid orders only"}</p></div><Link href={"/dashboard?shop="+encodeURIComponent(store.slug)} className="market-primary">{nl?"Producten beheren →":"Manage products →"}</Link></div>
    {hasError && <p className="notice" role="alert">{nl?"Sommige cijfers konden niet worden geladen. Dit overzicht kan onvolledig zijn.":"Some metrics could not be loaded. Values below may be incomplete."}</p>}
    <div className="insights-stats">
      <div className="insight-stat"><span>{nl?"Alle concepten en producten":"Total product drafts & listings"}</span><strong>{productResult.count ?? "—"}</strong><small>{nl?"Alle productstatussen":"All product statuses"}</small></div>
      <div className="insight-stat"><span>{nl?"Gepubliceerde producten":"Published products"}</span><strong>{publishedResult.count ?? "—"}</strong><small>{nl?"Zichtbaar zodra de shop actief is":"Visible when the shop is active"}</small></div>
      <div className="insight-stat"><span>{nl?"Betaalde bestellingen":"Paid orders"}</span><strong>{paid.length}{incomplete ? "+" : ""}</strong><small>{nl?"Laatste 30 dagen; zonder terugbetalingen en openstaande orders":"Last 30 days; excludes refunds and pending orders"}</small></div>
    </div>
    <section className="insights-section"><h2>{nl?"Bruto betaalde verkopen per valuta":"Gross paid sales by currency"}</h2>
      <p className="muted">{nl?"Gebaseerd op betaalde bestellingen in de afgelopen 30 dagen. Dit is niet je Stripe-saldo of nettowinst. Terugbetaalde bestellingen zijn uitgesloten.":"From paid orders in the last 30 days. This is not your Stripe payout balance. Refunded or partially refunded orders are excluded; the figures are not net profit."}</p>
      {totals.length ? <div className="insights-stats">{totals.map(t => <div className="insight-stat" key={t.currency}><span>{t.currency.toUpperCase()} {nl?"aan betaalde bestellingen":"paid order value"}</span><strong>{money(t.total,t.currency)}</strong><small>{nl?"Aandeel maker vóór andere kosten:":"Allocated to creator before other charges:"} {money(t.creator,t.currency)}</small></div>)}</div> : <p className="notice">{nl?"Nog geen betaalde verkopen in deze periode.":"No paid sales recorded in this period yet."}</p>}
      {incomplete && <p className="notice">{nl?"We tonen maximaal 1.000 recente orders. Bij veel verkopen kunnen totalen te laag zijn.":"Showing at most the latest 1,000 orders. Totals may be understated for high-volume sellers."}</p>}
    </section>
    <section className="insights-section"><h2>{nl?"Volgende stappen voor je shop":"Next steps for your shop"}</h2><div className="insights-checklist">{statusMessages.map(step => <div className="insights-step" key={step.title}><span aria-hidden="true">{step.done ? "✓" : "○"}</span><div><strong>{step.title}</strong><p>{step.desc}</p></div><Link href={step.href}>{nl?"Openen →":"Open →"}</Link></div>)}</div></section>
    <p className="privacy-copy">{nl?"Deze cijfers zijn alleen zichtbaar voor de eigenaar en komen uit de shopgegevens. Er worden geen verkopen, bezoekersaantallen of beoordelingen verzonnen.":"These are seller-private metrics derived from your authenticated store. There are no fabricated sales, visitor counts or review scores."}</p>
  </main>;
}
