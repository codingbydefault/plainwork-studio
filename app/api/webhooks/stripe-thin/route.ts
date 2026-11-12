import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { serverEnv } from "@/lib/env";
import { stripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

const supportedTypes = new Set([
  "v2.core.account[requirements].updated",
  "v2.core.account[configuration.merchant].capability_status_updated",
  "v2.core.account[configuration.customer].capability_status_updated",
]);

export async function POST(request: Request) {
  const secret = serverEnv().STRIPE_CONNECT_THIN_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "STRIPE_CONNECT_THIN_WEBHOOK_SECRET is not configured" }, { status: 503 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });

  const client = stripeClient();
  try {
    // parseEventNotification verifies the thin payload before any database mutation.
    const notification = client.parseEventNotification(await request.text(), signature, secret);
    if (!supportedTypes.has(notification.type)) return NextResponse.json({ received: true, ignored: true });

    // A thin notification contains identifiers, not a full snapshot. Fetch the full event,
    // then use the event-specific helper to retrieve the latest related Account.
    await client.v2.core.events.retrieve(notification.id);
    let account;
    if(notification.type==="v2.core.account[requirements].updated"||notification.type==="v2.core.account[configuration.merchant].capability_status_updated"||notification.type==="v2.core.account[configuration.customer].capability_status_updated") account=await notification.fetchRelatedObject();
    if (!account || account.object !== "v2.core.account") throw new Error("Thin event did not resolve to a V2 Account");

    const merchant = account.configuration?.merchant;
    const cardStatus = merchant?.capabilities?.card_payments?.status ?? "inactive";
    const requirementStatus = account.requirements?.summary?.minimum_deadline?.status ?? null;
    const complete = cardStatus === "active" && requirementStatus !== "currently_due" && requirementStatus !== "past_due";

    // This cached summary powers the dashboard only; the status endpoint still reads V2 directly.
    await createSupabaseAdmin().from("stripe_accounts").update({
      charges_enabled: cardStatus === "active",
      onboarding_status: complete ? "complete" : "restricted",
      updated_at: new Date().toISOString(),
    }).eq("account_id", account.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe thin webhook failed", error);
    return NextResponse.json({ error: "Invalid or unprocessable thin event" }, { status: 400 });
  }
}
