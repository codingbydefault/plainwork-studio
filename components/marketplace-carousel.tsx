"use client";
import {useRef} from "react";
import Link from "next/link";
import type {Locale} from "@/lib/i18n";
import type {MarketplaceBook} from "@/lib/marketplace-books";
import {displayPrice,type DisplayCurrency,type FxQuote} from "@/lib/currency";

const photoIds:Record<string,string>={
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
 "small-business-security-weekend":"photo-1563013544-824ae1b704d3"
};

export function MarketplaceCarousel({items,kind,locale,id,currency,fx}:{items:MarketplaceBook[];kind:"free"|"paid";locale:Locale;id:string;currency:DisplayCurrency;fx:FxQuote}){
 const rail=useRef<HTMLDivElement>(null);
 const nl=locale==="nl",free=kind==="free";
 function scroll(dir:number){
   const el=rail.current;if(!el)return;
   const card=el.querySelector<HTMLElement>(".book-card");
   el.scrollBy({left:dir*((card?.offsetWidth??210)+16)*3,behavior:"smooth"});
 }
 return <section id={id} className="guide-section marketplace-carousel" aria-label={nl?(free?"Gratis minicursussen":"Volledige betaalde cursussen"):(free?"Free microcourses":"Full paid courses")}>
   <div className="guide-heading">
     <div><p className="guide-eyebrow">{nl?(free?"GRATIS KENNISMAKEN":"VERDIEP JE KENNIS"):(free?"TRY IT FREE":"GO FURTHER")}</p>
       <h2>{nl?(free?`${items.length} gratis minicursussen`:`${items.length} uitgebreide cursussen`):(free?`${items.length} free microcourses`:`${items.length} complete courses`)}</h2>
       <p className="guide-subtitle">{nl?(free?"Een gratis introductie bij elk onderwerp.":"Praktische digitale boeken van CodedByDefault en Plainwork AI Studio."):(free?"A free introduction to every topic.":"Practical digital books from CodedByDefault and Plainwork AI Studio.")}</p>
     </div>
     <div className="guide-controls">
       <button type="button" aria-label={nl?"Vorige boeken":"Previous books"} onClick={()=>scroll(-1)}>‹</button>
       <button type="button" aria-label={nl?"Volgende boeken":"Next books"} onClick={()=>scroll(1)}>›</button>
     </div>
   </div>
   {items.length===0?<div className="explore-empty"><p>{nl?"Geen boeken gevonden voor deze zoekopdracht.":"No matching books for this search."}</p></div>:
   <div className="guide-rail marketplace-book-rail" ref={rail}>
     {items.map((book)=>{
       const photo=photoIds[book.slug]??"photo-1499750310107-5fef28a66643";
       const price=displayPrice(book.priceMinor,book.currency,currency,fx,locale);
       return <article className="book-card marketplace-book-card" key={book.key}>
         <Link href={book.href} className="book-cover-link" aria-label={nl?`Bekijk ${book.title}`:`View ${book.title}`}>
           <div className="photo-cover" style={{backgroundImage:`linear-gradient(180deg, rgba(10,25,40,.12),rgba(10,25,40,.23) 44%,rgba(10,25,40,.94)),url("https://images.unsplash.com/${photo}?auto=format&fit=crop&w=520&q=80")`}}>
             <span className="photo-cover-spine" aria-hidden="true"/>
             <div className="cover-top"><span className="cover-logo">{book.shopSlug==="codedbydefault"?"CODEDBYDEFAULT":"PLAINWORK AI"}</span><span className="cover-tag">{nl?(free?"GRATIS":"CURSUS"):(free?"FREE":"COURSE")}</span></div>
             <div className="cover-bottom"><span className="cover-edition">{book.category}</span><h3>{book.title}</h3><span className="cover-footer">{nl?"DIGITALE EDITIE":"DIGITAL EDITION"}</span></div>
           </div>
         </Link>
         <div className="book-meta">
           <p className="book-category">{book.shop}</p>
           <h3><Link className="book-title-link" href={book.href}>{book.title}</Link></h3>
           <div className="marketplace-book-bottom">
             <strong className="book-price">{free?(nl?"Gratis":"Free"):price.value}</strong>
             <span className={book.available?"marketplace-book-status available":"marketplace-book-status"}>
               {book.available?(nl?"Beschikbaar":"Available"):(nl?"Binnenkort":"Coming soon")}
             </span>
           </div>
           <Link className="book-details-link" href={book.href}>{nl?"Bekijk boek →":"View book →"}</Link>
         </div>
       </article>;
     })}
   </div>}
   <p className="guide-swipe">{nl?`Blader door alle ${items.length} boeken →`:`Browse all ${items.length} books →`}</p>
 </section>;
}
