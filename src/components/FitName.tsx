import { useEffect, useState, type CSSProperties } from "react";

const FACE = '200 100px "Jost"';
/** Tracking of the name at full width, in em. The same figure as `--track-fit` in index.css. */
const TRACK = 0.06;
/** Rough width of a capital in em before the face has loaded: Jost's round letters and M, W are wide; I and J are narrow. */
const guess = (t: string) => [...t].reduce((n, ch) => n + (/[MW]/.test(ch) ? 0.86 : /[CDGOQ]/.test(ch) ? 0.74 : /[IJ]/.test(ch) ? 0.28 : /[EFLST]/.test(ch) ? 0.5 : /\s/.test(ch) ? 0.26 : 0.62), 0);

/** The width of a name in em as it is set: Jost 200 capitals with the tracking between the letters (not after the
    last one, which the CSS takes back with a negative margin). A guess at first, measured once the face has loaded. */
export function useEm(text: string) {
  const caps = text.toUpperCase();
  const gaps = Math.max(0, [...caps].length - 1) * TRACK;
  const [em, setEm] = useState(() => guess(caps));
  useEffect(() => {
    let live = true;
    const measure = () => {
      if (!live || !document.fonts.check(FACE)) return;
      const c = document.createElement("canvas").getContext("2d");
      if (!c) return;
      c.font = FACE;
      const w = c.measureText(caps).width / 100;
      if (w > 0) setEm(w);
    };
    document.fonts.load(FACE).then(measure).catch(() => {});
    return () => { live = false; };
  }, [caps]);
  return (em + gaps) * 1.012;
}

/** A scent's name set to fill the width of its container. CSS does the sizing with container units, so the size
    follows the page at every width; `cap` stops it growing past a size. */
export function FitName({ text, cap }: { text: string; cap?: string }) {
  const em = useEm(text);
  return <span className="fit block"><span style={{ ["--em" as string]: em.toFixed(4), ...(cap ? { ["--cap" as string]: cap } : {}) } as CSSProperties}>{text}</span></span>;
}
