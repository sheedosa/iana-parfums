import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ScentFinder } from "../components/ScentFinder";
import { Bottle, Monogram, PhotoSlot, Vial } from "../components/Art";
import { store } from "../lib/store";
import { SITE } from "../data/site";

export function FinderPage() {
  const scents = store.scents();
  return (
    <>
      <Seo title="Scent finder" path="/scent-finder" description="Three questions: when you'll wear it, which family, how strong. We point you to one or two of the four scents and remember your answers on this device. I&A Parfums, Tooting."
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Scent finder", path: "/scent-finder" }])} />
      <section className="wrap flex flex-col gap-4 py-10 sm:py-14">
        <p className="label text-mute">Scent finder</p>
        <h1 className="text-[46px] sm:text-[60px]">Three questions, then the sample.</h1>
        <p className="max-w-xl text-[18px] text-mute">You can't smell a website, so we don't pretend. Tell us when you'll wear it, which family you lean to and how strong you like it; we point you to the closest one or two, and the 2ml sample does the rest.</p>
        <div className="mt-4 rounded-pill bg-sage p-5 sm:p-8"><ScentFinder /></div>
      </section>
      <section className="wrap grid gap-10 pb-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex min-w-0 flex-col gap-4">
          <h2 className="text-[34px]">How the families work</h2>
          <dl className="flex flex-col">
            {store.families().map((f) => (
              <div key={f.handle} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[120px_1fr]">
                <dt className="display text-[26px]"><Link to={`/range/${f.handle}`} className="underline">{f.title}</Link></dt>
                <dd className="text-base text-mute">{f.blurb}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <h2 className="text-[34px]">Light or present?</h2>
          <p className="text-base text-mute">Light scents sit within arm's reach and fade gently; they suit offices and daytime. Present scents leave a trail and last into the evening. Neither is better; the sample tells you which you are.</p>
          <div className="mt-2 flex h-[150px] items-end justify-around border-b border-ink" aria-hidden="true">
            {scents.map((s) => <Bottle key={s.handle} scent={s} plain className="h-full w-auto" />)}
          </div>
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
        <div className="wrap grid items-center gap-10 py-12 lg:grid-cols-[1.4fr_1fr] lg:py-16">
          <div className="flex flex-col gap-5">
            <p className="label text-sage">Our scents</p>
            <h1 className="text-[46px] text-paper sm:text-[64px]">A short range, sold small first.</h1>
            <p className="max-w-xl text-[18px] text-mute-dark">Four scents, one in each family, and every one sold as a 2ml sample before anyone is asked to buy a bottle. The scents themselves, their names and their notes are to come from the house.</p>
          </div>
          <Monogram className="hidden h-[300px] justify-self-end text-paper/50 lg:block" />
        </div>
      </section>

      <section className="wrap grid gap-10 py-16 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-4">
          <p className="label text-mute">Top, heart, base</p>
          <h2 className="text-[34px] sm:text-[44px]">Three layers, in the order you meet them.</h2>
        </div>
        <div className="flex flex-col gap-4 text-[18px]">
          <p>The top is the first half hour: the bright things that fly off first. The heart is the body of the scent, what you live with through the afternoon. The base is what stays, still there on your scarf the next morning.</p>
          <p className="text-mute">Every scent page will list all three in plain words. [NOTES TO COME]</p>
        </div>
      </section>

      <section id="sample" className="on-ink bg-ink py-16 text-paper">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[auto_1fr_auto]">
          <Vial colour="#d8e2dc" dark className="hidden h-36 w-auto lg:block" />
          <div className="flex flex-col gap-4">
            <p className="label text-sage">The sample credit</p>
            <h2 className="text-[34px] text-paper sm:text-[44px]">The sample comes first, and its price comes off the bottle.</h2>
            <p className="max-w-2xl text-[18px] text-mute-dark">Every scent is sold as a 2ml sample. When you buy the 50ml or 100ml afterwards, online or at the counter, the sample price comes off.</p>
            <p className="text-base text-mute-dark">Sample £[SAMPLE PRICE]. [HOW THE CREDIT IS APPLIED]</p>
          </div>
          <Link to="/range" className="btn btn-paper self-start lg:self-center">See the range</Link>
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
        <div className="wrap flex flex-col gap-4 py-14 sm:py-20">
          <p className="label text-mute">Visit</p>
          <h1 className="text-[46px] sm:text-[64px]">{SITE.address.street}, {SITE.address.area}.</h1>
          <p className="max-w-xl text-[18px]">Try every scent at the counter, take a sample home, or collect an order you placed online.</p>
        </div>
      </section>
      <section className="wrap grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Address</h2><p className="text-lg">{SITE.address.street}<br />{SITE.address.area}, {SITE.address.city}<br />{SITE.address.postcode}</p><a href={maps} className="inline-flex min-h-11 items-center self-start underline">Open in Google Maps</a></div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Opening hours</h2><p className="text-lg">{SITE.hours}</p><p className="text-base text-mute">No appointment needed. The same shop as I&amp;A Fashions, Formal and Schoolwear, in Tooting since {SITE.since}.</p></div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Phone</h2><a href={`tel:${SITE.phoneIntl}`} className="inline-flex min-h-11 items-center self-start text-lg underline">{SITE.phone}</a><p className="text-base text-mute">Ring to check a scent is in, or to put a sample aside.</p></div>
      </section>
      <section className="wrap grid gap-6 pb-6 lg:grid-cols-[1.3fr_1fr]">
        <PhotoSlot label="Photograph to come" line="The perfume counter at 84 Mitcham Road" className="min-h-[300px]" />
        <div className="on-ink flex flex-col justify-center gap-4 rounded-pill bg-ink p-8 text-paper"><h2 className="text-[34px] text-paper">Click and collect</h2><p className="text-base text-mute-dark">Order online at launch and collect from {SITE.delivery.collect}. Can't get to Tooting? Start with a 2ml sample or the discovery set.</p><div className="flex flex-wrap gap-3"><Link to="/discovery-set" className="btn btn-paper">Discovery set</Link><Link to="/delivery-returns" className="btn btn-outline-paper">Delivery</Link></div></div>
      </section>
    </>
  );
}
