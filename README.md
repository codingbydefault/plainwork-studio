# Plainwork Studio creator marketplace

Plainwork Studio is a Next.js marketplace foundation for secure digital-product sales. External creators onboard through Stripe Connect, the server applies a 1% application fee to direct charges, and verified Stripe webhooks grant buyer entitlements.

## Included

- Stripe-hosted Connect onboarding for external creators
- Server-created direct-charge Checkout Sessions with an integer 1% application fee
- Signed webhook verification, deduplication, atomic order fulfillment, refund recording, and full-refund entitlement revocation
- Private Supabase Storage uploads and 60-second entitled download links
- Buyer library and creator order/revenue dashboard
- Row Level Security for marketplace, ownership, order, and entitlement data

## Local setup

1. Copy `.env.example` to `.env.local` and fill the values without committing it.
2. Apply `supabase/migrations/20261112120000_creator_marketplace.sql` to a non-production Supabase project first.
3. Configure a Stripe Connect webhook for `/api/webhooks/stripe` with `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`, and `account.updated`.
4. Run `npm install`, then `npm run dev`.

## Verification boundary

Repository tests verify fee math, types, builds, authorization logic, and migration structure. They cannot prove the live Stripe Connect controller model, webhook endpoint, account capabilities, or Supabase migration state. Verify those in test-mode dashboards before accepting real payments.

## Payment model

Each checkout contains one product from one creator. The direct charge is created on that creator's connected account and includes `application_fee_amount = round(total_minor / 100)`. Stripe processing costs, tax, disputes, and refunds are separate from the advertised 1% platform commission.
