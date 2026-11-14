"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
export function LanguageSwitcher({locale}:{locale:Locale}) {
  const [busy,setBusy]=useState(false);
  async function setLanguage(value:string) {
    setBusy(true);
    try {
      const response=await fetch("/api/language",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({locale:value})});
      if(response.ok) window.location.reload();
    } finally { setBusy(false); }
  }
  return <label className="pw-language"><span className="sr-only">{locale==="nl"?"Websitetaal":"Website language"}</span><select aria-label={locale==="nl"?"Websitetaal":"Website language"} value={locale} onChange={event=>void setLanguage(event.target.value)} disabled={busy}><option value="nl">NL</option><option value="en">EN</option></select></label>;
}
