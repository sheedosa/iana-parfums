import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Bottle } from "../components/Art";
import { VLink, bottleVT } from "../components/VLink";
import { NotFound } from "./NotFound";
import { useNote } from "../lib/words";
import { useStage } from "../lib/stage";
import { fullName, store, type Scent } from "../lib/store";
import { SITE, gbp } from "../data/site";

const ALL = { handle: "all", title: "The range", blurb: "Four eaux de parfum, one in each family. Every one as a 2ml sample before the bottle." };

/** One place in the line: the bottle, then its name, family and price. The whole place is the link. */
function Place({ s, back, onOn, onOff }: { s: Scent; back: boolean; onOn: () => void; onOff: () => void }) {
  const note = useNote(s);
  return (
    <li className="min-w-0">
      <VLink to={`/scents/${s.handle}`} className="group flex h-full flex-col" onMouseEnter={onOn} onMouseLeave={onOff} onFocus={onOn} onBlur={onOff}>
        <span className="step stand h-[clamp(150px,min(34vw,calc(100svh-33rem)),460px)]" data-step={back ? "back" : undefined}>
          <span className="flex h-full" style={bottleVT(s.handle)}><Bottle scent={s} /></span>
        </span>
        <span className="flex flex-col items-center gap-0.5 px-1 pt-4 text-center">
          <h3 className="name name-c name-sm underline-offset-[6px] group-hover:underline">{fullName(s)}</h3>
          <span className="text-mute">{s.family}</span>
          <span className="text-mute">50ml {gbp(s.prices["50ml"])}</span>
          {note && <span className="t-small">{note}</span>}
        </span>
      </VLink>
    </li>
  );
}

/** The range has no grid: it is the dock opened to full height, all four on one line with their names beneath.
    On a family page that family's bottle stands forward and the page takes its wash. */
export function Range() {
  const { family = "all" } = useParams();
  const f = family === "all" ? ALL : store.family(family);
  const [hover, setHover] = useState<string | null>(null);
  useEffect(() => { setHover(null); }, [family]);
  const all = store.scents();
  const own = family === "all" ? null : store.scents({ family })[0]?.handle ?? null;
  const active = hover ?? own;
  useStage(f ? active : null);
  if (!f) return <NotFound />;
  const path = family === "all" ? "/range" : `/range/${family}`;

  return (
    <>
      <Seo title={family === "all" ? "The range" : `${f.title} scents`} path={path} description={`${f.blurb} Bottles from ${gbp(SITE.bottlesFrom)}. I&A Parfums, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, ...(family === "all" ? [] : [{ name: "The range", path: "/range" }]), { name: f.title, path }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: f.title, description: f.blurb }]} />

      <section className="wrap pt-6">
        <h1>{f.title}</h1>
        <p className="t-lede col mt-4">{f.blurb}</p>
        <p className="col mt-2 text-mute">Bottles from {gbp(SITE.bottlesFrom)}. Sample scents with working names; the 50ml prices shown are samples for this preview.</p>
        <nav aria-label="Families" className="mt-4 flex flex-wrap gap-x-7">
          {[ALL, ...store.families()].map((x) => (
            <Link key={x.handle} to={x.handle === "all" ? "/range" : `/range/${x.handle}`} aria-current={x.handle === family ? "page" : undefined}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center underline-offset-[6px] hover:underline ${x.handle === family ? "underline decoration-amber decoration-2" : "text-mute"}`}>{x.handle === "all" ? "All four" : x.title}</Link>
          ))}
        </nav>

        <h2 className="sr-only">Scents</h2>
        <ul className="mt-10 grid grid-cols-4 gap-x-1 sm:gap-x-6">
          {all.map((s) => <Place key={s.handle} s={s} back={Boolean(active) && active !== s.handle} onOn={() => setHover(s.handle)} onOff={() => setHover(null)} />)}
        </ul>
      </section>

      <section className="wrap flex flex-col items-start gap-1 pt-20">
        <h2>Not sure which</h2>
        <p className="t-lede col">Three questions point you to one or two of the four, or take all four home as 2ml samples.</p>
        <p className="flex flex-wrap gap-x-8"><Link to="/scent-finder" className="link">The scent finder</Link><Link to="/discovery-set" className="link">The discovery set</Link></p>
      </section>
    </>
  );
}
