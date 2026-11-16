import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { apiError } from "@/lib/http";

const schema=z.object({productId:z.string().uuid(),language:z.enum(["nl","en"]),filename:z.string().min(1).max(160).regex(/^[a-zA-Z0-9._ -]+$/),contentType:z.enum(["application/pdf","application/zip","application/x-zip-compressed"]),size:z.number().int().positive().max(100*1024*1024)});
export async function POST(request:Request){try{const user=await requireUser();const input=schema.parse(await request.json());const db=createSupabaseAdmin();const {data:product}=await db.from("products").select("id,store_id,stores!inner(owner_id)").eq("id",input.productId).eq("stores.owner_id",user.id).single();if(!product)throw new Error("Product not found");const safe=input.filename.replace(/\s+/g,"-");const path=`${product.store_id}/${product.id}/${crypto.randomUUID()}-${safe}`;const {data,error}=await db.storage.from("product-files").createSignedUploadUrl(path,{upsert:false});if(error)throw error;const {error:fileError}=await db.from("product_files").insert({product_id:product.id,storage_path:path,filename:input.filename,mime_type:input.contentType,size_bytes:input.size,language:input.language});if(fileError)throw fileError;return NextResponse.json({path,token:data.token,signedUrl:data.signedUrl})}catch(error){return apiError(error)}}
