import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { Bottle, mix } from "../components/Art";
import { VLink, bottleVT } from "../components/VLink";
import { scentLine, useNote } from "../components/ScentCard";
import { NotFound } from "./NotFound";
import { answersLabel, fullName, store, type Scent } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE, gbp } from "../data/site";

const ALL = { handle: "all", title: "The range", blurb: "Four eaux de parfum, one in each family. Every one as a 2ml sample before the bottle." };

/** One place on the shelf: the bottle standing on the line, its name and details under it. The whole place is the link. */
function Place({ s, step, onOn, onOff }: { s: Scent; step: "1" | "off" | "rest"; onOn: () => void; onOff: () => void }) {
  const note = useNote(s);
  return (
    <li className="min-w-0">
      <VLink to={`/scents/${s.handle}`} className="group flex h-full flex-col" onMouseEnter={onOn} onMouseLeave={onOff} onFocus={onOn} onBlur={onOff}>
        <span className="shelf-btn h-[clamp(190px,25vw,350px)] flex-none border-b border-ink px-[8%]" data-step={step === "off" ? undefined : step}>
          <span className="flex h-full w-full items-end" style={bottleVT(s.handle)}><Bottle scent={s} /></span>
        </span>
        <span className="flex flex-col gap-1 pr-4 pt-4">
          <h3 className="display t-h3 underline-offset-4 group-hover:underline">{fullName(s)}</h3>
          <span className="voice">{scentLine(s)}</span>
          <span className="text-base text-mute">2ml sample £[SAMPLE PRICE], 50ml {gbp(s.prices["50ml"])}.</span>
          {note && <span className="text-base">{note}.</span>}
        </span>
      </VLink>
    </li>
  );
}

/** The range is the shelf: all four on one line. The bottle under your pointer or focus steps forward and the page
    takes its tint; on a family page that family's bottle is the one already forward. */
export function Range() {
  const { family = "all" } = useParams();
  const f = family === "all" ? ALL : store.family(family);
  const { answers } = usePrefs();
  const [hover, setHover] = useState<string | null>(null);
  useEffect(() => { setHover(null); }, [family]);
  if (!f) return <NotFound />;

  const all = store.scents();
  const shown = store.scents({ family });
  const current = family === "all" ? null : shown[0]?.handle ?? null;
  const active = all.find((x) => x.handle === (hover ?? current));
  const path = family === "all" ? "/range" : `/range/${family}`;

  return (
    <>
      <Seo title={family === "all" ? "The range" : `${f.title} scents`} path={path} description={`${f.blurb} Bottles from ${gbp(SITE.bottlesFrom)}. I&A Parfums, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, ...(family === "all" ? [] : [{ name: "The range", path: "/range" }]), { name: f.title, path }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: f.title, description: f.blurb }]} />

      <section className="tint" style={{ backgroundColor: active ? mix("#fbfbf9", active.colour, 0.3) : "#fbfbf9" }}>
        <div className="wrap flex flex-col pb-14 pt-3 sm:pb-20 lg:pt-6">
          <nav aria-label="Breadcrumb" className="crumbs">{family === "all" ? <Link to="/">Home</Link> : <><Link to="/">Home</Link>, <Link to="/range">the range</Link></>}</nav>
          <div className="grid gap-x-14 gap-y-3 lg:grid-cols-[1fr_minmax(0,34rem)] lg:items-end">
            <h1 className={family === "all" ? "" : "t-name"}>{f.title}</h1>
            <div className="flex flex-col gap-2">
              <p className="t-lede">{family === "all" ? f.blurb : <>The range is four on purpose: one scent in each family. {f.blurb}</>}</p>
              <p className="text-base text-mute">Bottles from {gbp(SITE.bottlesFrom)}, 2ml sample £[SAMPLE PRICE]. Sample scents with working names; bottle prices are samples for this preview.</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <nav aria-label="Families" className="flex flex-wrap gap-2">
              {[ALL, ...store.families()].map((x) => <Link key={x.handle} to={x.handle === "all" ? "/range" : `/range/${x.handle}`} className="chip" aria-current={x.handle === family ? "page" : undefined}>{x.handle === "all" ? "All four" : x.title}</Link>)}
            </nav>
            <p className="text-base" role="status">{family === "all" ? "Showing all four scents." : <>Showing the one {f.title.toLowerCase()} scent of four. <Link to="/range" className="link">Show all four</Link></>}</p>
          </div>

          <h2 className="sr-only">Scents</h2>
          <ul className="mt-4 grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {all.map((s) => (
              <Place key={s.handle} s={s} step={active ? (active.handle === s.handle ? "1" : "off") : "rest"} onOn={() => setHover(s.handle)} onOff={() => setHover(null)} />
            ))}
          </ul>
        </div>
      </section>

      <section className="end-band bg-sage">
        <div className="wrap grid gap-x-14 gap-y-8 py-12 md:grid-cols-2">
          <div className="flex flex-col items-start gap-2">
            <h2 className="t-h3">{answers ? "Your finder picks are marked" : "Not sure which?"}</h2>
            <p className="measure text-base">{answers ? <>They match your answers: {answersLabel(answers)}.</> : "Three questions point you to one or two of the four."}</p>
            <Link to="/scent-finder" className="link">{answers ? "Change my answers" : "Find my scent"}</Link>
          </div>
          <div className="flex flex-col items-start gap-2">
            <h2 className="t-h3">Or try all four</h2>
            <p className="measure text-base">The discovery set is the whole range as 2ml samples in one box.</p>
            <Link to="/discovery-set" className="link">The discovery set</Link>
          </div>
        </div>
      </section>
    </>
  );
}
