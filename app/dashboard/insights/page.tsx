import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Order = { id: string; status: string; total_minor: number; platform_fee_minor: number; currency: string; created_at: string };

export default async function CreatorInsights() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <main className="account-shell"><div className="account-card"><h1>Creator insights</h1><p>Please log in to view your shop activity.</p><Link href="/login" className="button">Log in</Link></div></main>;

  const { data: store } = await supabase.from("stores").select("id,name,slug,status").eq("owner_id",user.id).maybeSingle();
  if (!store) return <main className="account-shell"><div className="account-card"><h1>Start your creator journey</h1><p>Open your shop to start tracking your products and sales.</p><Link href="/create-shop" className="button">Create your shop</Link></div></main>;

  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
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
  const money = (minor: number, currency: string) => new Intl.NumberFormat("en",{style:"currency",currency:currency.toUpperCase()}).format(minor/100);
  const hasError = Boolean(productResult.error || publishedResult.error || salesResult.error);
  const incomplete = orders.length === 1000;
  const statusMessages = [
    { title: "Shop created", done: true, href: "/dashboard", desc: "Your storefront is registered." },
    { title: "Publish a product", done: (publishedResult.count ?? 0) > 0, href: "/dashboard", desc: "Add a complete digital product and publish it when ready." },
    { title: "Share your shop", done: store.status === "active", href: `/store/${store.slug}`, desc: store.status === "active" ? "Your storefront is active and shareable." : "Your store is not active yet. Complete onboarding first." },
    { title: "Reach your first sale", done: paid.length > 0, href: "/dashboard", desc: "Promote your listings and earn trust with useful products." },
  ];
  return <main className="insights-page">
    <div className="insights-header"><div><p className="guide-eyebrow">CREATOR SUCCESS</p><h1>Your shop at a glance.</h1><p className="muted">{store.name} · last 30 days · paid orders only</p></div><Link href="/dashboard" className="market-primary">Manage products →</Link></div>
    {hasError && <p className="notice" role="alert">Some metrics could not be loaded. Values below may be incomplete.</p>}
    <div className="insights-stats">
      <div className="insight-stat"><span>Total product drafts & listings</span><strong>{productResult.count ?? "—"}</strong><small>All product statuses</small></div>
      <div className="insight-stat"><span>Published products</span><strong>{publishedResult.count ?? "—"}</strong><small>Visible when the shop is active</small></div>
      <div className="insight-stat"><span>Paid orders</span><strong>{paid.length}{incomplete ? "+" : ""}</strong><small>Last 30 days; excludes refunds and pending orders</small></div>
    </div>
    <section className="insights-section"><h2>Gross paid sales by currency</h2>
      <p className="muted">From paid orders in the last 30 days. This is not your Stripe payout balance. Refunded or partially refunded orders are excluded; the figures are not net profit.</p>
      {totals.length ? <div className="insights-stats">{totals.map(t => <div className="insight-stat" key={t.currency}><span>{t.currency.toUpperCase()} paid order value</span><strong>{money(t.total,t.currency)}</strong><small>Allocated to creator before other charges: {money(t.creator,t.currency)}</small></div>)}</div> : <p className="notice">No paid sales recorded in this period yet.</p>}
      {incomplete && <p className="notice">Showing at most the latest 1,000 orders. Totals may be understated for high-volume sellers.</p>}
    </section>
    <section className="insights-section"><h2>Next steps for your shop</h2><div className="insights-checklist">{statusMessages.map(step => <div className="insights-step" key={step.title}><span aria-hidden="true">{step.done ? "✓" : "○"}</span><div><strong>{step.title}</strong><p>{step.desc}</p></div><Link href={step.href}>Open →</Link></div>)}</div></section>
    <p className="privacy-copy">These are seller-private metrics derived from your authenticated store. There are no fabricated sales, visitor counts or review scores.</p>
  </main>;
}
