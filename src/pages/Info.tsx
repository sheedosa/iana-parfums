import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ScentFinder } from "../components/ScentFinder";
import { Fact, Slip } from "../components/Rows";
import { useStage } from "../lib/stage";
import { store } from "../lib/store";
import { SITE, gbp } from "../data/site";

export function FinderPage() {
  return (
    <>
      <Seo title="Scent finder" path="/scent-finder" description="Three questions: when you'll wear it, which family, how strong. We point you to one or two of the four scents and remember your answers on this device. I&A Parfums, Tooting."
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Scent finder", path: "/scent-finder" }])} />
      <section className="wrap pt-6">
        <h1>The scent finder</h1>
        <p className="t-lede col mt-4">Tell us when you will wear it, which family you lean to and how strong you like it. We point you to the closest one or two of the four, and the 2ml sample does the rest.</p>
      </section>
      <ScentFinder />
      <section className="wrap flex flex-col gap-3 pt-16">
        <h2>The four families</h2>
        <dl className="max-w-[60rem]">
          {store.families().map((f) => <Fact key={f.handle} lg term={<Link to={`/range/${f.handle}`} className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-[6px]">{f.title}</Link>}>{f.blurb}</Fact>)}
        </dl>
        <h2 className="mt-10">Light or present</h2>
        <p className="col">Light scents sit within arm's reach and fade gently; they suit offices and daytime. Present scents leave a trail and last into the evening.</p>
      </section>
    </>
  );
}

export function OurScents() {
  useStage(null);
  return (
    <>
      <Seo title="Our scents, and how we sell them" path="/our-scents" description="How the I&A Parfums range is built: four families, top, heart and base notes, and why every scent comes as a 2ml sample before the bottle. Tooting, London."
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Our scents", path: "/our-scents" }])} />

      <section className="wrap flex flex-col gap-3 pt-6">
        <h1>Our scents, and how we sell them</h1>
        <p className="t-lede col mt-1">Four scents, one in each family, and every one sold as a 2ml sample before anyone is asked to buy a bottle. The scents themselves, their names and their notes are to come from the house.</p>

        <h2 className="mt-12">The layers of a scent</h2>
        <dl className="col">
          <Fact lg term="Top">The first half hour, the bright things that leave first</Fact>
          <Fact lg term="Heart">The body of the scent, through the afternoon</Fact>
          <Fact lg term="Base">What stays, still there the next morning</Fact>
        </dl>
        <p className="col text-mute">Every scent page will list all three in plain words. [NOTES TO COME]</p>

        <h2 id="sample" className="mt-12 scroll-mt-8">The sample credit</h2>
        <p className="t-lede col">Every scent is sold as a 2ml sample. When you buy the 50ml or 100ml afterwards, online or at the counter, the price of the sample comes off.</p>
        <Slip bottle={gbp(SITE.bottlesFrom)} sample="£⁠[SAMPLE PRICE]" />
        <p className="col text-mute">[HOW THE CREDIT IS APPLIED]</p>
        <Link to="/range" className="act self-start">See the range</Link>
      </section>
    </>
  );
}

export function Visit() {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}`)}`;
  useStage(null);
  return (
    <>
      <Seo title="Visit the shop in Tooting" path="/visit" description={`Smell every scent at the counter at ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}, or click and collect. Open ${SITE.hours}. Phone ${SITE.phone}.`}
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Visit", path: "/visit" }])} />
      <section className="wrap flex flex-col gap-3 pt-6">
        <h1>{SITE.address.street}, {SITE.address.area}</h1>
        <p className="t-lede col mt-1">Try every scent at the counter, take a sample home, or collect an order you placed online. No appointment is needed.</p>
        <dl className="col mt-8">
          <Fact lg term="Address">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</Fact>
          <Fact lg term="Open">{SITE.hours}</Fact>
          <Fact lg term="Phone"><a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a></Fact>
        </dl>
        <a href={maps} className="act self-start">Open in Google Maps</a>
        <p className="col text-mute">The same shop as I&amp;A Fashions, Formal and Schoolwear, in Tooting since {SITE.since}. Ring to check a scent is in, or to put a sample aside.</p>

        <h2 className="mt-12">Click and collect</h2>
        <p className="col">Order online at launch and collect from {SITE.delivery.collect}. If you can't get to Tooting, start with a 2ml sample or <Link to="/discovery-set" className="link">the discovery set</Link></p>
        <Link to="/delivery-returns" className="link self-start">Delivery and returns</Link>
      </section>
    </>
  );
}
