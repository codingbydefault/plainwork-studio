import type {Locale} from "@/lib/i18n";
const titles:Record<string,{title:string;description:string}>={
"ai-workflow-7-days":{title:"Bouw je eerste AI-automatisering in 7 dagen",description:"Van repetitieve taak naar een veilige, controleerbare workflow."},
"client-follow-up-3-days":{title:"Maak een klantopvolgsysteem in 3 dagen",description:"Maak een overzicht van contacten, volgende acties, opvolgteksten en reminders."},
"business-dashboards-7-days":{title:"Bouw betrouwbare bedrijfsdashboards in 7 dagen",description:"Van losse cijfers naar beslissingen met controleerbare data."},
"customer-support-chatbot-5-days":{title:"Bouw een klantenservicechatbot in 5 dagen",description:"Handige FAQ-antwoorden met een duidelijke menselijke uitweg."},
"short-form-video-10-days":{title:"Maak 30 korte video’s in 10 dagen",description:"Een haalbaar systeem voor verticale video met je smartphone."},
"digital-product-7-days":{title:"Lanceer je eerste digitale product in 7 dagen",description:"Van één herkenbaar probleem naar een eerlijke, bruikbare download."},
"simple-crm-5-days":{title:"Bouw een eenvoudig klanten-CRM in 5 dagen",description:"Beheer contacten, offertes en afspraken in één overzicht."},
"local-discovery-7-days":{title:"Word lokaal beter gevonden in 7 dagen",description:"Echte lokale zichtbaarheid zonder nepbeoordelingen."},
"online-course-10-days":{title:"Maak je eerste online cursus in 10 dagen",description:"Leer één praktische vaardigheid met korte, toetsbare lessen."},
"small-business-security-weekend":{title:"Beveilig je bedrijfswebsite in één weekend",description:"Een haalbare basis voor toegang, updates, back-ups en herstel."}
};
export function translatedProduct(slug:string|undefined,title:string,description:string|null,locale:Locale){
 const translation=locale==="nl"&&slug?titles[slug]:undefined;
 return {title:translation?.title??title,description:translation?.description??description};
}

export function findDutchCourseSlugs(search:string):string[]{const term=search.trim().toLocaleLowerCase('nl-NL');if(!term)return [];return Object.entries(titles).filter(([,entry])=>(entry.title+' '+entry.description).toLocaleLowerCase('nl-NL').includes(term)).map(([slug])=>slug);}
