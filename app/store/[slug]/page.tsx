import { notFound } from "next/navigation";
import { CheckoutButton } from "@/components/checkout-button";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeClient } from "@/lib/stripe";

export const dynamic="force-dynamic";

export default async function Storefront({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const db=createSupabaseAdmin();
  // Public URLs use the stable store slug. Never expose account IDs as the long-term identifier.
  const {data:store}=await db.from("stores").select("id,name,stripe_accounts(account_id),products(id,stripe_product_id,status)").eq("slug",slug).eq("status","active").single();
  const accountId=(store?.stripe_accounts as unknown as {account_id:string}|null)?.account_id;if(!store||!accountId)notFound();
  // stripeAccount sends the Stripe-Account header and lists only this creator's catalog.
  const stripeProducts=await stripeClient().products.list({limit:20,active:true,expand:["data.default_price"]},{stripeAccount:accountId});
  const localByStripeId=new Map((store.products as unknown as Array<{id:string;stripe_product_id:string|null;status:string}>).map((product)=>[product.stripe_product_id,product]));
  return <main><section className="hero"><div className="eyebrow">Creator storefront</div><h1>{store.name}</h1><p>Secure digital products fulfilled through Plainwork Studio.</p></section><div className="grid">{stripeProducts.data.map((product)=>{const local=localByStripeId.get(product.id);const price=typeof product.default_price==="string"?null:product.default_price;return <article className="card" key={product.id}><h2>{product.name}</h2><p className="muted">{product.description}</p>{price?.unit_amount&&<div className="price">{new Intl.NumberFormat("en",{style:"currency",currency:price.currency}).format(price.unit_amount/100)}</div>}{local?.status==="published"?<CheckoutButton productId={local.id}/>:<p className="notice">This product is not published yet.</p>}</article>})}</div></main>;
}
