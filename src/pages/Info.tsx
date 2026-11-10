import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ScentFinder } from "../components/ScentFinder";
import { Monogram, PhotoSlot, Vial } from "../components/Art";
import { store } from "../lib/store";
import { SITE, gbp } from "../data/site";

export function FinderPage() {
  return (
    <>
      <Seo title="Scent finder" path="/scent-finder" description="Three questions: when you'll wear it, which family, how strong. We point you to one or two of the four scents and remember your answers on this device. I&A Parfums, Tooting."
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Scent finder", path: "/scent-finder" }])} />
      <ScentFinder lead>
        <div className="grid gap-x-14 gap-y-3 lg:grid-cols-[1fr_minmax(0,34rem)] lg:items-end">
          <div>
            <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link></nav>
            <h1>Three questions, then the sample.</h1>
          </div>
          <p className="t-lede">You can't smell a website, so we don't pretend. Tell us when you'll wear it, which family you lean to and how strong you like it; we point you to the closest one or two, and the 2ml sample does the rest.</p>
        </div>
      </ScentFinder>
      <section className="wrap grid gap-x-14 gap-y-12 pt-14 sm:pt-20 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex min-w-0 flex-col gap-5">
          <h2>How the families work</h2>
          <dl className="rows border-b border-ink/20" style={{ ["--term" as string]: "8rem" }}>
            {store.families().map((f) => (
              <div key={f.handle}>
                <dt className="display t-h3"><Link to={`/range/${f.handle}`} className="link min-h-0 decoration-1">{f.title}</Link></dt>
                <dd className="text-base">{f.blurb}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <h2>Light or present?</h2>
          <p className="text-base">Light scents sit within arm's reach and fade gently; they suit offices and daytime. Present scents leave a trail and last into the evening. Neither is better; the sample tells you which you are.</p>
          <Link to="/range" className="link self-start">See all four on the shelf</Link>
        </div>
      </section>
    </>
  );
}

export function OurScents() {
  return (
    <>
      <Seo title="Our scents, and how we sell them" path="/our-scents" description="How the I&A Parfums range is built: four families, top, heart and base notes, and why every scent comes as a 2ml sample before the bottle. Tooting, London."
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Our scents", path: "/our-scents" }])} />

      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid items-end gap-x-14 gap-y-8 pb-12 pt-3 lg:grid-cols-[1.5fr_1fr] lg:pb-16 lg:pt-6">
          <div className="flex flex-col gap-4">
            <nav aria-label="Breadcrumb" className="crumbs text-mute-dark"><Link to="/">Home</Link></nav>
            <h1 className="t-name text-paper">A short range, sold small first.</h1>
            <p className="t-lede max-w-[38rem]">Four scents, one in each family, and every one sold as a 2ml sample before anyone is asked to buy a bottle. The scents themselves, their names and their notes are to come from the house.</p>
          </div>
          <Monogram className="hidden h-[280px] justify-self-end text-paper/50 lg:block" />
        </div>
      </section>

      <section className="wrap grid gap-x-14 gap-y-8 py-16 sm:py-24 lg:grid-cols-[1fr_1.2fr]">
        <h2 className="t-h1">Three layers, in the order you meet them.</h2>
        <div className="flex flex-col gap-5">
          <dl className="rows border-b border-ink/20" style={{ ["--term" as string]: "7rem" }}>
            <div><dt className="display t-h3">Top</dt><dd className="text-base">The first half hour: the bright things that fly off first.</dd></div>
            <div><dt className="display t-h3">Heart</dt><dd className="text-base">The body of the scent, what you live with through the afternoon.</dd></div>
            <div><dt className="display t-h3">Base</dt><dd className="text-base">What stays, still there on your scarf the next morning.</dd></div>
          </dl>
          <p className="text-base text-mute">Every scent page will list all three in plain words. [NOTES TO COME]</p>
        </div>
      </section>

      <section id="sample" className="end-band on-ink scroll-mt-16 bg-ink py-16 text-paper sm:py-20">
        <div className="wrap grid items-center gap-x-14 gap-y-10 lg:grid-cols-[auto_1.3fr_1fr]">
          <Vial colour="#d8e2dc" dark className="hidden h-64 w-auto lg:block" />
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-paper">The sample comes first, and its price comes off the bottle.</h2>
            <p className="t-lede max-w-[36rem]">Every scent is sold as a 2ml sample. When you buy the 50ml or 100ml afterwards, online or at the counter, the sample price comes off.</p>
            <p className="text-base text-mute-dark">[HOW THE CREDIT IS APPLIED]</p>
            <Link to="/range" className="btn btn-paper mt-1">See the range</Link>
          </div>
          <div className="slip flex flex-col px-6 pb-6 pt-5" role="group" aria-label="How the sample credit reads on your order">
            <p className="voice pb-2">On your order</p>
            <p className="slip-row"><span>50ml bottle</span><span className="fig t-h3">{gbp(SITE.bottlesFrom)}</span></p>
            <p className="slip-row"><span>Your 2ml sample, already paid</span><span className="whitespace-nowrap">less £[SAMPLE PRICE]</span></p>
            <p className="pt-4 text-base text-mute">The bottle costs what it costs, less the sample you tried first.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export function Visit() {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}`)}`;
  return (
    <>
      <Seo title="Visit the shop in Tooting" path="/visit" description={`Smell every scent at the counter at ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}, or click and collect. Open ${SITE.hours}. Phone ${SITE.phone}.`}
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Visit", path: "/visit" }])} />
      <section className="bg-sage">
        <div className="wrap grid gap-x-14 gap-y-4 pb-12 pt-3 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-end lg:pb-16 lg:pt-6">
          <div>
            <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link></nav>
            <h1 className="t-name">{SITE.address.street}, {SITE.address.area}.</h1>
          </div>
          <div className="flex flex-col items-start gap-4">
            <p className="t-lede">Try every scent at the counter, take a sample home, or collect an order you placed online.</p>
            <div className="flex flex-wrap gap-3"><a href={maps} className="btn btn-ink">Open in Google Maps</a><a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost">{SITE.phone}</a></div>
          </div>
        </div>
      </section>
      <section className="wrap grid gap-x-14 gap-y-10 py-14 sm:py-20 lg:grid-cols-[1.25fr_1fr]">
        <PhotoSlot label="Photograph to come" line="The perfume counter at 84 Mitcham Road" className="min-h-[280px] lg:min-h-[420px]" />
        <dl className="rows self-center border-b border-ink/20" style={{ ["--term" as string]: "7rem" }}>
          <div><dt className="text-mute">Address</dt><dd className="display t-h3">{SITE.address.street}<br />{SITE.address.area}, {SITE.address.city}<br />{SITE.address.postcode}</dd></div>
          <div><dt className="text-mute">Open</dt><dd><span className="display t-h3">{SITE.hours}</span><br /><span className="text-base text-mute">No appointment needed. The same shop as I&amp;A Fashions, Formal and Schoolwear, in Tooting since {SITE.since}.</span></dd></div>
          <div><dt className="text-mute">Phone</dt><dd><a href={`tel:${SITE.phoneIntl}`} className="display t-h3 link min-h-11 decoration-1">{SITE.phone}</a><br /><span className="text-base text-mute">Ring to check a scent is in, or to put a sample aside.</span></dd></div>
        </dl>
      </section>
      <section className="end-band on-ink bg-ink text-paper">
        <div className="wrap grid gap-x-14 gap-y-6 py-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <h2 className="text-paper">Click and collect</h2>
          <div className="flex flex-col items-start gap-4">
            <p className="t-lede max-w-[36rem]">Order online at launch and collect from {SITE.delivery.collect}. Can't get to Tooting? Start with a 2ml sample or the discovery set.</p>
            <div className="flex flex-wrap gap-3"><Link to="/discovery-set" className="btn btn-paper">Discovery set</Link><Link to="/delivery-returns" className="btn btn-outline-paper">Delivery</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
