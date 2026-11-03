import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Vial } from "../components/Art";
import { ScentFinder } from "../components/ScentFinder";
import { store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE } from "../data/site";

export function DiscoverySet() {
  const scents = store.scents();
  const { sampled, toggleSampled } = usePrefs();
  const allTried = scents.every((s) => sampled.includes(s.handle));
  const markAll = () => scents.forEach((s) => { if (sampled.includes(s.handle) === allTried) toggleSampled(s.handle); });

  return (
    <>
      <Seo title="The discovery set: all seven scents as 2ml samples" path="/discovery-set" type="product"
        description="Every I&A Parfums scent as a 2ml sample in one box. Wear one a day for a week, then the set's credit comes off your first 50ml or 100ml bottle. Tooting, London."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Discovery set", path: "/discovery-set" }]),
          { "@context": "https://schema.org", "@type": "Product", name: "Discovery set", description: `Seven 2ml samples: ${scents.map((s) => s.name).join(", ")}.`, brand: { "@type": "Brand", name: SITE.name }, category: "Fragrance discovery set" }]} />

      <section className="on-ink rules bg-ink text-paper">
        <div className="wrap grid items-center gap-10 py-14 lg:grid-cols-[1fr_1fr] lg:py-20">
          <div className="flex flex-col gap-5">
            <nav aria-label="Breadcrumb" className="text-sm text-mute-dark"><Link to="/" className="underline">Home</Link> · Discovery set</nav>
            <h1 className="text-[44px] text-paper sm:text-[64px]">All seven. Two millilitres each.</h1>
            <p className="max-w-lg text-[18px] text-mute-dark">The whole range in one box, for £[PRICE]. A week of wearing a different scent each day, and the set's credit of £[SAMPLE CREDIT] comes off your first 50ml or 100ml.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <button type="button" disabled className="btn btn-paper min-h-14 cursor-not-allowed opacity-70">Online ordering opens at launch</button>
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn-outline-paper">Pick one up in Tooting</a>
            </div>
            <p className="text-sm text-mute-dark">Concept preview: sample product. The set price and the credit are confirmed with the client.</p>
          </div>
          <div className="flex min-w-0 items-end justify-between gap-1 rounded-pill border border-paper/30 p-4 sm:gap-2 sm:p-8" role="img" aria-label={`Seven sample vials: ${scents.map((s) => s.name).join(", ")}`}>
            {scents.map((s) => <Vial key={s.handle} colour={s.colour} stroke="#fbfbf9" className="h-24 w-auto sm:h-44" />)}
          </div>
        </div>
      </section>

      <section className="wrap py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[32px] sm:text-[40px]">What's in the box</h2>
          <button type="button" aria-pressed={allTried} onClick={markAll} className="chip">{allTried ? "I have the set" : "I've got the set: mark all as tried"}</button>
        </div>
        <ol className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {scents.map((s, i) => (
            <li key={s.handle} className="border-t border-line">
              <Link to={`/scents/${s.handle}`} className="flex min-h-16 items-center gap-4 py-3">
                <span className="display w-8 text-[26px] text-mute">{i + 1}</span>
                <Vial colour={s.colour} className="h-12 w-auto shrink-0" />
                <span className="flex flex-col"><span className="display text-[22px] leading-tight">{s.name}</span><span className="text-sm text-mute">{s.line} · {s.family}, {s.strength.toLowerCase()}</span></span>
                {sampled.includes(s.handle) && <span className="label ml-auto rounded-pill bg-ink px-2 py-1.5 text-[11px] text-paper">Sampled</span>}
              </Link>
            </li>
          ))}
          <li className="border-t border-line">
            <div className="flex min-h-16 items-center gap-4 py-3 text-mute"><span className="display w-8 text-[26px]">+</span><span className="text-sm">A card with the notes of each scent and a space to write what you thought, and your credit code [TO CONFIRM].</span></div>
          </li>
        </ol>
      </section>

      <section className="bg-sage py-16">
        <div className="wrap grid gap-10 lg:grid-cols-3">
          {[
            ["Day one to seven", "Wear one scent a day, on skin, from the morning. Note which ones you keep catching on your own sleeve."],
            ["Then choose", "Come back to the scent page, press \"I have the sample\" and the credit shows on the 50ml and 100ml."],
            ["Online or in the shop", "The credit works the same at the counter in Tooting. Bring the box or the code. [HOW THE CREDIT IS APPLIED]."],
          ].map(([t, d]) => <div key={t} className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="text-[26px]">{t}</h2><p className="text-mute">{d}</p></div>)}
        </div>
      </section>

      <section className="wrap py-16">
        <p className="label mb-3 text-mute">Rather narrow it down?</p>
        <h2 className="mb-8 text-[32px] sm:text-[40px]">Three questions find two or three to start with.</h2>
        <ScentFinder />
      </section>
    </>
  );
}
