import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ScentCard, whenText } from "../components/ScentCard";
import { StickyBar } from "../components/StickyBar";
import { Bottle, DiscoveryBox, Vial, mix } from "../components/Art";
import { bottleVT } from "../components/VLink";
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

const NOTES: [string, string][] = [
  ["Top", "The first half hour."],
  ["Heart", "The afternoon."],
  ["Base", "What's left on your coat the next day."],
];

export function ScentPage() {
  const { handle = "" } = useParams();
  const s = store.scent(handle);
  const { sampled, toggleSampled } = usePrefs();
  const tried = sampled.includes(handle);
  const [size, setSize] = useState<Size>(tried ? "50ml" : "2ml sample");
  useEffect(() => { setSize(sampled.includes(handle) ? "50ml" : "2ml sample"); }, [handle]);
  const actions = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  if (!s) return <NotFound />;

  const name = fullName(s);
  const path = `/scents/${s.handle}`;
  const fam = s.family.toLowerCase();
  const pairs = store.pairs(s);
  const isSample = size === "2ml sample";
  const when = whenText(s);
  const tint = mix("#fbfbf9", s.colour, 0.3);

  return (
    <>
      <Seo title={`${name}, eau de parfum`} path={path} type="product"
        description={`${name}: a ${s.strength.toLowerCase()} ${fam} eau de parfum for ${when}, from I & A Parfums in Tooting. Try the 2ml sample first; bottles from ${gbp(SITE.bottlesFrom)}.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "The range", path: "/range" }, { name: s.family, path: `/range/${fam}` }, { name, path }]),
          { "@context": "https://schema.org", "@type": "Product", name, description: `A ${fam} eau de parfum. Concept preview: sample scent.`, brand: { "@type": "Brand", name: SITE.name }, category: `${s.family} eau de parfum`, color: s.colour }]} />

      {/* The page takes the scent's tint. Name and price lead; the stage shows what the chosen size is. */}
      <section style={{ backgroundColor: tint }}>
        <div className="wrap grid gap-x-12 gap-y-6 pb-12 pt-3 lg:grid-cols-[1.15fr_1fr] lg:pb-16 lg:pt-6">
          <div className="flex min-w-0 flex-col gap-2">
            <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link>, <Link to="/range">the range</Link>, <Link to={`/range/${fam}`}>{fam}</Link></nav>
            <h1 className="t-name">{name}</h1>
            <p className="voice">{s.family} eau de parfum. {s.strength}, for {when}.</p>
            <p className="text-base lg:hidden">2ml sample first, £[SAMPLE PRICE]. Bottles from {gbp(s.prices["50ml"])}.</p>
            <div className="relative mt-4 flex h-[clamp(210px,50vw,380px)] grow items-end justify-center gap-[5%] border-b border-ink px-4 lg:min-h-[400px]" role="img" aria-label={`${name}: ${isSample ? "the 2ml sample vial, with the bottle behind it" : `the ${size} bottle, with its 2ml sample beside it`}`}>
              <span className="stage-item flex h-[96%] items-end" style={{ ...bottleVT(s.handle), transform: `scale(${isSample ? 0.72 : size === "50ml" ? 0.86 : 1})`, opacity: isSample ? 0.55 : 1 }}>
                <Bottle scent={s} className="h-full w-auto" />
              </span>
              <span className="stage-item flex h-[96%] items-end" style={{ transform: `scale(${isSample ? 0.82 : 0.36})`, opacity: isSample ? 1 : 0.8 }}>
                <Vial colour={s.colour} className="h-full w-auto" />
              </span>
            </div>
          </div>

          <div ref={panel} className="flex scroll-mt-20 flex-col gap-5 rounded-pill bg-paper p-5 sm:p-7">
            <fieldset className="flex flex-col gap-3">
              <legend className="label mb-2 text-mute">Size</legend>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.filter((x) => s.sizes.includes(x)).map((x) => (
                  <button key={x} type="button" aria-pressed={size === x} onClick={() => setSize(x)} className={`flex min-h-14 flex-col items-center justify-center rounded-pill border px-3 py-2 text-base leading-tight transition-colors duration-150 ${size === x ? "border-ink bg-ink text-paper" : "border-ink hover:bg-stone"}`}>
                    <span>{x === "2ml sample" ? "2ml" : x}</span>
                    <span className={`t-small ${size === x ? "text-mute-dark" : "text-mute"}`}>{x === "2ml sample" ? "sample" : "bottle"}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div key={size} className="swap flex flex-col gap-1 border-y border-line py-4" aria-live="polite">
              {isSample ? (
                <>
                  <p className="t-lede"><b>2ml sample, £[SAMPLE PRICE]</b></p>
                  <p className="text-base text-mute">Wear it for a few days. If you buy the bottle, the sample price comes off.</p>
                </>
              ) : (
                <>
                  <p className="flex flex-wrap items-baseline gap-x-3"><span className="fig t-h1">{priceText(s, size)}</span><span className="text-base text-mute">{size}, a sample price for this preview</span></p>
                  <p className="text-base text-mute">{tried ? `Your sample credit: the 2ml price comes off this ${size}.` : `Not smelt it yet? Start with the 2ml; its price comes off this ${size} later.`}</p>
                </>
              )}
              <p className="text-base text-mute">[HOW THE CREDIT IS APPLIED]</p>
            </div>

            <button type="button" aria-pressed={tried} onClick={() => { toggleSampled(s.handle); if (!tried) setSize("50ml"); }} className="chip self-start">{tried ? "I have the sample" : "I've already tried the sample"}</button>

            <div ref={actions} className="mt-auto flex flex-col gap-3">
              <button type="button" disabled className="btn min-h-14">Online ordering opens at launch</button>
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink">Smell it in Tooting, {SITE.phone}</a>
              <p className="t-small text-center text-mute">Concept preview: a sample scent with a working name. Bottles from {gbp(SITE.bottlesFrom)} is confirmed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-x-14 gap-y-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col gap-6">
          <h2>Top, heart and base.</h2>
          <dl className="grid gap-x-8 sm:grid-cols-3">
            {NOTES.map(([k, t]) => (
              <div key={k} className="flex flex-col gap-1 border-t border-ink py-4">
                <dt className="display t-h3">{k}</dt>
                <dd className="text-base text-mute">{t}</dd>
                <dd className="pt-2 text-base">[NOTES TO COME]</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="t-h3">Delivery and returns</h2>
          <DeliveryRows />
          <Link to="/delivery-returns" className="link self-start">Delivery and returns in full</Link>
        </div>
      </section>

      {pairs.length > 0 && (
        <section className="wrap border-t border-line pt-14">
          <h2 className="mb-8">Wear it with</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-[1fr_1fr_1.35fr]">
            {pairs.map((x) => <ScentCard key={x.handle} s={x} />)}
            <Link to="/discovery-set" className="on-ink group flex flex-col justify-between gap-6 rounded-pill bg-ink p-6 text-paper col-span-2 sm:p-8 lg:col-span-1">
              <DiscoveryBox dark scents={store.scents()} className="w-full" />
              <span className="flex flex-col gap-1"><span className="display t-h3 underline-offset-4 group-hover:underline">Or all four as samples</span><span className="text-base text-mute-dark">The discovery set, £[SET PRICE]</span></span>
            </Link>
          </div>
        </section>
      )}

      <StickyBar watch={actions} label="Your size">
        <button type="button" onClick={() => panel.current?.scrollIntoView({ block: "start" })} className="flex min-h-11 min-w-0 flex-1 flex-col items-start justify-center text-left leading-tight">
          <span className="max-w-full truncate font-medium underline decoration-1 underline-offset-4">{isSample ? "2ml sample" : `${size} bottle`}</span>
          <span className="max-w-full truncate text-[16px] text-mute">{priceText(s, size)}</span>
          <span className="sr-only">Change size</span>
        </button>
        <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink shrink-0 px-5">Call the shop</a>
      </StickyBar>
    </>
  );
}
