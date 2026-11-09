import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { DiscoveryBox, Vial } from "../components/Art";
import { DeliveryRows } from "./ScentPage";
import { fullName, store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE } from "../data/site";

export function DiscoverySet() {
  const scents = store.scents();
  const { sampled, toggleSampled, answers } = usePrefs();
  const allTried = scents.every((s) => sampled.includes(s.handle));
  const markAll = () => scents.forEach((s) => { if (sampled.includes(s.handle) === allTried) toggleSampled(s.handle); });

  return (
    <>
      <Seo title="The discovery set: all four scents as 2ml samples" path="/discovery-set" type="product"
        description="Every I&A Parfums scent as a 2ml sample in one box, with a card for your notes. Wear a different one each day, then choose your bottle. Tooting, London."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Discovery set", path: "/discovery-set" }]),
          { "@context": "https://schema.org", "@type": "Product", name: "Discovery set", description: `Four 2ml samples: ${scents.map(fullName).join(", ")}. Concept preview: sample product.`, brand: { "@type": "Brand", name: SITE.name }, category: "Fragrance discovery set" }]} />

      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid items-center gap-8 py-10 lg:grid-cols-[1fr_1.1fr] lg:py-16">
          <div className="flex flex-col gap-4">
            <nav aria-label="Breadcrumb" className="crumbs text-[15px] text-mute-dark"><Link to="/">Home</Link> · Discovery set</nav>
            <h1 className="text-[48px] text-paper sm:text-[68px]">All four,<br />2ml each.</h1>
            <p className="max-w-lg text-[18px] text-mute-dark">The whole range in one box, with a card for your notes. Wear a different scent each day, then choose your bottle.</p>
            <p className="label text-sage">Set price £[SET PRICE]</p>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button type="button" disabled className="btn min-h-14">Online ordering opens at launch</button>
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn-outline-paper">Pick one up in Tooting</a>
            </div>
            <p className="text-[14px] text-mute-dark">Concept preview: sample product.</p>
          </div>
          <DiscoveryBox dark scents={scents} className="w-full max-w-[600px] justify-self-center" />
        </div>
      </section>

      <section className="wrap py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[34px] sm:text-[44px]">What's in the box</h2>
          <button type="button" aria-pressed={allTried} onClick={markAll} className="chip">{allTried ? "I have the set" : "I've got the set: mark all as tried"}</button>
        </div>
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {scents.map((s) => (
            <li key={s.handle} className="border-t border-line">
              <Link to={`/scents/${s.handle}`} className="flex min-h-20 items-center gap-5 py-4">
                <Vial colour={s.colour} className="h-16 w-auto shrink-0" />
                <span className="flex flex-col"><span className="display text-[26px] leading-tight underline-offset-4 hover:underline">{fullName(s)}</span><span className="text-base text-mute">{s.family} · {s.strength.toLowerCase()}, {s.when === "Both" ? "day or evening" : s.when.toLowerCase()}</span></span>
                {sampled.includes(s.handle) && <span className="label ml-auto rounded-pill bg-ink px-2 py-1.5 text-[11px] text-paper">Sampled</span>}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-line pt-4 text-base text-mute">Also in the box: a card to note what you thought of each scent. [CARD AND CREDIT DETAILS TO CONFIRM]</p>
      </section>

      <section className="bg-sage py-16">
        <div className="wrap grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4">
            <h2 className="text-[34px] sm:text-[44px]">A week with four scents</h2>
            <p className="text-[18px]">Wear one scent a day, on skin, from the morning, and note which ones you keep catching on your own sleeve. Then come back to the scent page and press "I have the sample": the bottle shows your sample credit.</p>
          </div>
          <div className="flex flex-col gap-3 self-end border-t border-ink pt-4">
            <p className="text-[18px]">{answers ? "Your finder answers are saved; your matches are flagged on the range." : "Rather narrow it down first?"}</p>
            <Link to="/scent-finder" className="btn btn-ink self-start">{answers ? "See my scents" : "Three questions"}</Link>
          </div>
        </div>
      </section>

      <section className="wrap pt-16">
        <h2 className="label mb-2 font-sans text-mute">Delivery and returns</h2>
        <DeliveryRows className="max-w-2xl" />
      </section>
    </>
  );
}
