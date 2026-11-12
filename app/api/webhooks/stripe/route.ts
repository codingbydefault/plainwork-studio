import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeClient } from "@/lib/stripe";
import { serverEnv } from "@/lib/env";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Database = ReturnType<typeof createSupabaseAdmin>;

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = stripeClient().webhooks.constructEvent(
      payload,
      signature,
      serverEnv().STRIPE_CONNECT_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = createSupabaseAdmin();
  const { data: claimed, error: claimError } = await db.rpc("claim_webhook_event", {
    p_provider: "stripe",
    p_event_id: event.id,
    p_event_type: event.type,
    p_connected_account_id: event.account ?? null,
  });
  if (claimError) {
    console.error("Webhook claim failed", { eventId: event.id, error: claimError });
    return NextResponse.json({ error: "Webhook claim failed" }, { status: 500 });
  }
  if (!claimed) return NextResponse.json({ received: true, duplicate: true });

  try {
    await handleEvent(event, db);
    const { error } = await db.from("webhook_events")
      .update({ status: "processed", error_message: null, processed_at: new Date().toISOString() })
      .eq("provider", "stripe")
      .eq("event_id", event.id)
      .eq("status", "processing");
    if (error) throw error;
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed", { eventId: event.id, type: event.type, error });
    const { error: markError } = await db.from("webhook_events")
      .update({ status: "failed", error_message: error instanceof Error ? error.message.slice(0, 1000) : "Unknown error" })
      .eq("provider", "stripe")
      .eq("event_id", event.id)
      .eq("status", "processing");
    if (markError) console.error("Could not mark webhook for retry", { eventId: event.id, error: markError });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function handleEvent(event: Stripe.Event, db: Database) {
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode === "subscription" || session.payment_status !== "paid") return;
    const orderId = session.metadata?.order_id;
    if (!orderId || !event.account || typeof session.payment_intent !== "string" ||
      session.amount_total == null || !session.currency) {
      throw new Error("Incomplete connected-account Checkout session");
    }
    const { error } = await db.rpc("fulfill_paid_order", {
      p_order_id: orderId,
      p_checkout_session_id: session.id,
      p_payment_intent_id: session.payment_intent,
      p_connected_account_id: event.account,
      p_amount_minor: session.amount_total,
      p_currency: session.currency,
    });
    if (error) throw error;
  } else if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    if (!event.account || typeof charge.payment_intent !== "string") {
      throw new Error("Incomplete connected-account refund event");
    }
    const { error } = await db.rpc("record_refund", {
      p_charge_id: charge.id,
      p_payment_intent_id: charge.payment_intent,
      p_amount_refunded_minor: charge.amount_refunded,
      p_status: charge.refunded ? "succeeded" : "partial",
      p_connected_account_id: event.account,
    });
    if (error) throw error;
  } else if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    const { error } = await db.from("stripe_accounts")
      .update({
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        onboarding_status: account.charges_enabled && account.payouts_enabled ? "complete" : "restricted",
        updated_at: new Date().toISOString(),
      })
      .eq("account_id", account.id);
    if (error) throw error;
  } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const accountId = subscription.customer_account;
    if (!accountId) return;
    const { data: mapping } = await db.from("stripe_accounts").select("store_id").eq("account_id", accountId).single();
    if (!mapping) return;
    const item = subscription.items.data[0];
    const { error } = await db.from("creator_subscriptions").upsert({
      store_id: mapping.store_id,
      stripe_subscription_id: subscription.id,
      stripe_price_id: item?.price.id ?? null,
      status: subscription.status,
      quantity: item?.quantity ?? 1,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "store_id" });
    if (error) throw error;
  }
}
