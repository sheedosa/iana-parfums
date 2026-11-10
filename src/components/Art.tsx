// Drawn imagery. Flat fills from the palette, one 1.5px line that stays 1.5px at any size
// (vector-effect: non-scaling-stroke), no gradients.
import type { ReactNode } from "react";
import type { Family, Scent } from "../lib/store";

const INK = "#45353a", PAPER = "#fbfbf9", SAGE = "#d8e2dc", DEEP = "#2a2326";
const NS = { vectorEffect: "non-scaling-stroke" as const };

/** True when white text reads better on this hex. */
export function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.55;
}
/** Flat mix of two hex colours (t = share of b). Used for the glass tint: no gradients, just a lighter solid. */
export function mix(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

/* ---------- The bottle ----------
   One construction, four proportions. Every bottle shares the same 160 x 240 box and stands on y = 236,
   so set side by side they keep their true relative sizes: tall Fresh, rounded Floral, square Woody, squat Warm. */
type Shape = {
  bw: number; bh: number; br: number; // body width, height (to the top of the shoulder), bottom corner radius
  sh: number; nw: number; nh: number; // shoulder drop, neck width, neck height
  cw: number; ch: number; cr: number; dome?: boolean; // cap
  base: number; // visible thickness of the glass base
  lw: number; lh: number; ly: number; // label width, height, centre (fraction of body from the top)
};
export const SHAPES: Record<Family, Shape> = {
  Fresh: { bw: 64, bh: 150, br: 5, sh: 12, nw: 20, nh: 9, cw: 28, ch: 46, cr: 3, base: 15, lw: 46, lh: 54, ly: 0.56 },
  Floral: { bw: 96, bh: 120, br: 30, sh: 34, nw: 22, nh: 7, cw: 36, ch: 32, cr: 3, dome: true, base: 13, lw: 58, lh: 40, ly: 0.58 },
  Woody: { bw: 100, bh: 106, br: 3, sh: 5, nw: 26, nh: 7, cw: 48, ch: 40, cr: 2, base: 20, lw: 64, lh: 42, ly: 0.52 },
  Warm: { bw: 124, bh: 82, br: 16, sh: 16, nw: 30, nh: 6, cw: 60, ch: 26, cr: 4, base: 14, lw: 78, lh: 34, ly: 0.55 },
};
const CX = 80, GROUND = 236;

function bodyPath(s: Shape, inset = 0, top?: number) {
  const L = CX - s.bw / 2 + inset, R = CX + s.bw / 2 - inset, B = GROUND - (inset ? s.base : 0);
  const yT = GROUND - s.bh, ys = yT + s.sh, r = Math.max(s.br - inset, 1.5);
  if (top !== undefined) {
    // The liquid: flat top, straight sides, a glass punt pushing up from the base.
    return `M${L} ${top}H${R}V${B - r}Q${R} ${B} ${R - r} ${B}Q${CX} ${B - 7} ${L + r} ${B}Q${L} ${B} ${L} ${B - r}Z`;
  }
  const nL = CX - s.nw / 2, nR = CX + s.nw / 2, k = (s.bw - s.nw) / 2;
  return `M${nL} ${yT - s.nh}V${yT}C${nL - k * 0.62} ${yT} ${L} ${yT + s.sh * 0.38} ${L} ${ys}V${B - r}Q${L} ${B} ${L + r} ${B}H${R - r}Q${R} ${B} ${R} ${B - r}V${ys}C${R} ${yT + s.sh * 0.38} ${nR + k * 0.62} ${yT} ${nR} ${yT}V${yT - s.nh}Z`;
}

type BottleProps = { scent: Pick<Scent, "name" | "family" | "colour" | "cap">; dark?: boolean; plain?: boolean; className?: string; title?: string };

/** The bottle, drawn for one scent: its family's proportion, its colour, its cap, its name on the label. */
export function Bottle({ scent, dark = false, plain = false, className = "", title }: BottleProps) {
  return (
    <svg viewBox="0 0 160 240" preserveAspectRatio="xMidYMax meet" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <BottleArt scent={scent} dark={dark} plain={plain} />
    </svg>
  );
}

/** The bottle's parts as an SVG group, for composing into boxes and scenes. */
export function BottleArt({ scent, dark = false, plain = false, transform, label }: { scent: BottleProps["scent"]; dark?: boolean; plain?: boolean; transform?: string; label?: [string, string] }) {
  const s = SHAPES[scent.family];
  const line = dark ? PAPER : INK;
  const glass = dark ? mix(scent.colour, INK, 0.42) : mix(scent.colour, PAPER, 0.72);
  const narrow = s.lw < 50;
  const [big, small] = label ?? [scent.name, scent.family.toUpperCase()];
  const yT = GROUND - s.bh;
  const liquidTop = yT + s.sh + (s.dome ? 4 : 7);
  const L = CX - s.bw / 2;
  const collarY = yT - s.nh - 5;
  const capY = collarY - s.ch;
  const capX = CX - s.cw / 2;
  const cap = dark && scent.cap.toLowerCase() === INK ? DEEP : scent.cap;
  const capLight = isDark(cap) ? mix(cap, PAPER, 0.35) : mix(cap, INK, 0.12);
  const ly = yT + s.bh * s.ly;
  const capPath = s.dome
    ? `M${capX} ${collarY}V${capY + s.cw / 2.6}A${s.cw / 2} ${s.cw / 2.6} 0 0 1 ${capX + s.cw} ${capY + s.cw / 2.6}V${collarY}Z`
    : undefined;
  return (
    <g transform={transform} strokeLinejoin="round" strokeLinecap="round">
      {/* glass, then the liquid inside it, then a flat reflection */}
      <path d={bodyPath(s)} fill={glass} stroke={line} strokeWidth="1.5" {...NS} />
      <path d={bodyPath(s, 4.5, liquidTop)} fill={scent.colour} />
      <path d={`M${L + 4.5} ${liquidTop}H${CX + s.bw / 2 - 4.5}`} stroke={line} strokeWidth="1" opacity=".35" {...NS} />
      <rect x={L + 9} y={liquidTop + 8} width="3.5" height={Math.max(GROUND - s.base - liquidTop - 22, 6)} rx="1.75" fill={PAPER} opacity=".6" />
      <rect x={L + 15} y={liquidTop + 8} width="1.5" height={Math.max((GROUND - s.base - liquidTop) * 0.35, 4)} rx=".75" fill={PAPER} opacity=".5" />
      {/* the base: a second line marks where the thick glass bottom begins */}
      <path d={`M${L + 3} ${GROUND - s.base + 2}H${CX + s.bw / 2 - 3}`} stroke={line} strokeWidth="1" opacity=".3" {...NS} />
      {/* collar and cap */}
      <rect x={CX - s.nw / 2 - 3} y={collarY} width={s.nw + 6} height="5.5" rx="1" fill={dark ? PAPER : INK} stroke={line} strokeWidth="1.5" {...NS} />
      {capPath
        ? <path d={capPath} fill={cap} stroke={line} strokeWidth="1.5" {...NS} />
        : <rect x={capX} y={capY} width={s.cw} height={s.ch} rx={s.cr} fill={cap} stroke={line} strokeWidth="1.5" {...NS} />}
      <rect x={capX + s.cw * 0.2} y={capY + (s.dome ? s.cw / 4 : 5)} width="2.5" height={s.ch - (s.dome ? s.cw / 4 : 5) - 6} rx="1.25" fill={capLight} />
      {/* the label, with the scent's name set on it */}
      <rect x={CX - s.lw / 2} y={ly - s.lh / 2} width={s.lw} height={s.lh} rx="1" fill={PAPER} stroke={line} strokeWidth="1" {...NS} />
      {!plain && (
        <g textAnchor="middle" fill={INK}>
          <text x={CX} y={ly - s.lh / 2 + 8.5} fontSize={narrow ? 3.7 : 4.2} letterSpacing={narrow ? 0.55 : 0.9} fontFamily="Jost, sans-serif">I &amp; A PARFUMS</text>
          <text x={CX} y={ly + 4} fontSize={Math.min(s.lh > 45 ? 15 : 13.5, (s.lw - 8) / (big.length * 0.58))} fontWeight="500" fontFamily="'Bodoni Moda', Didot, Georgia, serif">{big}</text>
          <path d={`M${CX - 7} ${ly + 8.5}H${CX + 7}`} stroke={INK} strokeWidth=".6" />
          <text x={CX} y={ly + 15} fontSize="4.6" letterSpacing="1.1" fontFamily="Jost, sans-serif">{small}</text>
        </g>
      )}
    </g>
  );
}

/* ---------- The 2ml vial ---------- */
function VialArt({ x = 0, y = 0, h = 112, colour = SAGE, line = INK, cap = INK }: { x?: number; y?: number; h?: number; colour?: string; line?: string; cap?: string }) {
  const k = h / 112; // vial is drawn 28 wide, 112 tall at k = 1
  const w = 14 * k, cx = x + 14 * k;
  const capH = 22 * k, bodyTop = y + capH + 4 * k, bottom = y + h;
  const glass = mix(colour, PAPER, 0.7);
  return (
    <g strokeLinejoin="round">
      <path d={`M${cx - w / 2} ${bodyTop}V${bottom - w / 2}A${w / 2} ${w / 2} 0 0 0 ${cx + w / 2} ${bottom - w / 2}V${bodyTop}Z`} fill={glass} stroke={line} strokeWidth="1.5" {...NS} />
      <path d={`M${cx - w / 2 + 2.5 * k} ${bodyTop + 16 * k}V${bottom - w / 2}A${w / 2 - 2.5 * k} ${w / 2 - 2.5 * k} 0 0 0 ${cx + w / 2 - 2.5 * k} ${bottom - w / 2}V${bodyTop + 16 * k}Z`} fill={colour} />
      <rect x={cx - w / 2 + 3.5 * k} y={bodyTop + 22 * k} width={1.6 * k} height={40 * k} rx={0.8 * k} fill={PAPER} opacity=".65" />
      <rect x={cx - w / 2 - 1.5 * k} y={y} width={w + 3 * k} height={capH} rx={1.5 * k} fill={cap} stroke={line} strokeWidth="1.5" {...NS} />
      <rect x={cx - w / 2 + 1.5 * k} y={y + 3 * k} width={1.4 * k} height={capH - 6 * k} rx={0.7 * k} fill={mix(cap, PAPER, 0.4)} />
      <rect x={cx - w / 2 - 0.5 * k} y={bodyTop + 30 * k} width={w + k} height={18 * k} fill={PAPER} stroke={line} strokeWidth="1" {...NS} />
    </g>
  );
}

/** The 2ml sample vial, on its own. One cap colour everywhere: Ochre. */
export function Vial({ colour = SAGE, dark = false, className = "" }: { colour?: string; dark?: boolean; className?: string }) {
  return (
    <svg viewBox="-2 -2 32 116" className={className} aria-hidden="true">
      <VialArt colour={colour} line={dark ? PAPER : INK} cap={dark ? DEEP : INK} />
    </svg>
  );
}

/* ---------- Hero still life: the bottle with its sample beside it ---------- */
export function HeroStill({ scent, className = "" }: { scent: Scent; className?: string }) {
  return (
    <svg viewBox="0 0 300 300" className={className} role="img" aria-label={`A ${scent.family.toLowerCase()} eau de parfum: a 50ml bottle, with its 2ml sample vial beside it`}>
      {/* a low Sage plinth the bottle and its sample stand on */}
      <rect x="10" y="262" width="280" height="30" rx="2" fill={SAGE} stroke={PAPER} strokeWidth="1.5" {...NS} />
      <path d="M10 270H290" stroke={INK} strokeWidth="1" opacity=".2" {...NS} />
      <g transform="translate(6 -68.4) scale(1.42)"><BottleArt scent={scent} dark label={["Eau de parfum", scent.family.toUpperCase()]} /></g>
      <g transform="translate(224 150)"><VialArt h={112} colour={scent.colour} line={PAPER} cap={DEEP} /></g>
    </svg>
  );
}

/* ---------- The discovery box: lid up, four vials in a tray, a notes card ---------- */
export function DiscoveryBox({ scents, className = "", dark = false }: { scents: Scent[]; className?: string; dark?: boolean }) {
  const line = dark ? PAPER : INK;
  const xs = scents.map((_, i) => 96 + i * 46);
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label={`The discovery set: an open box with ${scents.length} sample vials (${scents.map((s) => s.name).join(", ")}) and a notes card`}>
      {/* lid, standing open behind the tray */}
      <rect x="40" y="14" width="320" height="150" rx="3" fill={DEEP} stroke={line} strokeWidth="1.5" {...NS} />
      <rect x="52" y="26" width="296" height="126" rx="1.5" fill="none" stroke={PAPER} strokeWidth="1" opacity=".35" {...NS} />
      <text x="200" y="62" textAnchor="middle" fontSize="8" letterSpacing="2.4" fill={PAPER} fontFamily="Jost, sans-serif">I &amp; A PARFUMS</text>
      <text x="200" y="88" textAnchor="middle" fontSize="20" fontWeight="500" fill={PAPER} fontFamily="'Bodoni Moda', Didot, Georgia, serif">The discovery set</text>
      {/* the inner wall of the tray */}
      <rect x="34" y="150" width="332" height="22" fill={mix(SAGE, INK, 0.18)} stroke={line} strokeWidth="1.5" {...NS} />
      {scents.map((s, i) => <VialArt key={s.handle} x={xs[i]} y={104} h={120} colour={s.colour} line={INK} cap={INK} />)}
      {/* a notes card tucked in at the end */}
      <g transform="rotate(-7 318 150)">
        <rect x="290" y="112" width="58" height="80" rx="1" fill={PAPER} stroke={INK} strokeWidth="1.5" {...NS} />
        <text x="319" y="132" textAnchor="middle" fontSize="11" fontWeight="500" fill={INK} fontFamily="'Bodoni Moda', Didot, Georgia, serif">Your notes</text>
        {[146, 156, 166].map((y) => <path key={y} d={`M300 ${y}H338`} stroke={INK} strokeWidth=".75" opacity=".4" {...NS} />)}
      </g>
      {/* the tray front */}
      <rect x="28" y="172" width="344" height="92" rx="3" fill={SAGE} stroke={line} strokeWidth="1.5" {...NS} />
      <rect x="40" y="184" width="320" height="68" rx="1.5" fill="none" stroke={INK} strokeWidth="1" opacity=".3" {...NS} />
      <text x="200" y="222" textAnchor="middle" fontSize="9" letterSpacing="2.6" fill={INK} fontFamily="Jost, sans-serif">{`${scents.length} × 2ML SAMPLES`}</text>
    </svg>
  );
}

