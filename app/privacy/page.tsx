import {getLocale} from "@/lib/i18n-server";
export default async function PrivacyPage(){
 const nl=(await getLocale())==="nl";
 return <main className="panel">
  <div className="eyebrow">{nl?"Privacyverklaring":"Privacy notice"}</div>
  <h1>{nl?"Hoe we je e-mailadres gebruiken":"How we use your email"}</h1>
  <p>{nl?"Als je een gratis minigids aanvraagt, slaat CodedByDefault je e-mailadres en de aangevraagde gids op om de download te bezorgen en misbruik te voorkomen.":"When you request a free MicroGuide, CodedByDefault stores your email address and the guide you requested so we can deliver it and prevent abuse."}</p>
  <p>{nl?"We sturen alleen marketingberichten als je daarvoor apart toestemming geeft. Afmelden kan via de link in onze marketingmails. We bewaren gegevens die nodig zijn voor levering en beveiliging; toestemming kun je intrekken en je kunt om verwijdering vragen.":"Marketing messages are sent only when you select the separate marketing checkbox. You can unsubscribe from any marketing email. Delivery records are used for operational and security purposes and you may withdraw marketing consent or request erasure."}</p>
  <p>{nl?"We gebruiken Supabase voor opslag van aanvragen en bestanden en kunnen een e-maildienst gebruiken voor gevraagde gidsen en toegestane marketing. We verkopen je e-mailadres niet.":"We use Supabase for lead records and files and may use an email provider to send requested guides and opted-in marketing. We do not sell your email address."}</p>
  <p>{nl?"Wil je inzage, correctie of verwijdering aanvragen, of toestemming intrekken? Neem dan contact op via de contactgegevens van CodedByDefault op de shop.":"To request access, correction, deletion or withdrawal of consent, contact CodedByDefault using the support details shown on the storefront."}</p>
  <p className="muted">{nl?"Versie: 12 november 2026":"Version: 12 November 2026"}</p>
 </main>;
}
