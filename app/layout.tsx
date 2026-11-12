import "./globals.css";
import "./lead.css";
import "./marketplace.css";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";

export const metadata = { title: "Plainwork Studio", description: "A creator-first marketplace with a 1% platform fee." };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let user=null;try{const supabase=await createSupabaseServer();const result=await supabase.auth.getUser();user=result.data.user}catch{}
  return <html lang="en"><body><header className="site-header"><div className="header-inner"><Link className="brand" href="/"><span className="brand-mark">P</span><span>Plainwork</span></Link><nav className="nav"><Link href="/#marketplace">Explore</Link><Link href="/#free-guides">Free guides</Link><Link href="/dashboard">Sell with us</Link>{user?<><Link href="/library">Library</Link><Link className="nav-cta" href="/dashboard">Dashboard</Link><SignOutButton/></>:<><Link href="/auth">Sign in</Link><Link className="nav-cta" href="/auth">Start selling</Link></>}</nav></div></header><div className="page">{children}</div><footer className="site-footer"><div className="footer-inner"><div><Link className="brand" href="/"><span className="brand-mark">P</span><span>Plainwork</span></Link><p>Practical digital products from independent creators.</p></div><div><strong>Marketplace</strong><Link href="/#marketplace">Explore products</Link><Link href="/#free-guides">Free guides</Link><Link href="/library">Buyer library</Link></div><div><strong>Creators</strong><Link href="/dashboard">Open a shop</Link><Link href="/dashboard">Creator dashboard</Link><span>1% platform fee</span></div><div><strong>Company</strong><Link href="/privacy">Privacy</Link><span>Secure Stripe payments</span></div></div></footer></body></html>;
}
