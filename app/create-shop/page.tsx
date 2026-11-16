"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useSiteLocale } from "@/lib/use-site-locale";

export default function CreateShopPage() {
  const router = useRouter();
  const nl=useSiteLocale()==="nl";
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowser();
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      setLoggedIn(!!user);
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
      if (authError || !user) { setError("Log eerst in voordat je een shop maakt."); return; }
      const data = new FormData(event.currentTarget);
      const name = String(data.get("name") ?? "").trim();
      const slug = String(data.get("slug") ?? "").trim().toLowerCase();
      if (name.length < 2 || name.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        setError("Gebruik een shopnaam van 2–80 tekens en een URL-naam met kleine letters, cijfers of streepjes."); return;
      }
      const { error: insertError } = await supabase.from("stores").insert({ owner_id: user.id, name, slug, status: "draft" });
      if (insertError) throw insertError;
      router.push(`/dashboard?shop=${encodeURIComponent(slug)}`); router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Je shop kon niet worden aangemaakt.");
    } finally { setBusy(false); }
  }

  return <main className="account-shell"><div className="account-card">
    <p className="guide-eyebrow">BEGIN TE VERKOPEN OP PLAINWORK STUDIO</p>
    <h1>{nl?"Maak je eigen shop.":"Create your shop."}</h1>
    <p className="muted">{nl?"Kies je shopnaam en URL. Onder één account kun je meerdere shops beheren. Nieuwe shops beginnen als concept.":"Choose a shop name and URL. You can create multiple shops under one login. Each shop starts as a draft."}</p>
    {!ready ? <p>{nl?"Je account controleren…":"Checking your account…"}</p> : !loggedIn ?
      <div className="stack"><p className="notice">{nl?"Log in of maak een account om een shop te openen.":"Log in or create an account to open your shop."}</p><Link href="/login" className="button account-submit">{nl?"Inloggen of registreren":"Log in or sign up"}</Link></div>
      : <form className="stack" onSubmit={submit}>
          <label>{nl?"Shopnaam":"Shop name"}<input name="name" type="text" placeholder={nl?"Naam van je studio of onderneming":"Your studio or business name"} minLength={2} maxLength={80} required/></label>
          <label>{nl?"URL-naam van de shop":"Shop URL name"}<input name="slug" type="text" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="your-studio" required/></label>
          <p className="privacy-copy">{nl?"Gebruik kleine letters, cijfers en streepjes. De URL-naam moet uniek zijn.":"Use lowercase letters, numbers and hyphens for the URL name. It must be unique."}</p>
          <button type="submit" className="button account-submit" disabled={busy}>{busy?(nl?"Aanmaken…":"Creating…"):(nl?"Maak mijn shop":"Create my shop")}</button>
          {error && <p className="notice" role="alert">{error}</p>}
        </form>}
  </div></main>;
}
