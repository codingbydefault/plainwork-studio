import {NextResponse} from "next/server";
import {z} from "zod";
export async function POST(request:Request){
 const origin=request.headers.get("origin");
 if(!origin||new URL(origin).host!==new URL(request.url).host)return NextResponse.json({error:"Invalid origin"},{status:403});
 const parsed=z.object({currency:z.enum(["EUR","GBP"])}).safeParse(await request.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({error:"Invalid currency"},{status:400});
 const response=NextResponse.json({currency:parsed.data.currency});
 response.cookies.set("plainwork_currency",parsed.data.currency,{path:"/",sameSite:"lax",maxAge:365*24*60*60,secure:process.env.NODE_ENV==="production"});
 return response;
}
