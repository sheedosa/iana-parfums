import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** A fact: a term, a dotted leader and its value at the right. Goes inside a <dl>. */
export function Fact({ term, children, lg = false }: { term: ReactNode; children: ReactNode; lg?: boolean }) {
  return <div className={`row ${lg ? "row-lg" : ""}`}><dt className="t">{term}</dt><span className="lead" aria-hidden="true" /><dd className="v">{children}</dd></div>;
}

/** A row that goes somewhere: the page's name, a leader and a few words on what it is. */
export function GoRow({ to, term, children, href }: { to?: string; href?: string; term: ReactNode; children: ReactNode }) {
  const inner = <><span className="t">{term}</span><span className="lead" aria-hidden="true" /><span className="v text-mute">{children}</span></>;
  return <li>{href ? <a href={href} className="row row-lg">{inner}</a> : <Link to={to ?? "/"} className="row row-lg">{inner}</Link>}</li>;
}

/** A row that is a choice. The chosen one is underlined. */
export function PickRow({ on, onClick, term, children }: { on: boolean; onClick: () => void; term: ReactNode; children: ReactNode }) {
  return <button type="button" className="row" aria-pressed={on} onClick={onClick}><span className="t">{term}</span><span className="lead" aria-hidden="true" /><span className="v">{children}</span></button>;
}

/** The other ways to buy, as a quiet list. `skip` leaves out the page you are on. */
export function OtherWays({ skip = "", finder = true }: { skip?: string; finder?: boolean }) {
  const rows: [string, string, string][] = [
    ["/discovery-set", "The discovery set", "All four scents as 2ml samples in one box"],
    ["/gift-box", "The gift box", "A bottle from the range, boxed for giving"],
    ["/seasonal-edition", "The seasonal edition", "Coming soon. Register your interest"],
    ...(finder ? [["/scent-finder", "The scent finder", "Three questions point you to one or two of the four"] as [string, string, string]] : []),
    ["/visit", "The counter in Tooting", "Smell every scent in the shop"],
  ];
  return <ul className="col">{rows.filter((r) => r[0] !== skip).map(([to, t, v]) => <GoRow key={to} to={to} term={t}>{v}</GoRow>)}</ul>;
}

/** The sample credit as it reads on an order: two lines of a bill, no box. */
export function Slip({ bottle, sample }: { bottle: string; sample: string }) {
  return (
    <dl className="col" aria-label="How the sample credit reads on your order">
      <Fact term="50ml bottle">{bottle}</Fact>
      <Fact term="Your 2ml sample, already paid">less {sample}</Fact>
    </dl>
  );
}
