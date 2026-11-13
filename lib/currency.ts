import {cookies} from "next/headers";
export type DisplayCurrency="EUR"|"GBP";
export type FxQuote={gbpPerEur:number;date:string}|null;
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
export function displayPrice(amountMinor:number,baseCurrency:string,selected:DisplayCurrency,fx:FxQuote,locale:"nl"|"en"){
 const base=baseCurrency.toUpperCase();
 const canConvert=base!==selected && fx!==null && (base==="EUR"||base==="GBP");
 const finalCurrency=canConvert?selected:base;
 const amount=canConvert?(base==="EUR"?(amountMinor/100)*fx!.gbpPerEur:(amountMinor/100)/fx!.gbpPerEur):amountMinor/100;
 return {value:new Intl.NumberFormat(locale==="nl"?"nl-NL":"en-GB",{style:"currency",currency:finalCurrency}).format(amount),converted:canConvert,currency:finalCurrency};
}
