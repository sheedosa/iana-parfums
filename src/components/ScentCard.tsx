import { VLink, bottleVT } from "./VLink";
import { Bottle } from "./Art";
import { usePrefs } from "../lib/prefs";
import { findScents, fullName, type Scent } from "../lib/store";
import { gbp } from "../data/site";

/** A scent in the range: the bottle on Sage, its name, family and prices. Bottles keep their family proportion. */
export function ScentCard({ s, tall = false }: { s: Scent; tall?: boolean }) {
  const { answers, sampled } = usePrefs();
  const forYou = answers ? findScents(answers).some((x) => x.handle === s.handle) : false;
  const tried = sampled.includes(s.handle);
  return (
    <VLink to={`/scents/${s.handle}`} className="lift group flex flex-col gap-2">
      <div className={`relative flex flex-col items-center justify-end overflow-hidden rounded-pill bg-sage px-4 pt-10 ${tall ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
        <span className="flex min-h-0 w-full flex-1" style={bottleVT(s.handle)}><Bottle scent={s} className="h-full w-full" /></span>
        <span className="-mx-4 h-[6%] shrink-0 self-stretch border-t border-ink/25 bg-[#cdd8d2]" aria-hidden="true" />
        {tried ? <span className="label absolute left-3 top-3 rounded-pill bg-ink px-2 py-1.5 text-[11px] text-paper">Sampled</span>
          : forYou ? <span className="label absolute left-3 top-3 rounded-pill bg-paper px-2 py-1.5 text-[11px] text-ink">For you</span> : null}
      </div>
      <h3 className="display mt-1 text-[28px] leading-tight group-hover:underline">{fullName(s)}</h3>
      <p className="-mt-1 text-base text-mute">{s.family} · working name · {s.strength.toLowerCase()}, for {s.when === "Both" ? "day or evening" : s.when.toLowerCase()}</p>
      <p className="text-base">2ml £[SAMPLE PRICE] · 50ml {gbp(s.prices["50ml"])}</p>
    </VLink>
  );
}
