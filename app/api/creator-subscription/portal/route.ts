import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { serverEnv } from "@/lib/env";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeClient } from "@/lib/stripe";
import { z } from "zod";

export async function POST(request:Request){try{const user=await requireUser();const {storeId}=z.object({storeId:z.string().uuid()}).parse(await request.json());const db=createSupabaseAdmin();const {data}=await db.from("stripe_accounts").select("account_id,stores!inner(owner_id)").eq("stores.owner_id",user.id).eq("store_id",storeId).single();if(!data)throw new Error("No connected Stripe account");const session=await stripeClient().billingPortal.sessions.create({customer_account:data.account_id,return_url:`${serverEnv().NEXT_PUBLIC_APP_URL}/dashboard`});return NextResponse.json({url:session.url})}catch(error){return apiError(error)}}
