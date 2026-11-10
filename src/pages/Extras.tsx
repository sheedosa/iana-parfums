import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Bottle, GiftBox, SeasonalBox, mix } from "../components/Art";
import { StickyBar } from "../components/StickyBar";
import { DeliveryRows } from "./ScentPage";
import { fullName, store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE, gbp } from "../data/site";

export function GiftBoxPage() {
  const scents = store.scents();
  const [handle, setHandle] = useState(scents[1]?.handle ?? scents[0].handle);
  const [size, setSize] = useState<"50ml" | "100ml">("50ml");
  const s = store.scent(handle) ?? scents[0];
  const actions = useRef<HTMLDivElement>(null);
  const chooser = useRef<HTMLDivElement>(null);
  return (
    <>
      <Seo title="The gift box" path="/gift-box" type="product"
        description={`A bottle from the I&A Parfums range, boxed for giving. Choose the scent and the size; bottles from ${gbp(SITE.bottlesFrom)}. Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Gift box", path: "/gift-box" }]),
          { "@context": "https://schema.org", "@type": "Product", name: "Gift box", description: "A bottle from the range, boxed for giving. Concept preview: sample product.", brand: { "@type": "Brand", name: SITE.name }, category: "Fragrance gift set" }]} />

      {/* The chosen bottle steps forward on the little shelf, and the stage takes its tint. */}
      <section className="wrap grid gap-x-14 gap-y-6 pb-16 pt-3 lg:grid-cols-[1.15fr_1fr] lg:pt-6">
        <div className="flex flex-col gap-3 lg:col-start-2 lg:row-start-1">
          <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link></nav>
          <h1>The gift box</h1>
          <p className="voice">For someone else</p>
          <p className="t-lede">A bottle from the range, boxed for giving. Choose the scent and the size; the band on the box carries its name.</p>
        </div>
        <div className="tint self-start rounded-pill p-6 sm:p-10 lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1" style={{ backgroundColor: mix("#fbfbf9", s.colour, 0.3) }}>
          <GiftBox scent={s} className="w-full" />
        </div>
        <div className="flex flex-col gap-7 lg:col-start-2 lg:row-start-2">
          <div ref={chooser} className="flex scroll-mt-20 flex-col gap-7">
            <fieldset>
              <legend className="label mb-1 text-mute">Scent</legend>
              <div className="grid grid-cols-4">
                {scents.map((x) => (
                  <button key={x.handle} type="button" aria-pressed={x.handle === handle} onClick={() => setHandle(x.handle)} className="group flex min-w-0 flex-col">
                    <span className="shelf-btn h-28 flex-none border-b border-ink" data-step={x.handle === handle ? "1" : undefined}><Bottle scent={x} plain /></span>
                    <span className={`flex min-h-11 items-center justify-center text-[16px] underline-offset-4 ${x.handle === handle ? "font-medium underline" : "group-hover:underline"}`}>{fullName(x)}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="label mb-3 text-mute">Size</legend>
              <div className="flex flex-wrap gap-2">{(["50ml", "100ml"] as const).map((x) => <button key={x} type="button" className="chip" aria-pressed={x === size} onClick={() => setSize(x)}>{x}, {gbp(s.prices[x])}</button>)}</div>
            </fieldset>
          </div>
          <div key={`${handle}-${size}`} className="swap flex flex-col gap-1 border-y border-line py-4" aria-live="polite">
            <p className="flex flex-wrap items-baseline gap-x-3"><span className="fig t-h1">{gbp(s.prices[size])}</span><span className="text-base">{fullName(s)}, {size}, plus the box £[GIFT BOX PRICE]</span></p>
            <p className="text-base text-mute">Bottle prices are samples for this preview; bottles from {gbp(SITE.bottlesFrom)} is confirmed. What comes in the box: [GIFT BOX CONTENTS TO CONFIRM]</p>
          </div>
          <div ref={actions} className="flex flex-col items-start gap-2">
            <button type="button" disabled className="btn min-h-14 self-stretch">Online ordering opens at launch</button>
            <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink self-stretch">Ask in Tooting, {SITE.phone}</a>
            <Link to="/discovery-set" className="link">Not sure which? Give the discovery set</Link>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-x-14 gap-y-4 border-t border-line pt-14 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <h2 className="t-h3">Delivery and returns</h2>
        <DeliveryRows className="max-w-2xl" />
      </section>

      <StickyBar watch={actions} label="Your gift box">
        <button type="button" onClick={() => chooser.current?.scrollIntoView({ block: "start" })} className="flex min-h-11 min-w-0 flex-1 flex-col items-start justify-center text-left leading-tight">
          <span className="max-w-full truncate font-medium underline decoration-1 underline-offset-4">{fullName(s)}, {size}</span>
          <span className="max-w-full truncate text-[16px] text-mute">{gbp(s.prices[size])} plus the box</span>
          <span className="sr-only">Change scent or size</span>
        </button>
        <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ink shrink-0 px-5">Call the shop</a>
      </StickyBar>
    </>
  );
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SeasonalEdition() {
  const { interest, setInterest } = usePrefs();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const field = useRef<HTMLInputElement>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    const problem = !v ? "Enter your email address so we can tell you when the first edition is ready." : !EMAIL.test(v) ? "That email address looks incomplete. It should read like name@example.co.uk." : "";
    setError(problem);
    if (problem) { field.current?.focus(); return; }
    setInterest({ name: name.trim(), email: v, at: new Date().toISOString() });
  };
  return (
    <>
      <Seo title="The seasonal edition" path="/seasonal-edition"
        description="A scent for the season, sent a few times a year. The I&A Parfums seasonal edition is coming soon: register your interest. Tooting, London."
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "The seasonal edition", path: "/seasonal-edition" }])} />

      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid items-center gap-x-14 gap-y-6 pb-12 pt-3 lg:grid-cols-[1.1fr_1fr] lg:pb-16 lg:pt-6">
          <div className="flex flex-col gap-3">
            <nav aria-label="Breadcrumb" className="crumbs text-mute-dark"><Link to="/">Home</Link></nav>
            <h1 className="t-name text-paper">The seasonal edition</h1>
            <p className="voice">Coming soon</p>
            <p className="t-lede measure">A scent for the season, sent to you a few times a year.</p>
            <a href="#register" className="btn btn-paper mt-2 self-start">Register your interest</a>
          </div>
          <SeasonalBox dark scent={{ name: "", family: "Fresh", colour: "#c9b6c7", cap: "#45353a" }} className="w-full max-w-[540px] justify-self-center lg:justify-self-end" />
        </div>
      </section>

      <section className="wrap grid gap-x-14 gap-y-12 py-16 sm:py-20 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-6">
          <h2>How it works</h2>
          <dl className="rows border-b border-ink/20" style={{ ["--term" as string]: "13rem" }}>
            <div><dt className="display t-h4">Made for the season</dt><dd className="text-base">A few times a year, a scent chosen for the months it arrives in.</dd></div>
            <div><dt className="display t-h4">Sent to your door</dt><dd className="text-base">Each edition is posted to you in its own box. What each box holds: [EDITION CONTENTS TO CONFIRM]</dd></div>
            <div><dt className="display t-h4">Price and how often</dt><dd className="text-base">£[PRICE PER EDITION], [HOW OFTEN IT IS SENT]. Registering interest costs nothing and commits you to nothing.</dd></div>
          </dl>
        </div>

        <div id="register" className="flex scroll-mt-24 flex-col gap-4 self-start rounded-pill bg-sage p-6 sm:p-8">
          <h2 className="t-h3">Register your interest</h2>
          {interest ? (
            <div role="status" className="flex flex-col items-start gap-3">
              <p className="t-lede">Saved{interest.name ? `, ${interest.name}` : ""}. We have {interest.email} on this device.</p>
              <p className="text-base text-mute">This is a preview: nothing has been sent anywhere. At launch this form joins the real list.</p>
              <button type="button" onClick={() => setInterest(null)} className="link">Remove my details</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="se-name">Your name <span className="text-mute">(optional)</span></label>
                <input id="se-name" className="field" autoComplete="name" autoCapitalize="words" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="se-email">Email address</label>
                <input ref={field} id="se-email" className="field" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} aria-invalid={error ? true : undefined} aria-describedby={error ? "se-error" : undefined} value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }} />
                {error && <p id="se-error" role="alert" className="text-base font-medium">{error}</p>}
              </div>
              <button type="submit" className="btn btn-ink">Register interest</button>
              <p className="t-small text-mute">Preview: your details are saved on this device only. Nothing is sent.</p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

export function DeliveryReturns() {
  const d = SITE.delivery;
  const th = "label py-2 pr-4 font-sans text-mute";
  return (
    <>
      <Seo title="Delivery and returns" path="/delivery-returns"
        description={`Standard delivery ${gbp(d.standard.price)} in ${d.standard.time}, express ${gbp(d.express.price)} in ${d.express.time}, free on orders of ${gbp(d.freeOver)} and over, click and collect in Tooting. ${SITE.returns.days}-day returns.`}
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Delivery and returns", path: "/delivery-returns" }])} />
      <section className="bg-sage">
        <div className="wrap flex flex-col gap-3 pb-12 pt-3 lg:pb-16 lg:pt-6">
          <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link></nav>
          <h1>Delivery and returns</h1>
          <p className="t-lede measure">The same terms as every I&amp;A shop.</p>
        </div>
      </section>
      <section className="wrap grid gap-x-14 gap-y-12 pt-14 sm:pt-20 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex min-w-0 flex-col gap-4">
          <h2>Delivery</h2>
          <table className="w-full text-left text-base">
            <thead><tr className="border-b border-ink"><th scope="col" className={th}>Service</th><th scope="col" className={th}>Price</th><th scope="col" className={th}>Arrives</th></tr></thead>
            <tbody>
              <tr className="border-b border-line"><th scope="row" className="py-3 pr-4 font-normal">Standard</th><td className="fig t-h4 pr-4">{gbp(d.standard.price)}</td><td>{d.standard.time}</td></tr>
              <tr className="border-b border-line"><th scope="row" className="py-3 pr-4 font-normal">Express</th><td className="fig t-h4 pr-4">{gbp(d.express.price)}</td><td>{d.express.time}</td></tr>
              <tr className="border-b border-line"><th scope="row" className="py-3 pr-4 font-normal">Free delivery</th><td className="fig t-h4 pr-4">Free</td><td>Orders of {gbp(d.freeOver)} and over</td></tr>
              <tr className="border-b border-line"><th scope="row" className="py-3 pr-4 font-normal">Click and collect</th><td className="pr-4">In the shop</td><td>{d.collect}</td></tr>
            </tbody>
          </table>
          <p className="text-base text-mute">A bottle from {gbp(SITE.bottlesFrom)} qualifies for free delivery on its own.</p>
        </div>
        <div className="flex flex-col items-start gap-3">
          <h2>Returns</h2>
          <p className="t-lede">You have {SITE.returns.days} days to return an order.</p>
          <p className="text-base text-mute">Across the I&amp;A shops, {SITE.returns.excluded.slice(0, -1).join(", ")} and {SITE.returns.excluded.at(-1)} can't be returned. Opened perfume and used samples: [TO CONFIRM]</p>
          <p className="text-base">Questions? Ring <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a></p>
        </div>
      </section>
    </>
  );
}
