import { Link } from "react-router-dom";
import { Bottle } from "./Art";
import { usePrefs } from "../lib/prefs";
import { findScents, type Scent } from "../lib/store";

export function ScentCard({ s, dark = false }: { s: Scent; dark?: boolean }) {
  const { answers, sampled } = usePrefs();
  const forYou = answers ? findScents(answers).some((x) => x.handle === s.handle) : false;
  const tried = sampled.includes(s.handle);
  return (
    <Link to={`/scents/${s.handle}`} className="lift group flex flex-col gap-2.5">
      <div className={`relative flex aspect-[4/5] items-end justify-center overflow-hidden rounded-pill ${dark ? "bg-ink-soft" : "bg-sage"}`}>
        <Bottle colour={s.colour} cap={s.cap} stroke={dark ? "#fbfbf9" : "#45353a"} className="h-[78%] w-auto" />
        <span className="absolute bottom-3 left-3 h-5 w-5 rounded-pill border border-ink/30" style={{ background: s.colour }} aria-hidden="true" />
        {tried ? <span className="label absolute left-3 top-3 rounded-pill bg-ink px-2 py-1.5 text-[11px] text-paper">Sampled</span>
          : forYou ? <span className="label absolute left-3 top-3 rounded-pill bg-paper px-2 py-1.5 text-[11px] text-ink">For you</span> : null}
      </div>
      <h3 className={`display text-[26px] leading-tight group-hover:underline ${dark ? "text-paper" : ""}`}>{s.name}</h3>
      <p className={`-mt-1.5 text-sm ${dark ? "text-mute-dark" : "text-mute"}`}>{s.line} · {s.family}, {s.strength.toLowerCase()}</p>
      <p className={`-mt-1.5 text-sm ${dark ? "text-mute-dark" : "text-mute"}`}>Sample £[PRICE] · 50ml £[PRICE]</p>
    </Link>
  );
}
