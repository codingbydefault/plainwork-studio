import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { localeForHostname, currencyForHostname } from "@/lib/domain-locale";

export async function proxy(request:NextRequest){
  const hasLocale=request.cookies.has("plainwork_locale");
  const defaultLocale=localeForHostname(request.nextUrl.hostname);
  const hasCurrency=request.cookies.has("plainwork_currency");
  const defaultCurrency=currencyForHostname(request.nextUrl.hostname);
  if(!hasLocale) request.cookies.set("plainwork_locale",defaultLocale);
  if(!hasCurrency) request.cookies.set("plainwork_currency",defaultCurrency);

  let response=NextResponse.next({request});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(url&&key){
    const supabase=createServerClient(url,key,{cookies:{
      getAll:()=>request.cookies.getAll(),
      setAll:(items)=>{
        items.forEach(({name,value})=>request.cookies.set(name,value));
        response=NextResponse.next({request});
        items.forEach(({name,value,options})=>response.cookies.set(name,value,options));
      }
    }});
    await supabase.auth.getUser();
  }

  if(!hasLocale) response.cookies.set("plainwork_locale",defaultLocale,{path:"/",sameSite:"lax",maxAge:60*60*24*365,secure:process.env.NODE_ENV==="production"});
  if(!hasCurrency) response.cookies.set("plainwork_currency",defaultCurrency,{path:"/",sameSite:"lax",maxAge:60*60*24*365,secure:process.env.NODE_ENV==="production"});
  return response;
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]};