/* ---------- The gift box: a lidded box with a band, the bottle standing in front ---------- */
export function GiftBox({ scent, className = "" }: { scent: Scent; className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={`A lidded gift box with a paper band, and a bottle of ${scent.name} standing in front of it`}>
      <path d="M8 292H392" stroke={INK} strokeWidth="1.5" {...NS} />
      {/* the box, its lid a little wider than the base */}
      <rect x="170" y="112" width="192" height="180" rx="2" fill={INK} stroke={INK} strokeWidth="1.5" {...NS} />
      <rect x="162" y="92" width="208" height="40" rx="2" fill={INK} stroke={PAPER} strokeWidth="1.5" {...NS} />
      <rect x="176" y="99" width="3" height="26" rx="1.5" fill={mix(INK, PAPER, 0.3)} />
      {/* the paper band */}
      <rect x="170" y="186" width="192" height="58" fill={SAGE} stroke={INK} strokeWidth="1.5" {...NS} />
      <path d="M170 192H362M170 238H362" stroke={INK} strokeWidth=".75" opacity=".35" {...NS} />
      <text x="266" y="210" textAnchor="middle" fontSize="7.5" letterSpacing="2.2" fill={INK} fontFamily="Jost, sans-serif">I &amp; A PARFUMS</text>
      <text x="266" y="230" textAnchor="middle" fontSize="15" fontWeight="500" fill={INK} fontFamily="'Bodoni Moda', Didot, Georgia, serif">{scent.name}</text>
      {/* the bottle, in front */}
      <g transform="translate(76 56)"><BottleArt scent={scent} /></g>
    </svg>
  );
}

