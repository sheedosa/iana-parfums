import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ScentFinder } from "../components/ScentFinder";
import { PhotoSlot, Shelf, Vial } from "../components/Art";
import { store } from "../lib/store";
import { SITE } from "../data/site";

export function Home() {
  const scents = store.scents();
  return (
    <>
      <Seo title="Smell it first. Eau de parfum from Tooting" path="/" description="Seven eaux de parfum made for I & A in Tooting, London. Every scent comes as a 2ml sample first, and the sample price is credited back against the bottle. Three questions find your scent." />

      <section className="on-ink rules bg-ink text-paper">
        <div className="wrap grid items-center gap-8 py-8 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
          <div className="relative flex max-w-xl flex-col gap-3 sm:gap-5">
            <p className="label relative text-sage">Eau de parfum · Tooting, London</p>
            <h1 className="relative text-[48px] text-paper sm:text-[76px]">Smell it first.</h1>
            <p className="relative max-w-md text-[17px] text-mute-dark sm:text-[18px]">Seven scents, each sold as a 2ml sample first. Buy the bottle afterwards and the sample price comes off.</p>
            <div className="relative flex flex-wrap gap-3 pt-1">
              <Link to="/range" className="btn btn-paper">See the range</Link>
              <Link to="/discovery-set" className="btn btn-outline-paper hidden sm:inline-flex">All seven samples</Link>
            </div>
          </div>
          <div id="finder" className="rounded-pill border border-paper/30 p-4 sm:p-7">
            <p className="label mb-4 text-sage sm:mb-5">Scent finder · three questions</p>
            <ScentFinder dark compact />
          </div>
        </div>
      </section>

      <section className="wrap grid gap-8 border-b border-line py-14 sm:grid-cols-3">
        {[
          ["Choose a sample", "Every scent comes as a 2ml vial for £[PRICE]. [HOW LONG A 2ML SAMPLE LASTS], which is the only way to know."],
          ["Wear it a few days", "On skin, at work, in the evening. A perfume at noon is not the perfume at nine, so give it time."],
          ["The sample pays for itself", "Buy the 50ml or 100ml afterwards and we credit the £[PRICE] you paid for the sample. Online or in the shop."],
        ].map(([t, d], i) => (
          <div key={t} className="flex gap-4 border-t border-ink pt-5">
            <Vial className="h-14 w-auto shrink-0" />
            <div className="flex flex-col gap-2"><h2 className="label font-sans text-mute">{i + 1} · {t}</h2><p className="text-[17px]">{d}</p></div>
          </div>
        ))}
      </section>

      <section className="on-ink mt-16 bg-ink py-16 text-paper sm:py-20">
        <div className="wrap">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div><p className="label mb-3 text-sage">The shelf</p><h2 className="text-[32px] text-paper sm:text-[44px]">Seven scents. That's the range.</h2></div>
            <Link to="/range" className="label inline-flex min-h-11 items-center text-paper underline">See them all</Link>
          </div>
          <Shelf scents={scents} className="mb-10" />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 xl:grid-cols-7">
            {scents.map((s) => (
              <li key={s.handle}>
                <Link to={`/scents/${s.handle}`} className="lift group flex min-h-11 flex-col gap-2">
                  <span className="block h-3 w-full rounded-pill" style={{ background: s.colour }} aria-hidden="true" />
                  <span className="display text-[24px] leading-tight text-paper group-hover:underline">{s.name}</span>
                  <span className="-mt-1 text-sm text-mute-dark">{s.line}</span>
                  <span className="label text-[11px] text-mute-dark">{s.family} · {s.strength}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-sage py-16 sm:py-20">
        <div className="wrap grid min-w-0 items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <p className="label text-mute">Discovery set</p>
            <h2 className="text-[32px] sm:text-[44px]">All seven, 2ml each, in one box.</h2>
            <p className="text-[17px]">The whole range as samples for £[PRICE]. Wear a different one each day, then come back for the bottle; the set's credit of £[SAMPLE CREDIT] comes off your first 50ml or 100ml.</p>
            <Link to="/discovery-set" className="btn btn-ink self-start">The discovery set</Link>
          </div>
          <div className="flex min-w-0 items-end justify-center gap-2 rounded-pill bg-paper p-5 sm:gap-5 sm:p-10" role="img" aria-label="Seven sample vials in a row, one for each scent">
            {scents.map((s) => <Vial key={s.handle} colour={s.colour} className="h-20 w-auto sm:h-40" />)}
          </div>
        </div>
      </section>

      <section className="wrap grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1fr]">
        <PhotoSlot label="the blending bench, materials and pipettes" className="aspect-[4/3] lg:aspect-[4/5] lg:max-w-md" />
        <div className="flex flex-col justify-center gap-5">
          <p className="label text-mute">How we make them</p>
          <h2 className="text-[32px] sm:text-[44px]">Notes you can read, and a story you can wear.</h2>
          <p className="text-[17px]">Each scent is built as top, heart and base, and we show all three on the page so you know what you'll smell at nine, at noon and at night. Blended by [PERFUMER], in [WHERE THE SCENTS ARE MADE], in small batches for the shop.</p>
          <Link to="/our-scents" className="btn btn-ghost self-start">Our scents</Link>
        </div>
      </section>

      <section className="wrap flex flex-wrap items-center justify-between gap-6 border-t border-line pt-12">
        <div className="flex max-w-xl flex-col gap-2">
          <p className="label text-mute">The shop</p>
          <h2 className="text-[32px] sm:text-[40px]">{SITE.address.street}, {SITE.address.area}.</h2>
          <p className="text-mute">Open {SITE.hours}. Every scent is on the counter to try, and the sample credit works in the shop too. Part of the I&amp;A family, in Tooting since {SITE.since}.</p>
        </div>
        <div className="flex flex-wrap gap-3"><Link to="/visit" className="btn btn-ink">Visit the shop</Link><a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">{SITE.phone}</a></div>
      </section>
    </>
  );
}
