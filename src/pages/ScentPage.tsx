import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Bottle, Vial } from "../components/Art";
import { FitName } from "../components/FitName";
import { Fact, OtherWays, PickRow } from "../components/Rows";
import { VLink, bottleVT } from "../components/VLink";
import { NotFound } from "./NotFound";
import { scentLine, useNote, whenText } from "../lib/words";
import { useStage } from "../lib/stage";
import { fullName, priceText, store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { DELIVERY_LINE, SITE, SIZES, gbp, type Size } from "../data/site";

/** Delivery and returns in one sentence, from SITE, with the way to the full page. */
export function DeliveryLine() {
  return <p className="text-mute">{DELIVERY_LINE}. Click and collect from {SITE.delivery.collect}. <Link to="/delivery-returns" className="link text-bone">Delivery and returns in full</Link></p>;
}

const LAYERS: [string, string][] = [["Top", "The first half hour"], ["Heart", "The afternoon"], ["Base", "What is left the next day"]];

export function ScentPage() {
  const { handle = "" } = useParams();
  const s = store.scent(handle);
  const { sampled, toggleSampled } = usePrefs();
  const tried = sampled.includes(handle);
  const [size, setSize] = useState<Size>(tried ? "50ml" : "2ml sample");
  useEffect(() => { setSize(sampled.includes(handle) ? "50ml" : "2ml sample"); }, [handle]);
  useStage(s ? s.handle : null);
  if (!s) return <NotFound />;
  return <Body key={s.handle} handle={s.handle} size={size} setSize={setSize} tried={tried} toggle={() => { toggleSampled(s.handle); if (!tried) setSize("50ml"); }} />;
}

function Body({ handle, size, setSize, tried, toggle }: { handle: string; size: Size; setSize: (s: Size) => void; tried: boolean; toggle: () => void }) {
  const s = store.scent(handle)!;
  const note = useNote(s);
  const name = fullName(s);
  const path = `/scents/${s.handle}`;
  const fam = s.family.toLowerCase();
  const pairs = store.pairs(s);
  const isSample = size === "2ml sample";

  return (
    <>
      <Seo title={`${name}, eau de parfum`} path={path} type="product"
        description={`${name}: a ${s.strength.toLowerCase()} ${fam} eau de parfum for ${whenText(s)}, from I & A Parfums in Tooting. Try the 2ml sample first; bottles from ${gbp(SITE.bottlesFrom)}.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "The range", path: "/range" }, { name: s.family, path: `/range/${fam}` }, { name, path }]),
          { "@context": "https://schema.org", "@type": "Product", name, description: `A ${fam} eau de parfum. Concept preview: sample scent.`, brand: { "@type": "Brand", name: SITE.name }, category: `${s.family} eau de parfum`, color: s.colour }]} />

      <section className="wrap pt-4">
        <h1 className="font-normal"><FitName text={name} cap="13rem" /></h1>
        <p className="t-lede mt-4">{scentLine(s)}</p>
        <p className="text-mute">A working name, and a sample scent for this preview.{note && <span className="text-bone"> {note}.</span>}</p>

        <div className="mt-6 flex h-[42svh] min-h-[260px] items-end justify-center gap-[4%] md:h-[clamp(280px,calc(100svh-30rem),520px)] md:min-h-0" role="img" aria-label={`${name}: ${isSample ? "the 2ml sample vial, with the bottle beside it" : `the ${size} bottle, with its 2ml sample beside it`}`}>
          <span className="step flex h-full items-end" data-step={isSample ? "back" : undefined} style={bottleVT(s.handle)}><Bottle scent={s} className="h-full w-auto" /></span>
          <span className="step flex h-[46%] items-end" data-step={isSample ? undefined : "back"}><Vial colour={s.colour} className="h-full w-auto" /></span>
        </div>
      </section>

      <section className="wrap flex flex-col gap-3 pt-14" aria-labelledby="sizes">
        <h2 id="sizes">Sizes and prices</h2>
        <div role="group" aria-label="Size" className="col">
          {SIZES.filter((x) => s.sizes.includes(x)).map((x) => (
            <PickRow key={x} on={size === x} onClick={() => setSize(x)} term={x === "2ml sample" ? "2ml sample" : `${x} bottle`}>{priceText(s, x)}</PickRow>
          ))}
        </div>
        <p className="col text-mute">The 50ml and 100ml prices are samples for this preview; bottles from {gbp(SITE.bottlesFrom)} is confirmed.</p>
        <p key={size} className="swap t-lede col" aria-live="polite">
          {isSample
            ? "Wear the 2ml for a few days. If you buy the bottle afterwards, the price of the sample comes off."
            : tried
              ? `You have the sample, so the 2ml price comes off this ${size}.`
              : `Not smelt it yet? Start with the 2ml; its price comes off this ${size} later.`}
        </p>
        <button type="button" className="row col" aria-pressed={tried} onClick={toggle}>
          <span className="t">I have tried the 2ml sample</span><span className="lead" aria-hidden="true" /><span className="v">{tried ? "Yes" : "Not yet"}</span>
        </button>
        <a href={`tel:${SITE.phoneIntl}`} className="act self-start">Call the shop on {SITE.phone}</a>
        <p className="col text-mute">Online ordering opens at launch. Until then, ring us or smell it at the counter in Tooting.</p>
        <DeliveryLine />
      </section>

      <section className="wrap flex flex-col gap-3 pt-16" aria-labelledby="notes">
        <h2 id="notes">Notes</h2>
        <dl className="col">{LAYERS.map(([k, v]) => <Fact key={k} term={k}>{v}</Fact>)}</dl>
        <p className="col text-mute">The notes in {name}: [NOTES TO COME]</p>
      </section>

      {pairs.length > 0 && (
        <section className="wrap flex flex-col gap-3 pt-16" aria-labelledby="with">
          <h2 id="with">Wear it with</h2>
          <ul className="col">
            {pairs.map((x) => (
              <li key={x.handle}><VLink to={`/scents/${x.handle}`} className="row row-lg"><span className="t">{fullName(x)}</span><span className="lead" aria-hidden="true" /><span className="v text-mute">{x.family}, {x.strength.toLowerCase()}</span></VLink></li>
            ))}
          </ul>
        </section>
      )}

      <section className="wrap flex flex-col gap-3 pt-16" aria-labelledby="ways">
        <h2 id="ways">Other ways to buy</h2>
        <OtherWays finder={false} />
      </section>
    </>
  );
}