/* ---------- The seasonal edition: a flat box from above, one bottle lying in its bed ---------- */
export function SeasonalBox({ scent, className = "", dark = false }: { scent: Pick<Scent, "name" | "family" | "colour" | "cap">; className?: string; dark?: boolean }) {
  const line = dark ? PAPER : INK;
  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-label="The seasonal edition: a flat box, seen from above, with a bottle lying in a shaped bed and a card for the season">
      <rect x="14" y="14" width="372" height="232" rx="3" fill={dark ? DEEP : INK} stroke={line} strokeWidth="1.5" {...NS} />
      <rect x="30" y="30" width="340" height="200" rx="2" fill={SAGE} stroke={line} strokeWidth="1.5" {...NS} />
      {/* the bed the bottle lies in */}
      <rect x="44" y="88" width="230" height="84" rx="3" fill={mix(SAGE, INK, 0.16)} stroke={INK} strokeWidth="1" {...NS} />
      <g transform="rotate(-90 165 130) translate(85 -12)"><BottleArt scent={scent} label={["Season", "EDITION"]} /></g>
      {/* the card */}
      <rect x="292" y="54" width="62" height="152" rx="1" fill={PAPER} stroke={INK} strokeWidth="1.5" {...NS} />
      <text x="323" y="84" textAnchor="middle" fontSize="6.5" letterSpacing="1.8" fill={INK} fontFamily="Jost, sans-serif">EDITION</text>
      <text x="323" y="108" textAnchor="middle" fontSize="15" fontWeight="500" fill={INK} fontFamily="'Bodoni Moda', Didot, Georgia, serif">The</text>
      <text x="323" y="124" textAnchor="middle" fontSize="15" fontWeight="500" fill={INK} fontFamily="'Bodoni Moda', Didot, Georgia, serif">season</text>
      <path d="M310 136H336" stroke={INK} strokeWidth=".75" {...NS} />
      {[152, 162, 172, 182].map((y) => <path key={y} d={`M304 ${y}H342`} stroke={INK} strokeWidth=".75" opacity=".35" {...NS} />)}
    </svg>
  );
}

