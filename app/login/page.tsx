"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
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
          setMessage("Check your email to confirm your account, then log in.");
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
    <h1>{mode === "login" ? "Welcome back." : "Create your account."}</h1>
    <p className="muted">Log in to access your library and manage your digital products.</p>
    <form className="stack" onSubmit={submit}>
      <label>Email address<input type="email" name="email" autoComplete="email" required placeholder="you@example.com"/></label>
      <label>Password<input type="password" name="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required placeholder="Enter your password"/></label>
      <button className="button account-submit" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button>
      {error && <p className="notice" role="alert">{error}</p>}
      {message && <p className="notice" role="status">{message}</p>}
    </form>
    <p className="account-switch">{mode === "login" ? "New to Plainwork Studio?" : "Already have an account?"}{" "}
      <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setMessage(""); }} className="text-button">{mode === "login" ? "Create an account" : "Log in"}</button>
    </p>
    <p className="account-switch"><Link href="/">Back to marketplace</Link></p>
  </div></main>;
}
