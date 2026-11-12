import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Plainwork Studio", description: "A creator-first marketplace with a 1% platform fee." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div className="page"><header className="topbar"><Link className="brand" href="/">Plainwork Studio</Link><nav className="nav"><Link href="/">Marketplace</Link><Link href="/library">Library</Link><Link href="/dashboard">Creator dashboard</Link></nav></header>{children}</div></body></html>;
}
