import { useState } from "react";
import { Link } from "react-router-dom";
import { Bottle } from "./Art";
import { usePrefs } from "../lib/prefs";
import { FAMILIES, STRENGTHS, WHENS, findScents, fullName, type Answers, type Family, type Strength, type When } from "../lib/store";

const Q = [
  { key: "when", label: "When will you wear it?", options: WHENS, hint: { Day: "Work, daytime, every day", Evening: "Dinner, nights out, winter" } },
  { key: "family", label: "Which family do you lean to?", options: FAMILIES, hint: { Fresh: "Citrus, green, clean", Floral: "Flowers, soft to full", Woody: "Dry woods, quiet", Warm: "Resins, amber, sweet" } },
  { key: "strength", label: "How strong?", options: STRENGTHS, hint: { Light: "Close to the skin", Present: "People will notice" } },
] as const;

type Draft = { when?: When; family?: Family; strength?: Strength };

/** Three questions, answered by pressing. Results appear once all three are answered and are saved on this device.
 *  The full widget lives on Home and /scent-finder only; elsewhere pages link to it. */
export function ScentFinder({ dark = false, columns = true }: { dark?: boolean; columns?: boolean }) {
  const { answers, setAnswers } = usePrefs();
  const [draft, setDraft] = useState<Draft>(answers ?? {});
  const done = draft.when && draft.family && draft.strength ? (draft as Answers) : null;
  const picks = done ? findScents(done) : [];

  const pick = (key: keyof Draft, value: string) => {
    const next = { ...draft, [key]: value } as Draft;
    setDraft(next);
    if (next.when && next.family && next.strength) setAnswers(next as Answers);
  };
  const reset = () => { setDraft({}); setAnswers(null); };
  const chip = dark ? "chip-dark" : "chip";
  const mute = dark ? "text-mute-dark" : "text-mute";

  return (
    <div className="flex flex-col gap-8">
      <div className={`grid gap-7 ${columns ? "lg:grid-cols-[1fr_1.6fr_1fr]" : ""}`}>
        {Q.map((q) => (
          <fieldset key={q.key} className="flex min-w-0 flex-col">
            <legend className={`mb-3 text-[18px] ${dark ? "text-paper" : ""}`}>{q.label}</legend>
            <div className="flex flex-wrap gap-2">
              {q.options.map((o) => (
                <button key={o} type="button" className={`${chip} flex-col items-start justify-center px-4 py-2 leading-tight`} aria-pressed={draft[q.key] === o} onClick={() => pick(q.key, o)}>
                  <span className="text-base">{o}</span>
                  <span className={`text-[14px] ${draft[q.key] === o ? (dark ? "text-mute" : "text-mute-dark") : mute}`}>{(q.hint as Record<string, string>)[o]}</span>
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div role="status" aria-live="polite" className="flex flex-col gap-4">
        {done ? (
          <>
            <p className={`text-[18px] ${dark ? "text-paper" : ""}`}>{picks.length === 1 ? "One scent" : `${picks.length} scents`} for {done.when.toLowerCase()}, {done.family.toLowerCase()} and {done.strength.toLowerCase()}. Saved on this device.</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {picks.map((s, i) => (
                <li key={s.handle}>
                  <Link to={`/scents/${s.handle}`} className={`lift flex min-h-11 items-center gap-4 rounded-pill p-3 ${dark ? "bg-paper text-ink" : "border border-ink bg-paper"}`}>
                    <span className="flex h-24 w-20 shrink-0 items-end justify-center rounded-pill bg-sage pt-2"><Bottle scent={s} plain className="h-full w-full" /></span>
                    <span className="flex flex-col"><span className="label text-mute">{i === 0 ? "Closest" : "Also try"}</span><span className="display text-[24px] leading-tight">{fullName(s)}</span><span className="text-base text-mute">2ml sample £[SAMPLE PRICE]</span></span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link to="/discovery-set" className={`btn ${dark ? "btn-outline-paper" : "btn-ghost"}`}>Or try all four</Link>
              <button type="button" onClick={reset} className={`inline-flex min-h-11 items-center px-2 text-base underline ${dark ? "text-paper" : ""}`}>Start again</button>
            </div>
          </>
        ) : (
          <p className={`text-base ${mute}`}>Answer all three and we point you to one or two of the four. Your answers stay on this device.</p>
        )}
      </div>
    </div>
  );
}
