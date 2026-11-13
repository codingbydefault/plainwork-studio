"use client";
import {FormEvent,useState} from "react";
import {catalog,catalogByKey} from "@/lib/catalog";
import {localCatalog} from "@/lib/catalog-i18n";
import {useSiteLocale} from "@/lib/use-site-locale";
import {createSupabaseBrowser} from "@/lib/supabase/client";
export function ProductForm({storeId}:{storeId:string}){
 const locale=useSiteLocale();const nl=locale==="nl";
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;setBusy(true);setMessage("");
  try{
   const form=new FormData(event.currentTarget),catalogKey=String(form.get("catalogKey")??"");
   const response=await fetch("/api/products",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
    storeId,catalogKey:catalogKey||undefined,name:form.get("name"),description:form.get("description"),
    priceMinor:Math.round(Number(form.get("price"))*100),currency:form.get("currency")})});
   const result=await response.json();if(!response.ok)throw new Error(result.error??"Could not create product");
   const file=form.get("file"),language=String(form.get("language")??"nl");
   if(file instanceof File&&file.size>0){
    const expected=catalogKey?catalogByKey.get(catalogKey)?.paid.archive:undefined;
    if(expected&&language==="en"&&file.name!==expected)throw new Error(nl?`Het product is gemaakt, maar verwacht het Engelse bestand: ${expected}`:`Product created; expected English archive: ${expected}`);
    const uploadResponse=await fetch("/api/products/upload",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
     productId:result.product.id,language,filename:file.name,contentType:file.type||"application/zip",size:file.size})});
    const upload=await uploadResponse.json();if(!uploadResponse.ok)throw new Error(upload.error??"Upload could not be prepared");
    const {error}=await createSupabaseBrowser().storage.from("product-files").uploadToSignedUrl(upload.path,upload.token,file,{contentType:file.type||"application/zip"});
    if(error)throw error;
    setMessage(nl?"Conceptproduct aangemaakt en bestand veilig geüpload.":"Draft product created and file uploaded securely.");
   }else setMessage(nl?"Conceptproduct aangemaakt. Upload het cursusbestand voordat je publiceert.":"Draft created. Upload the course file before publishing.");
   event.currentTarget.reset();
  }catch(error){setMessage(error instanceof Error?error.message:(nl?"Er is iets misgegaan.":"Something went wrong."))}
  finally{setBusy(false)}
 }
 return <form className="stack" onSubmit={submit}>
  <label>{nl?"Voorbeeldproduct":"Starter product"}<select name="catalogKey" defaultValue=""><option value="">{nl?"Eigen product":"Custom product"}</option>
   {catalog.map(item=><option value={item.key} key={item.key}>{localCatalog(item,locale).category} — {localCatalog(item,locale).paid.title}</option>)}
  </select></label>
  <p className="muted">{nl?"Bij een voorbeeldproduct worden de vooraf ingestelde titel, prijs en categorie gebruikt.":"A starter product uses its preset title, price and category."}</p>
  <label>{nl?"Productnaam":"Product name"}<input name="name" required minLength={2}/></label>
  <label>{nl?"Beschrijving":"Description"}<textarea name="description" rows={4}/></label>
  <div className="row"><label>{nl?"Prijs":"Price"}<input name="price" type="number" min="0.50" step="0.01" required/></label>
   <label>{nl?"Valuta":"Currency"}<select name="currency"><option value="eur">EUR</option><option value="usd">USD</option><option value="gbp">GBP</option></select></label></div>
  <label>{nl?"Taal van het cursusbestand":"Course file language"}<select name="language" defaultValue="nl"><option value="nl">Nederlands</option><option value="en">English</option></select></label>
  <label>{nl?"Cursusbestand (PDF of ZIP)":"Course file (PDF or ZIP)"}<input name="file" type="file" accept=".pdf,.zip,application/pdf,application/zip,application/x-zip-compressed"/></label>
  <button type="submit" className="button" disabled={busy}>{busy?(nl?"Opslaan en uploaden…":"Saving and uploading…"):(nl?"Product maken als concept":"Create draft product")}</button>
  {message&&<p className="notice" role="status">{message}</p>}
 </form>;
}
