import { Link, NavLink } from "react-router-dom";
import { DELIVERY_LINE, SITE } from "../data/site";
import { usePrefs } from "../lib/prefs";
import { useCurrent } from "../lib/stage";
import { findScents, fullName, store } from "../lib/store";
import { Bottle } from "./Art";
import { VLink } from "./VLink";

const BASE = import.meta.env.BASE_URL;

export function Logo({ className = "" }: { className?: string }) {
  return <img src={`${BASE}img/logo/iana-parfums-horizontal-white.svg`} alt="I&A Parfums" className={className} width="340" height="49" />;
}

/** The header: the lockup and two links. The four scents are in the dock, not here. */
export function Header() {
  const nav = ({ isActive }: { isActive: boolean }) => `inline-flex min-h-11 items-center underline-offset-[6px] hover:underline ${isActive ? "underline decoration-amber decoration-2" : ""}`;
  return (
    <header className="wrap flex min-h-[4.5rem] items-center justify-between gap-6">
      <Link to="/" className="inline-flex min-h-11 shrink-0 items-center"><Logo className="h-[1.625rem] w-auto sm:h-8" /></Link>
      <nav aria-label="Site" className="flex gap-6 sm:gap-9">
        <NavLink to="/discovery-set" className={nav}>Samples</NavLink>
        <NavLink to="/visit" className={nav}>Visit</NavLink>
      </nav>
    </header>
  );
}

/** The dock: the range standing on the shelf line along the bottom of every page. The scent the page is showing
    steps forward; the one the finder chose for you is marked. */
export function Dock() {
  const current = useCurrent();
  const { answers } = usePrefs();
  const picks = answers ? findScents(answers).map((s) => s.handle) : [];
  return (
    <nav aria-label="The four scents" className="dock">
      <ul className="wrap">
        {store.scents().map((s) => (
          <li key={s.handle} className="min-w-0">
            <VLink to={`/scents/${s.handle}`} aria-current={current === s.handle ? "true" : undefined}>
              <span className="shelf"><Bottle scent={s} plain />{picks[0] === s.handle && <span className="pick">Your pick</span>}</span>
              <span className="name">{fullName(s)}</span>
            </VLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const f = "inline-flex min-h-11 items-center underline underline-offset-4";
/** The footer: a few lines of small text above the dock. */
export function Footer() {
  const a = SITE.address;
  return (
    <footer className="wrap mt-24 pb-8 text-[15px] text-mute">
      <p className="max-w-[68rem]">{SITE.tradingAs} is a working name of {SITE.legalName}, company no. {SITE.companyNumber}, VAT {SITE.vat}. {a.street}, {a.area}, {a.city} {a.postcode}, open {SITE.hours}. {SITE.preview && "This is a concept preview: the four scents are samples with working names, and online ordering opens at launch. "}{DELIVERY_LINE}.</p>
      <p className="flex flex-wrap gap-x-6 text-bone">
        <a href={`tel:${SITE.phoneIntl}`} className={f}>{SITE.phone}</a>
        <Link to="/delivery-returns" className={f}>Delivery and returns</Link>
        <Link to="/range" className={f}>The range</Link>
        <Link to="/scent-finder" className={f}>Scent finder</Link>
        <Link to="/our-scents" className={f}>Our scents</Link>
        <a href={SITE.social.instagram} className={f}>Instagram</a>
        <a href={SITE.social.facebook} className={f}>Facebook</a>
        {SITE.family.map((x) => <a key={x.name} href={x.url} className={f}>{x.name}</a>)}
      </p>
    </footer>
  );
}
