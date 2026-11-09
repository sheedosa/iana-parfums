import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { GiftBox, SeasonalBox } from "../components/Art";
import { DeliveryRows } from "./ScentPage";
import { fullName, store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE, gbp } from "../data/site";

export function GiftBoxPage() {
  const scents = store.scents();
  const [handle, setHandle] = useState(scents[1]?.handle ?? scents[0].handle);
  const [size, setSize] = useState<"50ml" | "100ml">("50ml");
  const s = store.scent(handle) ?? scents[0];
  return (
    <>
      <Seo title="The gift box" path="/gift-box" type="product"
        description={`A bottle from the I&A Parfums range, boxed for giving. Choose the scent and the size; bottles from ${gbp(SITE.bottlesFrom)}. Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Gift box", path: "/gift-box" }]),
          { "@context": "https://schema.org", "@type": "Product", name: "Gift box", description: "A bottle from the range, boxed for giving. Concept preview: sample product.", brand: { "@type": "Brand", name: SITE.name }, category: "Fragrance gift set" }]} />

      <section className="wrap grid items-center gap-8 pb-14 pt-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pt-10">
        <div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1">
          <nav aria-label="Breadcrumb" className="crumbs text-[15px] text-mute"><Link to="/">Home</Link> · Gift box</nav>
          <h1 className="text-[46px] sm:text-[64px]">The gift box</h1>
          <p className="text-[18px]">A bottle from the range, boxed for giving. Choose the scent and the size; the band on the box carries its name.</p>
          <p className="text-[18px]"><b>{fullName(s)}, {size}: {gbp(s.prices[size])}</b> <span className="text-mute">+ box £[GIFT BOX PRICE]</span></p>
        </div>
        <div className="rounded-pill bg-sage p-6 sm:p-10 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <GiftBox scent={s} className="w-full" />
        </div>
        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-2">
          <fieldset>
            <legend className="label mb-3 text-mute">Scent</legend>
            <div className="flex flex-wrap gap-2">{scents.map((x) => <button key={x.handle} type="button" className="chip" aria-pressed={x.handle === handle} onClick={() => setHandle(x.handle)}>{fullName(x)}</button>)}</div>
          </fieldset>
          <fieldset>
            <legend className="label mb-3 text-mute">Size</legend>
            <div className="flex flex-wrap gap-2">{(["50ml", "100ml"] as const).map((x) => <button key={x} type="button" className="chip" aria-pressed={x === size} onClick={() => setSize(x)}>{x} · {gbp(s.prices[x])}</button>)}</div>
          </fieldset>
          <p className="text-base text-mute">Bottle prices are samples for this preview; bottles from {gbp(SITE.bottlesFrom)} is confirmed. What comes in the box: [GIFT BOX CONTENTS TO CONFIRM]</p>
          <button type="button" disabled className="btn min-h-14">Online ordering opens at launch</button>
          <Link to="/discovery-set" className="inline-flex min-h-11 items-center self-start underline underline-offset-4">Not sure which? Give the discovery set</Link>
        </div>
      </section>

      <section className="wrap">
        <h2 className="label mb-2 font-sans text-mute">Delivery and returns</h2>
        <DeliveryRows className="max-w-2xl" />
      </section>
    </>
  );
}

export function SeasonalEdition() {
  const { interest, setInterest } = usePrefs();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const submit = (e: FormEvent) => { e.preventDefault(); if (!email.trim()) return; setInterest({ name: name.trim(), email: email.trim(), at: new Date().toISOString() }); };
  return (
    <>
      <Seo title="The seasonal edition" path="/seasonal-edition"
        description="A scent for the season, sent a few times a year. The I&A Parfums seasonal edition is coming soon: register your interest. Tooting, London."
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "The seasonal edition", path: "/seasonal-edition" }])} />

      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid items-center gap-8 py-10 lg:grid-cols-[1fr_1fr] lg:py-16">
          <div className="flex flex-col gap-4">
            <nav aria-label="Breadcrumb" className="crumbs text-[15px] text-mute-dark"><Link to="/">Home</Link> · The seasonal edition</nav>
            <h1 className="text-[46px] text-paper sm:text-[68px]">The seasonal edition</h1>
            <p className="max-w-lg text-[18px] text-mute-dark">A scent for the season, sent to you a few times a year. Coming soon.</p>
          </div>
          <SeasonalBox dark scent={{ name: "", family: "Fresh", colour: "#c9b6c7", cap: "#45353a" }} className="w-full max-w-[520px] justify-self-center" />
        </div>
      </section>

      <section className="wrap grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex max-w-2xl flex-col gap-8">
          <h2 className="text-[34px] sm:text-[44px]">How it works</h2>
          <div className="flex flex-col gap-2 border-t border-ink pt-4">
            <h3 className="display text-[26px]">A scent made for the season</h3>
            <p className="text-[18px]">A few times a year, a scent chosen for the months it arrives in.</p>
          </div>
          <div className="flex flex-col gap-2 border-t border-ink pt-4">
            <h3 className="display text-[26px]">Sent to your door</h3>
            <p className="text-[18px]">Each edition is posted to you in its own box. What each box holds: [EDITION CONTENTS TO CONFIRM]</p>
          </div>
          <div className="flex flex-col gap-2 border-t border-ink pt-4">
            <h3 className="display text-[26px]">Price and how often</h3>
            <p className="text-[18px]">£[PRICE PER EDITION], [HOW OFTEN IT IS SENT]. Registering interest costs nothing and commits you to nothing.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 self-start rounded-pill bg-sage p-6 sm:p-8">
          <h2 className="text-[30px]">Register your interest</h2>
          {interest ? (
            <div role="status" className="flex flex-col gap-3">
              <p className="text-[18px]">Saved{interest.name ? `, ${interest.name}` : ""}. We have {interest.email} on this device.</p>
              <p className="text-base text-mute">This is a preview: nothing has been sent anywhere. At launch this form joins the real list.</p>
              <button type="button" onClick={() => setInterest(null)} className="inline-flex min-h-11 items-center self-start underline">Remove my details</button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-base">Your name<input className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label className="flex flex-col gap-1.5 text-base">Email<input className="field" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <button type="submit" className="btn btn-ink">Register interest</button>
              <p className="text-[14px] text-mute">Preview: your details are saved on this device only. Nothing is sent.</p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

export function DeliveryReturns() {
  const d = SITE.delivery;
  return (
    <>
      <Seo title="Delivery and returns" path="/delivery-returns"
        description={`Standard delivery ${gbp(d.standard.price)} in ${d.standard.time}, express ${gbp(d.express.price)} in ${d.express.time}, free on orders of ${gbp(d.freeOver)} and over, click and collect in Tooting. ${SITE.returns.days}-day returns.`}
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Delivery and returns", path: "/delivery-returns" }])} />
      <section className="wrap flex flex-col gap-4 pb-10 pt-8 sm:pt-12">
        <nav aria-label="Breadcrumb" className="crumbs text-[15px] text-mute"><Link to="/">Home</Link> · Delivery and returns</nav>
        <h1 className="text-[46px] sm:text-[64px]">Delivery and returns</h1>
        <p className="max-w-2xl text-[18px] text-mute">The same terms as every I&amp;A shop.</p>
      </section>
      <section className="wrap grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-3">
          <h2 className="text-[32px]">Delivery</h2>
          <table className="w-full text-left text-base">
            <thead><tr className="border-b border-ink"><th scope="col" className="label py-2 font-sans text-mute">Service</th><th scope="col" className="label py-2 font-sans text-mute">Price</th><th scope="col" className="label py-2 font-sans text-mute">Arrives</th></tr></thead>
            <tbody>
              <tr className="border-b border-line"><th scope="row" className="py-3 font-normal">Standard</th><td>{gbp(d.standard.price)}</td><td>{d.standard.time}</td></tr>
              <tr className="border-b border-line"><th scope="row" className="py-3 font-normal">Express</th><td>{gbp(d.express.price)}</td><td>{d.express.time}</td></tr>
              <tr className="border-b border-line"><th scope="row" className="py-3 font-normal">Free delivery</th><td>Free</td><td>Orders of {gbp(d.freeOver)} and over</td></tr>
              <tr className="border-b border-line"><th scope="row" className="py-3 font-normal">Click and collect</th><td>In the shop</td><td>{d.collect}</td></tr>
            </tbody>
          </table>
          <p className="text-base text-mute">A bottle from {gbp(SITE.bottlesFrom)} qualifies for free delivery on its own.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-[32px]">Returns</h2>
          <p className="text-[18px]">You have {SITE.returns.days} days to return an order.</p>
          <p className="text-base text-mute">Across the I&amp;A shops, {SITE.returns.excluded.slice(0, -1).join(", ")} and {SITE.returns.excluded.at(-1)} can't be returned. Opened perfume and used samples: [TO CONFIRM]</p>
          <p className="text-base">Questions: <a href={`tel:${SITE.phoneIntl}`} className="inline-flex min-h-11 items-center underline">{SITE.phone}</a></p>
        </div>
      </section>
    </>
  );
}
