import "./globals.css";
import "./lead.css";
import Link from "next/link";
import { getLocale, getCopy } from "@/lib/i18n-server";
import { LanguageSwitcher } from "@/components/language-switcher";
import {CurrencySwitcher} from "@/components/currency-switcher";
import {getDisplayCurrency} from "@/lib/currency-server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";

export const metadata = { title: "Plainwork Studio", description: "Verkoop en ontdek digitale cursussen en producten. Makers behouden 99% van de verkoopprijs vóór bijkomende kosten. | Buy and sell practical digital products." };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale,t,currency,supabase]=await Promise.all([getLocale(),getCopy(),getDisplayCurrency(),createSupabaseServer()]);
  const {data:{user}}=await supabase.auth.getUser();
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
      {user ? <>
        <Link className="header-login" href="/dashboard">{t.dashboard}</Link>
        <SignOutButton/>
      </> : <Link className="header-login" href="/login">{t.login}</Link>}
      <Link className="header-shop" href="/create-shop">{t.createShop} <span aria-hidden="true">↗</span></Link>
    </div>
  </header>{children}<footer className="legal-footer">
    <div><Link className="brand" href="/">Plainwork Studio</Link><p>{locale==="nl"?"Een marktplaats van CodedByDefault voor praktische digitale producten.":"A CodedByDefault marketplace for practical digital products."}</p></div>
    <div><strong>CodedByDefault</strong><span>IT · AI · Software · Web design</span><span>KvK 42171617</span><span>BTW NL005557496B77</span></div>
    <div><strong>{locale==="nl"?"Juridisch":"Legal"}</strong><Link href="/privacy">{locale==="nl"?"Privacyverklaring":"Privacy notice"}</Link><a href="https://www.codedbydefault.com/" target="_blank" rel="noreferrer">codedbydefault.com ↗</a><span>© 2026 CodedByDefault</span></div>
  </footer></div></body></html>;
}
