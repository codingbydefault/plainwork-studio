import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AuthPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");
  return <main className="auth-shell"><section className="auth-pitch"><div className="eyebrow">Join the marketplace</div><h1>Buy useful systems. Or open your own digital shop.</h1><p>One account gives buyers a permanent library and creators a storefront, secure file delivery, Stripe payouts, and a simple 1% platform fee.</p><div className="feature-list"><span>✓ Secure digital delivery</span><span>✓ Creator storefront URL</span><span>✓ Buyer purchase library</span><span>✓ Stripe-powered payments</span></div></section><AuthForm/></main>;
}
