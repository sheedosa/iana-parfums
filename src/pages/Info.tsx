import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ScentFinder } from "../components/ScentFinder";
import { Bottle, Monogram, NotesDiagram, PhotoSlot, Vial } from "../components/Art";
import { store } from "../lib/store";
import { SITE } from "../data/site";

export function FinderPage() {
  return (
    <>
      <Seo title="Scent finder" path="/scent-finder" description="Three questions: when you'll wear it, which family, how strong. We narrow seven scents to two or three and remember your answers on this device. I&A Parfums, Tooting."
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Scent finder", path: "/scent-finder" }])} />
      <section className="wrap flex flex-col gap-5 py-12 sm:py-16">
        <p className="label text-mute">Scent finder</p>
        <h1 className="text-[44px] sm:text-[56px]">Three questions. Two or three scents.</h1>
        <p className="max-w-xl text-[17px] text-mute">You can't smell a website, so we don't pretend. Tell us when you'll wear it, which family you lean to and how strong you like it. We narrow the seven to the closest two or three; then the sample does the rest.</p>
        <div className="rounded-pill bg-sage p-6 sm:p-8"><ScentFinder /></div>
      </section>
      <section className="wrap grid gap-10 pb-6 lg:grid-cols-[1fr_1fr]">
        <div className="flex min-w-0 flex-col gap-4">
          <h2 className="text-[32px]">How the families work</h2>
          <dl className="flex flex-col">
            {store.families().map((f) => (
              <div key={f.handle} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[120px_1fr]">
                <dt className="display text-[24px]"><Link to={`/range/${f.handle}`} className="underline">{f.title}</Link></dt>
                <dd className="text-mute">{f.blurb}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <h2 className="text-[32px]">Light or present?</h2>
          <p className="text-mute">Light scents sit within arm's reach and fade gently; they suit offices and daytime. Present scents leave a trail and last into the night. Neither is better; the sample tells you which you are.</p>
          <div className="flex flex-wrap items-end gap-4 rounded-pill bg-stone p-6 sm:gap-6" aria-hidden="true">
            <Bottle colour="#e6c6ca" className="h-28 w-auto" /><span className="label text-mute">Light</span>
            <Bottle colour="#6f6561" cap="#2a2326" className="h-40 w-auto" /><span className="label text-mute">Present</span>
          </div>
        </div>
      </section>
    </>
  );
}

export function OurScents() {
  const example = store.scent("cedar-wardrobe")!;
  return (
    <>
      <Seo title="Our scents, and how we make them" path="/our-scents" description="How the I&A Parfums range is built: top, heart and base notes, small batches, the perfumer and the materials, and why every scent comes as a sample first. Tooting, London."
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Our scents", path: "/our-scents" }])} />

      <section className="on-ink rules bg-ink text-paper">
        <div className="wrap grid items-center gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:py-20">
          <div className="flex flex-col gap-5">
            <p className="label text-sage">Our scents</p>
            <h1 className="text-[44px] text-paper sm:text-[64px]">Seven scents, made slowly, sold small first.</h1>
            <p className="max-w-xl text-[18px] text-mute-dark">A short range on purpose. Each scent is built in three layers, blended by [PERFUMER] in [WHERE THE SCENTS ARE MADE], bottled in small batches, and sold as a 2ml sample before anyone is asked to buy a bottle.</p>
          </div>
          <Monogram className="hidden h-[320px] justify-self-end text-paper/40 lg:block" />
        </div>
      </section>

      <section className="wrap grid gap-10 py-16 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-4">
          <p className="label text-mute">Top, heart, base</p>
          <h2 className="text-[32px] sm:text-[40px]">Three layers, in the order you meet them.</h2>
          <p className="text-[17px]">Every scent page shows the same diagram. The top is the first half hour: citrus, herbs, the bright things that fly off first. The heart is the body of the scent, the flowers and woods you live with through the afternoon. The base is what stays: musks, resins and ambers, still there on your scarf the next morning.</p>
          <p className="text-mute">We write the notes in plain words. If a scent is mostly cedar, the page says cedar.</p>
        </div>
        <div className="rounded-pill bg-sage p-6 sm:p-10">
          <NotesDiagram colour={example.colour} className="mx-auto w-full max-w-[420px]" />
          <p className="mt-4 text-center text-sm text-mute">{example.name}: {example.notes.top.join(", ").toLowerCase()} over {example.notes.heart.join(", ").toLowerCase()} on {example.notes.base.join(", ").toLowerCase()}.</p>
        </div>
      </section>

      <section className="bg-sage py-16">
        <div className="wrap">
          <h2 className="mb-2 text-[32px] sm:text-[40px]">How a scent gets to the shelf</h2>
          <p className="mb-8 max-w-2xl text-mute">A proposed process for the page; every step is confirmed with the client and the perfumer before launch.</p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[["01", "A brief", "A place, a time of day, a material. Common at dawn started as a walk; Cedar wardrobe as a cupboard door."],
              ["02", "The blend", "[PERFUMER] builds the accord in [NUMBER] trials over [WEEKS] weeks. [HOW TRIALS ARE JUDGED, TO CONFIRM.]"],
              ["03", "Maceration", "Proposed: the blend rests in alcohol for [WEEKS] weeks before it is filtered and bottled. [MACERATION AND BOTTLING, TO CONFIRM.]"],
              ["04", "Samples first", "Proposed: each batch is drawn into 2ml vials from the same batch as the bottles. [HOW SAMPLES ARE FILLED, TO CONFIRM.]"]].map(([n, t, d]) => (
              <div key={t} className="flex flex-col gap-2 border-t border-ink pt-5"><p className="display text-[28px] text-mute">{n}</p><h3 className="text-xl">{t}</h3><p className="text-[15px] text-mute">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap grid gap-10 py-16 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-4">
          <p className="label text-mute">The perfumer and the materials</p>
          <h2 className="text-[32px] sm:text-[40px]">[PERFUMER NAME], [WHERE THEY WORK].</h2>
          <p className="text-[17px] text-mute">[PERFUMER BIOGRAPHY: training, previous houses, how they came to work with I & A.]</p>
          <p className="text-mute">Materials: [NATURALS AND SYNTHETICS USED, SOURCING]. Alcohol: [ALCOHOL BASE]. [VEGAN / CRUELTY-FREE / ALLERGEN STATEMENTS, IF CONFIRMED].</p>
        </div>
        <PhotoSlot label="the perfumer at the bench, shoulders down" className="aspect-[4/3] lg:aspect-[4/5] lg:max-w-md lg:justify-self-end" />
      </section>

      <section id="sample" className="on-ink bg-ink py-16 text-paper">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[auto_1fr_auto]">
          <Vial colour="#d8e2dc" stroke="#fbfbf9" className="h-32 w-auto" />
          <div className="flex flex-col gap-4">
            <p className="label text-sage">The sample credit</p>
            <h2 className="text-[32px] text-paper sm:text-[40px]">You can't smell a website. So the sample comes first, and it's free in the end.</h2>
            <p className="max-w-2xl text-mute-dark">Every scent is £[PRICE] as a 2ml sample. When you buy the 50ml or 100ml afterwards, online or at the counter, that £[PRICE] comes off. Buy the discovery set and £[SAMPLE CREDIT] comes off your first bottle. [HOW THE CREDIT IS APPLIED: code in the box, on your account, or at the till.]</p>
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
      <Seo title="Visit the shop in Tooting" path="/visit" description={`Smell every scent at the counter at ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}. Open ${SITE.hours}. Phone ${SITE.phone}.`}
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Visit", path: "/visit" }])} />
      <section className="rules-ink bg-sage">
        <div className="wrap flex flex-col gap-4 py-16 sm:py-20">
          <p className="label text-mute">Visit</p>
          <h1 className="text-[44px] sm:text-[64px]">{SITE.address.street}, {SITE.address.area}.</h1>
          <p className="max-w-xl text-[18px]">Every scent is on the counter with blotters. Try them on skin, take a sample home, or bring your sample box back for the credit.</p>
        </div>
      </section>
      <section className="wrap grid gap-10 py-14 md:grid-cols-3">
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Address</h2><p className="text-lg">{SITE.address.street}<br />{SITE.address.area}, {SITE.address.city}<br />{SITE.address.postcode}</p><a href={maps} className="inline-flex min-h-11 items-center underline">Open in Google Maps</a></div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Opening hours</h2><p className="text-lg">{SITE.hours}</p><p className="text-mute">No appointment needed. The same shop as I&amp;A Fashions, Tailoring and Schoolwear, in Tooting since {SITE.since}.</p></div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Phone</h2><a href={`tel:${SITE.phoneIntl}`} className="inline-flex min-h-11 items-center text-lg underline">{SITE.phone}</a><p className="text-mute">Ring to check a scent is in stock, or to put a sample aside.</p></div>
      </section>
      <section className="wrap grid gap-6 pb-6 lg:grid-cols-[1fr_1fr]">
        <PhotoSlot label="the perfume counter, bottles and blotters" className="aspect-[16/9]" />
        <div className="on-ink flex flex-col justify-center gap-4 rounded-pill bg-ink p-8 text-paper"><h2 className="text-[32px] text-paper">Can't get to Tooting?</h2><p className="text-mute-dark">Start with the 2ml sample or the discovery set. The credit works online just the same.</p><div className="flex flex-wrap gap-3"><Link to="/discovery-set" className="btn btn-paper">Discovery set</Link><Link to="/scent-finder" className="btn btn-outline-paper">Find my scent</Link></div></div>
      </section>
    </>
  );
}
