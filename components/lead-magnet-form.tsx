"use client";
import {FormEvent,useState} from "react";
import {useSiteLocale} from "@/lib/use-site-locale";

export function LeadMagnetForm({guideKey}:{guideKey:string}){
 const locale=useSiteLocale(),nl=locale==="nl";
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;setBusy(true);setMessage("");
  try {
   const form=new FormData(event.currentTarget);
   const response=await fetch("/api/free-guides",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
    guideKey,language:form.get("language"),email:form.get("email"),marketingConsent:form.get("marketingConsent")==="on",website:form.get("website")})});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error??(nl?"De download is niet beschikbaar.":"Download unavailable."));
   if(typeof result.downloadUrl!=="string")throw new Error(nl?"Downloadlink ontbreekt.":"Download URL missing.");
   window.location.assign(result.downloadUrl);
   setMessage(nl?"Je beveiligde download begint.":"Your secure download is starting.");
  } catch(error){setMessage(error instanceof Error?error.message:(nl?"De download is mislukt.":"Download failed."))}
  finally{setBusy(false)}
 }
 if(!open)return <button type="button" className="button secondary" onClick={()=>setOpen(true)}>{nl?"Download de gratis PDF":"Get the free PDF"}</button>;
 return <form className="lead-form" onSubmit={submit}>
  <label>{nl?"E-mailadres":"Email address"}<input name="email" type="email" autoComplete="email" required placeholder="jij@voorbeeld.nl"/></label>
  <label>{nl?"Taal van de PDF":"PDF language"}<select name="language" defaultValue={locale}><option value="nl">Nederlands</option><option value="en">English</option></select></label>
  <label className="consent"><input name="marketingConsent" type="checkbox"/> {nl?"Stuur mij af en toe tips en aanbiedingen over deze cursus. Ik kan me altijd uitschrijven.":"Email me useful tips and offers about the matching course. I can unsubscribe anytime."}</label>
  <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
  <p className="privacy-copy">{nl?"We gebruiken je e-mailadres om de gids te bezorgen. Marketing is optioneel. Lees ons":"We use your email to deliver the guide. Marketing is optional. Read our"} <a href="/privacy">{nl?"privacybeleid":"privacy notice"}</a>.</p>
  <div className="row"><button className="button secondary" type="submit" disabled={busy}>{busy?(nl?"Voorbereiden…":"Preparing…"):(nl?"Veilig downloaden":"Download securely")}</button><button type="button" className="text-button" onClick={()=>setOpen(false)}>{nl?"Annuleren":"Cancel"}</button></div>
  {message&&<p className="notice" role="status">{message}</p>}
 </form>;
}
