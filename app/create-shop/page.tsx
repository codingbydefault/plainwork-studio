"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function CreateShopPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [existing, setExisting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowser();
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      setLoggedIn(!!user);
      if (user) {
        const { data } = await supabase.from("stores").select("id").eq("owner_id", user.id).limit(1);
        if (active) setExisting(Boolean(data?.length));
      }
      if (active) setReady(true);
    }
    void check();
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const supabase = createSupabaseBrowser();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) { setError("Log in before creating a shop."); return; }
      const data = new FormData(event.currentTarget);
      const name = String(data.get("name") ?? "").trim();
      const slug = String(data.get("slug") ?? "").trim().toLowerCase();
      if (name.length < 2 || name.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        setError("Use a shop name (2–80 characters) and a lowercase URL slug with letters, numbers or hyphens."); return;
      }
      const { data: current } = await supabase.from("stores").select("id").eq("owner_id", user.id).limit(1);
      if (current?.length) { router.push("/dashboard"); router.refresh(); return; }
      const { error: insertError } = await supabase.from("stores").insert({ owner_id: user.id, name, slug, status: "draft" });
      if (insertError) throw insertError;
      router.push("/dashboard"); router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create your shop.");
    } finally { setBusy(false); }
  }

  return <main className="account-shell"><div className="account-card">
    <p className="guide-eyebrow">START SELLING ON PLAINWORK STUDIO</p>
    <h1>Create your shop.</h1>
    <p className="muted">Choose a shop name and URL. Your shop starts as a draft until you're ready to publish products.</p>
    {!ready ? <p>Checking your account…</p> : !loggedIn ?
      <div className="stack"><p className="notice">Log in or create an account to open your shop.</p><Link href="/login" className="button account-submit">Log in or sign up</Link></div>
      : existing ? <div className="stack"><p className="notice">You already have a shop.</p><Link href="/dashboard" className="button account-submit">Open creator dashboard</Link></div>
      : <form className="stack" onSubmit={submit}>
          <label>Shop name<input name="name" type="text" placeholder="Your studio or business name" minLength={2} maxLength={80} required/></label>
          <label>Shop URL name<input name="slug" type="text" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="your-studio" required/></label>
          <p className="privacy-copy">Use lowercase letters, numbers and hyphens for the URL name. It must be unique.</p>
          <button type="submit" className="button account-submit" disabled={busy}>{busy ? "Creating…" : "Create my shop"}</button>
          {error && <p className="notice" role="alert">{error}</p>}
        </form>}
  </div></main>;
}
