import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ScentFinder } from "../components/ScentFinder";
import { Bottle, DiscoveryBox, GiftBox, HeroStill, SeasonalBox, Vial } from "../components/Art";
import { fullName, store } from "../lib/store";
import { SITE, gbp } from "../data/site";

export function Home() {
  const scents = store.scents();
  const hero = store.scent("no-3-woody") ?? scents[0];
  return (
    <>
      <Seo title="Smell it first. Eau de parfum from Tooting" path="/" description={`Eau de parfum from I & A in Tooting, London. Every scent comes as a 2ml sample before the bottle, and bottles start at ${gbp(SITE.bottlesFrom)}. Discovery set, gift box and a seasonal edition.`} />

      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid items-center gap-6 py-8 sm:py-12 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:py-16">
          <div className="flex max-w-xl flex-col gap-4 sm:gap-5">
            <p className="label text-sage">Eau de parfum · Tooting, London</p>
            <h1 className="text-[52px] text-paper sm:text-[80px]">Smell it first.</h1>
            <p className="max-w-md text-[18px] text-mute-dark">Every scent comes as a 2ml sample before the bottle. Wear it for a few days; if you buy the bottle, the sample price comes off.</p>
            <p className="label text-sage">Bottles from {gbp(SITE.bottlesFrom)} · Sample £[SAMPLE PRICE]</p>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Link to="/range" className="btn btn-paper">See the four scents</Link>
              <Link to="/discovery-set" className="btn btn-outline-paper">All four as samples</Link>
            </div>
          </div>
          <HeroStill scent={hero} className="mx-auto w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[520px] lg:justify-self-end" />
        </div>
      </section>

      <section id="finder" className="bg-sage py-12 sm:py-16">
        <div className="wrap flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="label text-mute">Scent finder</p>
            <h2 className="text-[34px] sm:text-[44px]">Not sure where to start? Three questions.</h2>
          </div>
          <ScentFinder />
        </div>
      </section>

      <section className="on-ink bg-ink py-16 text-paper sm:py-20">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2"><p className="label text-sage">The shelf</p><h2 className="text-[34px] text-paper sm:text-[48px]">Four families, one scent in each.</h2></div>
            <Link to="/range" className="label inline-flex min-h-11 items-center text-paper underline">The range</Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-0">
            {scents.map((s) => (
              <li key={s.handle} className="flex flex-col">
                <Link to={`/scents/${s.handle}`} className="lift group flex flex-col gap-3">
                  <span className="flex h-[190px] items-end justify-center border-b border-paper/60 sm:h-[300px]"><Bottle scent={s} dark className="h-full w-full" /></span>
                  <span className="display text-[26px] leading-tight text-paper group-hover:underline">{fullName(s)}</span>
                  <span className="-mt-2 text-base text-mute-dark">{s.strength}, {s.when === "Both" ? "day or evening" : s.when.toLowerCase()}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl text-base text-mute-dark">Names, notes and stories are to come from the house; these four are placeholders in the shape of the range. [NOTES TO COME]</p>
        </div>
      </section>

      <section className="wrap grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[auto_1fr] lg:gap-20">
        <Vial colour="#c8a98d" className="hidden h-[300px] w-auto lg:block" />
        <div className="flex max-w-3xl flex-col gap-6">
          <p className="label text-mute">How the sample works</p>
          <h2 className="text-[34px] sm:text-[48px]">You can't smell a website. So the sample comes first.</h2>
          <div className="grid gap-6 text-[18px] sm:grid-cols-2">
            <p>Choose a scent and we send it as a 2ml vial, £[SAMPLE PRICE]. Wear it on skin, at work and in the evening: a perfume at noon is not the perfume at nine.</p>
            <p>If it's the one, buy the 50ml or 100ml and the sample price comes off. If it isn't, you've spent the price of a sample, not a bottle.</p>
          </div>
          <Link to="/our-scents#sample" className="inline-flex min-h-11 items-center self-start underline underline-offset-4">How the sample credit works</Link>
        </div>
      </section>

      <section className="bg-sage py-16 sm:py-20">
        <div className="wrap grid min-w-0 items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col gap-5">
            <p className="label text-mute">Discovery set</p>
            <h2 className="text-[34px] sm:text-[48px]">All four, 2ml each, in one box.</h2>
            <p className="text-[18px]">The whole range as samples, with a card to note what you thought of each. Wear a different one each day, then come back for the bottle.</p>
            <p className="text-base text-mute">Set price £[SET PRICE].</p>
            <Link to="/discovery-set" className="btn btn-ink self-start">The discovery set</Link>
          </div>
          <DiscoveryBox scents={scents} className="w-full max-w-[560px] justify-self-center" />
        </div>
      </section>

      <section className="wrap grid gap-6 py-16 sm:py-20 lg:grid-cols-[1.25fr_1fr]">
        <Link to="/gift-box" className="group grid items-center gap-6 rounded-pill border border-ink p-6 sm:grid-cols-[1fr_1.1fr] sm:p-8">
          <div className="flex flex-col gap-3">
            <p className="label text-mute">For someone else</p>
            <h2 className="text-[32px] group-hover:underline sm:text-[40px]">The gift box</h2>
            <p className="text-base">A bottle from the range, boxed for giving.</p>
            <p className="text-base text-mute">Price £[GIFT BOX PRICE]</p>
          </div>
          <GiftBox scent={scents[1]} className="w-full" />
        </Link>
        <Link to="/seasonal-edition" className="on-ink group flex flex-col justify-between gap-6 rounded-pill bg-ink p-6 text-paper sm:p-8">
          <SeasonalBox dark scent={{ name: "", family: "Fresh", colour: "#c9b6c7", cap: "#45353a" }} className="w-full max-w-[380px]" />
          <div className="flex flex-col gap-3">
            <p className="label text-sage">Coming soon</p>
            <h2 className="text-[32px] text-paper group-hover:underline sm:text-[40px]">The seasonal edition</h2>
            <p className="text-base text-mute-dark">A scent for the season, sent a few times a year. Register your interest.</p>
          </div>
        </Link>
      </section>

      <section className="wrap flex flex-wrap items-center justify-between gap-6 border-t border-line pt-12">
        <div className="flex max-w-xl flex-col gap-2">
          <p className="label text-mute">The shop</p>
          <h2 className="text-[34px] sm:text-[40px]">{SITE.address.street}, {SITE.address.area}.</h2>
          <p className="text-base text-mute">Open {SITE.hours}. Try every scent at the counter, or click and collect your order. Part of the I&amp;A family, in Tooting since {SITE.since}.</p>
        </div>
        <div className="flex flex-wrap gap-3"><Link to="/visit" className="btn btn-ink">Visit the shop</Link><a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">{SITE.phone}</a></div>
      </section>
    </>
  );
}
