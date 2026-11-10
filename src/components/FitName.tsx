import { useEffect, useState, type CSSProperties } from "react";

const FACE = '400 100px "Libre Bodoni"';
/** Rough width of a word in em before the face has loaded: capitals and m, w are wide; f, i, j, l, t are narrow. */
const guess = (t: string) => [...t].reduce((n, ch) => n + (/[MW]/.test(ch) ? 0.92 : /[A-Z]/.test(ch) ? 0.7 : /[mw]/.test(ch) ? 0.84 : /[fijlt]/.test(ch) ? 0.34 : 0.56), 0);

/** The width of a word in em in the display face: a guess at first, measured once the face has loaded. */
export function useEm(text: string) {
  const [em, setEm] = useState(() => guess(text));
  useEffect(() => {
    let live = true;
    const measure = () => {
      if (!live || !document.fonts.check(FACE)) return;
      const c = document.createElement("canvas").getContext("2d");
      if (!c) return;
      c.font = FACE;
      const w = c.measureText(text).width / 100;
      if (w > 0) setEm(w);
    };
    document.fonts.load(FACE).then(measure).catch(() => {});
    return () => { live = false; };
  }, [text]);
  return em * 1.012;
}

/** A scent's name set to fill the width of its container. CSS does the sizing with container units, so the size
    follows the page at every width; `cap` stops it growing past a size. */
export function FitName({ text, cap }: { text: string; cap?: string }) {
  const em = useEm(text);
  return <span className="fit block"><span style={{ ["--em" as string]: em.toFixed(4), ...(cap ? { ["--cap" as string]: cap } : {}) } as CSSProperties}>{text}</span></span>;
}
