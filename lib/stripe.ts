import Stripe from "stripe";
import { serverEnv } from "@/lib/env";
export { applicationFee } from "@/lib/fees";

export function stripeClient() { return new Stripe(serverEnv().STRIPE_SECRET_KEY); }
