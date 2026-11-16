import {cookies} from "next/headers";
import type {DisplayCurrency,FxQuote} from "@/lib/currency";
export async function getDisplayCurrency():Promise<DisplayCurrency>{
 const value=(await cookies()).get("plainwork_currency")?.value;
 return value==="GBP"?"GBP":"EUR";
}
export async function getFxQuote():Promise<FxQuote>{
 try{
  const response=await fetch("https://api.frankfurter.dev/v2/rate/eur/gbp?providers=ecb",{next:{revalidate:60*60*6}});
  if(!response.ok)return null;
  const data:unknown=await response.json();
  if(!data||typeof data!=="object")return null;
  const quote=data as {rate?:unknown;date?:unknown};
  if(typeof quote.rate!=="number"||!Number.isFinite(quote.rate)||quote.rate<=0||typeof quote.date!=="string")return null;
  return {gbpPerEur:quote.rate,date:quote.date};
 }catch{return null;}
}
