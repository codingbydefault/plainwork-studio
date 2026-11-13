"use client";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { copy } from "@/lib/i18n";

export function CheckoutButton({productId, locale="nl"}:{productId:string;locale?:Locale}) {
  const t=copy[locale];
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [available,setAvailable]=useState<Locale[]>([]);
  const [loading,setLoading]=useState(true);
  const [language,setLanguage]=useState<Locale>(locale);

  useEffect(()=>{
    let active=true;
    setLoading(true);
    void fetch(`/api/products/${encodeURIComponent(productId)}/languages`,{cache:"no-store"})
      .then(r=>r.ok?r.json():{languages:[]})
      .then(({languages}:{languages:Locale[]})=>{
        if(!active)return;
        const options=(languages??[]).filter((l):l is Locale=>l==="nl"||l==="en");
        setAvailable(options);
        setLanguage(options.includes(locale)?locale:options[0]??locale);
      })
      .catch(()=>{if(active)setAvailable([])})
      .finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[productId,locale]);

  async function checkout() {
    if(!available.includes(language)){setError(t.noEdition);return;}
    setBusy(true);setError("");
    try {
      const response=await fetch("/api/checkout",{method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({productId,language})});
      const data=await response.json();
      if(!response.ok){setError(data.error||"Checkout failed");return;}
      if(typeof data.url!=="string"||!data.url.startsWith("https://checkout.stripe.com/")) {setError("Invalid checkout link");return;}
      window.location.assign(data.url);
    } catch {setError(locale==="nl"?"Betaling kon niet worden gestart.":"Could not start checkout.");}
    finally {setBusy(false); }
  }
  return <div className="stack checkout-language">
    <label>{t.chooseLanguage}
      <select value={language} onChange={e=>setLanguage(e.target.value as Locale)} disabled={loading||busy||available.length===0}>
        {available.length?available.map(l=><option value={l} key={l}>{l==="nl"?t.nlBook:t.enBook}</option>)
          : <option value="">{loading?(locale==="nl"?"Talen controleren…":"Checking editions…"):t.noEdition}</option>}
      </select>
    </label>
    <button type="button" className="button" disabled={busy||loading||available.length===0} onClick={()=>void checkout()}>
      {busy?t.preparing:t.purchase}
    </button>
    {!loading&&available.length===0&&<small className="muted">{t.noEdition}</small>}
    {error&&<small className="muted" role="alert">{error}</small>}
  </div>;
}
