import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeClient } from "@/lib/stripe";
import { apiError } from "@/lib/http";

export async function POST(){try{const user=await requireUser();const db=createSupabaseAdmin();const {data}=await db.from("stripe_accounts").select("account_id,stores!inner(owner_id)").eq("stores.owner_id",user.id).single();if(!data)throw new Error("No connected account");const account=await stripeClient().accounts.retrieve(data.account_id);await db.from("stripe_accounts").update({charges_enabled:account.charges_enabled,payouts_enabled:account.payouts_enabled,details_submitted:account.details_submitted,onboarding_status:account.charges_enabled&&account.payouts_enabled?"complete":"restricted",updated_at:new Date().toISOString()}).eq("account_id",data.account_id);return NextResponse.json({chargesEnabled:account.charges_enabled,payoutsEnabled:account.payouts_enabled,detailsSubmitted:account.details_submitted})}catch(error){return apiError(error)}}
