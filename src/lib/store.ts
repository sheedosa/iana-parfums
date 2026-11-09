// Commerce goes through this module only. Preview mode reads scents.json; at launch the Shopify adapter
// (ported from iana-schoolwear) implements the same interface, with Size (2ml sample / 50ml / 100ml) as the
// variant option and family, strength and when as metafields or tags.
import data from "../data/scents.json";
import { gbp, type Size } from "../data/site";

export const FAMILIES = ["Fresh", "Floral", "Woody", "Warm"] as const;
export type Family = (typeof FAMILIES)[number];
export const STRENGTHS = ["Light", "Present"] as const;
export type Strength = (typeof STRENGTHS)[number];
export const WHENS = ["Day", "Evening"] as const;
export type When = (typeof WHENS)[number];

export type Scent = {
  handle: string;
  name: string; // placeholder name in the house style, "No. 1"
  family: Family;
  strength: Strength;
  when: When | "Both";
  colour: string; // swatch, used for the liquid in the drawn bottle
  cap: string;
  prices: { "50ml": number; "100ml": number }; // sample prices, GBP
  pairs: string[]; // handles to "wear it with"
  sizes: Size[];
};
export type FamilyPage = { handle: string; title: string; blurb: string };

const d = data as unknown as { families: FamilyPage[]; scents: Scent[] };

/** "No. 1 Fresh": the name as it reads on the label and in headings. */
export const fullName = (s: Scent) => `${s.name} ${s.family}`;

/** Price text for a size. The 2ml price is not confirmed; bottle prices are samples. */
export const priceText = (s: Scent, size: Size) => (size === "2ml sample" ? "£[SAMPLE PRICE]" : gbp(s.prices[size]));

export const store = {
  families: (): FamilyPage[] => d.families,
  family: (handle: string) => d.families.find((f) => f.handle === handle),
  scents: (f: { family?: string } = {}): Scent[] =>
    d.scents.filter((s) => !f.family || f.family === "all" || s.family.toLowerCase() === f.family.toLowerCase()),
  scent: (handle: string) => d.scents.find((s) => s.handle === handle),
  pairs: (s: Scent): Scent[] => s.pairs.map((h) => d.scents.find((x) => x.handle === h)).filter((x): x is Scent => Boolean(x)),
};

/** Scent finder: three answers rank the range. Family counts most; the closest one or two are returned. */
export type Answers = { when: When; family: Family; strength: Strength };
export function findScents(a: Answers): Scent[] {
  const score = (s: Scent) =>
    (s.family === a.family ? 4 : 0) + (s.when === a.when ? 2 : s.when === "Both" ? 1 : 0) + (s.strength === a.strength ? 1 : 0);
  const ranked = [...d.scents].map((s) => ({ s, n: score(s) })).sort((x, y) => y.n - x.n);
  // The family match, plus the next closest if it shares at least when or strength.
  return ranked.filter((r, i) => i === 0 || (i === 1 && r.n >= 2)).map((r) => r.s);
}
export const answersLabel = (a: Answers) => `${a.when} · ${a.family} · ${a.strength}`;
