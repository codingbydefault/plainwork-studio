import Link from "next/link";

const features = [
  { icon:"▦", title:"Your own storefront",desc:"Give your digital products a place to live and a link you can share.",titleNl:"Je eigen shop",descNl:"Maak een plek voor je digitale producten met een deelbare link." },
  { icon:"↗", title:"Sales insights",desc:"Track published products, paid orders and your shop's progress.",titleNl:"Inzicht in verkopen",descNl:"Bekijk je producten, betaalde bestellingen en voortgang." },
  { icon:"⇩", title:"Digital delivery",desc:"Deliver purchased files through a private download library.",titleNl:"Digitale levering",descNl:"Lever bestanden via een afgeschermde downloadbibliotheek." },
  { icon:"◎", title:"Stripe payments",desc:"Connect a Stripe account to take payments once your shop is approved.",titleNl:"Betalingen met Stripe",descNl:"Koppel je Stripe-account en ontvang betalingen na goedkeuring." },
];

export function CreatorDashboardPreview({locale="nl"}:{locale?:"nl"|"en"}) {
  const t=(nl:string,en:string)=>locale==="nl"?nl:en;
  return <main className="creator-showcase">
    <section className="creator-showcase-hero">
      <div className="creator-showcase-copy">
        <span className="creator-showcase-kicker">PLAINWORK STUDIO FOR CREATORS</span>
        <h1>{t("Jouw kennis verdient","Your knowledge deserves")}<br/><em>{t("een eigen shop.","its own storefront.")}</em></h1>
        <p className="creator-showcase-subtitle">{t("Zet je kennis om in inkomsten!","Turn your knowledge, into cash!")}</p>
        <p className="creator-showcase-description">{t("Begin eenvoudig: maak een account, kies je shopnaam, koppel Stripe en voeg je eerste digitale product toe. Beheer daarna alles op één plek.","Getting started is straightforward: create your account, choose your shop name, then connect Stripe and add your first digital product. Manage products and follow your progress in one place.")}</p>
        <div className="creator-showcase-actions">
          <Link className="creator-showcase-primary" href="/create-shop">{t("Maak je shop","Create your shop")} <span aria-hidden="true">↗</span></Link>
          <Link className="creator-showcase-secondary" href="/login">{t("Inloggen op je dashboard","Log in to your dashboard")} <span aria-hidden="true">→</span></Link>
        </div>
        <p className="creator-showcase-disclaimer">{t('Inkomsten zijn niet gegarandeerd. Verkopen hangt af van registratie en controle.','Earnings are not guaranteed. Shop and payment availability depend on onboarding and review.')}</p>
      </div>
      <div className="creator-dashboard-demo" aria-label="Illustrative dashboard preview, using sample data">
        <div className="demo-topbar"><div className="demo-brand"><span className="demo-brand-symbol" aria-hidden="true">P</span><span>Plainwork <strong>Studio</strong></span></div><span className="demo-preview-label">{t("VOORBEELD","DEMO PREVIEW")}</span></div>
        <div className="demo-screen">
          <div className="demo-sidebar" aria-hidden="true">
            <span className="active">▦</span><span>▤</span><span>▥</span><span>◫</span>
          </div>
          <div className="demo-content">
            <div className="demo-heading"><div><small>OVERVIEW</small><strong>{t("Goedemorgen, maker!","Good morning, Creator!")}</strong><span>{t("Je shop in één oogopslag","Your store at a glance")}</span></div><span className="demo-avatar">C</span></div>
            <div className="demo-stat-grid">
              <div><small>{t("Bruto-omzet","Gross sales")}</small><strong>€1,240</strong><span>{t("Fictief voorbeeld","Example only")}</span></div>
              <div><small>{t("Bestellingen","Orders")}</small><strong>48</strong><span>Example only</span></div>
              <div><small>{t("Producten","Products")}</small><strong>12</strong><span>Example only</span></div>
            </div>
            <div className="demo-chart-card"><div className="demo-chart-heading"><strong>{t("Omzetoverzicht","Sales overview")}</strong><span>{t("Voorbeeldtrend","Sample trend")}</span></div>
              <svg viewBox="0 0 400 145" role="img" aria-label="Illustrative upward sales line, not real performance data" preserveAspectRatio="none">
                <defs><linearGradient id="demo-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#087f76" stopOpacity=".24"/><stop offset="100%" stopColor="#087f76" stopOpacity="0"/></linearGradient></defs>
                <g stroke="#E7EFEB" strokeWidth="1"><path d="M0 30H400M0 70H400M0 110H400"/></g>
                <path d="M0 117L38 108L74 111L114 87L154 96L194 72L234 79L280 47L327 59L366 27L400 17V145H0Z" fill="url(#demo-fill)"/>
                <path d="M0 117L38 108L74 111L114 87L154 96L194 72L234 79L280 47L327 59L366 27L400 17" fill="none" stroke="#087F76" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="demo-mini-footer"><span>{t("Recente bestellingen","Recent orders")}</span><span>{t("Downloads","Product downloads")}</span><span>{t("Shopinstellingen","Shop settings")}</span></div>
          </div>
        </div>
        <p className="demo-caption">{t("Fictief dashboard en voorbeeldcijfers. Dit zijn geen echte verkopen of inkomensgaranties.","Illustrative interface and sample figures — not actual sales or a guarantee of earnings.")}</p>
      </div>
    </section>
    <section className="creator-simple-setup" aria-labelledby="creator-setup-title"><div className="creator-showcase-section-heading"><span>{t("ZONDER TECHNISCHE VOORKENNIS","GET STARTED WITHOUT THE GUESSWORK")}</span><h2 id="creator-setup-title">{t("Vier eenvoudige stappen. Eén overzicht.","Four clear steps. One place to manage it all.")}</h2><p>{t("Je hoeft niet te programmeren om een account of shop aan te maken. Volg de stappen in je dashboard.","No coding required to create an account or set up your shop. Follow the setup steps in your creator dashboard.")}</p></div><ol className="creator-setup-steps"><li><span className="creator-step-num">01</span><h3>{t("Maak je account","Create your account")}</h3><p>{t("Registreer met je e-mailadres en wachtwoord. Bevestig je mail als dat gevraagd wordt.","Sign up with your email and password. Confirm your email if requested.")}</p></li><li><span className="creator-step-num">02</span><h3>{t("Geef je shop een naam","Name your shop")}</h3><p>{t("Kies een naam en een eigen URL. Je shop begint als concept.","Choose your shop name and unique URL. Your storefront starts privately as a draft.")}</p></li><li><span className="creator-step-num">03</span><h3>{t("Koppel Stripe","Connect Stripe")}</h3><p>{t("Volg de registratie en verificatie bij Stripe om betalingen te kunnen ontvangen.","Follow Stripe’s onboarding and verification process so you can accept payments.")}</p></li><li><span className="creator-step-num">04</span><h3>{t("Voeg producten toe","Add your products")}</h3><p>{t("Upload je cursus of sjabloon en bereid de productpagina voor.","Upload your digital guide or toolkit and prepare your listing for publication.")}</p></li></ol><div className="creator-setup-actions"><Link className="creator-showcase-primary" href="/create-shop">{t("Maak je gratis account en shop ↗","Create your free account and shop ↗")}</Link><span>{t("Registreren gaat eenvoudig. Betaalverificatie en publicatiecontrole kunnen extra stappen vragen.","Account creation is straightforward. Payment verification and publishing approval can take additional steps.")}</span></div></section>
    <section className="creator-showcase-share" aria-label="Creator revenue share">
      <div><span className="creator-share-kicker">{t("JOUW VERKOPEN. JOUW OMZET.","YOUR SALES. YOUR REVENUE.")}</span><h2>{t("Behoud","Keep")} <strong>99%</strong> {t("van je omzet.","of your revenue.")}</h2><p>{t("Plainwork Studio rekent 1% van de verkoopprijs. Transactiekosten, belastingen, terugbetalingen en andere kosten zijn apart.","Plainwork Studio charges 1% of the sale price. Payment processing, taxes, refunds, disputes and other applicable costs are separate.")}</p></div>
      <div className="creator-share-numbers" aria-label="Example distribution of a 100 euro sale price"><div><span>{t("Aandeel maker*","Creator share*")}</span><strong>€99</strong></div><div><span>{t("Platformkosten","Platform fee")}</span><strong>€1</strong></div><div className="creator-share-meter"><span/><span/></div><small>{t("*Vóór bijkomende kosten. Voorbeeld bij een verkoopprijs van €100.","*Before other applicable fees and costs. Illustrative €100 sale.")}</small></div>
    </section>
    <section className="creator-showcase-features"><div className="creator-showcase-section-heading"><span>{t("GEBOUWD VOOR MAKERS","BUILT FOR CREATORS")}</span><h2>{t("Alles begint bij je eigen shop.","Everything starts with a shop.")}</h2><p>{t("Jij maakt nuttige producten. Plainwork Studio helpt bij aanbieden, verkopen en leveren.","Focus on making helpful products. Plainwork Studio provides tools to list, sell and deliver them.")}</p></div>
      <div className="creator-feature-grid">{features.map(feature=><article className="creator-feature" key={feature.title}><span aria-hidden="true" className="creator-feature-icon">{feature.icon}</span><h3>{locale==="nl"?feature.titleNl:feature.title}</h3><p>{locale==="nl"?feature.descNl:feature.desc}</p></article>)}</div>
    </section>
    <section className="creator-stripe-section">
      <div className="creator-stripe-icon"><span aria-hidden="true">↗</span></div>
      <div className="creator-stripe-copy"><h2>{t("Betalingen via Stripe","Payments connected through Stripe")}</h2><p>{t("Makers koppelen hun Stripe-account voor registratie en betalingen. Beschikbaarheid en verificatie verschillen per land en account.","Creators connect their own Stripe account for onboarding and payment processing. Stripe availability and verification requirements depend on your location and account.")}</p></div>
      <a className="creator-stripe-brand" href="https://stripe.com" target="_blank" rel="noopener noreferrer" aria-label="Learn more about Stripe"><span className="creator-stripe-wordmark">stripe</span></a>
    </section>
    <section className="creator-showcase-last"><span>{t("JOUW VOLGENDE STAP","YOUR NEXT STEP")}</span><h2>{t("Klaar om je kennis te delen?","Ready to share what you know?")}</h2><p>{t("Maak een shop, voeg je eerste product toe en bereid je verkoop voor.","Create a shop, add your first digital product, and prepare your storefront for launch.")}</p><Link className="creator-showcase-primary" href="/create-shop">Create your shop <span aria-hidden="true">↗</span></Link></section>
  </main>;
}