/** A labelled slot where the client's photograph will go: brand ground, crop marks, a label and one line. */
export function PhotoSlot({ label, line, className = "", dark = false, children }: { label?: string; line: string; className?: string; dark?: boolean; children?: ReactNode }) {
  const c = dark ? PAPER : INK;
  return (
    <div className={`relative flex flex-col justify-end overflow-hidden rounded-pill p-6 sm:p-8 ${dark ? "on-ink bg-ink-soft text-paper" : "bg-sage text-ink"} ${className}`} role="img" aria-label={`Photograph to come: ${line}`}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke={c} strokeWidth="1.5">
        {/* crop marks in each corner, like a frame on a contact sheet */}
        <path d="M4 12V4H12M88 4H96V12M96 88V96H88M12 96H4V88" vectorEffect="non-scaling-stroke" />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center p-10" aria-hidden="true">{children}</div>}
      <div className="relative flex flex-col gap-1" aria-hidden="true">
        <span className={`label ${dark ? "text-sage" : "text-mute"}`}>{label ?? "Photograph to come"}</span>
        <span className="text-[16px]">{line}</span>
      </div>
    </div>
  );
}

/** The monogram used in heroes: the marque's I in a tall rectangle, drawn in rules. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 410" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="298" height="408" vectorEffect="non-scaling-stroke" />
      <rect x="31" y="31" width="238" height="348" vectorEffect="non-scaling-stroke" />
      <path d="M150 90v230M110 90h80M110 320h80" strokeWidth="6" />
    </svg>
  );
}
