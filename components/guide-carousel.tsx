"use client";
import { useRef } from "react";
import Link from "next/link";
import { LeadMagnetForm } from "@/components/lead-magnet-form";
import { CheckoutButton } from "@/components/checkout-button";
import type { CatalogPair } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import {localCatalog} from "@/lib/catalog-i18n";

const photos: Record<string, string> = {
  "cleaning-quotes": "photo-1581578731548-c64695cc6952",
  "mobile-detailing": "photo-1492144534655-ae79c964c9d7",
  "installer-quotes": "photo-1504307651254-35680f356dfd",
  "event-rentals": "photo-1511795409834-ef04bbd61622",
  "airbnb-turnover": "photo-1611892440504-42a792e24d32",
  "custom-cakes": "photo-1578985545062-69928b1d9587",
  "dog-grooming": "photo-1517849845537-4d257902454a",
  "wedding-photography": "photo-1519741497674-611481863552",
  "food-truck": "photo-1565123409695-7b5ef63a2efb",
  "web-agency-care": "photo-1460925895917-afdab827c52f"
};
type Props = { items: CatalogPair[]; kind: "free" | "paid"; published: Record<string, string>; locale?:Locale };

export function GuideCarousel({ items, kind, published, locale="nl" }: Props) {
  const rail = useRef<HTMLDivElement>(null);
  const free = kind === "free";
  function scroll(direction: number) {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".book-card");
    el.scrollBy({ left: direction * ((card?.offsetWidth ?? 270) + 20) * 2, behavior: "smooth" });
  }
  return <section id={free ? "free-guides" : "premium-guides"} className="guide-section" aria-label={locale==="nl"?(free?"Gratis gidsen":"Betaalde cursussen"):(free?"Free business guides":"Premium business guides")}>
    <div className="guide-heading">
      <div><p className="guide-eyebrow">{locale==="nl"?(free?"BEGIN GRATIS":"VERDIEP JE KENNIS"):(free?"START HERE — IT'S FREE":"GO FURTHER")}</p>
        <h2>{locale==="nl"?(free?"Begin met een gratis minicursus.":"Zet je kennis om in resultaat."):(free?"Your next idea starts here.":"Build something bigger.")}</h2>
        <p className="guide-subtitle">{locale==="nl"?(free?"Praktische minigidsen waarmee je vandaag begint.":"Uitgebreide cursussen met werkboeken en heldere stappen."):(free?"Practical mini-guides you can put to work today.":"Complete toolkits with workbooks, templates and clear next steps.")}</p>
      </div>
      <div className="guide-controls">
        <button type="button" aria-label={locale==="nl"?"Vorige boeken":(free?"Previous free books":"Previous paid books")} onClick={()=>scroll(-1)}>‹</button>
        <button type="button" aria-label={locale==="nl"?"Volgende boeken":(free?"Next free books":"Next paid books")} onClick={()=>scroll(1)}>›</button>
      </div>
    </div>
    <div className="guide-rail" ref={rail}>
      {items.map((item, index) => {
        const localized=localCatalog(item,locale);
        const guide=free?localized.free:localized.paid;
        const productId = published[item.key];
        const photo = photos[item.key];
        const url = `/guides/${item.key}/${kind}`;
        return <article className="book-card" key={item.key}>
          <Link href={url} className="book-cover-link" aria-label={`Details about ${guide.title}`}><div className="photo-cover" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,25,40,.06) 0%,rgba(10,25,40,.25) 45%,rgba(10,25,40,.92) 100%),url("https://images.unsplash.com/${photo}?auto=format&fit=crop&w=620&q=80")` }}>
            <span className="photo-cover-spine" aria-hidden="true"></span>
            <div className="cover-top"><span className="cover-logo">PLAINWORK <strong>STUDIO</strong></span><span className="cover-tag">{locale==="nl"?(free?"GRATIS GIDS":"UITGEBREIDE CURSUS"):(free?"FREE GUIDE":"FULL TOOLKIT")}</span></div>
            <div className="cover-bottom"><span className="cover-edition">VOL. {String(index+1).padStart(2,"0")} · {localized.category}</span><h3>{guide.title}</h3><span className="cover-footer">{locale==="nl"?(free?"EEN NUTTIGE EERSTE STAP":"PRAKTISCHE KENNIS. ECHTE VOORUITGANG."):(free?"A QUICK WIN FOR YOUR BUSINESS":"REAL TOOLS. REAL PROGRESS.")}</span></div>
          </div></Link>
          <div className="book-meta"><p className="book-category">{localized.category}</p><h3><Link className="book-title-link" href={url}>{guide.title}</Link></h3><p className="book-summary">{free ? localized.free.hook : localized.paid.benefits}</p>
            <Link href={url} className="book-details-link">{locale==="nl"?"Bekijk de inhoud →":"See what’s inside →"}</Link>
            {free ? <LeadMagnetForm guideKey={item.key}/> : <>
              <p className="book-price">€{(item.paid.priceMinor/100).toFixed(2)}</p>
              {productId ? <CheckoutButton productId={productId} locale={locale}/> : <p className="book-unavailable">{locale==="nl"?"Binnenkort beschikbaar · betaling nog niet actief":"Coming soon · secure checkout pending"}</p>}
            </>}
          </div>
        </article>;
      })}
    </div>
    <p className="guide-swipe">{locale==="nl"?"Blader door alle":"Scroll to explore all"} {items.length} {locale==="nl"?"boeken":"books"} <span aria-hidden="true">→</span></p>
  </section>;
}
