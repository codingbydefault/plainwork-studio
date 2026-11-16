"use client";
import {useState} from "react";
import type {DisplayCurrency} from "@/lib/currency";
export function CurrencySwitcher({currency,locale}:{currency:DisplayCurrency;locale:"nl"|"en"}){
 const [busy,setBusy]=useState(false);
 async function change(next:string){
  setBusy(true);
  try{
   const response=await fetch("/api/currency",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({currency:next})});
   if(response.ok)window.location.reload();
  }finally{setBusy(false)}
 }
 return <label className="pw-currency">
  <span className="sr-only">{locale==="nl"?"Prijsvaluta":"Display currency"}</span>
  <select aria-label={locale==="nl"?"Prijsvaluta":"Display currency"} value={currency} disabled={busy} onChange={e=>void change(e.target.value)}>
   <option value="EUR">€ EUR</option><option value="GBP">£ GBP</option>
  </select>
 </label>;
}
