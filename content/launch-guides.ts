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
  deliveryAssetFilename: string;
  assetPackageReceived: boolean;
};
export const launchGuides: LaunchGuide[] = [
  {
    "slug": "cleaning-quotes-micro-guide",
    "series": "cleaning-quotes",
    "kind": "lead_magnet",
    "title": "Quote a Recurring Cleaning Job in 20 Minutes",
    "description": "Check the six common gaps in a cleaning quotation before sending it.",
    "category": "Cleaning & services",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null,
    "deliveryAssetFilename": "01_cleaning-quotes_micro_guide.pdf",
    "assetPackageReceived": true
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
    "downloadFilename": null,
    "deliveryAssetFilename": "01_cleaning-quotes_paid_bundle.zip",
    "assetPackageReceived": true
  },
  {
    "slug": "mobile-detailing-micro-guide",
    "series": "mobile-detailing",
    "kind": "lead_magnet",
    "title": "Price Your Next Mobile Detailing Job in 15 Minutes",
    "description": "Use a quick checklist to find hidden mobile detailing costs.",
    "category": "Automotive",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null,
    "deliveryAssetFilename": "02_mobile-detailing_micro_guide.pdf",
    "assetPackageReceived": true
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
    "downloadFilename": null,
    "deliveryAssetFilename": "02_mobile-detailing_paid_bundle.zip",
    "assetPackageReceived": true
  },
  {
    "slug": "installer-quotes-micro-guide",
    "series": "installer-quotes",
    "kind": "lead_magnet",
    "title": "Stop Underquoting Installation Jobs in 20 Minutes",
    "description": "Review the scope and exclusions in your next installation quote.",
    "category": "Trades",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null,
    "deliveryAssetFilename": "03_installer-quotes_micro_guide.pdf",
    "assetPackageReceived": true
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
    "downloadFilename": null,
    "deliveryAssetFilename": "03_installer-quotes_paid_bundle.zip",
    "assetPackageReceived": true
  },
  {
    "slug": "event-rentals-micro-guide",
    "series": "event-rentals",
    "kind": "lead_magnet",
    "title": "Prevent Double Bookings in Your Rental Business Today",
    "description": "Prevent common booking and return handover mistakes.",
    "category": "Events",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null,
    "deliveryAssetFilename": "04_event-rentals_micro_guide.pdf",
    "assetPackageReceived": true
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
    "downloadFilename": null,
    "deliveryAssetFilename": "04_event-rentals_paid_bundle.zip",
    "assetPackageReceived": true
  },
  {
    "slug": "airbnb-turnovers-micro-guide",
    "series": "airbnb-turnovers",
    "kind": "lead_magnet",
    "title": "Build a Guest-Ready Cleaning Checklist in 15 Minutes",
    "description": "Spot missed tasks before the next guest checks in.",
    "category": "Hospitality",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null,
    "deliveryAssetFilename": "05_airbnb-turnovers_micro_guide.pdf",
    "assetPackageReceived": true
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
    "downloadFilename": null,
    "deliveryAssetFilename": "05_airbnb-turnovers_paid_bundle.zip",
    "assetPackageReceived": true
  },
  {
    "slug": "cake-pricing-micro-guide",
    "series": "cake-pricing",
    "kind": "lead_magnet",
    "title": "Price a Custom Cake Without Guesswork in 15 Minutes",
    "description": "List the costs that are easy to overlook in a custom cake quote.",
    "category": "Food businesses",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null,
    "deliveryAssetFilename": "06_cake-pricing_micro_guide.pdf",
    "assetPackageReceived": true
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
    "downloadFilename": null,
    "deliveryAssetFilename": "06_cake-pricing_paid_bundle.zip",
    "assetPackageReceived": true
  },
  {
    "slug": "dog-grooming-micro-guide",
    "series": "dog-grooming",
    "kind": "lead_magnet",
    "title": "Cost a Mobile Grooming Appointment in 15 Minutes",
    "description": "Assess route efficiency and appointment buffers.",
    "category": "Pet services",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null,
    "deliveryAssetFilename": "07_dog-grooming_micro_guide.pdf",
    "assetPackageReceived": true
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
    "downloadFilename": null,
    "deliveryAssetFilename": "07_dog-grooming_paid_bundle.zip",
    "assetPackageReceived": true
  },
  {
    "slug": "wedding-photo-micro-guide",
    "series": "wedding-photo",
    "kind": "lead_magnet",
    "title": "Price Your First Wedding Photo Package in 20 Minutes",
    "description": "Check what every wedding photography package should specify.",
    "category": "Photography",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null,
    "deliveryAssetFilename": "08_wedding-photo_micro_guide.pdf",
    "assetPackageReceived": true
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
    "downloadFilename": null,
    "deliveryAssetFilename": "08_wedding-photo_paid_bundle.zip",
    "assetPackageReceived": true
  },
  {
    "slug": "food-truck-micro-guide",
    "series": "food-truck",
    "kind": "lead_magnet",
    "title": "Find Your Food Truck Break-Even Point in 10 Minutes",
    "description": "Calculate the inputs needed for a basic daily break-even estimate.",
    "category": "Food businesses",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null,
    "deliveryAssetFilename": "09_food-truck_micro_guide.pdf",
    "assetPackageReceived": true
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
    "downloadFilename": null,
    "deliveryAssetFilename": "09_food-truck_paid_bundle.zip",
    "assetPackageReceived": true
  },
  {
    "slug": "web-maintenance-micro-guide",
    "series": "web-maintenance",
    "kind": "lead_magnet",
    "title": "Price a Website Care Plan in 20 Minutes",
    "description": "Clarify inclusions and exclusions before selling recurring website maintenance.",
    "category": "Web & software",
    "priceMinor": 0,
    "status": "asset_pending",
    "downloadFilename": null,
    "deliveryAssetFilename": "10_web-maintenance_micro_guide.pdf",
    "assetPackageReceived": true
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
    "downloadFilename": null,
    "deliveryAssetFilename": "10_web-maintenance_paid_bundle.zip",
    "assetPackageReceived": true
  }
];
