import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeClient } from "@/lib/stripe";
import { apiError } from "@/lib/http";

const schema=z.object({orderId:z.string().uuid(),amountMinor:z.number().int().positive().optional()});
export async function POST(request:Request){try{const user=await requireUser();const input=schema.parse(await request.json());const db=createSupabaseAdmin();const {data}=await db.from("orders").select("id,total_minor,stripe_payment_intent_id,stripe_connected_account_id,stores!inner(owner_id)").eq("id",input.orderId).eq("stores.owner_id",user.id).eq("status","paid").single();if(!data||!data.stripe_payment_intent_id||!data.stripe_connected_account_id)throw new Error("Order cannot be refunded");const amount=input.amountMinor??data.total_minor;if(amount>data.total_minor)throw new Error("Refund exceeds order total");const refund=await stripeClient().refunds.create({payment_intent:data.stripe_payment_intent_id,amount,refund_application_fee:true,metadata:{order_id:data.id}},{stripeAccount:data.stripe_connected_account_id,idempotencyKey:`refund:${data.id}:${amount}`});return NextResponse.json({refundId:refund.id,status:refund.status})}catch(error){return apiError(error)}}
