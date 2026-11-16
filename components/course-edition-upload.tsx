"use client";
import {FormEvent,useState} from "react";
import {useSiteLocale} from "@/lib/use-site-locale";
import {createSupabaseBrowser} from "@/lib/supabase/client";
export function CourseEditionUpload({products}:{products:Array<{id:string;title:string}>}){
 const nl=useSiteLocale()==="nl";const[busy,setBusy]=useState(false);const[message,setMessage]=useState("");
 async function onSubmit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(busy)return;setBusy(true);setMessage("");
  try{
   const form=new FormData(e.currentTarget),file=form.get("file");
   if(!(file instanceof File)||file.size===0)throw new Error(nl?"Kies eerst een bestand.":"Choose a file first.");
   const response=await fetch("/api/products/upload",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
    productId:form.get("productId"),language:form.get("language"),filename:file.name,contentType:file.type||"application/pdf",size:file.size})});
   const json=await response.json();if(!response.ok)throw new Error(json.error??"Upload failed");
   const result=await createSupabaseBrowser().storage.from("product-files").uploadToSignedUrl(json.path,json.token,file,{contentType:file.type||"application/pdf"});
   if(result.error)throw result.error;
   setMessage(nl?"De taaleditie is veilig toegevoegd. Controleer de inhoud vóór publicatie.":"Language edition uploaded securely. Verify it before publishing.");
   e.currentTarget.reset();
  }catch(error){setMessage(error instanceof Error?error.message:"Upload failed")}
  finally{setBusy(false)}
 }
 if(!products.length)return null;
 return <form className="stack" onSubmit={onSubmit}>
  <p className="muted">{nl?"Voeg een Nederlandse of Engelse versie toe aan een bestaand cursusproduct.":"Add a Dutch or English edition to an existing course."}</p>
  <label>{nl?"Product":"Product"}<select name="productId" required>{products.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label>
  <label>{nl?"Taal van het bestand":"Edition language"}<select name="language"><option value="nl">Nederlands</option><option value="en">English</option></select></label>
  <label>{nl?"PDF- of ZIP-bestand":"PDF or ZIP file"}<input type="file" name="file" required accept=".pdf,.zip,application/pdf,application/zip,application/x-zip-compressed"/></label>
  <button type="submit" className="button" disabled={busy}>{busy?(nl?"Uploaden…":"Uploading…"):(nl?"Taaleditie toevoegen":"Upload edition")}</button>
  {message&&<p role="status" className="notice">{message}</p>}
 </form>;
}
