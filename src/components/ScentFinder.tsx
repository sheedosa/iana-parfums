import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bottle, mix } from "./Art";
import { VLink } from "./VLink";
import { scentLine } from "./ScentCard";
import { usePrefs } from "../lib/prefs";
import { FAMILIES, STRENGTHS, WHENS, findScents, fullName, store, type Answers, type Family, type Strength, type When } from "../lib/store";

const Q = [
  { key: "when", label: "When will you wear it?", options: WHENS, hint: { Day: "Work, daytime, every day", Evening: "Dinner, nights out, winter" } },
  { key: "family", label: "Which family do you lean to?", options: FAMILIES, hint: { Fresh: "Citrus, green, clean", Floral: "Flowers, soft to full", Woody: "Dry woods, quiet", Warm: "Resins, amber, sweet" } },
  { key: "strength", label: "How strong?", options: STRENGTHS, hint: { Light: "Close to the skin", Present: "People will notice" } },
] as const;

type Draft = { when?: When; family?: Family; strength?: Strength };

/** Three questions, answered by pressing. Once all three are answered the range stands on its shelf and the picked
 *  bottle steps forward, the band takes its tint, and the answers are saved on this device: the same language as the
 *  Home hero. The full widget lives on Home and /scent-finder only; elsewhere pages link to it.
 *  `children` is the band's heading; `lead` is for the page that opens with the band. */
export function ScentFinder({ children, id, lead = false }: { children?: ReactNode; id?: string; lead?: boolean }) {
  const { answers, setAnswers } = usePrefs();
  const [draft, setDraft] = useState<Draft>(answers ?? {});
  const done = draft.when && draft.family && draft.strength ? (draft as Answers) : null;
  const picks = done ? findScents(done) : [];
  const [top, second] = picks;
  const left = Q.filter((q) => !draft[q.key]).length;

  const pick = (key: keyof Draft, value: string) => {
    const next = { ...draft, [key]: value } as Draft;
    setDraft(next);
    if (next.when && next.family && next.strength) setAnswers(next as Answers);
  };
  const reset = () => { setDraft({}); setAnswers(null); };

  return (
    <section id={id} className={`tint pb-14 sm:pb-20 ${lead ? "pt-3 lg:pt-6" : "pt-14 sm:pt-20"}`} style={{ backgroundColor: top ? mix("#fbfbf9", top.colour, 0.3) : "#d8e2dc" }}>
      <div className="wrap flex flex-col gap-9">
        {children}
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-[1fr_2fr_1fr]">
          {Q.map((q) => (
            <fieldset key={q.key} className="flex min-w-0 flex-col">
              <legend className="t-lede mb-3">{q.label}</legend>
              <div className={`grid grid-cols-2 gap-2 ${q.key === "family" ? "" : "lg:grid-cols-1"}`}>
                {q.options.map((o) => (
                  <button key={o} type="button" className="chip flex-col items-start justify-center whitespace-normal px-4 py-2 text-left leading-tight" aria-pressed={draft[q.key] === o} onClick={() => pick(q.key, o)}>
                    <span>{o}</span>
                    <span className={`t-small ${draft[q.key] === o ? "text-mute-dark" : "text-mute"}`}>{(q.hint as Record<string, string>)[o]}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div role="status" aria-live="polite">
          {done && top ? (
            <div className="grid items-end gap-x-14 gap-y-6 border-t border-ink/30 pt-8 lg:grid-cols-[1.25fr_1fr]">
              <div className="flex h-[clamp(140px,21vw,270px)] items-end border-b border-ink">
                {store.scents().map((x) => {
                  const rank = picks.findIndex((p) => p.handle === x.handle);
                  return rank < 0
                    ? <span key={x.handle} className="shelf-btn h-full" data-step="back" aria-hidden="true"><Bottle scent={x} /></span>
                    : (
                      <VLink key={x.handle} to={`/scents/${x.handle}`} carry={x.handle} data-step={rank + 1} className="shelf-btn h-full">
                        <span data-carry={x.handle} className="flex h-full w-full items-end"><Bottle scent={x} /></span>
                        <span className="sr-only">{fullName(x)}, {rank === 0 ? "your closest scent" : "also worth trying"}</span>
                      </VLink>
                    );
                })}
              </div>
              <div key={top.handle} className="swap flex flex-col gap-2">
                <p className="text-base">Closest for {done.when.toLowerCase()}, {done.family.toLowerCase()} and {done.strength.toLowerCase()}. Saved on this device.</p>
                <p className="display t-h1">{fullName(top)}</p>
                <p className="voice">{scentLine(top)}</p>
                <p className="text-base">2ml sample £[SAMPLE PRICE].{second && <> Also worth trying: <Link to={`/scents/${second.handle}`} className="link">{fullName(second)}</Link>.</>}</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
                  <VLink to={`/scents/${top.handle}`} carry={top.handle} className="btn btn-ink">Open {fullName(top)}</VLink>
                  <Link to="/discovery-set" className="link">Or try all four</Link>
                  <button type="button" onClick={reset} className="link">Start again</button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-base text-mute">{left === 3 ? "Answer all three and we point you to one or two of the four." : `${left === 1 ? "One more answer" : "Two more answers"} and we point you to one or two of the four.`} Your answers stay on this device.</p>
          )}
        </div>
      </div>
    </section>
  );
}
