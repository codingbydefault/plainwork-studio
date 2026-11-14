import type { Locale } from "@/lib/i18n";

export function localeForHostname(hostname: string): Locale {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");

  if (normalized.endsWith(".online") || normalized === "online") return "en";
  return "nl";
}
