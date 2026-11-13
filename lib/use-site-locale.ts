"use client";
import {useEffect,useState} from "react";
import type {Locale} from "@/lib/i18n";
export function useSiteLocale():Locale{
 const [locale,setLocale]=useState<Locale>("nl");
 useEffect(()=>{setLocale(document.documentElement.lang==="en"?"en":"nl")},[]);
 return locale;
}
