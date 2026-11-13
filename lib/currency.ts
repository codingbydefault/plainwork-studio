export type DisplayCurrency="EUR"|"GBP";
export type FxQuote={gbpPerEur:number;date:string}|null;
export function displayPrice(amountMinor:number,baseCurrency:string,selected:DisplayCurrency,fx:FxQuote,locale:"nl"|"en"){
 const base=baseCurrency.toUpperCase();
 const canConvert=base!==selected && fx!==null && (base==="EUR"||base==="GBP");
 const finalCurrency=canConvert?selected:base;
 const amount=canConvert?(base==="EUR"?(amountMinor/100)*fx!.gbpPerEur:(amountMinor/100)/fx!.gbpPerEur):amountMinor/100;
 return {value:new Intl.NumberFormat(locale==="nl"?"nl-NL":"en-GB",{style:"currency",currency:finalCurrency}).format(amount),converted:canConvert,currency:finalCurrency};
}
