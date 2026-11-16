import {catalog} from "@/lib/catalog";
import {localCatalog} from "@/lib/catalog-i18n";
import {translatedProduct} from "@/lib/ai-courses-i18n";
import type {Locale} from "@/lib/i18n";

type Preview = {key:string;title:string;description:string;category:string;priceMinor:number;shop:"CodedByDefault"|"Plainwork AI Studio";shopSlug:string;slug:string;href:string};
const ai = [
  ["ai-workflow-7-days","Build Your First AI Automation in 7 Days","Create a safe, tested business automation.","AI & Automatisering",2900],
  ["client-follow-up-3-days","Create a Client Follow-Up System in 3 Days","Create an organised client follow-up workflow.","Klanten en verkoop",2400],
  ["business-dashboards-7-days","Master Business Dashboards in 7 Days","Turn accurate data into useful business insights.","Analyse en rapportage",2900],
  ["customer-support-chatbot-5-days","Build a Customer Support Chatbot in 5 Days","Develop a helpful FAQ chatbot with human escalation.","AI & Klantenservice",3900],
  ["short-form-video-10-days","Create 30 Short-Form Videos in 10 Days","Plan and shoot engaging short videos.","Contentmarketing",2900],
  ["digital-product-7-days","Launch Your First Digital Product in 7 Days","Create and validate a digital product.","Digitale producten",3900],
  ["simple-crm-5-days","Build a Simple Client CRM in 5 Days","Organise client data and deal stages.","Klanten en verkoop",2900],
  ["local-discovery-7-days","Get Your Local Business Found Online in 7 Days","Improve trustworthy local search visibility.","Lokale marketing",2400],
  ["online-course-10-days","Create Your First Online Course in 10 Days","Design an effective self-study course.","Online opleidingen",3900],
  ["small-business-security-weekend","Secure Your Small-Business Website in 1 Weekend","Set up a practical website security baseline.","Websitebeheer",2900],
] as const;

export function curatedLaunchProducts(locale:Locale):Preview[]{
 const coded=catalog.map(item=>{
   const t=localCatalog(item,locale);
   return {key:"coded:"+item.key,title:t.paid.title,description:t.paid.benefits,category:t.category,priceMinor:item.paid.priceMinor,
     shop:"CodedByDefault" as const,shopSlug:"codedbydefault",slug:item.key,href:`/guides/${item.key}/paid`};
 });
 const studio=ai.map(([slug,title,description,category,priceMinor])=>{
   const translated=translatedProduct(slug,title,description,locale);
   return {key:"ai:"+slug,title:translated.title,description:translated.description??description,category,
      priceMinor,shop:"Plainwork AI Studio" as const,shopSlug:"plainwork-ai-studio",slug,href:`/courses/${slug}`};
 });
 return [...coded,...studio];
}
export function findCuratedCourse(slug:string,locale:Locale){
 return curatedLaunchProducts(locale).find(product=>product.shopSlug==="plainwork-ai-studio"&&product.slug===slug);
}
