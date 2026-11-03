import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ScentCard } from "../components/ScentCard";
import { NotFound } from "./NotFound";
import { STRENGTHS, WHENS, store, type Strength, type When } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { Vial } from "../components/Art";

const ALL = { handle: "all", title: "The range", blurb: "Seven eaux de parfum, two fresh, two floral, two woody and one warm. Every one as a 2ml sample first." };

export function Range() {
  const { family = "all" } = useParams();
  const f = family === "all" ? ALL : store.family(family);
  const { answers } = usePrefs();
  const [strength, setStrength] = useState<Strength[]>([]);
  const [when, setWhen] = useState<When[]>([]);
  if (!f) return <NotFound />;

  const base = store.scents({ family });
  const list = store.scents({ family, strength, when });
  const tog = <T,>(set: (fn: (x: T[]) => T[]) => void, v: T) => set((x) => (x.includes(v) ? x.filter((y) => y !== v) : [...x, v]));
  const path = family === "all" ? "/range" : `/range/${family}`;

  return (
    <>
      <Seo title={family === "all" ? "The range" : `${f.title} scents`} path={path} description={`${f.blurb} I&A Parfums, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: f.title, path }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: f.title, description: f.blurb }]} />

      {answers && <div className="bg-sage"><div className="wrap flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><p>Scents marked <b>For you</b> match your finder answers. <Link to="/scent-finder" className="inline-flex min-h-11 items-center underline">Change them</Link></p></div></div>}

      <section className="wrap flex flex-col gap-4 pb-6 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link to="/" className="underline">Home</Link> · {family === "all" ? "The range" : <><Link to="/range" className="underline">The range</Link> · {f.title}</>}</nav>
        <h1 className="text-[44px] sm:text-[56px]">{f.title}</h1>
        <p className="max-w-2xl text-[17px] text-mute">{f.blurb}</p>
        <nav aria-label="Families" className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[ALL, ...store.families()].map((x) => <Link key={x.handle} to={x.handle === "all" ? "/range" : `/range/${x.handle}`} className="chip" aria-current={x.handle === family ? "page" : undefined}>{x.handle === "all" ? "All" : x.title}</Link>)}
        </nav>
      </section>

      <section className="wrap grid gap-10 pb-10 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="flex flex-col gap-7">
          <fieldset className="flex flex-col gap-1">
            <legend className="label mb-2 text-mute">Strength</legend>
            {STRENGTHS.map((x) => <label key={x} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={strength.includes(x)} onChange={() => tog(setStrength, x)} className="h-[18px] w-[18px] accent-[#45353a]" /> {x} <span className="text-mute">({base.filter((s) => s.strength === x).length})</span></label>)}
          </fieldset>
          <fieldset className="flex flex-col gap-1">
            <legend className="label mb-2 text-mute">When</legend>
            {WHENS.map((x) => <label key={x} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={when.includes(x)} onChange={() => tog(setWhen, x)} className="h-[18px] w-[18px] accent-[#45353a]" /> {x} <span className="text-mute">({base.filter((s) => s.when === x || s.when === "Both").length})</span></label>)}
          </fieldset>
          <div className="on-ink flex flex-col gap-2 rounded-pill bg-ink p-4 text-paper">
            <Vial className="h-12 w-auto" />
            <p className="text-sm font-normal">Not sure which?</p>
            <p className="text-sm text-mute-dark">Every scent is £[PRICE] as a 2ml sample, credited back when you buy the bottle.</p>
            <Link to="/discovery-set" className="label inline-flex min-h-11 items-center text-paper underline">Try all seven</Link>
          </div>
        </aside>
        <div className="min-w-0">
          <h2 className="sr-only">Scents</h2>
          <p className="mb-5 text-sm text-mute" aria-live="polite">{list.length} {list.length === 1 ? "scent" : "scents"}</p>
          {list.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 xl:grid-cols-3">{list.map((s) => <ScentCard key={s.handle} s={s} />)}</div>
          ) : (
            <div className="rounded-pill bg-stone p-8 text-center"><p>Nothing matches those filters.</p><button type="button" onClick={() => { setStrength([]); setWhen([]); }} className="btn btn-ghost mt-4">Clear filters</button></div>
          )}
        </div>
      </section>

      <section className="wrap">
        <div className="flex flex-col gap-4 rounded-pill bg-sage p-8 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-[28px] sm:text-[32px]">Three questions narrow it to two or three</h2><p className="text-mute">When you wear it, which family, how strong. Your answers are saved and the matches are flagged on every page.</p></div>
          <Link to="/scent-finder" className="btn btn-ink shrink-0">Find my scent</Link>
        </div>
      </section>
    </>
  );
}
