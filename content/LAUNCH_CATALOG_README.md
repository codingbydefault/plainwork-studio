# CodedByDefault launch catalog (20 draft listings)

This collection defines the ten outcome-based paid product titles from the previous digital-product challenge and ten companion micro-guide lead magnets.

- **Catalog source:** `content/launch-guides.ts`
- **Review preview:** `/launch-catalog`
- **Status:** content/asset pending, *not live products*.
- **Paid prices:** intentionally unset; no price was confirmed.
- **Download assets:** not available in this repository. Do not mark any listing published or take payment until the matching PDF/ZIP is reviewed and stored privately.

## Why these drafts are not written into `public.products`

The current Supabase schema requires `price_minor > 0`, the checkout is only designed for paid digital goods, and a product requires a real `store_id` belonging to a registered creator. Publishing a free lead magnet as a paid 1-cent product would misrepresent the offer.

## Publishing checklist

1. Confirm the CodedByDefault creator store exists in the Kabayans Supabase project.
2. Obtain the original 10 complete paid PDFs/ZIPs and their 10 free micro-guides (or commission and approve their final copy).
3. Assign approved retail prices to the ten paid guides.
4. Implement a zero-cost `free_claim` or optional email-consent flow **separately** from Stripe paid checkout. Lead capture and marketing emails require appropriate disclosures and consent.
5. Upload PDFs to the `product-files` private bucket; verify MIME, actual file bytes, malware checks, file metadata and entitlement permissions.
6. Create product rows under the intended store with `draft` status, verify the displayed text and delivery, then publish after testing.
7. Preserve the 1% commission logic for paid purchases only. Do not trigger Stripe Checkout for free claims.

## Matches

Each `series` value links one micro-guide to its full paid guide. The titles are editable product copy and do not promise guaranteed business outcomes.
