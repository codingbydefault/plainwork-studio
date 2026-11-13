import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { apiError } from "@/lib/http";

export async function GET(_:Request,{params}:{params:Promise<{entitlementId:string}>}) {
  try {
    const user=await requireUser();
    const {entitlementId}=await params;
    const db=createSupabaseAdmin();
    const {data,error}=await db.from("entitlements")
      .select("id,order_item:order_items(selected_language),product_files:products(product_files(id,storage_path,language))")
      .eq("id",entitlementId).eq("buyer_id",user.id).eq("status","active").single();
    if(error||!data)throw new Error("Entitlement not found");
    const orderItem=data.order_item as unknown as {selected_language:string}|null;
    const selected=orderItem?.selected_language;
    if(selected!=="nl"&&selected!=="en")throw new Error("Invalid purchased language");
    const product=data.product_files as unknown as {product_files:Array<{id:string;storage_path:string;language:string}>}|null;
    const files=(product?.product_files??[]).filter(file=>file.language===selected);
    if(files.length===0)throw new Error("Purchased course edition is unavailable");
    for(const file of files) {
      const {data:metadata,error:infoError}=await db.storage.from("product-files").info(file.storage_path);
      if(infoError||!metadata)continue;
      const {data:signed,error:signedError}=await db.storage.from("product-files")
        .createSignedUrl(file.storage_path,60,{download:true});
      if(signedError||!signed)continue;
      await db.from("download_events").insert({entitlement_id:data.id,buyer_id:user.id,product_file_id:file.id});
      return NextResponse.redirect(signed.signedUrl,303);
    }
    throw new Error("No uploaded file exists for the purchased language");
  } catch(error){return apiError(error);}
}
