import "./globals.css";
import "./lead.css";
import Link from "next/link";

export const metadata = { title: "Plainwork Studio", description: "Find free guides and premium digital toolkits. Sell your own creations and keep 99% of the sale price before processing fees and other costs." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div className="page"><header className="topbar"><Link className="brand" href="/">Plainwork Studio</Link><nav className="nav"><Link href="/">Marketplace</Link><Link href="/library">Library</Link><Link href="/dashboard">Sell digital products</Link></nav></header>{children}</div></body></html>;
}
