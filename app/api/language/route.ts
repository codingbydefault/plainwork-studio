import { NextResponse } from "next/server";
import { z } from "zod";
export async function POST(request:Request) {
  const origin=request.headers.get("origin");
  if(!origin || new URL(origin).host!==new URL(request.url).host) return NextResponse.json({error:"Invalid origin"},{status:403});
  const parsed=z.object({locale:z.enum(["nl","en"])}).safeParse(await request.json().catch(()=>null));
  if(!parsed.success) return NextResponse.json({error:"Invalid locale"},{status:400});
  const response=NextResponse.json({locale:parsed.data.locale});
  response.cookies.set("plainwork_locale",parsed.data.locale,{path:"/",sameSite:"lax",maxAge:60*60*24*365,secure:process.env.NODE_ENV==="production"});
  return response;
}
