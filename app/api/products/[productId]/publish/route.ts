import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { apiError } from "@/lib/http";

export async function POST(_:Request,{params}:{params:Promise<{productId:string}>}){try{const user=await requireUser();const {productId}=await params;const db=createSupabaseAdmin();const {data:product}=await db.from("products").select("id,store_id,stripe_product_id,stripe_price_id,stores!inner(owner_id,status),product_files(id)").eq("id",productId).eq("stores.owner_id",user.id).single();if(!product)throw new Error("Product not found");const store=product.stores as unknown as {status:string};const files=product.product_files as unknown as Array<{id:string}>;if(store.status!=="active")throw new Error("Complete Stripe onboarding before publishing");if(!product.stripe_product_id||!product.stripe_price_id||!files.length)throw new Error("Add a price and secure file before publishing");const {error}=await db.from("products").update({status:"published"}).eq("id",product.id);if(error)throw error;return NextResponse.json({published:true})}catch(error){return apiError(error)}}
