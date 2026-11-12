import { launchGuides } from "@/content/launch-guides";

export const metadata = {
  title: "Launch Catalog | Plainwork Studio",
  description: "Preview ten CodedByDefault digital-product guides and their ten free lead magnets.",
};

export default function LaunchCatalog() {
  const paid = launchGuides.filter((guide) => guide.kind === "paid");
  const free = launchGuides.filter((guide) => guide.kind === "lead_magnet");
  return (
    <main>
      <section className="hero">
        <div className="eyebrow">CodedByDefault · launch collection</div>
        <h1>20 practical guides. 10 paths from a free start to a complete system.</h1>
        <p>Explore ten planned paid guides and their matching micro-guides. This is a catalog preview: downloadable files and paid checkout will be enabled only after content and pricing are verified.</p>
      </section>
      <section>
        <div className="row"><h2>Free micro-guides</h2><span className="muted">10 lead magnets · files pending review</span></div>
        <div className="grid">
          {free.map((guide) => <article className="card" key={guide.slug}>
            <div className="eyebrow">{guide.category} · Free</div>
            <h2>{guide.title}</h2>
            <p className="muted">{guide.description}</p>
            <p className="notice">Preview only — download not yet available.</p>
          </article>)}
        </div>
      </section>
      <section>
        <div className="row"><h2>Complete paid guides</h2><span className="muted">10 full products · prices and files pending review</span></div>
        <div className="grid">
          {paid.map((guide) => <article className="card" key={guide.slug}>
            <div className="eyebrow">{guide.category} · Complete guide</div>
            <h2>{guide.title}</h2>
            <p className="muted">{guide.description}</p>
            <p className="notice">Preview only — checkout not yet available.</p>
          </article>)}
        </div>
      </section>
    </main>
  );
}
