import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Bottle, wash } from "../components/Art";
import { FitName, useEm } from "../components/FitName";
import { OtherWays, Slip } from "../components/Rows";
import { VLink, bottleVT } from "../components/VLink";
import { scentLine } from "../lib/words";
import { useSetCurrent } from "../lib/stage";
import { fullName, store, type Scent } from "../lib/store";
import { SITE, gbp } from "../data/site";

/** One scent, one screen: the name across the width, the bottle, one line and the way in. */
function Screen({ s, first }: { s: Scent; first: boolean }) {
  const name = fullName(s);
  const fam = store.family(s.family.toLowerCase());
  const em = useEm(name);
  return (
    <section data-scent={s.handle} aria-labelledby={`name-${s.handle}`} className="screen" style={{ ["--em" as string]: em.toFixed(4), backgroundColor: wash(s.colour) } as CSSProperties}>
      <div className="wrap">
        <h2 id={`name-${s.handle}`}><FitName text={name} /></h2>
        <div className="mt-6 grid items-end gap-x-10 gap-y-6 md:mt-4 md:grid-cols-12">
          <VLink to={`/scents/${s.handle}`} tabIndex={-1} aria-hidden="true" className={`stand screen-bottle md:order-2 md:col-span-4 md:col-start-8 md:justify-start ${first ? "rise" : ""}`}>
            <span className="flex h-full" style={bottleVT(s.handle)}><Bottle scent={s} /></span>
          </VLink>
          <div className="flex flex-col items-start gap-3 md:order-1 md:col-span-6 md:pb-6">
            <p className="t-lede">{scentLine(s)}</p>
            {fam && <p className="measure text-mute">{fam.blurb}</p>}
            <VLink to={`/scents/${s.handle}`} className="act mt-2">Sample it<span className="sr-only">: {name}</span></VLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  const scents = useMemo(() => store.scents(), []);
  const setCurrent = useSetCurrent();
  const box = useRef<HTMLDivElement>(null);

  // The page takes the wash of the scent on screen, and that bottle steps forward in the dock.
  useEffect(() => {
    setCurrent(scents[0]?.handle ?? null);
    const root = box.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setCurrent((e.target as HTMLElement).dataset.scent || null);
    }, { rootMargin: "-45% 0px -45% 0px" });
    root.querySelectorAll("[data-scent]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [scents, setCurrent]);

  return (
    <div ref={box}>
      <Seo title="Eau de parfum from Tooting, sampled before the bottle" path="/" description={`Eau de parfum from I & A in Tooting, London. Every scent comes as a 2ml sample before the bottle, and bottles start at ${gbp(SITE.bottlesFrom)}. Discovery set, gift box and a seasonal edition.`} />

      <div className="wrap">
        <h1 className="font-sans text-base font-normal">Four eaux de parfum from Tooting, each sold as a 2ml sample before the bottle.</h1>
      </div>

      {scents.map((s, i) => <Screen key={s.handle} s={s} first={i === 0} />)}

      <section data-scent="" className="wrap flex flex-col gap-6 pb-10 pt-24">
        <h2>How the sample works</h2>
        <p className="t-lede col">Choose a scent and we send it as a 2ml vial. Wear it on your skin for a few days, at work and in the evening. If you then buy the 50ml or the 100ml, the price of the sample comes off the bottle.</p>
        <Slip bottle={gbp(SITE.bottlesFrom)} sample="£⁠[SAMPLE PRICE]" />
        <Link to="/our-scents#sample" className="link self-start">More on the sample credit</Link>
      </section>

      <section data-scent="" className="wrap flex flex-col gap-4 pt-16">
        <h2>Other ways to buy</h2>
        <OtherWays />
      </section>
    </div>
  );
}
