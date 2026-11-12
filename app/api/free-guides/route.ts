import { NextResponse } from "next/server";
import { z } from "zod";
import { catalogByKey } from "@/lib/catalog";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const inputSchema = z.object({
  guideKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  marketingConsent: z.boolean(),
  website: z.string().max(0),
});

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  try {
    const input = inputSchema.parse(await request.json());
    const item = catalogByKey.get(input.guideKey);
    if (!item) return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    const db = createSupabaseAdmin();
    const { data: lead, error: leadError } = await db.rpc("capture_lead_magnet", {
      p_email: input.email, p_guide_key: input.guideKey, p_marketing_consent: input.marketingConsent,
      p_privacy_policy_version: "2026-11-12",
    });
    if (leadError || !lead) throw leadError ?? new Error("Lead capture failed");
    const { data: signed, error: signedError } = await db.storage.from("free-guides").createSignedUrl(item.free.file, 120, { download: item.free.file });
    if (signedError || !signed) throw signedError ?? new Error("Download unavailable");
    return NextResponse.json({ downloadUrl: signed.signedUrl }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("Free guide request failed", error);
    return NextResponse.json({ error: "We could not prepare your guide." }, { status: 400 });
  }
}
