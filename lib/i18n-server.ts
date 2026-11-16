import { cookies } from "next/headers";
import { copy, isLocale, type Locale } from "@/lib/i18n";
export async function getLocale(): Promise<Locale> {
  const raw = (await cookies()).get("plainwork_locale")?.value;
  return isLocale(raw) ? raw : "nl";
}
export async function getCopy(){ return copy[await getLocale()]; }
