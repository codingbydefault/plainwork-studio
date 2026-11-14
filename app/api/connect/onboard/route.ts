import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeClient } from "@/lib/stripe";
import { serverEnv } from "@/lib/env";
import { apiError } from "@/lib/http";
import { z } from "zod";

const bodySchema = z.object({ country: z.string().length(2).transform((value) => value.toLowerCase()), storeId: z.string().uuid() });

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { country, storeId } = bodySchema.parse(await request.json());
    if (!user.email) throw new Error("Your account needs an email address before Stripe onboarding");

    const db = createSupabaseAdmin();
    const { data: store } = await db.from("stores").select("id,name,stripe_accounts(account_id)").eq("owner_id", user.id).eq("id", storeId).single();
    if (!store) throw new Error("Create a store first");

    let accountId = (store.stripe_accounts as unknown as { account_id: string } | null)?.account_id;
    const stripe = stripeClient();

    if (!accountId) {
      // V2 Accounts replace the old top-level Standard/Express/Custom `type` model.
      // A full Stripe dashboard lets Stripe host the identity and requirements workflow.
      const account = await stripe.v2.core.accounts.create({
        display_name: store.name,
        contact_email: user.email,
        identity: { country },
        dashboard: "full",
        defaults: {
          responsibilities: {
            fees_collector: "stripe",
            losses_collector: "stripe",
          },
        },
        configuration: {
          customer: {},
          merchant: { capabilities: { card_payments: { requested: true } } },
        },
      });
      accountId = account.id;
      // Store only the ownership mapping. Live readiness is always read from Stripe V2.
      await db.from("stripe_accounts").insert({ store_id: store.id, account_id: accountId, onboarding_status: "pending" });
    }

    const base = serverEnv().NEXT_PUBLIC_APP_URL;
    // Account Links are single-use. The refresh URL returns here to generate a fresh link.
    const link = await stripe.v2.core.accountLinks.create({
      account: accountId,
      use_case: {
        type: "account_onboarding",
        account_onboarding: {
          collection_options: { fields: "eventually_due", future_requirements: "include" },
          refresh_url: `${base}/dashboard?connect=refresh`,
          return_url: `${base}/dashboard?connect=returned`,
        },
      },
    });
    return NextResponse.json({ url: link.url });
  } catch (error) { return apiError(error); }
}
