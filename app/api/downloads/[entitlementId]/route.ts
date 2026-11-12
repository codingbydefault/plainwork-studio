import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { apiError } from "@/lib/http";

export async function GET(_:Request,{params}:{params:Promise<{entitlementId:string}>}){try{const user=await requireUser();const {entitlementId}=await params;const db=createSupabaseAdmin();const {data}=await db.from("entitlements").select("id,product_id,product_files:products(product_files(id,storage_path))").eq("id",entitlementId).eq("buyer_id",user.id).eq("status","active").single();if(!data)throw new Error("Entitlement not found");const files=((data.product_files as unknown as {product_files:Array<{id:string;storage_path:string}>})?.product_files??[]);if(!files.length)throw new Error("No file available");const {data:signed,error}=await db.storage.from("product-files").createSignedUrl(files[0].storage_path,60,{download:true});if(error)throw error;await db.from("download_events").insert({entitlement_id:data.id,buyer_id:user.id,product_file_id:files[0].id});return NextResponse.redirect(signed.signedUrl,303)}catch(error){return apiError(error)}}
