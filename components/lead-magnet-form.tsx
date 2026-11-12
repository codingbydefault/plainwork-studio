"use client";

import { FormEvent, useState } from "react";

export function LeadMagnetForm({ guideKey }: { guideKey: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/free-guides", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ guideKey, email: form.get("email"), marketingConsent: form.get("marketingConsent") === "on", website: form.get("website") }),
    });
    const result = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(result.error ?? "We could not prepare your guide.");
    window.location.assign(result.downloadUrl); setMessage("Your secure download is starting.");
  }

  if (!open) return <button className="button secondary" onClick={() => setOpen(true)}>Get the free PDF</button>;
  return <form className="lead-form" onSubmit={submit}>
    <label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label>
    <label className="consent"><input name="marketingConsent" type="checkbox"/> Email me useful tips and offers for the matching full toolkit. I can unsubscribe at any time.</label>
    <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
    <p className="privacy-copy">We use your email to deliver this guide. Marketing is optional. See our <a href="/privacy">privacy notice</a>.</p>
    <div className="row"><button className="button secondary" disabled={busy}>{busy ? "Preparing…" : "Download securely"}</button><button type="button" className="text-button" onClick={() => setOpen(false)}>Cancel</button></div>
    {message && <p className="notice" role="status">{message}</p>}
  </form>;
}
