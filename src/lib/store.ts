// Commerce goes through this module only. Preview mode reads scents.json; at launch the Shopify adapter
// (ported from iana-schoolwear) implements the same interface, with Size (2ml sample / 50ml / 100ml) as the
// variant option and family, strength and when as metafields or tags.
import data from "../data/scents.json";
import type { Size } from "../data/site";

export const FAMILIES = ["Fresh", "Floral", "Woody", "Warm"] as const;
export type Family = (typeof FAMILIES)[number];
export const STRENGTHS = ["Light", "Present"] as const;
export type Strength = (typeof STRENGTHS)[number];
export const WHENS = ["Day", "Evening"] as const;
export type When = (typeof WHENS)[number];

export type Scent = {
  handle: string;
  name: string;
  line: string; // two or three words under the name, the way a shelf label reads
  family: Family;
  strength: Strength;
  when: When | "Both";
  notes: { top: string[]; heart: string[]; base: string[] };
  story: string;
  colour: string; // swatch, used for the bottle fill
  cap: string;
  pairs: string[]; // handles to "wear it with"
  sizes: Size[];
};
export type FamilyPage = { handle: string; title: string; blurb: string };

const d = data as unknown as { families: FamilyPage[]; scents: Scent[] };

export const store = {
  families: (): FamilyPage[] => d.families,
  family: (handle: string) => d.families.find((f) => f.handle === handle),
  scents: (f: { family?: string; strength?: Strength[]; when?: When[] } = {}): Scent[] =>
    d.scents.filter((s) =>
      (!f.family || f.family === "all" || s.family.toLowerCase() === f.family.toLowerCase()) &&
      (!f.strength?.length || f.strength.includes(s.strength)) &&
      (!f.when?.length || s.when === "Both" || f.when.includes(s.when))),
  scent: (handle: string) => d.scents.find((s) => s.handle === handle),
  pairs: (s: Scent): Scent[] => s.pairs.map((h) => d.scents.find((x) => x.handle === h)).filter((x): x is Scent => Boolean(x)),
};

/** Scent finder: three answers narrow the range to the two or three closest scents. Family counts most. */
export type Answers = { when: When; family: Family; strength: Strength };
export function findScents(a: Answers): Scent[] {
  const score = (s: Scent) =>
    (s.family === a.family ? 4 : 0) + (s.when === a.when ? 2 : s.when === "Both" ? 1 : 0) + (s.strength === a.strength ? 1 : 0);
  const ranked = [...d.scents].map((s) => ({ s, n: score(s) })).sort((x, y) => y.n - x.n);
  const inFamily = ranked.filter((r) => r.s.family === a.family);
  const picks = inFamily.length >= 2 ? inFamily.slice(0, 3) : ranked.slice(0, 3);
  return picks.map((r) => r.s);
}
export const answersLabel = (a: Answers) => `${a.when} · ${a.family} · ${a.strength}`;
