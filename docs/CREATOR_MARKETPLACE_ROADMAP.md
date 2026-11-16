# Plainwork Studio — Creator-First Marketplace Roadmap

Updated: 2026-11-13. Owner: CodedByDefault.

## Product promise

- For creators: Sell useful digital products with a **1% platform transaction fee**. The creator's 99% share is **before** payment-processing fees, taxes, refunds, disputes, and any other applicable costs. Avoid claiming guaranteed income.
- For buyers: Discover trustworthy practical digital products; get a genuine free sample, learn what a product contains, pay securely, and access downloads after confirmed payment.
- First focus: niche small-business toolkits (cleaning, automotive detailing, quotations, hospitality, food businesses, photography). Expand only after proof of retention.

## Delivery status

### Phase A — Core marketplace foundation (existing + design PR #7)

- Auth, private product-file storage, Stripe Connect onboarding, checkout/webhooks, entitlements, basic storefronts.
- Product catalogs: 10 free lead magnets and 10 paid toolkits; individual detail pages and matching upsell.
- Clear seller/buyer split, white/charcoal/teal brand, login and create-shop actions.
- **Risks:** Confirm Stripe webhook refund correctness, actual upload and entitlement/download behavior, email consent requirements and all migration deployments. Unpublished listings must stay private.

### Phase B — Creator Success & Discovery (this PR #8)

- Cross-creator `/explore`: public published listings from active shops only, search, sort and pagination.
- Product detail pages `/products/[id]` with creator attribution, conditional checkout and related products.
- Private `/dashboard/insights`: published-product counts, paid-order activity and 30-day currency-separated gross revenue metrics.
- Creator onboarding checklist and navigation to shop analytics.
- No new migration or data-policy bypass; works with existing tables and RLS.

### Phase C — Launch-critical workflows (next)

1. **Secure publishing**: authenticated creator can submit product for review; server verifies ownership, actual private Storage object, Stripe onboarding/payment capability, published price, description, and product contents before publication. Require moderation approval where appropriate; do not silently turn drafts public. Implement abuse reports and takedown.
2. **Shop activation**: documented transition draft → active after seller identity/payment readiness; multi-tenant isolation, clear status and remediation actions.
3. **Product management**: edit details, preview, upload/replace securely, archive, manage prices, verify delivery entitlement, seller refunds workflow.
4. **Auth UX**: email verification, password reset, sign out, route protection and redirect-after-login. End-to-end test on mobile and desktop.
5. **Trust and compliance**: platform terms, buyer refund/cancellation rules for digital content, copyright/DMCA notices, privacy/consent, invoicing/VAT handling for each jurisdiction, transaction audit logs, fraud and content moderation.

### Phase D — Organic growth

1. Curated categories and editorial collections (avoid fake ratings or sales metrics).
2. SEO pages: durable metadata, canonical URLs, structured product data from actual published products only, sitemap, social preview images.
3. Free-to-paid analytics and consent-based creator email funnel.
4. Verified reviews from paid customers only; report-abuse mechanism and seller quality rules.
5. Seller share links and referral attribution; agree who funds any affiliate commissions and how refunds affect attribution.

### Phase E — Creator tooling

1. Listing quality score and recommendations for discoverability.
2. Useful AI-assisted descriptions, translation and cover-generation with human approval; no bulk-spam uploads.
3. Optional subscription features only if the core 1% marketplace is economically viable; disclose incremental fees.
4. Creator retention tooling: first-sale education, checklist milestones, payout/reconciliation help.

## Growth metrics

- **North-star:** share of verified creators achieving their first paid sale within 30 days of joining.
- Supporting: active sellers, published quality listings, GMV by currency, take-rate, paid order count, buyer repeat purchases, free-guide downloads and free→paid conversion, seller retention, refund/chargeback rate.
- Track real events only; seller dashboard must not show fabricated traffic, ratings or orders.
- Avoid cross-currency GMV sums without a documented FX source and as-of rate.

## Release gates

- PR #7 design merged/tested first, then this PR reviewed against its base.
- TypeScript check, Next.js production build, tests, mobile/desktop keyboard navigation and core a11y review.
- RLS/security policies and Storage permissions audited in the correct Supabase organization.
- Stripe Connect test creator, buyer purchase, signed webhook, entitlement, refund and download verified with sandbox credentials.
- Unpublished product URLs blocked; no public private-file URLs.
- Staged preview QA before production promotion. Rollback plan documented.

## Known limits of the Phase B implementation

- Search is title-based and works on published listings; more sophisticated search and faceted filters can follow.
- Categories accept an exact text filter rather than a curated taxonomy.
- Analytics counts only paid orders in the last 30 days and caps the query at 1,000 recent orders; it is not a payout ledger or net revenue report.
- No user-generated reviews, referral program or AI listing creator yet.
- Store and product publication still require the Phase C safe workflow.
