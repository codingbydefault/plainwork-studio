"use client";
import { FormEvent, useState } from "react";
import { catalog, catalogByKey } from "@/lib/catalog";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export function ProductForm({storeId}:{storeId:string}) {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); const form = new FormData(event.currentTarget);
    const catalogKey = String(form.get("catalogKey") ?? "");
    const response = await fetch("/api/products", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ storeId, catalogKey: catalogKey || undefined, name: form.get("name"), description: form.get("description"), priceMinor: Math.round(Number(form.get("price")) * 100), currency: form.get("currency") }) });
    const result = await response.json();
    if (!response.ok) { setBusy(false); return setMessage(result.error ?? "Could not create product"); }
    const file = form.get("file");
    if (file instanceof File && file.size > 0) {
      const expectedArchive = catalogKey ? catalogByKey.get(catalogKey)?.paid.archive : undefined;
      if (expectedArchive && file.name !== expectedArchive) { setBusy(false); return setMessage(`Product created, but choose its matching book: ${expectedArchive}`); }
      const uploadResponse = await fetch("/api/products/upload", {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({productId:result.product.id,filename:file.name,contentType:file.type || "application/zip",size:file.size})});
      const upload = await uploadResponse.json();
      if (!uploadResponse.ok) { setBusy(false); return setMessage(upload.error ?? "Product created, but the book could not be attached"); }
      const { error } = await createSupabaseBrowser().storage.from("product-files").uploadToSignedUrl(upload.path, upload.token, file, {contentType:file.type || "application/zip"});
      if (error) { setBusy(false); return setMessage(`Product created, but the book upload failed: ${error.message}`); }
      setMessage("Product created and the matching paid book was attached securely.");
    } else setMessage("Product created as a draft. Attach its paid ZIP before publishing.");
    setBusy(false); event.currentTarget.reset();
  }
  return <form className="stack" onSubmit={submit}><label>Starter product<select name="catalogKey" defaultValue=""><option value="">Custom product</option>{catalog.map((item)=><option value={item.key} key={item.key}>{item.category} — {item.paid.title}</option>)}</select></label><p className="muted">Choosing a starter product locks in the correct title, category, €14.99 price and matching ZIP filename.</p><label>Product name<input name="name" required minLength={2}/></label><label>Description<textarea name="description" rows={4}/></label><div className="row"><label>Price<input name="price" type="number" min="0.50" step="0.01" required/></label><label>Currency<select name="currency"><option value="eur">EUR</option><option value="usd">USD</option><option value="gbp">GBP</option></select></label></div><label>Paid book/toolkit ZIP<input name="file" type="file" accept=".zip,application/zip,application/x-zip-compressed"/></label><button className="button" disabled={busy}>{busy?"Creating and attaching…":"Create product and attach book"}</button>{message&&<p className="notice">{message}</p>}</form>;
}
