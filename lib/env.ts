import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SECRET_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_CONNECT_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export function publicEnv() { return publicSchema.parse(process.env); }
export function serverEnv() { return serverSchema.parse(process.env); }
