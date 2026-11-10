import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ScentFinder } from "../components/ScentFinder";
import { Bottle, DiscoveryBox, GiftBox, SeasonalBox, Vial, mix } from "../components/Art";
import { VLink, bottleVT } from "../components/VLink";
import { usePrefs } from "../lib/prefs";
import { findScents, fullName, store, type Scent } from "../lib/store";
import { SITE, gbp } from "../data/site";

const whenText = (s: Scent) => (s.when === "Both" ? "day or evening" : s.when.toLowerCase());

/** The hero is the range: four bottles on one shelf. Choose one and it steps forward, the ground takes its tint
    and its details read beside it. Opens on your finder pick if you have one. */
function Shelf({ scents }: { scents: Scent[] }) {
  const { answers } = usePrefs();
  const pick = answers ? findScents(answers)[0]?.handle : undefined;
  const [handle, setHandle] = useState(pick ?? "common");
  const s = scents.find((x) => x.handle === handle) ?? scents[0];
  return (
    <section className="tint on-ink overflow-hidden text-paper" style={{ backgroundColor: mix("#45353a", s.colour, 0.09) }}>
      <div className="wrap flex flex-col pb-10 pt-8 sm:pt-12 lg:pb-14">
        <h1 className="t-hero text-paper">Smell it first.</h1>
        <div className="mt-5 grid gap-x-14 gap-y-6 lg:-mt-8 lg:grid-cols-[minmax(0,21rem)_1fr] lg:items-end">
          <div className="flex flex-col gap-6">
            <p className="t-lede text-paper/85">Every scent comes as a 2ml sample before the bottle. Wear it for a few days; if you buy the bottle, the sample price comes off.</p>
            <div className="hidden flex-col gap-3 lg:flex">
              <Link to="/range" className="btn btn-paper">See the four scents</Link>
              <Link to="/discovery-set" className="btn btn-outline-paper">All four as samples</Link>
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
            <div role="group" aria-label="Choose a scent" className="flex h-[clamp(140px,24vw,310px)] items-end border-b border-paper/70">
              {scents.map((x, i) => (
                <button key={x.handle} type="button" aria-pressed={x.handle === s.handle} aria-label={`${fullName(x)}, ${x.family.toLowerCase()}`} onClick={() => setHandle(x.handle)}
                  className="shelf-btn rise h-full" style={{ ["--i" as string]: i }}>
                  <span className="flex h-full w-full items-end" style={bottleVT(x.handle)}><Bottle scent={x} dark /></span>
                </button>
              ))}
            </div>
            <div key={s.handle} className="swap flex flex-wrap items-end justify-between gap-x-8 gap-y-4 pt-5" aria-live="polite">
              <div className="flex flex-col gap-1">
                <p className="display text-[clamp(2.25rem,4vw,3.5rem)] leading-none text-paper">{fullName(s)}</p>
                <p className="voice text-paper/85">{s.family}, {s.strength.toLowerCase()}, for {whenText(s)}</p>
                <p className="text-base text-paper/75">A working name. 2ml sample £[SAMPLE PRICE], 50ml {gbp(s.prices["50ml"])}.</p>
              </div>
              <VLink to={`/scents/${s.handle}`} className="btn btn-paper">Open {fullName(s)}</VLink>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:hidden">
          <Link to="/range" className="btn btn-outline-paper">See the four scents</Link>
          <Link to="/discovery-set" className="btn btn-outline-paper">All four as samples</Link>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  const scents = store.scents();
  return (
    <>
      <Seo title="Smell it first. Eau de parfum from Tooting" path="/" description={`Eau de parfum from I & A in Tooting, London. Every scent comes as a 2ml sample before the bottle, and bottles start at ${gbp(SITE.bottlesFrom)}. Discovery set, gift box and a seasonal edition.`} />

      <Shelf scents={scents} />

      <section className="wrap grid items-start gap-x-14 gap-y-10 py-16 sm:py-24 lg:grid-cols-[auto_1.2fr_1fr]">
        <Vial colour="#c8a98d" className="hidden h-[340px] w-auto lg:block" />
        <div className="flex flex-col gap-6">
          <h2 className="t-h1">You can't smell a website. So the sample comes first.</h2>
          <p className="t-lede max-w-[34rem]">Choose a scent and we send it as a 2ml vial. Wear it on skin, at work and in the evening: a perfume at noon is not the perfume at nine.</p>
          <p className="t-lede max-w-[34rem]">If it's the one, buy the bottle and the sample price comes off. If it isn't, you've spent the price of a sample, not a bottle.</p>
          <Link to="/our-scents#sample" className="inline-flex min-h-11 items-center self-start underline underline-offset-4">How the sample credit works</Link>
        </div>
        <div className="slip flex flex-col px-6 pb-6 pt-5 lg:mt-3" role="group" aria-label="How the sample credit reads on your order">
          <p className="voice pb-2">On your order</p>
          <p className="slip-row"><span>50ml bottle</span><span className="display text-[26px]">{gbp(SITE.bottlesFrom)}</span></p>
          <p className="slip-row"><span>Your 2ml sample, already paid</span><span className="whitespace-nowrap">less £[SAMPLE PRICE]</span></p>
          <p className="pt-4 text-base text-mute">The bottle costs what it costs, less the sample you tried first.</p>
        </div>
      </section>

      <section id="finder" className="bg-sage py-14 sm:py-20">
        <div className="wrap flex flex-col gap-8">
          <h2 className="t-h2">Not sure where to start? Three questions.</h2>
          <ScentFinder />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="wrap grid min-w-0 items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col gap-5">
            <h2 className="t-h1">All four, 2ml each, in one box.</h2>
            <p className="t-lede">The whole range as samples, with a card to note what you thought of each. Wear a different one each day, then come back for the bottle.</p>
            <p className="text-base text-mute">Set price £[SET PRICE].</p>
            <Link to="/discovery-set" className="btn btn-ink self-start">The discovery set</Link>
          </div>
          <DiscoveryBox scents={scents} className="w-full max-w-[560px] justify-self-center" />
        </div>
      </section>

      <section className="wrap grid gap-6 pb-16 sm:pb-24 lg:grid-cols-[1.25fr_1fr]">
        <Link to="/gift-box" className="group grid items-center gap-6 rounded-pill bg-sage p-6 sm:grid-cols-[1fr_1.1fr] sm:p-8">
          <div className="flex flex-col gap-3">
            <h2 className="t-h2 group-hover:underline">The gift box</h2>
            <p className="voice text-mute">For someone else</p>
            <p className="text-base">A bottle from the range, boxed for giving.</p>
            <p className="text-base text-mute">Price £[GIFT BOX PRICE]</p>
          </div>
          <GiftBox scent={scents[1]} className="w-full" />
        </Link>
        <Link to="/seasonal-edition" className="on-ink group flex flex-col justify-between gap-6 rounded-pill bg-ink p-6 text-paper sm:p-8">
          <SeasonalBox dark scent={{ name: "", family: "Fresh", colour: "#c9b6c7", cap: "#45353a" }} className="w-full max-w-[380px]" />
          <div className="flex flex-col gap-3">
            <h2 className="t-h2 text-paper group-hover:underline">The seasonal edition</h2>
            <p className="voice text-sage">Coming soon</p>
            <p className="text-base text-mute-dark">A scent for the season, sent a few times a year. Register your interest.</p>
          </div>
        </Link>
      </section>

      <section className="wrap flex flex-wrap items-center justify-between gap-6 border-t border-line pt-12">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="t-h2">{SITE.address.street}, {SITE.address.area}.</h2>
          <p className="text-base text-mute">Open {SITE.hours}. Try every scent at the counter, or click and collect your order. Part of the I&amp;A family, in Tooting since {SITE.since}.</p>
        </div>
        <div className="flex flex-wrap gap-3"><Link to="/visit" className="btn btn-ink">Visit the shop</Link><a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">{SITE.phone}</a></div>
      </section>
    </>
  );
}
