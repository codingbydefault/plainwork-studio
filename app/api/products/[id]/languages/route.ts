import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  if(!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({languages:[]},{status:400});
  const db=createSupabaseAdmin();
  const {data:product}=await db.from("products").select("id,store_id,stores!inner(status)").eq("id",id).eq("status","published").eq("stores.status","active").maybeSingle();
  if(!product) return NextResponse.json({languages:[]},{status:404});
  const {data:files,error}=await db.from("product_files").select("storage_path,language").eq("product_id",id);
  if(error) return NextResponse.json({languages:[]},{status:503});
  const available=new Set<string>();
  for(const file of files??[]) {
    const lang=file.language;
    if(lang!=="nl"&&lang!=="en")continue;
    // Storage metadata validation prevents phantom editions if an upload was never completed.
    const {data:metadata,error:storageError}=await db.storage.from("product-files").info(file.storage_path);
    if(!storageError&&metadata)available.add(lang);
  }
  return NextResponse.json({languages:Array.from(available)},{headers:{"cache-control":"no-store"}});
}
