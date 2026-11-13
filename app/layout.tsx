import "./globals.css";
import "./lead.css";
import Link from "next/link";

export const metadata = { title: "Plainwork Studio", description: "Buy and sell practical digital products. Creators keep 99% of sale prices before payment-processing fees and other applicable costs." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div className="page"><header className="topbar">
    <Link className="brand" href="/">Plainwork Studio</Link>
    <nav className="nav" aria-label="Main navigation">
      <Link href="/">Home</Link>
      <Link href="/explore">Explore products</Link>
      <Link href="/library">My library</Link>
      <Link href="/dashboard">Creator dashboard</Link>
    </nav>
    <div className="header-actions">
      <Link className="header-login" href="/login">Log in</Link>
      <Link className="header-shop" href="/create-shop">Create a shop <span aria-hidden="true">↗</span></Link>
    </div>
  </header>{children}</div></body></html>;
}
