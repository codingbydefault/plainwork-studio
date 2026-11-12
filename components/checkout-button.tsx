"use client";
import { useState } from "react";

export function CheckoutButton({ productId }: { productId: string }) {
  const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function checkout(){setBusy(true);setError("");const response=await fetch("/api/checkout",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({productId})});const data=await response.json();if(response.ok)location.assign(data.url);else{setError(data.error);setBusy(false)}}
  return <div className="stack"><button className="button" disabled={busy} onClick={checkout}>{busy?"Opening checkout…":"Buy securely"}</button>{error&&<small className="muted">{error}</small>}</div>;
}
