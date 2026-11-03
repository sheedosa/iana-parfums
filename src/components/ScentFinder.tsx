import { useState } from "react";
import { Link } from "react-router-dom";
import { Bottle } from "./Art";
import { usePrefs } from "../lib/prefs";
import { FAMILIES, STRENGTHS, WHENS, findScents, type Answers, type Family, type Strength, type When } from "../lib/store";

const Q = [
  { key: "when", label: "When will you wear it?", options: WHENS, hint: { Day: "Work, daytime, every day", Evening: "Dinner, nights out, winter" } },
  { key: "family", label: "Which family?", options: FAMILIES, hint: { Fresh: "Citrus, green, water", Floral: "Rose, jasmine, iris", Woody: "Cedar, vetiver, smoke", Warm: "Honey, amber, resins" } },
  { key: "strength", label: "How strong?", options: STRENGTHS, hint: { Light: "Close to the skin", Present: "People will notice" } },
] as const;

type Partial = { when?: When; family?: Family; strength?: Strength };

/** Three questions, answered by pressing. Results appear as soon as all three are answered and are saved on this device. */
export function ScentFinder({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  const { answers, setAnswers } = usePrefs();
  const [draft, setDraft] = useState<Partial>(answers ?? {});
  const done = draft.when && draft.family && draft.strength ? (draft as Answers) : null;
  const picks = done ? findScents(done) : [];

  const pick = (key: keyof Partial, value: string) => {
    const next = { ...draft, [key]: value } as Partial;
    setDraft(next);
    if (next.when && next.family && next.strength) setAnswers(next as Answers);
  };
  const reset = () => { setDraft({}); setAnswers(null); };
  const chip = dark ? "chip-dark" : "chip";

  return (
    <div className="flex flex-col gap-6">
      <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-3"}`}>
        {Q.map((q, i) => (
          <fieldset key={q.key} className="flex flex-col gap-3">
            <legend className={`mb-3 flex items-baseline gap-3 ${dark ? "text-paper" : ""}`}><span className="display text-[28px]">{i + 1}</span><span className="text-[17px]">{q.label}</span></legend>
            <div className="flex flex-wrap gap-2">
              {q.options.map((o) => (
                <button key={o} type="button" className={`${chip} flex-col items-start px-4 py-2 leading-tight`} aria-pressed={draft[q.key] === o} onClick={() => pick(q.key, o)}>
                  <span>{o}</span>
                  <span className={`text-[12px] ${draft[q.key] === o ? (dark ? "text-mute" : "text-mute-dark") : dark ? "text-mute-dark" : "text-mute"}`}>{(q.hint as Record<string, string>)[o]}</span>
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div role="status" aria-live="polite" className="flex flex-col gap-4">
        {done ? (
          <>
            <p className={`text-[17px] ${dark ? "text-paper" : ""}`}>{picks.length === 1 ? "One scent" : `${picks.length} scents`} for {done.when.toLowerCase()}, {done.family.toLowerCase()} and {done.strength.toLowerCase()}. Saved on this device.</p>
            <ul className="grid gap-3 sm:grid-cols-3">
              {picks.map((s) => (
                <li key={s.handle}>
                  <Link to={`/scents/${s.handle}`} className={`lift flex min-h-11 items-center gap-4 rounded-pill p-3 ${dark ? "bg-paper text-ink" : "bg-paper"}`}>
                    <Bottle colour={s.colour} cap={s.cap} className="h-16 w-auto shrink-0" />
                    <span className="flex flex-col"><span className="display text-[22px] leading-tight">{s.name}</span><span className="text-sm text-mute">{s.line}</span><span className="label mt-1 text-[11px] text-mute">Sample £[PRICE]</span></span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link to="/discovery-set" className={`btn ${dark ? "btn-outline-paper" : "btn-ghost"}`}>Or try all seven</Link>
              <button type="button" onClick={reset} className={`inline-flex min-h-11 items-center px-2 text-sm underline ${dark ? "text-paper" : ""}`}>Start again</button>
            </div>
          </>
        ) : (
          <p className={`text-sm ${dark ? "text-mute-dark" : "text-mute"}`}>Answer all three and we narrow the seven to two or three. Nothing is sent anywhere; your answers stay on this device.</p>
        )}
      </div>
    </div>
  );
}
