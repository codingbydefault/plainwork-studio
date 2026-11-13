import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export type DiscoverBook = {
  key:string;slug:string;title:string;category:string;priceMinor:number;currency:string;
  shop:string;shopSlug:string;href:string;available:boolean;
};

const photos:Record<string,string>={
  "cleaning-quotes":"photo-1581578731548-c64695cc6952",
  "mobile-detailing":"photo-1492144534655-ae79c964c9d7",
  "installer-quotes":"photo-1504307651254-35680f356dfd",
  "event-rentals":"photo-1511795409834-ef04bbd61622",
  "airbnb-turnover":"photo-1611892440504-42a792e24d32",
  "custom-cakes":"photo-1578985545062-69928b1d9587",
  "dog-grooming":"photo-1517849845537-4d257902454a",
  "wedding-photography":"photo-1519741497674-611481863552",
  "food-truck":"photo-1565123409695-7b5ef63a2efb",
  "web-agency-care":"photo-1460925895917-afdab827c52f",
  "ai-workflow-7-days":"photo-1677442136019-21780ecad995",
  "client-follow-up-3-days":"photo-1552664730-d307ca884978",
  "business-dashboards-7-days":"photo-1551288049-bebda4e38f71",
  "customer-support-chatbot-5-days":"photo-1531746790731-6c087fecd65a",
  "short-form-video-10-days":"photo-1611162616475-46b635cb6868",
  "digital-product-7-days":"photo-1460925895917-afdab827c52f",
  "simple-crm-5-days":"photo-1556761175-b413da4baf72",
  "local-discovery-7-days":"photo-1521737711867-e3b97375f902",
  "online-course-10-days":"photo-1516321318423-f06f85e504b3",
  "small-business-security-weekend":"photo-1563013544-824ae1b704d3",
};

export function ExploreBookCard({book,locale}:{book:DiscoverBook;locale:Locale}){
  const nl=locale==="nl";
  const photo=photos[book.slug]??"photo-1499750310107-5fef28a66643";
  const price=new Intl.NumberFormat(nl?"nl-NL":"en-GB",{style:"currency",currency:book.currency.toUpperCase()}).format(book.priceMinor/100);
  return <article className="discover-book">
    <Link href={book.href} className="discover-book-cover" aria-label={nl?`Bekijk ${book.title}`:`View ${book.title}`}
      style={{backgroundImage:`linear-gradient(180deg, rgba(5,19,25,.22) 0%, rgba(5,19,25,.12) 32%, rgba(5,19,25,.92) 100%),url("https://images.unsplash.com/${photo}?auto=format&fit=crop&w=480&q=78")`}}>
      <span className="discover-book-top">
        <span className="discover-book-imprint">{book.shopSlug==="codedbydefault"?"CODEDBYDEFAULT":"PLAINWORK AI"}</span>
        <span className="discover-book-type">{nl?"CURSUS":"COURSE"}</span>
      </span>
      <span className="discover-book-cover-bottom">
        <span className="discover-book-cover-category">{book.category}</span>
        <span className="discover-book-cover-title">{book.title}</span>
      </span>
    </Link>
    <div className="discover-book-info">
      <span className="discover-book-seller">{book.shop}</span>
      <h2><Link href={book.href}>{book.title}</Link></h2>
      <div className="discover-book-footer"><strong>{price}</strong>
        <span className={book.available?"discover-book-status ready":"discover-book-status"}>
          {book.available?(nl?"Beschikbaar":"Available"):(nl?"Binnenkort":"Coming soon")}
        </span>
      </div>
    </div>
  </article>;
}
