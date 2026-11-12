"use client";
import { useState } from "react";
export function ConnectButton(){const[busy,setBusy]=useState(false);async function start(){setBusy(true);const r=await fetch("/api/connect/onboard",{method:"POST"});const data=await r.json();if(r.ok)location.assign(data.url);else{alert(data.error);setBusy(false)}}return <button className="button" disabled={busy} onClick={start}>{busy?"Opening Stripe…":"Connect or continue Stripe onboarding"}</button>}
