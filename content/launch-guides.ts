/**
 * CodedByDefault initial catalog: 10 free lead magnets + 10 paid guide listings.
 * These are editorial DRAFTS, not live Supabase products.
 * priceMinor is intentionally null for paid guides until approved prices are provided.
 * Assets must be checked and uploaded privately before any listing is published.
 */
export type LaunchGuide = {
  slug: string;
  series: string;
  kind: "lead_magnet" | "paid";
  title: string;
  description: string;
  category: string;
  priceMinor: number | null;
  status: "asset_pending";
  downloadFilename: string | null;
};
export const launchGuides: LaunchGuide[] = [
  {
    "slug": "cleaning-quotes-micro-guide",
    "series": "cleaning-quotes",
    "kind": "lead_magnet",
    "title": "The 10-Minute Cleaning Quote Audit",
    "description": "Check the six common gaps in a cleaning quotation before sending it.",
    "category": "Cleaning & services",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "cleaning-quotes-full-guide",
    "series": "cleaning-quotes",
    "kind": "paid",
    "title": "Build Your AI Cleaning Quotation System in Just 3 Days",
    "description": "Create a reusable cleaning quote workflow with intake questions, costing checks, and AI-assisted drafting.",
    "category": "Cleaning & services",
    "priceMinor": null,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "mobile-detailing-micro-guide",
    "series": "mobile-detailing",
    "kind": "lead_magnet",
    "title": "5 Mobile Detailing Pricing Mistakes to Avoid",
    "description": "Use a quick checklist to find hidden mobile detailing costs.",
    "category": "Automotive",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "mobile-detailing-full-guide",
    "series": "mobile-detailing",
    "kind": "paid",
    "title": "Price Your Mobile Detailing Services Like a Pro in 48 Hours",
    "description": "Set prices that account for labor, materials, travel, and target margin.",
    "category": "Automotive",
    "priceMinor": null,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "installer-quotes-micro-guide",
    "series": "installer-quotes",
    "kind": "lead_magnet",
    "title": "The Installer Quotation Checklist",
    "description": "Review the scope and exclusions in your next installation quote.",
    "category": "Trades",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "installer-quotes-full-guide",
    "series": "installer-quotes",
    "kind": "paid",
    "title": "Build Your AI Installation Quotation System in Just 3 Days",
    "description": "Standardize scope, materials, contingencies, and change requests for installation quotes.",
    "category": "Trades",
    "priceMinor": null,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "event-rentals-micro-guide",
    "series": "event-rentals",
    "kind": "lead_magnet",
    "title": "The Event Rental Handover Checklist",
    "description": "Prevent common booking and return handover mistakes.",
    "category": "Events",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "event-rentals-full-guide",
    "series": "event-rentals",
    "kind": "paid",
    "title": "Organize Your Event Rental Business in Just 7 Days",
    "description": "Organize rental inventory, booking dates, deposits, and item returns.",
    "category": "Events",
    "priceMinor": null,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "airbnb-turnovers-micro-guide",
    "series": "airbnb-turnovers",
    "kind": "lead_magnet",
    "title": "The 15-Minute Turnover Readiness Checklist",
    "description": "Spot missed tasks before the next guest checks in.",
    "category": "Hospitality",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "airbnb-turnovers-full-guide",
    "series": "airbnb-turnovers",
    "kind": "paid",
    "title": "Build Your Airbnb Cleaning & Turnover System in 48 Hours",
    "description": "Create a repeatable vacation rental turnover workflow for cleaners and hosts.",
    "category": "Hospitality",
    "priceMinor": null,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "cake-pricing-micro-guide",
    "series": "cake-pricing",
    "kind": "lead_magnet",
    "title": "The Custom Cake Costing Mini-Worksheet",
    "description": "List the costs that are easy to overlook in a custom cake quote.",
    "category": "Food businesses",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "cake-pricing-full-guide",
    "series": "cake-pricing",
    "kind": "paid",
    "title": "Learn to Price Your Custom Cakes Like a Pro in Just 24 Hours",
    "description": "Calculate ingredients, labor, overhead, and pricing margins for custom cake orders.",
    "category": "Food businesses",
    "priceMinor": null,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "dog-grooming-micro-guide",
    "series": "dog-grooming",
    "kind": "lead_magnet",
    "title": "The Mobile Groomer Route & Cost Checklist",
    "description": "Assess route efficiency and appointment buffers.",
    "category": "Pet services",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "dog-grooming-full-guide",
    "series": "dog-grooming",
    "kind": "paid",
    "title": "Build Your Mobile Dog Grooming Business System in 3 Days",
    "description": "Plan grooming bookings, travel time, consumables, and service profitability.",
    "category": "Pet services",
    "priceMinor": null,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "wedding-photo-micro-guide",
    "series": "wedding-photo",
    "kind": "lead_magnet",
    "title": "The Wedding Photography Package Checklist",
    "description": "Check what every wedding photography package should specify.",
    "category": "Photography",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "wedding-photo-full-guide",
    "series": "wedding-photo",
    "kind": "paid",
    "title": "Create Your Wedding Photography Pricing & Booking System in 7 Days",
    "description": "Build consistent packages, deposits, delivery terms, and booking workflows.",
    "category": "Photography",
    "priceMinor": null,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "food-truck-micro-guide",
    "series": "food-truck",
    "kind": "lead_magnet",
    "title": "The Food Truck Break-Even Quick Check",
    "description": "Calculate the inputs needed for a basic daily break-even estimate.",
    "category": "Food businesses",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "food-truck-full-guide",
    "series": "food-truck",
    "kind": "paid",
    "title": "Build Your Food Truck Pricing & Profit System in Just 3 Days",
    "description": "Model menu item margins, operating costs, and break-even sales.",
    "category": "Food businesses",
    "priceMinor": null,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "web-maintenance-micro-guide",
    "series": "web-maintenance",
    "kind": "lead_magnet",
    "title": "The Website Care Plan Scope Checklist",
    "description": "Clarify inclusions and exclusions before selling recurring website maintenance.",
    "category": "Web & software",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null
  },
  {
    "slug": "web-maintenance-full-guide",
    "series": "web-maintenance",
    "kind": "paid",
    "title": "Launch Your Website Maintenance Packages in Just 7 Days",
    "description": "Define tiers, recurring deliverables, support boundaries, and profitable website care packages.",
    "category": "Web & software",
    "priceMinor": null,
    "status": "asset_pending",
    "downloadFilename": null
  }
];
