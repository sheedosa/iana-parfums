import type { CSSProperties } from "react";
import CAPS from "../data/jost-caps.json";

/** Tracking of the name at full width, in em. The same figure as `--track-fit` in index.css. */
const TRACK = 0.06;
type Table = { adv: Record<string, number>; kern: Record<string, number> };
const T = CAPS as Record<"200" | "300", Table>;

/** The width of a line of Jost capitals in em at one of the measured weights: advances plus kerning, from the table
    made by `scripts/caps-widths.mjs`. A character the table does not hold counts as an average capital. */
function width(caps: string, t: Table) {
  const ch = [...caps];
  return ch.reduce((n, c, i) => n + (t.adv[c] ?? 0.62) + (i ? t.kern[ch[i - 1] + c] ?? 0 : 0), 0);
}

/** The width of a name in em as it is set: Jost capitals at `weight` (200 to 300) with the tracking between the
    letters (not after the last one, which the CSS takes back with a negative margin). It is worked out from the
    table, not measured in the browser, so the prerendered page, the first render and the page after the face has
    loaded all give the same size and the name never moves. */
export function emOf(text: string, weight = 200) {
  const caps = text.toUpperCase();
  const gaps = Math.max(0, [...caps].length - 1) * TRACK;
  const a = width(caps, T[200]), b = width(caps, T[300]);
  return (a + (b - a) * ((weight - 200) / 100) + gaps) * 1.012;
}
export const useEm = (text: string) => emOf(text);

/** A scent's name set to fill the width of its container. CSS does the sizing with container units, so the size
    follows the page at every width; `cap` stops it growing past a size. `--em-s` is the width at the slightly
    heavier weight a narrow phone uses (250, see `.fit` in index.css). */
export function FitName({ text, cap }: { text: string; cap?: string }) {
  return <span className="fit block"><span style={{ ["--em" as string]: emOf(text).toFixed(4), ["--em-s" as string]: emOf(text, 250).toFixed(4), ...(cap ? { ["--cap" as string]: cap } : {}) } as CSSProperties}>{text}</span></span>;
}
