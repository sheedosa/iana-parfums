import { useState } from "react";
import { Link } from "react-router-dom";
import { Bottle } from "./Art";
import { PickRow } from "./Rows";
import { VLink, bottleVT } from "./VLink";
import { scentLine } from "../lib/words";
import { usePrefs } from "../lib/prefs";
import { useStage } from "../lib/stage";
import { FAMILIES, STRENGTHS, WHENS, findScents, fullName, type Answers, type Family, type Strength, type When } from "../lib/store";

const Q = [
  { key: "when", label: "When will you wear it?", options: WHENS, hint: { Day: "Work, daytime, every day", Evening: "Dinner, nights out, winter" } },
  { key: "family", label: "Which family do you lean to?", options: FAMILIES, hint: { Fresh: "Citrus, green, clean", Floral: "Flowers, soft to full", Woody: "Dry woods, quiet", Warm: "Resins, amber, sweet" } },
  { key: "strength", label: "How strong?", options: STRENGTHS, hint: { Light: "Close to the skin", Present: "People will notice" } },
] as const;

type Draft = { when?: When; family?: Family; strength?: Strength };

/** Three questions, answered by choosing a row. Once all three are answered the closest scent is named, the page
    takes its wash, its bottle steps forward in the dock and is marked there, and the answers are saved on this
    device. Lives on /scent-finder only; other pages link to it. */
export function ScentFinder() {
  const { answers, setAnswers } = usePrefs();
  const [draft, setDraft] = useState<Draft>(answers ?? {});
  const done = draft.when && draft.family && draft.strength ? (draft as Answers) : null;
  const [top, second] = done ? findScents(done) : [];
  const left = Q.filter((q) => !draft[q.key]).length;
  useStage(top ? top.handle : null);

  const pick = (key: keyof Draft, value: string) => {
    const next = { ...draft, [key]: value } as Draft;
    setDraft(next);
    if (next.when && next.family && next.strength) setAnswers(next as Answers);
  };
  const reset = () => { setDraft({}); setAnswers(null); };

  return (
    <section className="wrap grid gap-x-16 gap-y-10 pt-10 lg:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col gap-8">
        {Q.map((q) => (
          <fieldset key={q.key} className="min-w-0">
            <legend className="serif t-h3">{q.label}</legend>
            {q.options.map((o) => <PickRow key={o} on={draft[q.key] === o} onClick={() => pick(q.key, o)} term={o}><span className="text-mute">{(q.hint as Record<string, string>)[o]}</span></PickRow>)}
          </fieldset>
        ))}
      </div>

      <div role="status" aria-live="polite" className="lg:pt-1">
        {done && top ? (
          <div key={top.handle} className="swap flex flex-col items-start gap-2">
            <p className="text-mute">Closest for {done.when.toLowerCase()}, {done.family.toLowerCase()} and {done.strength.toLowerCase()}. Saved on this device.</p>
            <VLink to={`/scents/${top.handle}`} tabIndex={-1} aria-hidden="true" className="stand h-[40svh] min-h-[260px] justify-start"><span className="flex h-full" style={bottleVT(top.handle)}><Bottle scent={top} /></span></VLink>
            <p className="serif t-h1">{fullName(top)}</p>
            <p className="t-lede">{scentLine(top)}</p>
            {second && <p>Also worth trying: <Link to={`/scents/${second.handle}`} className="link">{fullName(second)}</Link></p>}
            <VLink to={`/scents/${top.handle}`} className="act">Sample {fullName(top)}</VLink>
            <p className="flex flex-wrap gap-x-8"><Link to="/discovery-set" className="link">Or try all four</Link><button type="button" onClick={reset} className="link">Start again</button></p>
          </div>
        ) : (
          <p className="t-lede measure text-mute">{left === 3 ? "Answer all three and we point you to one or two of the four." : `${left === 1 ? "One more answer" : "Two more answers"} and we point you to one or two of the four.`} Your answers stay on this device.</p>
        )}
      </div>
    </section>
  );
}
