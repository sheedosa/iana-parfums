import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ScentCard } from "../components/ScentCard";
import { NotFound } from "./NotFound";
import { answersLabel, store } from "../lib/store";
import { usePrefs } from "../lib/prefs";
import { SITE, gbp } from "../data/site";

const ALL = { handle: "all", title: "The range", blurb: "Four eaux de parfum, one in each family. Every one as a 2ml sample before the bottle." };

export function Range() {
  const { family = "all" } = useParams();
  const f = family === "all" ? ALL : store.family(family);
  const { answers } = usePrefs();
  if (!f) return <NotFound />;

  const list = store.scents({ family });
  const path = family === "all" ? "/range" : `/range/${family}`;

  return (
    <>
      <Seo title={family === "all" ? "The range" : `${f.title} scents`} path={path} description={`${f.blurb} Bottles from ${gbp(SITE.bottlesFrom)}. I&A Parfums, Tooting, London.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, ...(family === "all" ? [] : [{ name: "The range", path: "/range" }]), { name: f.title, path }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: f.title, description: f.blurb }]} />

      <section className="wrap flex flex-col gap-4 pb-8 pt-8 sm:pt-12">
        <nav aria-label="Breadcrumb" className="crumbs text-[15px] text-mute"><Link to="/">Home</Link> · {family === "all" ? "The range" : <><Link to="/range">The range</Link> · {f.title}</>}</nav>
        <h1 className="text-[48px] sm:text-[64px]">{family === "all" ? "The range" : `${f.title}`}</h1>
        <p className="max-w-2xl text-[18px] text-mute">{f.blurb}</p>
        <p className="text-base">Bottles from {gbp(SITE.bottlesFrom)} · 2ml sample £[SAMPLE PRICE] · Sample scents and prices for this preview</p>
        <nav aria-label="Families" className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[ALL, ...store.families()].map((x) => <Link key={x.handle} to={x.handle === "all" ? "/range" : `/range/${x.handle}`} className="chip" aria-current={x.handle === family ? "page" : undefined}>{x.handle === "all" ? "All four" : x.title}</Link>)}
        </nav>
      </section>

      <section className="wrap pb-6">
        <h2 className="sr-only">Scents</h2>
        {family === "all" ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">{list.map((s) => <ScentCard key={s.handle} s={s} tall />)}</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            {list.map((s) => <ScentCard key={s.handle} s={s} />)}
            <div className="flex flex-col gap-4">
              <h2 className="text-[32px] sm:text-[40px]">One {f.title.toLowerCase()} scent, for now.</h2>
              <p className="text-[18px]">The range is four on purpose: one scent in each family. {f.blurb}</p>
              <div className="flex flex-wrap gap-2">{store.families().filter((x) => x.handle !== family).map((x) => <Link key={x.handle} to={`/range/${x.handle}`} className="chip">{x.title}</Link>)}</div>
            </div>
          </div>
        )}
      </section>

      <section className="wrap pt-8">
        <p className="flex flex-wrap items-center gap-x-3 border-t border-line pt-6 text-base">
          {answers
            ? <>Scents marked <b>For you</b> match your finder answers ({answersLabel(answers)}). <Link to="/scent-finder" className="inline-flex min-h-11 items-center underline">Change them</Link></>
            : <>Not sure? Three questions point you to one or two. <Link to="/scent-finder" className="inline-flex min-h-11 items-center underline">Find my scent</Link></>}
          <span aria-hidden="true">·</span>
          <Link to="/discovery-set" className="inline-flex min-h-11 items-center underline">Or try all four as samples</Link>
        </p>
      </section>
    </>
  );
}
