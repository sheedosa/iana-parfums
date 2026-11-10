import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
      <div className="wrap flex min-h-9 items-center justify-between gap-3 text-[15px]">
        <p className="min-w-0 truncate">
          {answers
            ? <>Your scents: {picks.map((s, i) => <span key={s.handle}>{i ? " and " : ""}<Link to={`/scents/${s.handle}`} className="strip-link">{fullName(s)}</Link></span>)}<span className="hidden sm:inline">. <Link to="/scent-finder" className="strip-link">Change</Link></span></>
            : <><span className="hidden sm:inline">Every scent comes as a 2ml sample before the bottle. </span><Link to="/scent-finder" className="strip-link">Find my scent</Link></>}
        </p>
        {SITE.preview && <span className="label shrink-0 rounded-pill border border-paper/70 px-2 py-0.5 text-[11px]" title="Concept preview: scents are samples and ordering opens at launch">Preview</span>}
      </div>
    </section>
  );
}

/** The phone menu: a full panel with the whole nav, then the phone number, the address and the hours. */
function Menu({ onClose }: { onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    close.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !box.current) return;
      // Keep Tab inside the panel while it is open.
      const stops = [...box.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      const first = stops[0], last = stops[stops.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || !box.current.contains(at))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (at === last || !box.current.contains(at))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div ref={box} role="dialog" aria-modal="true" aria-label="Menu" className="panel on-ink fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-paper lg:hidden">
      <div className="wrap flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-white/15">
        <button ref={close} type="button" className="inline-flex h-11 w-11 items-center justify-center" aria-label="Close menu" onClick={onClose}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <Link to="/" className="inline-flex min-h-11 items-center" onClick={onClose}><Logo white className="h-6 w-auto sm:h-8" /></Link>
        <span className="w-11" aria-hidden="true" />
      </div>
      <nav aria-label="Menu" className="wrap flex flex-col pt-3">
        {NAV.map((n) => <NavLink key={n.to} to={n.to} onClick={onClose} className={({ isActive }) => `display t-h2 flex min-h-14 items-center border-b border-white/15 ${isActive ? "italic" : ""}`}>{n.label}</NavLink>)}
        <div className="grid grid-cols-1 pt-3 sm:grid-cols-3">
          {MORE.map((n) => <Link key={n.to} to={n.to} onClick={onClose} className="flex min-h-12 items-center text-[18px]">{n.label}</Link>)}
        </div>
      </nav>
      <div className="wrap mt-auto flex flex-col gap-1 pb-8 pt-8">
        <a href={`tel:${SITE.phoneIntl}`} className="display t-h3 inline-flex min-h-12 items-center self-start underline decoration-1 underline-offset-4">{SITE.phone}</a>
        <p className="text-base text-mute-dark">{SITE.address.street}, {SITE.address.area}, {SITE.address.city} {SITE.address.postcode}</p>
        <p className="text-base text-mute-dark">Open {SITE.hours}</p>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { answers } = usePrefs();
  const { pathname } = useLocation();
  const opener = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  const shut = () => { setOpen(false); opener.current?.focus(); };
  return (
    <>
      <Strip />
      <header className="on-ink sticky top-0 z-40 border-b border-white/15 bg-ink text-paper">
        <div className="wrap flex min-h-16 items-center justify-between gap-4">
          <button ref={opener} type="button" className="inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <Link to="/" className="inline-flex min-h-11 shrink-0 items-center"><Logo white className="h-6 w-auto sm:h-8" /></Link>
          <nav aria-label="Site" className="hidden gap-7 lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b ${isActive ? "border-paper" : "border-transparent hover:border-paper/60"}`}>{n.label}</NavLink>)}
          </nav>
          <Link to="/scent-finder" className="inline-flex min-h-11 items-center px-1 underline-offset-4 hover:underline sm:px-3">{answers ? "My scents" : <><span className="sm:hidden">Finder</span><span className="hidden sm:inline">Find my scent</span></>}</Link>
        </div>
      </header>
      {open && <Menu onClose={shut} />}
    </>
  );
}

const fLink = "inline-flex min-h-11 items-center text-base underline-offset-4 hover:underline";
export function Footer() {
  return (
    <footer className="on-ink bg-deep text-paper">
      <div className="wrap grid gap-x-10 gap-y-8 border-b border-white/15 py-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <p className="display t-h2 max-w-[22ch]">Every scent as a 2ml sample before the bottle.</p>
        <p className="text-base text-mute-dark"><Link to="/delivery-returns" className="text-paper underline underline-offset-4">{DELIVERY_LINE}</Link>. Click and collect from {SITE.delivery.collect}.</p>
      </div>
      <div className="wrap grid grid-cols-2 gap-x-8 gap-y-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <Logo white className="h-7 w-auto self-start" />
          <p className="max-w-xs text-base text-mute-dark">Eau de parfum from Tooting, London. Part of the I&amp;A family with {SITE.family.map((f, i) => <span key={f.name}>{i ? (i === SITE.family.length - 1 ? " and " : ", ") : ""}<a className="underline underline-offset-2" href={f.url}>{f.name}</a></span>)}.</p>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-mute-dark">Shop</h2>
          <ul className="flex flex-col">
            <li><Link to="/range" className={fLink}>The range</Link></li>
            <li><Link to="/discovery-set" className={fLink}>Discovery set</Link></li>
            <li><Link to="/gift-box" className={fLink}>Gift box</Link></li>
            <li><Link to="/seasonal-edition" className={fLink}>Seasonal edition</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label mb-3 font-sans text-mute-dark">Help</h2>
          <ul className="flex flex-col">
            <li><Link to="/scent-finder" className={fLink}>Scent finder</Link></li>
            <li><Link to="/our-scents" className={fLink}>Our scents</Link></li>
            <li><Link to="/delivery-returns" className={fLink}>Delivery and returns</Link></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h2 className="label mb-3 font-sans text-mute-dark">Visit</h2>
          <p className="text-base">{SITE.address.street}<br />{SITE.address.city} {SITE.address.postcode}<br />{SITE.hours}</p>
          <p><a href={`tel:${SITE.phoneIntl}`} className={`${fLink} underline`}>{SITE.phone}</a></p>
          <div className="flex gap-5"><a href={SITE.social.instagram} className={`${fLink} underline`}>Instagram</a><a href={SITE.social.facebook} className={`${fLink} underline`}>Facebook</a></div>
        </div>
      </div>
      <div className="wrap flex flex-col gap-x-8 gap-y-1 border-t border-white/15 py-6 text-[14px] text-mute-dark sm:flex-row sm:flex-wrap">
        <span>© {SITE.legalName}, trading as {SITE.tradingAs} (working name)</span>
        <span>Company no. {SITE.companyNumber}</span>
        <span>VAT {SITE.vat}</span>
      </div>
    </footer>
  );
}
