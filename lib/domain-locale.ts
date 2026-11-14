import type { Locale } from "@/lib/i18n";
import type {DisplayCurrency} from "@/lib/currency";

/** Known production hosts get distinct defaults; previews remain Dutch-first. */
export function localeForHostname(hostname:string):Locale{
 const normalized=hostname.toLowerCase().replace(/\.$/,"").split(":")[0];
 return normalized==="plainworkstudio.online"||normalized==="www.plainworkstudio.online"?"en":"nl";
}
export function currencyForHostname(hostname:string):DisplayCurrency{
 const normalized=hostname.toLowerCase().replace(/\.$/,"").split(":")[0];
 return normalized==="plainworkstudio.online"||normalized==="www.plainworkstudio.online"?"GBP":"EUR";
}
