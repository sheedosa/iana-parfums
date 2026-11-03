import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SITE } from "../data/site";
import { usePrefs } from "../lib/prefs";
import { answersLabel, findScents } from "../lib/store";

const BASE = import.meta.env.BASE_URL;
export const NAV = [
  { to: "/range", label: "The range" },
  { to: "/discovery-set", label: "Discovery set" },
  { to: "/scent-finder", label: "Scent finder" },
  { to: "/our-scents", label: "Our scents" },
  { to: "/visit", label: "Visit" },
];

export function Logo({ white = false, className = "" }: { white?: boolean; className?: string }) {
  return <img src={`${BASE}img/logo/iana-parfums-horizontal-${white ? "white" : "ochre"}.svg`} alt="I&A Parfums" className={className} width="340" height="49" />;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { answers } = usePrefs();
  const picks = answers ? findScents(answers) : [];
  return (
    <>
      <section aria-label="Notices">
      {SITE.preview && <div className="hidden bg-deep px-4 py-2 text-center text-[13px] text-paper sm:block">Concept preview · scents are samples; ordering opens at launch</div>}
      <div className="on-ink bg-ink px-4 py-2 text-center text-[13px] tracking-wide text-paper">
        {SITE.preview && <span className="sm:hidden">Concept preview · sample scents · </span>}
        {answers
          ? <><span className="hidden sm:inline">Your finder: <b>{answersLabel(answers)}</b> → </span>{picks.map((s, i) => <span key={s.handle}>{i ? ", " : ""}<Link to={`/scents/${s.handle}`} className="strip-link">{s.name}</Link></span>)} · <Link to="/scent-finder" className="strip-link">change</Link></>
          : <><span className="hidden sm:inline">Smell it first: every scent as a 2ml sample, credited back against the bottle · </span><Link to="/scent-finder" className="strip-link">find my scent</Link></>}
      </div>
      </section>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center" onClick={() => setOpen(false)}><Logo className="h-6 w-auto sm:h-8" /></Link>
          <nav aria-label="Site" className="hidden gap-7 text-sm tracking-wide lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${isActive ? "border-ink" : "border-transparent hover:border-ink/40"}`}>{n.label}</NavLink>)}
          </nav>
          <div className="flex items-center">
            <Link to="/scent-finder" className="hidden min-h-11 items-center px-3 text-sm md:inline-flex">{answers ? "My scents" : "Find my scent"}</Link>
            <Link to="/range" aria-label="The range" className="inline-flex h-11 w-11 items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            </Link>
          </div>
        </div>
        {open && (
          <nav aria-label="Site" className="border-t border-line bg-paper lg:hidden">
            <div className="wrap flex flex-col py-2">
              {NAV.map((n, i) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={`flex min-h-12 items-center text-lg ${i < NAV.length - 1 ? "border-b border-line" : ""}`}>{n.label}</Link>)}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="on-ink mt-20 bg-deep text-paper">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo white className="h-7 w-auto self-start" />
          <p className="max-w-xs text-sm text-mute-dark">Eau de parfum from Tooting, London. Part of the I&amp;A family with {SITE.family.map((f, i) => <span key={f.name}>{i ? (i === SITE.family.length - 1 ? " and " : ", ") : ""}<a className="underline" href={f.url}>{f.name}</a></span>)}.</p>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-mute-dark">Shop</h2>
          <ul className="flex flex-col">
            <li><Link to="/range" className="inline-flex min-h-11 items-center text-sm">The range</Link></li>
            <li><Link to="/range/fresh" className="inline-flex min-h-11 items-center text-sm">Fresh</Link></li>
            <li><Link to="/range/floral" className="inline-flex min-h-11 items-center text-sm">Floral</Link></li>
            <li><Link to="/range/woody" className="inline-flex min-h-11 items-center text-sm">Woody</Link></li>
            <li><Link to="/range/warm" className="inline-flex min-h-11 items-center text-sm">Warm</Link></li>
            <li><Link to="/discovery-set" className="inline-flex min-h-11 items-center text-sm">Discovery set</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-mute-dark">Help</h2>
          <ul className="flex flex-col">
            <li><Link to="/scent-finder" className="inline-flex min-h-11 items-center text-sm">Scent finder</Link></li>
            <li><Link to="/our-scents" className="inline-flex min-h-11 items-center text-sm">How we make them</Link></li>
            <li><Link to="/our-scents#sample" className="inline-flex min-h-11 items-center text-sm">The sample credit</Link></li>
            <li><a href={`tel:${SITE.phoneIntl}`} className="inline-flex min-h-11 items-center text-sm">{SITE.phone}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-mute-dark">Visit</h2>
          <p className="text-sm">{SITE.address.street}<br />{SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</p>
          <div className="mt-3 flex gap-4 text-sm"><a href={SITE.social.instagram} className="inline-flex min-h-11 items-center underline">Instagram</a><a href={SITE.social.facebook} className="inline-flex min-h-11 items-center underline">Facebook</a></div>
        </div>
      </div>
      <div className="wrap border-t border-white/15 py-6 text-xs text-mute-dark">© {SITE.legalName}, trading as {SITE.tradingAs} · Company no. {SITE.companyNumber} · VAT {SITE.vat}</div>
    </footer>
  );
}
