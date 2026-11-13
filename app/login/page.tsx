"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useSiteLocale } from "@/lib/use-site-locale";

export default function LoginPage() {
  const router = useRouter();
  const nl=useSiteLocale()==="nl";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(""); setMessage("");
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const supabase = createSupabaseBrowser();
    try {
      if (mode === "register") {
        const result = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/login` } });
        if (result.error) throw result.error;
        if (!result.data.session) {
          setMessage(nl?"Controleer je e-mail om je account te bevestigen. Log daarna in.":"Check your email to confirm your account, then log in.");
        } else {
          router.push("/create-shop"); router.refresh();
        }
      } else {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        router.push("/dashboard"); router.refresh();
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't complete your request.");
    } finally { setBusy(false); }
  }

  return <main className="account-shell"><div className="account-card">
    <p className="guide-eyebrow">PLAINWORK STUDIO</p>
    <h1>{mode === "login" ? (nl?"Welkom terug.":"Welcome back.") : (nl?"Maak je account aan.":"Create your account.")}</h1>
    <p className="muted">{nl?"Log in om je aankopen te bekijken en je digitale producten te beheren.":"Log in to access your library and manage your digital products."}</p>
    <form className="stack" onSubmit={submit}>
      <label>{nl?"E-mailadres":"Email address"}<input type="email" name="email" autoComplete="email" required placeholder="you@example.com"/></label>
      <label>{nl?"Wachtwoord":"Password"}<input type="password" name="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required placeholder={nl?"Vul je wachtwoord in":"Enter your password"}/></label>
      <button className="button account-submit" type="submit" disabled={busy}>{busy?(nl?"Even geduld…":"Please wait…"):mode==="login"?(nl?"Inloggen":"Log in"):(nl?"Account aanmaken":"Create account")}</button>
      {error && <p className="notice" role="alert">{error}</p>}
      {message && <p className="notice" role="status">{message}</p>}
    </form>
    <p className="account-switch">{mode==="login"?(nl?"Nieuw bij Plainwork Studio?":"New to Plainwork Studio?"):(nl?"Heb je al een account?":"Already have an account?")}{" "}
      <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setMessage(""); }} className="text-button">{mode==="login"?(nl?"Maak een account aan":"Create an account"):(nl?"Inloggen":"Log in")}</button>
    </p>
    <p className="account-switch"><Link href="/">{nl?"Terug naar de marktplaats":"Back to marketplace"}</Link></p>
  </div></main>;
}
