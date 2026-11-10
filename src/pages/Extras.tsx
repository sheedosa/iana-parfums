import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Bottle, GiftBox } from "../components/Art";
import { Fact, PickRow } from "../components/Rows";
import { DeliveryLine } from "./ScentPage";
import { useStage } from "../lib/stage";
import { fullName, store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE, gbp } from "../data/site";

export function GiftBoxPage() {
  const scents = store.scents();
  const [handle, setHandle] = useState(scents[1]?.handle ?? scents[0].handle);
  const [size, setSize] = useState<"50ml" | "100ml">("50ml");
  const s = store.scent(handle) ?? scents[0];
  useStage(s.handle);
  return (
    <>
      <Seo title="The gift box" path="/gift-box" type="product"
        description={`A bottle from the I&A Parfums range, boxed for giving. Choose the scent and the size; bottles from ${gbp(SITE.bottlesFrom)}. Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Gift box", path: "/gift-box" }]),
          { "@context": "https://schema.org", "@type": "Product", name: "Gift box", description: "A bottle from the range, boxed for giving. Concept preview: sample product.", brand: { "@type": "Brand", name: SITE.name }, category: "Fragrance gift set" }]} />

      <section className="wrap grid gap-x-16 gap-y-8 pt-6 lg:grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col gap-4">
          <h1>The gift box</h1>
          <p className="t-lede measure">A bottle from the range, boxed for giving. Choose the scent and the size; the band on the box carries its name.</p>
          <GiftBox scent={s} className="mt-4 w-full max-w-[560px]" />
        </div>

        <div className="flex flex-col gap-3 lg:pt-4">
          <h2>Scent</h2>
          <div role="group" aria-label="Scent">
            {scents.map((x) => <PickRow key={x.handle} on={x.handle === handle} onClick={() => setHandle(x.handle)} term={fullName(x)}>{x.family}</PickRow>)}
          </div>
          <h2 className="mt-6">Size</h2>
          <div role="group" aria-label="Size">
            {(["50ml", "100ml"] as const).map((x) => <PickRow key={x} on={x === size} onClick={() => setSize(x)} term={`${x} bottle`}>{gbp(s.prices[x])}</PickRow>)}
          </div>
          <p key={`${handle}-${size}`} className="swap t-lede mt-4" aria-live="polite">{fullName(s)}, {size}, {gbp(s.prices[size])}, plus the box at £⁠[GIFT BOX PRICE].</p>
          <p className="text-mute">Bottle prices are samples for this preview; bottles from {gbp(SITE.bottlesFrom)} is confirmed. What comes in the box: [GIFT BOX CONTENTS TO CONFIRM]</p>
          <a href={`tel:${SITE.phoneIntl}`} className="act self-start">Call the shop on {SITE.phone}</a>
          <p className="text-mute">Online ordering opens at launch. If you are not sure which scent they would wear, <Link to="/discovery-set" className="link text-bone">give the discovery set</Link></p>
          <DeliveryLine />
        </div>
      </section>
    </>
  );
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEASON = { name: "", family: "Fresh" as const, colour: "#c9b6c7" };

export function SeasonalEdition() {
  const { interest, setInterest } = usePrefs();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const field = useRef<HTMLInputElement>(null);
  useStage(null, SEASON.colour);
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

      <section className="wrap grid gap-x-16 gap-y-8 pt-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4">
          <h1>The seasonal edition</h1>
          <p className="t-lede measure">A scent for the season, sent to you a few times a year. It is coming soon, and you can register your interest now.</p>

          <h2 className="mt-10">How it works</h2>
          <dl className="col">
            <Fact term="Made for the season">A scent chosen for the months it arrives in</Fact>
            <Fact term="Sent to your door">Each edition posted in its own box</Fact>
            <Fact term="Registering">Costs nothing and commits you to nothing</Fact>
          </dl>
          <p className="col text-mute">What each box holds: [EDITION CONTENTS TO CONFIRM]. Price and how often: £⁠[PRICE PER EDITION], [HOW OFTEN IT IS SENT]</p>

          <div id="register" className="mt-10 flex max-w-[30rem] scroll-mt-8 flex-col gap-4">
            <h2>Register your interest</h2>
            {interest ? (
              <div role="status" className="flex flex-col items-start gap-2">
                <p className="t-lede">Saved{interest.name ? `, ${interest.name}` : ""}. We have {interest.email} on this device.</p>
                <p className="text-mute">This is a preview: nothing has been sent anywhere. At launch this form joins the real list.</p>
                <button type="button" onClick={() => setInterest(null)} className="link">Remove my details</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <label htmlFor="se-name">Your name <span className="text-mute">(optional)</span></label>
                  <input id="se-name" className="field" autoComplete="name" autoCapitalize="words" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="se-email">Email address</label>
                  <input ref={field} id="se-email" className="field" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} aria-invalid={error ? true : undefined} aria-describedby={error ? "se-error" : undefined} value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }} />
                  {error && <p id="se-error" role="alert" className="pt-2 font-medium">{error}</p>}
                </div>
                <button type="submit" className="act self-start">Register my interest</button>
                <p className="t-small text-mute">Preview: your details are saved on this device only. Nothing is sent.</p>
              </form>
            )}
          </div>
        </div>
        <div className="stand hidden h-[60svh] min-h-[380px] lg:flex" role="img" aria-label="The house bottle with a blank label, for the edition to come">
          <Bottle scent={SEASON} label={["The season", "EDITION"]} />
        </div>
      </section>
    </>
  );
}

export function DeliveryReturns() {
  const d = SITE.delivery;
  useStage(null);
  return (
    <>
      <Seo title="Delivery and returns" path="/delivery-returns"
        description={`Standard delivery ${gbp(d.standard.price)} in ${d.standard.time}, express ${gbp(d.express.price)} in ${d.express.time}, free on orders of ${gbp(d.freeOver)} and over, click and collect in Tooting. ${SITE.returns.days}-day returns.`}
        jsonLd={breadcrumbs([{ name: "Home", path: "/" }, { name: "Delivery and returns", path: "/delivery-returns" }])} />
      <section className="wrap flex flex-col gap-3 pt-6">
        <h1>Delivery and returns</h1>
        <h2 className="mt-8">Delivery</h2>
        <dl className="col">
          <Fact term="Standard">{gbp(d.standard.price)}, {d.standard.time}</Fact>
          <Fact term="Express">{gbp(d.express.price)}, {d.express.time}</Fact>
          <Fact term="Free delivery">Orders of {gbp(d.freeOver)} and over</Fact>
          <Fact term="Click and collect">{d.collect}</Fact>
        </dl>
        <p className="col text-mute">A bottle from {gbp(SITE.bottlesFrom)} qualifies for free delivery on its own.</p>
        <h2 className="mt-10">Returns</h2>
        <p className="t-lede col">You have {SITE.returns.days} days to return an order.</p>
        <p className="col text-mute">Across the I&amp;A shops, {SITE.returns.excluded.slice(0, -1).join(", ")} and {SITE.returns.excluded.at(-1)} can't be returned. Opened perfume and used samples: [TO CONFIRM]</p>
        <p className="col">If you have a question, ring <a href={`tel:${SITE.phoneIntl}`} className="link">{SITE.phone}</a></p>
      </section>
    </>
  );
}
