import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createSupabaseServer } from "@/lib/supabase/server";
import { apiError } from "@/lib/http";

const schema=z.object({name:z.string().trim().min(2).max(80),slug:z.string().trim().toLowerCase().min(3).max(48).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)});
export async function POST(request:Request){try{const user=await requireUser();const input=schema.parse(await request.json());const db=await createSupabaseServer();const {data:existing}=await db.from("stores").select("id").eq("owner_id",user.id).maybeSingle();if(existing)return NextResponse.json({error:"You already have a shop"},{status:409});const {data,error}=await db.from("stores").insert({owner_id:user.id,name:input.name,slug:input.slug,status:"draft"}).select("id,name,slug,status").single();if(error){if(error.code==="23505")return NextResponse.json({error:"That shop address is already taken"},{status:409});throw error}return NextResponse.json({store:data},{status:201})}catch(error){return apiError(error)}}
