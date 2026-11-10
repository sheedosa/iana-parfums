import { useRef } from "react";
import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { DiscoveryBox, Vial } from "../components/Art";
import { StickyBar } from "../components/StickyBar";
import { scentLine } from "../components/ScentCard";
import { DeliveryRows } from "./ScentPage";
import { fullName, store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE } from "../data/site";

export function DiscoverySet() {
  const scents = store.scents();
  const { sampled, toggleSampled, answers } = usePrefs();
  const allTried = scents.every((s) => sampled.includes(s.handle));
  const markAll = () => scents.forEach((s) => { if (sampled.includes(s.handle) === allTried) toggleSampled(s.handle); });
  const actions = useRef<HTMLDivElement>(null);

  return (
    <>
      <Seo title="The discovery set: all four scents as 2ml samples" path="/discovery-set" type="product"
        description="Every I&A Parfums scent as a 2ml sample in one box, with a card for your notes. Wear a different one each day, then choose your bottle. Tooting, London."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Discovery set", path: "/discovery-set" }]),
          { "@context": "https://schema.org", "@type": "Product", name: "Discovery set", description: `Four 2ml samples: ${scents.map(fullName).join(", ")}. Concept preview: sample product.`, brand: { "@type": "Brand", name: SITE.name }, category: "Fragrance discovery set" }]} />

      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid items-center gap-x-14 gap-y-6 pb-12 pt-3 lg:grid-cols-[1fr_1.15fr] lg:pb-16 lg:pt-6">
          <div className="flex flex-col gap-4">
            <nav aria-label="Breadcrumb" className="crumbs text-mute-dark"><Link to="/">Home</Link></nav>
            <h1 className="t-name text-paper">All four, 2ml each.</h1>
            <p className="t-lede measure">The whole range in one box, with a card for your notes. Wear a different scent each day, then choose your bottle.</p>
            <p className="text-base">Set price £[SET PRICE].</p>
            <div ref={actions} className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button type="button" disabled className="btn min-h-14">Online ordering opens at launch</button>
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn-outline-paper">Pick one up in Tooting</a>
            </div>
            <p className="t-small text-mute-dark">Concept preview: sample product.</p>
          </div>
          <DiscoveryBox dark scents={scents} className="w-full max-w-[620px] justify-self-center lg:justify-self-end" />
        </div>
      </section>

      {/* What's in the box: the four vials stand on one line, the way the bottles do on the shelf. */}
      <section className="wrap grid gap-x-14 gap-y-8 py-16 sm:py-20 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <div className="flex flex-col items-start gap-4">
          <h2>What's in the box</h2>
          <p className="text-base">Four 2ml vials and a card to note what you thought of each scent.</p>
          <p className="text-base text-mute">[CARD AND CREDIT DETAILS TO CONFIRM]</p>
          <button type="button" aria-pressed={allTried} onClick={markAll} className="chip whitespace-normal py-2 text-left">{allTried ? "I have the set" : "I've got the set: mark all as tried"}</button>
        </div>
        <ul className="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
          {scents.map((s) => (
            <li key={s.handle} className="min-w-0">
              <Link to={`/scents/${s.handle}`} className="group flex h-full flex-col">
                <span className="flex h-36 items-end justify-center border-b border-ink sm:h-44"><Vial colour={s.colour} className="h-[92%] w-auto" /></span>
                <span className="flex flex-col gap-1 pr-3 pt-3">
                  <h3 className="display t-h4 underline-offset-4 group-hover:underline">{fullName(s)}</h3>
                  <span className="text-base text-mute">{scentLine(s)}</span>
                  {sampled.includes(s.handle) && <span className="text-base">You have the sample.</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-sage py-16 sm:py-20">
        <div className="wrap grid gap-x-14 gap-y-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-4">
            <h2>A week with four scents</h2>
            <p className="t-lede max-w-[38rem]">Wear one scent a day, on skin, from the morning, and note which ones you keep catching on your own sleeve. Then come back to the scent page and press "I have the sample": the bottle shows your sample credit.</p>
          </div>
          <div className="flex flex-col items-start gap-3 self-end border-t border-ink pt-5">
            <p className="t-lede">{answers ? "Your finder answers are saved; your matches are marked on the range." : "Rather narrow it down first?"}</p>
            <Link to="/scent-finder" className="btn btn-ink">{answers ? "See my scents" : "Three questions"}</Link>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-x-14 gap-y-4 pt-16 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <h2 className="t-h3">Delivery and returns</h2>
        <DeliveryRows className="max-w-2xl" />
      </section>

      <StickyBar watch={actions} label="The discovery set">
        <p className="flex min-w-0 flex-1 flex-col leading-tight"><span className="truncate font-medium">Discovery set</span><span className="truncate text-[16px] text-mute">£[SET PRICE]</span></p>
        <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink shrink-0 px-5">Call the shop</a>
      </StickyBar>
    </>
  );
}
