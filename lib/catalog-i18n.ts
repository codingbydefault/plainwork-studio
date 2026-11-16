import type {CatalogPair} from "@/lib/catalog";
import type {Locale} from "@/lib/i18n";
type Translated={category:string;freeTitle:string;freeHook:string;paidTitle:string;paidBenefits:string};
const nl:Record<string,Translated>={
"cleaning-quotes":{category:"Schoonmaak en vastgoed",freeTitle:"Bereken een terugkerende schoonmaakopdracht in 20 minuten",freeHook:"Bepaal een maandprijs en maak een duidelijke takenlijst.",paidTitle:"Bouw je AI-offertesysteem voor schoonmaak in 3 dagen",paidBenefits:"Prijsberekening, bewerkbare offerte, intakeformulier en opvolgsjablonen."},
"mobile-detailing":{category:"Autoverzorging",freeTitle:"Bereken je volgende mobiele detailingopdracht in 15 minuten",freeHook:"Controleer of je prijs alle kosten en reistijd dekt.",paidTitle:"Bepaal professionele prijzen voor mobiele detailing in 48 uur",paidBenefits:"Pakketcalculator, reiskostenmodel, extra diensten en winstberekening."},
"installer-quotes":{category:"Installatie en techniek",freeTitle:"Voorkom te lage installatieoffertes in 20 minuten",freeHook:"Maak een duidelijk werkoverzicht met kosten en wijzigingen.",paidTitle:"Bouw je AI-offertesysteem voor installateurs in 3 dagen",paidBenefits:"Werkopname, kostencalculator, offertes en meerwerkregister."},
"event-rentals":{category:"Evenementen en verhuur",freeTitle:"Voorkom dubbele verhuurboekingen vanaf vandaag",freeHook:"Controleer beschikbaarheid, waarborgen en afleverafspraken.",paidTitle:"Organiseer je verhuurbedrijf in 7 dagen",paidBenefits:"Voorraadregister, waarborglogboek en aflever- en retourlijsten."},
"airbnb-turnover":{category:"Schoonmaak en vastgoed",freeTitle:"Maak een schoonmaakchecklist voor gasten in 15 minuten",freeHook:"Controleer alles vóór de aankomst van de volgende gast.",paidTitle:"Bouw een Airbnb-schoonmaaksysteem in 48 uur",paidBenefits:"Mobiele checklists, voorraad, meldingen en overdracht."},
"custom-cakes":{category:"Voeding en horeca",freeTitle:"Bereken een taartprijs zonder giswerk in 15 minuten",freeHook:"Bereken je kostprijs en controleer de marge per bestelling.",paidTitle:"Bereken de prijs van maatwerktaarten in 24 uur",paidBenefits:"Receptkostprijs, offerteblad, bestelkalender en betaalregister."},
"dog-grooming":{category:"Dierenverzorging",freeTitle:"Bereken een mobiele trimbeurt in 15 minuten",freeHook:"Zie welke routes en afspraken voldoende opleveren.",paidTitle:"Bouw je mobiele hondentrimsysteem in 3 dagen",paidBenefits:"Routeplanning, pakketten, herboekingen en klantfiches."},
"wedding-photography":{category:"Creatieve diensten",freeTitle:"Prijs je eerste trouwfotopakket in 20 minuten",freeHook:"Neem alle uren en kosten mee in je pakketprijs.",paidTitle:"Bouw je trouwfotografie-prijs- en boekingssysteem in 7 dagen",paidBenefits:"Pakketcalculator, aanvraagproces, voorstellen en boekingsoverzicht."},
"food-truck":{category:"Voeding en horeca",freeTitle:"Bereken het break-evenpunt van je foodtruck in 10 minuten",freeHook:"Ontdek hoeveel porties je nodig hebt om kosten te dekken.",paidTitle:"Bouw je foodtruck-prijs- en winstsysteem in 3 dagen",paidBenefits:"Menu-kostprijs, evenementenresultaat, voorraad en verkoopcijfers."},
"web-agency-care":{category:"Webdiensten",freeTitle:"Bepaal de prijs voor websiteonderhoud in 20 minuten",freeHook:"Maak een rendabel maandpakket met duidelijke grenzen.",paidTitle:"Start je websiteonderhoudspakketten in 7 dagen",paidBenefits:"Pakketprijzen, onboarding, terugkerende taken en klantoverzicht."}
};
export function localCatalog(item:CatalogPair,locale:Locale){
const translated=locale==="nl"?nl[item.key]:undefined;
return translated?{
 category:translated.category,
 free:{title:translated.freeTitle,hook:translated.freeHook},
 paid:{title:translated.paidTitle,benefits:translated.paidBenefits}
}:{category:item.category,free:{title:item.free.title,hook:item.free.hook},paid:{title:item.paid.title,benefits:item.paid.benefits}};
}
