import { VLink, bottleVT } from "./VLink";
import { Bottle } from "./Art";
import { usePrefs } from "../lib/prefs";
import { findScents, fullName, type Scent } from "../lib/store";
import { gbp } from "../data/site";

export const whenText = (s: Scent) => (s.when === "Both" ? "day or evening" : s.when.toLowerCase());
/** One line for a scent: its family, strength and when. */
export const scentLine = (s: Scent) => `${s.family}, ${s.strength.toLowerCase()}, for ${whenText(s)}`;

/** What the shopper has told us about this scent, in a short line; nothing if they have told us nothing. */
export function useNote(s: Scent) {
  const { answers, sampled } = usePrefs();
  if (sampled.includes(s.handle)) return "You have the sample";
  if (answers && findScents(answers).some((x) => x.handle === s.handle)) return "Your finder pick";
  return null;
}

/** A scent beside another: the bottle on Sage standing on a shelf line, its name, its line and its prices. */
export function ScentCard({ s }: { s: Scent }) {
  const note = useNote(s);
  return (
    <VLink to={`/scents/${s.handle}`} className="group flex flex-col">
      <span className="flex aspect-[4/5] flex-col lg:aspect-[5/6] justify-end rounded-pill bg-sage px-6 pt-8">
        <span className="flex min-h-0 flex-1 border-b border-ink" style={bottleVT(s.handle)}><Bottle scent={s} className="h-full w-full" /></span>
        <span className="h-6 shrink-0" aria-hidden="true" />
      </span>
      <span className="flex flex-col gap-1 pt-4">
        <h3 className="display t-h3 underline-offset-4 group-hover:underline">{fullName(s)}</h3>
        <span className="voice">{scentLine(s)}</span>
        <span className="text-base text-mute">2ml sample £[SAMPLE PRICE], 50ml {gbp(s.prices["50ml"])}. A working name.</span>
        {note && <span className="text-base">{note}.</span>}
      </span>
    </VLink>
  );
}
