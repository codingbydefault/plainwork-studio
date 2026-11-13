import Link from "next/link";

const features = [
  { icon:"▦", title:"Your own storefront",desc:"Give your digital products a place to live and a link you can share." },
  { icon:"↗", title:"Sales insights",desc:"Track published products, paid orders and your shop's progress." },
  { icon:"⇩", title:"Digital delivery",desc:"Deliver purchased files through a private download library." },
  { icon:"◎", title:"Stripe payments",desc:"Connect a Stripe account to take payments once your shop is approved." },
];

export function CreatorDashboardPreview() {
  return <main className="creator-showcase">
    <section className="creator-showcase-hero">
      <div className="creator-showcase-copy">
        <span className="creator-showcase-kicker">PLAINWORK STUDIO FOR CREATORS</span>
        <h1>Your knowledge deserves<br/><em>its own storefront.</em></h1>
        <p className="creator-showcase-subtitle">Turn your knowledge, into cash!</p>
        <p className="creator-showcase-description">Getting started is straightforward: create your account, choose your shop name, then connect Stripe and add your first digital product. Manage products and follow your progress in one place.</p>
        <div className="creator-showcase-actions">
          <Link className="creator-showcase-primary" href="/create-shop">Create your shop <span aria-hidden="true">↗</span></Link>
          <Link className="creator-showcase-secondary" href="/login">Log in to your dashboard <span aria-hidden="true">→</span></Link>
        </div>
        <p className="creator-showcase-disclaimer">Earnings aren't guaranteed. Shop and payment availability depend on onboarding and review.</p>
      </div>
      <div className="creator-dashboard-demo" aria-label="Illustrative dashboard preview, using sample data">
        <div className="demo-topbar"><div className="demo-brand"><span className="demo-brand-symbol" aria-hidden="true">P</span><span>Plainwork <strong>Studio</strong></span></div><span className="demo-preview-label">DEMO PREVIEW</span></div>
        <div className="demo-screen">
          <div className="demo-sidebar" aria-hidden="true">
            <span className="active">▦</span><span>▤</span><span>▥</span><span>◫</span>
          </div>
          <div className="demo-content">
            <div className="demo-heading"><div><small>OVERVIEW</small><strong>Good morning, Creator!</strong><span>Your store at a glance</span></div><span className="demo-avatar">C</span></div>
            <div className="demo-stat-grid">
              <div><small>Gross sales</small><strong>€1,240</strong><span>Example only</span></div>
              <div><small>Orders</small><strong>48</strong><span>Example only</span></div>
              <div><small>Products</small><strong>12</strong><span>Example only</span></div>
            </div>
            <div className="demo-chart-card"><div className="demo-chart-heading"><strong>Sales overview</strong><span>Sample trend</span></div>
              <svg viewBox="0 0 400 145" role="img" aria-label="Illustrative upward sales line, not real performance data" preserveAspectRatio="none">
                <defs><linearGradient id="demo-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#087f76" stopOpacity=".24"/><stop offset="100%" stopColor="#087f76" stopOpacity="0"/></linearGradient></defs>
                <g stroke="#E7EFEB" strokeWidth="1"><path d="M0 30H400M0 70H400M0 110H400"/></g>
                <path d="M0 117L38 108L74 111L114 87L154 96L194 72L234 79L280 47L327 59L366 27L400 17V145H0Z" fill="url(#demo-fill)"/>
                <path d="M0 117L38 108L74 111L114 87L154 96L194 72L234 79L280 47L327 59L366 27L400 17" fill="none" stroke="#087F76" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="demo-mini-footer"><span>Recent orders</span><span>Product downloads</span><span>Shop settings</span></div>
          </div>
        </div>
        <p className="demo-caption">Illustrative interface and sample figures — not actual sales or a guarantee of earnings.</p>
      </div>
    </section>
    <section className="creator-simple-setup" aria-labelledby="creator-setup-title"><div className="creator-showcase-section-heading"><span>GET STARTED WITHOUT THE GUESSWORK</span><h2 id="creator-setup-title">Four clear steps. One place to manage it all.</h2><p>No coding required to create an account or set up your shop. Follow the setup steps in your creator dashboard.</p></div><ol className="creator-setup-steps"><li><span className="creator-step-num">01</span><h3>Create your account</h3><p>Sign up with your email and password. Confirm your email if requested.</p></li><li><span className="creator-step-num">02</span><h3>Name your shop</h3><p>Choose your shop name and unique URL. Your storefront starts privately as a draft.</p></li><li><span className="creator-step-num">03</span><h3>Connect Stripe</h3><p>Follow Stripe’s onboarding and verification process so you can accept payments.</p></li><li><span className="creator-step-num">04</span><h3>Add your products</h3><p>Upload your digital guide or toolkit and prepare your listing for publication.</p></li></ol><div className="creator-setup-actions"><Link className="creator-showcase-primary" href="/create-shop">Create your free account and shop ↗</Link><span>Account creation is straightforward. Payment verification and publishing approval can take additional steps.</span></div></section>
    <section className="creator-showcase-share" aria-label="Creator revenue share">
      <div><span className="creator-share-kicker">YOUR SALES. YOUR REVENUE.</span><h2>Keep <strong>99%</strong> of your revenue.</h2><p>Plainwork Studio's platform share is 1% of the sale price. Payment processing, taxes, refunds, disputes and other applicable costs are separate.</p></div>
      <div className="creator-share-numbers" aria-label="Example distribution of a 100 euro sale price"><div><span>Creator share*</span><strong>€99</strong></div><div><span>Platform fee</span><strong>€1</strong></div><div className="creator-share-meter"><span/><span/></div><small>*Before other applicable fees and costs. Illustrative €100 sale.</small></div>
    </section>
    <section className="creator-showcase-features"><div className="creator-showcase-section-heading"><span>BUILT FOR CREATORS</span><h2>Everything starts with a shop.</h2><p>Focus on making helpful products. Plainwork Studio provides tools to list, sell and deliver them.</p></div>
      <div className="creator-feature-grid">{features.map(feature=><article className="creator-feature" key={feature.title}><span aria-hidden="true" className="creator-feature-icon">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.desc}</p></article>)}</div>
    </section>
    <section className="creator-stripe-section">
      <div className="creator-stripe-icon"><span aria-hidden="true">↗</span></div>
      <div className="creator-stripe-copy"><h2>Payments connected through Stripe</h2><p>Creators connect their own Stripe account for onboarding and payment processing. Stripe availability and verification requirements depend on your location and account.</p></div>
      <a className="creator-stripe-brand" href="https://stripe.com" target="_blank" rel="noopener noreferrer" aria-label="Learn more about Stripe"><span className="creator-stripe-wordmark">stripe</span></a>
    </section>
    <section className="creator-showcase-last"><span>YOUR NEXT STEP</span><h2>Ready to share what you know?</h2><p>Create a shop, add your first digital product, and prepare your storefront for launch.</p><Link className="creator-showcase-primary" href="/create-shop">Create your shop <span aria-hidden="true">↗</span></Link></section>
  </main>;
}
