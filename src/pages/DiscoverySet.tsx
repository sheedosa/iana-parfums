import { Seo, breadcrumbs } from "../components/Seo";
import { Vial } from "../components/Art";
import { VLink } from "../components/VLink";
import { OtherWays } from "../components/Rows";
import { DeliveryLine } from "./ScentPage";
import { useStage } from "../lib/stage";
import { fullName, store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE } from "../data/site";

/** Samples: each scent as a 2ml vial, or all four in the discovery set. */
export function DiscoverySet() {
  const scents = store.scents();
  const { sampled, toggleSampled } = usePrefs();
  const allTried = scents.every((s) => sampled.includes(s.handle));
  const markAll = () => scents.forEach((s) => { if (sampled.includes(s.handle) === allTried) toggleSampled(s.handle); });
  useStage(null);

  return (
    <>
      <Seo title="The discovery set: all four scents as 2ml samples" path="/discovery-set" type="product"
        description="Every I&A Parfums scent as a 2ml sample in one box, with a card for your notes. Wear a different one each day, then choose your bottle. Tooting, London."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Discovery set", path: "/discovery-set" }]),
          { "@context": "https://schema.org", "@type": "Product", name: "Discovery set", description: `Four 2ml samples: ${scents.map(fullName).join(", ")}. Concept preview: sample product.`, brand: { "@type": "Brand", name: SITE.name }, category: "Fragrance discovery set" }]} />

      <section className="wrap pt-6">
        <h1>The discovery set</h1>
        <p className="t-lede col mt-4">All four scents as 2ml samples in one box, with a card for your notes. Wear a different one each day, then choose your bottle.</p>

        <ul className="mt-10 grid max-w-[46rem] grid-cols-4">
          {scents.map((s) => (
            <li key={s.handle} className="min-w-0">
              <VLink to={`/scents/${s.handle}`} className="group flex flex-col items-start gap-3">
                <span className="flex h-40 sm:h-56"><Vial colour={s.colour} className="h-full w-auto" /></span>
                <span className="flex flex-col">
                  <span className="serif text-[clamp(.9375rem,2.5vw,1.5rem)] underline-offset-[6px] group-hover:underline">{fullName(s)}</span>
                  <span className="t-small text-mute">{s.family}{sampled.includes(s.handle) && <span className="text-bone">, tried</span>}</span>
                </span>
              </VLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap flex flex-col gap-3 pt-14" aria-labelledby="price">
        <h2 id="price">What it costs</h2>
        <p className="col">The set is £⁠[SET PRICE]. One 2ml sample on its own is £⁠[SAMPLE PRICE], chosen on the scent's page.</p>
        <p className="col text-mute">What the card says and how the set is credited against a bottle: [CARD AND CREDIT DETAILS TO CONFIRM]</p>
        <a href={`tel:${SITE.phoneIntl}`} className="act self-start">Call the shop on {SITE.phone}</a>
        <p className="col text-mute">Online ordering opens at launch. Until then, ring us or pick a set up at the counter in Tooting. Concept preview: a sample product.</p>
        <DeliveryLine />
      </section>

      <section className="wrap flex flex-col gap-3 pt-16" aria-labelledby="week">
        <h2 id="week">A week with four scents</h2>
        <p className="t-lede col">Wear one scent a day, on skin, from the morning. When you know which you want, open its page and tell it you have tried the sample: the bottle then shows the sample price coming off.</p>
        <button type="button" className="row col" aria-pressed={allTried} onClick={markAll}>
          <span className="t">I have the set and have tried all four</span><span className="lead" aria-hidden="true" /><span className="v">{allTried ? "Yes" : "Not yet"}</span>
        </button>
      </section>

      <section className="wrap flex flex-col gap-3 pt-16" aria-labelledby="ways">
        <h2 id="ways">Other ways to buy</h2>
        <OtherWays skip="/discovery-set" />
      </section>
    </>
  );
}
