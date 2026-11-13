import "./globals.css";
import "./lead.css";
import Link from "next/link";
import { getLocale, getCopy } from "@/lib/i18n-server";
import { LanguageSwitcher } from "@/components/language-switcher";
import {CurrencySwitcher} from "@/components/currency-switcher";
import {getDisplayCurrency} from "@/lib/currency";

export const metadata = { title: "Plainwork Studio", description: "Verkoop en ontdek digitale cursussen en producten. Makers behouden 99% van de verkoopprijs vóór bijkomende kosten. | Buy and sell practical digital products." };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale=await getLocale(); const t=await getCopy();const currency=await getDisplayCurrency();
  return <html lang={locale}><body><div className="page"><header className="topbar">
    <Link className="brand" href="/">Plainwork Studio</Link>
    <nav className="nav" aria-label={locale==="nl"?"Hoofdnavigatie":"Main navigation"}>
      <Link href="/">{t.home}</Link>
      <Link href="/explore">{t.explore}</Link>
      <Link href="/library">{t.library}</Link>
      <Link href="/dashboard">{t.dashboard}</Link>
    </nav>
    <div className="header-actions">
      <LanguageSwitcher locale={locale}/>
      <CurrencySwitcher currency={currency} locale={locale}/>
      <Link className="header-login" href="/login">{t.login}</Link>
      <Link className="header-shop" href="/create-shop">{t.createShop} <span aria-hidden="true">↗</span></Link>
    </div>
  </header>{children}</div></body></html>;
}
