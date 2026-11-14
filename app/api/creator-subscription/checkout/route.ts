import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { serverEnv } from "@/lib/env";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeClient } from "@/lib/stripe";
import { z } from "zod";

export async function POST(request:Request){try{const user=await requireUser();const {storeId}=z.object({storeId:z.string().uuid()}).parse(await request.json());const env=serverEnv();if(!env.STRIPE_CREATOR_SUBSCRIPTION_PRICE_ID)throw new Error("STRIPE_CREATOR_SUBSCRIPTION_PRICE_ID is not configured");const db=createSupabaseAdmin();const {data}=await db.from("stripe_accounts").select("account_id,stores!inner(owner_id)").eq("stores.owner_id",user.id).eq("store_id",storeId).single();if(!data)throw new Error("Connect Stripe before subscribing");
  // V2 Accounts can act as the platform-level Billing customer via customer_account.
  const session=await stripeClient().checkout.sessions.create({customer_account:data.account_id,mode:"subscription",line_items:[{price:env.STRIPE_CREATOR_SUBSCRIPTION_PRICE_ID,quantity:1}],success_url:`${env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success&session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=cancelled`});
  return NextResponse.json({url:session.url});}catch(error){return apiError(error)}}
