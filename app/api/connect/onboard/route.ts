import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeClient } from "@/lib/stripe";
import { serverEnv } from "@/lib/env";
import { apiError } from "@/lib/http";

export async function POST(){try{const user=await requireUser();const db=createSupabaseAdmin();const {data:store}=await db.from("stores").select("id,stripe_accounts(account_id)").eq("owner_id",user.id).single();if(!store)throw new Error("Create a store first");let accountId=(store.stripe_accounts as unknown as {account_id:string}|null)?.account_id;const stripe=stripeClient();if(!accountId){const account=await stripe.accounts.create({controller:{fees:{payer:"account"},losses:{payments:"stripe"},stripe_dashboard:{type:"full"},requirement_collection:"stripe"},metadata:{store_id:store.id,owner_id:user.id}});accountId=account.id;await db.from("stripe_accounts").insert({store_id:store.id,account_id:accountId,onboarding_status:"pending"})}const base=serverEnv().NEXT_PUBLIC_APP_URL;const link=await stripe.accountLinks.create({account:accountId,refresh_url:`${base}/dashboard?connect=refresh`,return_url:`${base}/dashboard?connect=returned`,type:"account_onboarding"});return NextResponse.json({url:link.url})}catch(error){return apiError(error)}}
