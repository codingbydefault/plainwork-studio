import { notFound } from "next/navigation";
import {getLocale} from "@/lib/i18n-server";
import {translatedProduct} from "@/lib/ai-courses-i18n";
import { CheckoutButton } from "@/components/checkout-button";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { stripeClient } from "@/lib/stripe";

export const dynamic="force-dynamic";

export default async function Storefront({params}:{params:Promise<{slug:string}>}){
  const locale=await getLocale();const {slug}=await params;const db=createSupabaseAdmin();
  // Public URLs use the stable store slug. Never expose account IDs as the long-term identifier.
  const {data:store}=await db.from("stores").select("id,name,stripe_accounts(account_id),products(id,slug,description,stripe_product_id,status)").eq("slug",slug).eq("status","active").single();
  const accountId=(store?.stripe_accounts as unknown as {account_id:string}|null)?.account_id;if(!store||!accountId)notFound();
  // stripeAccount sends the Stripe-Account header and lists only this creator's catalog.
  const stripeProducts=await stripeClient().products.list({limit:20,active:true,expand:["data.default_price"]},{stripeAccount:accountId});
  const localByStripeId=new Map((store.products as unknown as Array<{id:string;slug:string;description:string|null;stripe_product_id:string|null;status:string}>).map((product)=>[product.stripe_product_id,product]));
  return <main><section className="hero"><div className="eyebrow">{locale==="nl"?"Shop van een maker":"Creator storefront"}</div><h1>{store.name}</h1><p>{locale==="nl"?"Veilig afrekenen en digitale bestanden ontvangen via Plainwork Studio.":"Secure digital products fulfilled through Plainwork Studio."}</p></section><div className="grid">{stripeProducts.data.map((product)=>{const local=localByStripeId.get(product.id);const price=typeof product.default_price==="string"?null:product.default_price;const tr=translatedProduct(local?.slug,product.name,local?.description??product.description,locale);return <article className="card" key={product.id}><h2>{tr.title}</h2><p className="muted">{tr.description}</p>{price?.unit_amount&&<div className="price">{new Intl.NumberFormat(locale==="nl"?"nl-NL":"en-GB",{style:"currency",currency:price.currency}).format(price.unit_amount/100)}</div>}{local?.status==="published"?<CheckoutButton productId={local.id} locale={locale}/>:<p className="notice">{locale==="nl"?"Dit product is nog niet gepubliceerd.":"This product is not published yet."}</p>}</article>})}</div></main>;
}
