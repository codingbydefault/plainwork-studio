# Plainwork Studio creator marketplace

Plainwork Studio is a Next.js marketplace foundation for secure digital-product sales. External creators onboard through Stripe Connect, the server applies a 1% application fee to direct charges, and verified Stripe webhooks grant buyer entitlements.

## Included

- Stripe V2 Account creation and Stripe-hosted onboarding for external creators
- V2 thin-event handling for changing requirements and capabilities
- Connected-account Stripe Product creation and public creator storefronts
- Optional creator subscription Checkout and Billing Portal
- Server-created direct-charge Checkout Sessions with an integer 1% application fee
- Signed webhook verification, deduplication, atomic order fulfillment, refund recording, and full-refund entitlement revocation
- Private Supabase Storage uploads and 60-second entitled download links
- Buyer library and creator order/revenue dashboard
- Row Level Security for marketplace, ownership, order, and entitlement data

## Local setup

1. Copy `.env.example` to `.env.local` and fill the values without committing it.
2. Apply `supabase/migrations/20261112120000_creator_marketplace.sql` to a non-production Supabase project first.
3. Configure a Stripe Connect webhook for `/api/webhooks/stripe` with `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`, and `account.updated`.
4. Add a Thin event destination at `/api/webhooks/stripe-thin` for `v2.core.account[requirements].updated`, `v2.core.account[configuration.merchant].capability_status_updated`, and `v2.core.account[configuration.customer].capability_status_updated`.
5. Run `pnpm install`, then `pnpm dev`.

## Starter catalog

The ten MicroGuide PDFs under `public/free-guides` are intentionally public lead magnets. Each catalog pair has a permanent `catalog_key`, so its free PDF, Stripe product, category, and paid ZIP cannot be mismatched by a title edit. The creator dashboard checks the selected ZIP against the expected filename and uploads it to the private `product-files` bucket. The ten paid toolkit ZIPs are prepared locally under ignored `secure-product-files/`; never move them into `public/`.

## Verification boundary

Repository tests verify fee math, types, builds, authorization logic, and migration structure. They cannot prove the live Stripe Connect controller model, webhook endpoint, account capabilities, or Supabase migration state. Verify those in test-mode dashboards before accepting real payments.

## Payment model

Each checkout contains one product from one creator. The direct charge is created on that creator's connected account and includes `application_fee_amount = round(total_minor / 100)`. Stripe processing costs, tax, disputes, and refunds are separate from the advertised 1% platform commission.
