"use client";
import {useSyncExternalStore} from "react";
import type {Locale} from "@/lib/i18n";
export function useSiteLocale():Locale{
 return useSyncExternalStore(
  () => () => undefined,
  () => document.documentElement.lang==="en"?"en":"nl",
  () => "nl",
 );
}
