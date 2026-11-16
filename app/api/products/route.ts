import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeClient } from "@/lib/stripe";
import { catalogByKey } from "@/lib/catalog";

const schema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(2).max(120), description: z.string().max(1000),
  priceMinor: z.number().int().min(50), currency: z.enum(["eur", "usd", "gbp"]),
  catalogKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser(); const input = schema.parse(await request.json()); const db = createSupabaseAdmin();
    const catalogItem = input.catalogKey ? catalogByKey.get(input.catalogKey) : undefined;
    if (input.catalogKey && !catalogItem) throw new Error("Unknown starter catalog product");
    const productInput = catalogItem ? {
      name: catalogItem.paid.title,
      description: catalogItem.paid.benefits,
      priceMinor: catalogItem.paid.priceMinor,
      currency: "eur" as const,
    } : input;
    const { data: store } = await db.from("stores").select("id,stripe_accounts(account_id)").eq("owner_id", user.id).eq("id", input.storeId).single();
    const accountId = (store?.stripe_accounts as unknown as { account_id: string } | null)?.account_id;
    if (!store || !accountId) throw new Error("Complete Stripe Connect setup first");

    // The request option becomes the Stripe-Account header, so the Product and Price
    // belong to the creator rather than the platform account.
    const product = await stripeClient().products.create({
      name: productInput.name, description: productInput.description,
      default_price_data: { unit_amount: productInput.priceMinor, currency: productInput.currency },
    }, { stripeAccount: accountId });
    const priceId = typeof product.default_price === "string" ? product.default_price : product.default_price?.id;

    const slug = `${productInput.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${product.id.slice(-6).toLowerCase()}`;
    const { data, error } = await db.from("products").insert({
      store_id: store.id, catalog_key: input.catalogKey ?? null, category: catalogItem?.category ?? null,
      title: productInput.name, slug, description: productInput.description,
      price_minor: productInput.priceMinor, currency: productInput.currency, status: "draft",
      stripe_product_id: product.id, stripe_price_id: priceId,
    }).select("id,title,status").single();
    if (error) throw error;
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) { return apiError(error); }
}
