import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { DELIVERY_LINE, SITE } from "../data/site";
import { usePrefs } from "../lib/prefs";
import { findScents, fullName } from "../lib/store";

const BASE = import.meta.env.BASE_URL;
export const NAV = [
  { to: "/range", label: "The range" },
  { to: "/discovery-set", label: "Discovery set" },
  { to: "/gift-box", label: "Gift box" },
  { to: "/seasonal-edition", label: "Seasonal edition" },
  { to: "/visit", label: "Visit" },
];
const MORE = [
  { to: "/scent-finder", label: "Scent finder" },
  { to: "/our-scents", label: "Our scents" },
  { to: "/delivery-returns", label: "Delivery and returns" },
];

export function Logo({ white = false, className = "" }: { white?: boolean; className?: string }) {
  return <img src={`${BASE}img/logo/iana-parfums-horizontal-${white ? "white" : "ochre"}.svg`} alt="I&A Parfums" className={className} width="340" height="49" />;
}

/** One strip: the message on the left (your finder picks once answered), a small outlined Preview tag on the right. */
function Strip() {
  const { answers } = usePrefs();
  const picks = answers ? findScents(answers) : [];
  return (
    <section aria-label="Notices" className="on-ink bg-deep text-paper">
      <div className="wrap flex min-h-9 items-center justify-between gap-3 text-[14px] tracking-wide">
        <p className="min-w-0 truncate">
          {answers
            ? <>Your scents: {picks.map((s, i) => <span key={s.handle}>{i ? ", " : ""}<Link to={`/scents/${s.handle}`} className="strip-link">{fullName(s)}</Link></span>)}<span className="hidden sm:inline"> · <Link to="/scent-finder" className="strip-link">change</Link></span></>
            : <><span className="hidden sm:inline">Smell it first: every scent as a 2ml sample before the bottle · </span><Link to="/scent-finder" className="strip-link">Find my scent</Link></>}
        </p>
        {SITE.preview && <span className="label shrink-0 rounded-pill border border-paper/70 px-2 py-0.5 text-[11px]" title="Concept preview: scents are samples and ordering opens at launch">Preview</span>}
      </div>
    </section>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { answers } = usePrefs();
  return (
    <>
      <Strip />
      <header className="on-ink sticky top-0 z-40 border-b border-white/15 bg-ink text-paper">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center" onClick={() => setOpen(false)}><Logo white className="h-6 w-auto sm:h-8" /></Link>
          <nav aria-label="Site" className="hidden gap-6 text-[15px] tracking-wide lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${isActive ? "border-paper" : "border-transparent hover:border-paper/50"}`}>{n.label}</NavLink>)}
          </nav>
          <Link to="/scent-finder" className="inline-flex min-h-11 items-center px-1 text-[15px] underline-offset-4 hover:underline sm:px-3">{answers ? "My scents" : <><span className="sm:hidden">Finder</span><span className="hidden sm:inline">Find my scent</span></>}</Link>
        </div>
        {open && (
          <nav aria-label="Site" className="border-t border-white/15 bg-ink lg:hidden">
            <div className="wrap flex flex-col py-2">
              {[...NAV, ...MORE].map((n, i, all) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={`flex min-h-12 items-center text-lg ${i < all.length - 1 ? "border-b border-white/15" : ""}`}>{n.label}</Link>)}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

const fLink = "inline-flex min-h-11 items-center text-base";
export function Footer() {
  return (
    <footer className="on-ink mt-20 bg-deep text-paper">
      <div className="border-b border-white/15">
        <p className="wrap py-4 text-base"><Link to="/delivery-returns" className="underline underline-offset-4">{DELIVERY_LINE}</Link> · Click and collect from {SITE.delivery.collect}</p>
      </div>
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo white className="h-7 w-auto self-start" />
          <p className="max-w-xs text-base text-mute-dark">Eau de parfum from Tooting, London. Part of the I&amp;A family with {SITE.family.map((f, i) => <span key={f.name}>{i ? (i === SITE.family.length - 1 ? " and " : ", ") : ""}<a className="underline" href={f.url}>{f.name}</a></span>)}.</p>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-mute-dark">Shop</h2>
          <ul className="flex flex-col">
            <li><Link to="/range" className={fLink}>The range</Link></li>
            <li><Link to="/discovery-set" className={fLink}>Discovery set</Link></li>
            <li><Link to="/gift-box" className={fLink}>Gift box</Link></li>
            <li><Link to="/seasonal-edition" className={fLink}>The seasonal edition</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-mute-dark">Help</h2>
          <ul className="flex flex-col">
            <li><Link to="/scent-finder" className={fLink}>Scent finder</Link></li>
            <li><Link to="/our-scents" className={fLink}>Our scents</Link></li>
            <li><Link to="/delivery-returns" className={fLink}>Delivery and returns</Link></li>
            <li><a href={`tel:${SITE.phoneIntl}`} className={fLink}>{SITE.phone}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-mute-dark">Visit</h2>
          <p className="text-base">{SITE.address.street}<br />{SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</p>
          <div className="mt-3 flex gap-4 text-base"><a href={SITE.social.instagram} className="inline-flex min-h-11 items-center underline">Instagram</a><a href={SITE.social.facebook} className="inline-flex min-h-11 items-center underline">Facebook</a></div>
        </div>
      </div>
      <div className="wrap border-t border-white/15 py-6 text-xs text-mute-dark">© {SITE.legalName}, trading as {SITE.tradingAs} (working name) · Company no. {SITE.companyNumber} · VAT {SITE.vat}</div>
    </footer>
  );
}
