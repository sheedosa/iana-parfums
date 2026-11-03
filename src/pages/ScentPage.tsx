import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ScentCard } from "../components/ScentCard";
import { Bottle, NotesDiagram, Vial, isDark } from "../components/Art";
import { NotFound } from "./NotFound";
import { store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE, SIZES, type Size } from "../data/site";

export function ScentPage() {
  const { handle = "" } = useParams();
  const s = store.scent(handle);
  const { sampled, toggleSampled } = usePrefs();
  const tried = sampled.includes(handle);
  const [size, setSize] = useState<Size>(tried ? "50ml" : "2ml sample");
  useEffect(() => { setSize(sampled.includes(handle) ? "50ml" : "2ml sample"); }, [handle]);
  if (!s) return <NotFound />;

  const path = `/scents/${s.handle}`;
  const fam = s.family.toLowerCase();
  const pairs = store.pairs(s);
  const isSample = size === "2ml sample";
  const whenText = s.when === "Both" ? "day or evening" : s.when.toLowerCase();

  return (
    <>
      <Seo title={`${s.name}, eau de parfum`} path={path} type="product"
        description={`${s.name}: ${s.line.toLowerCase()}. A ${s.strength.toLowerCase()} ${fam} eau de parfum for ${whenText}. Try the 2ml sample first; the price is credited against the bottle. I&A Parfums, Tooting.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "The range", path: "/range" }, { name: s.family, path: `/range/${fam}` }, { name: s.name, path }]),
          { "@context": "https://schema.org", "@type": "Product", name: s.name, description: s.story, brand: { "@type": "Brand", name: SITE.name }, category: `${s.family} eau de parfum`, color: s.colour,
            additionalProperty: [{ "@type": "PropertyValue", name: "Top notes", value: s.notes.top.join(", ") }, { "@type": "PropertyValue", name: "Heart notes", value: s.notes.heart.join(", ") }, { "@type": "PropertyValue", name: "Base notes", value: s.notes.base.join(", ") }] }]} />

      <section className="wrap grid gap-10 pb-16 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-10">
        <div className="flex flex-col gap-3">
          <div className="relative flex aspect-[4/5] items-end justify-center overflow-hidden rounded-pill bg-sage sm:aspect-[5/5] lg:aspect-[4/5]">
            <span className="label absolute left-4 top-4 text-mute">{s.family} · {s.strength} · {s.when === "Both" ? "Day and evening" : s.when}</span>
            <Bottle colour={s.colour} cap={s.cap} className="h-[76%] w-auto" title={`${s.name} bottle in ${s.line.toLowerCase()} tones`} />
            <div className="absolute bottom-4 right-4 flex items-end gap-2">
              <Vial colour={s.colour} className="h-16 w-auto" />
              <span className="label text-[11px] text-mute">2ml</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-mute">
            <span className="inline-block h-6 w-10 rounded-pill border border-ink/30" style={{ background: s.colour }} aria-hidden="true" />
            <span>Bottle colour is a stand-in for photography. Concept preview.</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · <Link to="/range" className="underline">The range</Link> · <Link to={`/range/${fam}`} className="underline">{s.family}</Link></nav>
          <div className="flex flex-col gap-2">
            <h1 className="text-[40px] sm:text-[52px]">{s.name}</h1>
            <p className="text-[18px]">{s.line}</p>
            <p className="text-sm text-mute">Eau de parfum · {s.strength} · for {whenText}</p>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="label mb-2 text-mute">Size</legend>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.filter((x) => s.sizes.includes(x)).map((x) => (
                <button key={x} type="button" aria-pressed={size === x} onClick={() => setSize(x)} className={`flex min-h-14 flex-col items-start justify-center rounded-pill border px-3 py-2 text-left ${size === x ? "border-ink bg-ink text-paper" : "border-ink hover:bg-stone"}`}>
                  <span className="text-sm">{x}</span>
                  <span className={`text-[13px] ${size === x ? "text-mute-dark" : "text-mute"}`}>£[PRICE]</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 rounded-pill border border-ink p-4">
            {isSample ? (
              <>
                <p className="flex items-center gap-3 text-[17px]"><Vial className="h-9 w-auto shrink-0" /> <span>Smell it first: £[PRICE] for 2ml, credited back against the bottle.</span></p>
                <p className="text-sm text-mute">Enough for a week of wearing. When you come back for the 50ml or 100ml, the £[PRICE] comes off. [HOW THE CREDIT IS APPLIED: code in the sample box or on your account].</p>
              </>
            ) : tried ? (
              <>
                <p className="text-[17px]">Sample credit applied: <b>−£[PRICE]</b> off the {size}.</p>
                <p className="text-sm text-mute">You told us you have tried the {s.name} sample. The credit is confirmed at checkout. [HOW THE CREDIT IS APPLIED].</p>
              </>
            ) : (
              <>
                <p className="text-[17px]">Not smelt it yet? Start with the sample.</p>
                <p className="text-sm text-mute">The £[PRICE] you pay for the 2ml comes off this {size} when you buy it. Nothing to lose by trying first.</p>
              </>
            )}
            <button type="button" aria-pressed={tried} onClick={() => { toggleSampled(s.handle); if (!tried) setSize("50ml"); }} className="chip self-start">{tried ? "I have the sample" : "I've already tried the sample"}</button>
          </div>

          <div className="flex flex-col gap-3">
            <button type="button" disabled className="btn btn-ink min-h-14 cursor-not-allowed opacity-60">Online ordering opens at launch</button>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">Smell it in Tooting · {SITE.phone}</a>
            <p className="text-center text-sm text-mute">Concept preview: sample scent. Names, notes, prices and stock come from the client at launch.</p>
          </div>

          <div className="border-t border-line">
            <details open className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">The story</summary><p className="pb-4 text-mute">{s.story}</p></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">Concentration and how long it lasts</summary><p className="pb-4 text-mute">Eau de parfum, [CONCENTRATION]% fragrance oil. {s.strength === "Light" ? "Light: sits close to the skin and softens over [HOURS] hours." : "Present: a clear trail for the first hours, then close to the skin for [HOURS] hours."} Two sprays is plenty.</p></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">Ingredients</summary><p className="pb-4 text-mute">[INGREDIENTS LIST]. [VEGAN / CRUELTY-FREE CLAIMS, IF CONFIRMED]. Keep out of sunlight and away from heat.</p></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center">Delivery and returns</summary><p className="pb-4 text-mute">[DELIVERY TERMS]. [RETURNS WINDOW ON SEALED BOTTLES]. Opened bottles: this is why the sample comes first. Confirmed with the client before launch.</p></details>
          </div>
        </div>
      </section>

      <section className="bg-sage py-16">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="label text-mute">The notes</p>
            <h2 className="text-[32px] sm:text-[40px]">What you smell at nine, at noon and at night.</h2>
            <p className="text-[17px]">Top notes are what you smell in the first half hour. The heart is the afternoon. The base is what's left on your coat the next day.</p>
            <dl className="grid gap-5 pt-2 sm:grid-cols-3">
              {([["Top", s.notes.top], ["Heart", s.notes.heart], ["Base", s.notes.base]] as const).map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 border-t border-ink pt-3">
                  <dt className="label text-mute">{k}</dt>
                  {v.map((n) => <dd key={n} className="text-[17px]">{n}</dd>)}
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-pill bg-paper p-6 sm:p-10">
            <NotesDiagram colour={s.colour} className="mx-auto w-full max-w-[420px]" />
            <p className="mt-4 text-center text-sm text-mute">Top notes: {s.notes.top.join(", ").toLowerCase()}. Heart: {s.notes.heart.join(", ").toLowerCase()}. Base: {s.notes.base.join(", ").toLowerCase()}.</p>
          </div>
        </div>
      </section>

      {pairs.length > 0 && (
        <section className="wrap pt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[32px] sm:text-[36px]">Wear it with</h2>
            <p className="max-w-md text-sm text-mute">{isDark(s.colour) ? "Layer something lighter under it, or wear these on the days it feels like too much." : "Two that sit well beside it: one to layer, one for the days it's not quite enough."}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {pairs.map((x) => <ScentCard key={x.handle} s={x} />)}
            <Link to="/discovery-set" className="flex flex-col justify-end gap-2 rounded-pill bg-stone p-5 text-left"><Vial className="h-12 w-auto" /><span className="display text-[24px]">Or all seven as samples</span><span className="text-sm text-mute">The discovery set, £[PRICE]</span></Link>
          </div>
        </section>
      )}
    </>
  );
}
