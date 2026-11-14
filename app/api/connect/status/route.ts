import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeClient } from "@/lib/stripe";
import { apiError } from "@/lib/http";

export async function GET(){try{const user=await requireUser();const db=createSupabaseAdmin();const {data}=await db.from("stripe_accounts").select("account_id,stores!inner(owner_id)").eq("stores.owner_id",user.id).single();if(!data)throw new Error("No connected account");
  // Do not trust a cached database flag for onboarding. V2 is the source of truth.
  const account=await stripeClient().v2.core.accounts.retrieve(data.account_id,{include:["configuration.merchant","requirements"]});
  const cardStatus=account.configuration?.merchant?.capabilities?.card_payments?.status??"inactive";
  const requirementsStatus=account.requirements?.summary?.minimum_deadline?.status??null;
  const onboardingComplete=requirementsStatus!=="currently_due"&&requirementsStatus!=="past_due";
  const ready=cardStatus==="active"&&onboardingComplete;
  if(ready){const {data:mapping}=await db.from("stripe_accounts").update({charges_enabled:true,payouts_enabled:true,onboarding_status:"complete",updated_at:new Date().toISOString()}).eq("account_id",account.id).select("store_id").single();if(mapping)await db.from("stores").update({status:"active"}).eq("id",mapping.store_id)}
  return NextResponse.json({accountId:account.id,readyToProcessPayments:ready,cardPaymentsStatus:cardStatus,requirementsStatus,onboardingComplete});
}catch(error){return apiError(error)}}
