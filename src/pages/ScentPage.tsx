import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ScentCard } from "../components/ScentCard";
import { Bottle, DiscoveryBox, Vial } from "../components/Art";
import { NotFound } from "./NotFound";
import { fullName, priceText, store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE, SIZES, gbp, type Size } from "../data/site";

export function DeliveryRows({ className = "" }: { className?: string }) {
  const d = SITE.delivery;
  const rows: [string, string][] = [
    ["Standard", `${gbp(d.standard.price)}, ${d.standard.time}`],
    ["Express", `${gbp(d.express.price)}, ${d.express.time}`],
    ["Free delivery", `On orders of ${gbp(d.freeOver)} and over`],
    ["Click and collect", `From ${d.collect}`],
    ["Returns", `${SITE.returns.days} days. Opened bottles: [TO CONFIRM]`],
  ];
  return (
    <dl className={`grid text-base ${className}`}>
      {rows.map(([k, v]) => <div key={k} className="grid grid-cols-[9.5rem_1fr] gap-3 border-b border-line py-2.5"><dt className="text-mute">{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

export function ScentPage() {
  const { handle = "" } = useParams();
  const s = store.scent(handle);
  const { sampled, toggleSampled } = usePrefs();
  const tried = sampled.includes(handle);
  const [size, setSize] = useState<Size>(tried ? "50ml" : "2ml sample");
  useEffect(() => { setSize(sampled.includes(handle) ? "50ml" : "2ml sample"); }, [handle]);
  if (!s) return <NotFound />;

  const name = fullName(s);
  const path = `/scents/${s.handle}`;
  const fam = s.family.toLowerCase();
  const pairs = store.pairs(s);
  const isSample = size === "2ml sample";
  const whenText = s.when === "Both" ? "day or evening" : s.when.toLowerCase();

  return (
    <>
      <Seo title={`${name}, eau de parfum`} path={path} type="product"
        description={`${name}: a ${s.strength.toLowerCase()} ${fam} eau de parfum for ${whenText}, from I & A Parfums in Tooting. Try the 2ml sample first; bottles from ${gbp(SITE.bottlesFrom)}.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "The range", path: "/range" }, { name: s.family, path: `/range/${fam}` }, { name, path }]),
          { "@context": "https://schema.org", "@type": "Product", name, description: `A ${fam} eau de parfum. Concept preview: sample scent.`, brand: { "@type": "Brand", name: SITE.name }, category: `${s.family} eau de parfum`, color: s.colour }]} />

      <section className="wrap grid gap-x-14 gap-y-6 pb-16 pt-5 lg:grid-cols-[1.1fr_1fr] lg:pt-10">
        {/* Headline and price first in the reading order, so they lead on phones; on desktop they sit right of the bottle. */}
        <div className="flex flex-col gap-2 lg:col-start-2 lg:row-start-1">
          <nav aria-label="Breadcrumb" className="crumbs text-[15px] text-mute"><Link to="/">Home</Link> · <Link to="/range">The range</Link> · <Link to={`/range/${fam}`}>{s.family}</Link></nav>
          <h1 className="text-[44px] sm:text-[60px]">{name}</h1>
          <p className="text-[18px]">{s.family} eau de parfum · {s.strength} · for {whenText}</p>
          <p className="label text-mute">Sample scent · working name</p>
          <p className="text-[18px]"><b>2ml sample £[SAMPLE PRICE]</b> <span className="text-mute">· 50ml {gbp(s.prices["50ml"])} · 100ml {gbp(s.prices["100ml"])}</span></p>
        </div>

        <div className="relative flex h-[300px] items-end justify-center overflow-hidden rounded-pill bg-sage px-6 pt-8 sm:h-[420px] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start lg:h-[min(720px,calc(100vh-7rem))]">
          <span className="label absolute left-4 top-4 text-mute">{s.family} · {s.strength}</span>
          <span className="absolute inset-x-0 bottom-0 h-[7%] border-t border-ink/25 bg-[#cdd8d2]" aria-hidden="true" />
          <div className="relative flex h-[90%] w-full items-end justify-center gap-[4%]">
            <Bottle scent={s} className="h-full w-auto max-w-[70%]" title={`${name}: the bottle, with the scent's name on the label`} />
            <Vial colour={s.colour} className="h-[30%] w-auto" />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-2">
          <fieldset className="flex flex-col gap-3">
            <legend className="label mb-2 text-mute">Size</legend>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.filter((x) => s.sizes.includes(x)).map((x) => (
                <button key={x} type="button" aria-pressed={size === x} onClick={() => setSize(x)} className={`flex min-h-14 flex-col items-start justify-center rounded-pill border px-3 py-2 text-left ${size === x ? "border-ink bg-ink text-paper" : "border-ink hover:bg-stone"}`}>
                  <span className="text-base">{x === "2ml sample" ? "2ml sample" : x}</span>
                  <span className={`text-[14px] ${size === x ? "text-mute-dark" : "text-mute"}`}>{x === "2ml sample" ? "£[PRICE]" : priceText(s, x)}</span>
                </button>
              ))}
            </div>
            <p className="text-[14px] text-mute">Bottle prices are samples for this preview; bottles from {gbp(SITE.bottlesFrom)} is confirmed.</p>
          </fieldset>

          <div className="flex flex-col gap-3 rounded-pill border border-ink p-5">
            {isSample ? (
              <p className="flex items-center gap-4 text-[18px]"><Vial colour={s.colour} className="h-12 w-auto shrink-0" /><span>Buy the 2ml and wear it for a few days. If you buy the bottle, the sample price comes off.</span></p>
            ) : tried ? (
              <p className="text-[18px]">Sample credit: the 2ml price comes off the {size}.</p>
            ) : (
              <p className="text-[18px]">Not smelt it yet? Start with the 2ml; its price comes off this {size} later.</p>
            )}
            <p className="text-base text-mute">[HOW THE CREDIT IS APPLIED]</p>
            <button type="button" aria-pressed={tried} onClick={() => { toggleSampled(s.handle); if (!tried) setSize("50ml"); }} className="chip self-start">{tried ? "I have the sample" : "I've already tried the sample"}</button>
          </div>

          <div className="flex flex-col gap-3">
            <button type="button" disabled className="btn min-h-14">Online ordering opens at launch</button>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">Smell it in Tooting · {SITE.phone}</a>
            <p className="text-center text-[14px] text-mute">Concept preview: sample scent.</p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="label font-sans text-mute">Delivery and returns</h2>
            <DeliveryRows />
            <Link to="/delivery-returns" className="inline-flex min-h-11 items-center self-start underline underline-offset-4">Delivery and returns in full</Link>
          </div>
        </div>
      </section>

      <section className="bg-sage py-14">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <div className="flex flex-col gap-3">
            <p className="label text-mute">The notes</p>
            <h2 className="text-[34px] sm:text-[44px]">Top, heart and base.</h2>
          </div>
          <div className="flex flex-col gap-3 border-t border-ink pt-4">
            <p className="text-[18px]">[NOTES TO COME]</p>
            <p className="text-base text-mute">The top is the first half hour, the heart is the afternoon, the base is what's left on your coat the next day. Each scent page will list all three in plain words.</p>
          </div>
        </div>
      </section>

      {pairs.length > 0 && (
        <section className="wrap pt-16">
          <h2 className="mb-6 text-[34px] sm:text-[40px]">Wear it with</h2>
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.3fr]">
            {pairs.map((x) => <ScentCard key={x.handle} s={x} />)}
            <Link to="/discovery-set" className="group flex flex-col justify-between gap-4 rounded-pill bg-ink p-6 text-paper sm:col-span-2 lg:col-span-1">
              <DiscoveryBox dark scents={store.scents()} className="w-full" />
              <span className="flex flex-col gap-1"><span className="display text-[28px] group-hover:underline">Or all four as samples</span><span className="text-base text-mute-dark">The discovery set, £[SET PRICE]</span></span>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
