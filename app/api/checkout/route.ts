import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { applicationFee, stripeClient } from "@/lib/stripe";
import { serverEnv } from "@/lib/env";
import { apiError } from "@/lib/http";

const bodySchema = z.object({ productId: z.string().uuid(), language:z.enum(["nl","en"]) });

export async function POST(request: Request) {
  try {
    const user = await requireUser(); const { productId, language } = bodySchema.parse(await request.json()); const db = createSupabaseAdmin();
    const { data: product, error } = await db.from("products").select("id,title,price_minor,currency,store_id,status,stores!inner(stripe_accounts!inner(account_id,charges_enabled,payouts_enabled))").eq("id",productId).single();
    if(error||!product||product.status!=="published") throw new Error("Product unavailable");
    // Never charge for an edition that has not actually been uploaded.
    const {data:editions,error:editionsError}=await db.from("product_files").select("id,storage_path")
      .eq("product_id",productId).eq("language",language);
    if(editionsError||!editions?.length) throw new Error("This course language is not available yet");
    let verified=false;
    for(const edition of editions) {
      const {data:metadata,error:storageError}=await db.storage.from("product-files").info(edition.storage_path);
      if(!storageError&&metadata){verified=true;break;}
    }
    if(!verified)throw new Error("Selected course file has not been uploaded");
    const account = (product.stores as unknown as {stripe_accounts:{account_id:string;charges_enabled:boolean;payouts_enabled:boolean}}).stripe_accounts;
    // Read V2 directly before every checkout. Requirements can change after onboarding.
    const connectedAccount = await stripeClient().v2.core.accounts.retrieve(account.account_id, { include: ["configuration.merchant", "requirements"] });
    const cardStatus = connectedAccount.configuration?.merchant?.capabilities?.card_payments?.status;
    const requirementStatus = connectedAccount.requirements?.summary?.minimum_deadline?.status;
    if (cardStatus !== "active" || requirementStatus === "currently_due" || requirementStatus === "past_due") throw new Error("Creator is not ready to accept payments");
    const { data: order, error: orderError } = await db.from("orders").insert({buyer_id:user.id,store_id:product.store_id,status:"pending",currency:product.currency,total_minor:product.price_minor,platform_fee_minor:applicationFee(product.price_minor)}).select("id").single();
    if(orderError||!order) throw orderError;
    const { error: itemError } = await db.from("order_items").insert({order_id:order.id,product_id:product.id,unit_price_minor:product.price_minor,quantity:1,product_snapshot:{title:product.title,selected_language:language},selected_language:language}); if(itemError) throw itemError;
    const stripe = stripeClient(); const env=serverEnv();
    const session = await stripe.checkout.sessions.create({mode:"payment",customer_email:user.email,line_items:[{quantity:1,price_data:{currency:product.currency,unit_amount:product.price_minor,product_data:{name:product.title+" ("+language.toUpperCase()+")"}}}],payment_intent_data:{application_fee_amount:applicationFee(product.price_minor),metadata:{order_id:order.id}},metadata:{order_id:order.id,buyer_id:user.id},success_url:`${env.NEXT_PUBLIC_APP_URL}/library?checkout=success`,cancel_url:`${env.NEXT_PUBLIC_APP_URL}/?checkout=cancelled`},{stripeAccount:account.account_id,idempotencyKey:`checkout:${order.id}`});
    await db.from("orders").update({stripe_checkout_session_id:session.id}).eq("id",order.id);
    return NextResponse.json({url:session.url});
  } catch(error){return apiError(error)}
}
