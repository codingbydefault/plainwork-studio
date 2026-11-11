# Plainwork Studio

A calm membership storefront for practical PDF guides.

## Current state

This repository contains a static HTML storefront prototype. It presents:

- Individual paid e-books at €14,99 (one-time)
- A choose-three paid-book bundle at €49,99 (not available until a third paid title is added)
- A proposed monthly all-access membership (price unset)
- Access to the free-guide library with paid options

It is not a live SaaS yet. Authentication, recurring payments, entitlements, protected downloads, and verified sales reporting are not connected.

## Run locally

Open `index.html` in a browser. The page is self-contained and needs no build step.

## Planned production pieces

- Supabase Auth for member accounts
- Supabase Postgres for products, orders, and access entitlements
- Private Supabase Storage for PDFs, with short-lived download links
- Stripe Checkout and webhooks for one-time and recurring payments
- Vercel for hosting

Do not commit `.env` files, Stripe secrets, or Supabase service-role keys. Keep paid PDFs out of a public repository or public storage bucket.
