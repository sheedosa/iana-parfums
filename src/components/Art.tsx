// Drawn imagery, all on dark. One house bottle, drawn once: heavy glass with a visible wall and base, the liquid
// line, a dip tube, a metal collar, a lacquer cap and a paper label with the scent's name. Flat tones only.
// All lettering is Jost capitals, tracked. SVG adds the tracking after the last letter too, so a centred line is
// moved right by half its tracking.
import type { Scent } from "../lib/store";

export const DEEP = "#2a2326", OCHRE = "#45353a", BONE = "#ede6dc";
const LACQUER = "#151012", BRASS = "#a98c5d";

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c: number[]) => `#${c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("")}`;
/** Flat mix of two hex colours (t = share of b). */
export function mix(a: string, b: string, t: number) {
  const [x, y] = [rgb(a), rgb(b)];
  return hex(x.map((v, i) => v + (y[i] - v) * t));
}

const lin = (v: number) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
const enc = (v: number) => 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);
/** The page wash for a scent: its hue, deepened to the lightness of the Deep ground, so Bone, the secondary text
    and Amber all keep AA contrast on it (Amber 4.6:1, checked for every colour in the data). */
export function wash(colour: string) {
  let c = rgb(colour).map(lin);
  const m = (c[0] + c[1] + c[2]) / 3;
  c = c.map((v) => Math.max(0, m + (v - m) * 1.4));
  const l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return hex(c.map((v) => enc(Math.min(1, (v * 0.027) / l))));
}

type BottleScent = Pick<Scent, "name" | "family" | "colour">;
type BottleProps = { scent: BottleScent; plain?: boolean; className?: string; title?: string; label?: [string, string] };

/** The bottle for one scent: the house flacon with that scent's liquid and its name on the label. */
export function Bottle({ scent, plain = false, className = "", title, label }: BottleProps) {
  return (
    <svg viewBox="0 0 200 300" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <BottleArt scent={scent} plain={plain} label={label} />
    </svg>
  );
}

/** The bottle's parts as a group in a 200 x 300 box, standing on y = 292. */
export function BottleArt({ scent, plain = false, transform, label }: { scent: BottleScent; plain?: boolean; transform?: string; label?: [string, string] }) {
  const c = scent.colour;
  const glass = mix(c, DEEP, 0.7);
  const [big, small] = label ?? [scent.name, scent.family.toUpperCase()];
  const caps = big.toUpperCase();
  const nameSize = Math.min(11, 60 / (Math.max(caps.length, 1) * 0.8));
  const nameTrack = nameSize * 0.14;
  return (
    <g transform={transform}>
      <ellipse cx="100" cy="293" rx="66" ry="3.2" fill="#0d0a0b" opacity=".5" />
      {/* the glass: outer wall, then the hollow, then the liquid standing in it */}
      <path d="M86 118h28c0 0 30 0 30 0a12 12 0 0 1 12 12v154a8 8 0 0 1 -8 8H52a8 8 0 0 1 -8 -8V130a12 12 0 0 1 12 -12z" fill={glass} stroke={BONE} strokeOpacity=".55" strokeWidth="1.2" />
      <path d="M57 126h86a6 6 0 0 1 6 6v133a5 5 0 0 1 -5 5H56a5 5 0 0 1 -5 -5V132a6 6 0 0 1 6 -6z" fill={mix(DEEP, c, 0.1)} />
      <path d="M51 152h98v113a5 5 0 0 1 -5 5H56a5 5 0 0 1 -5 -5z" fill={c} />
      {/* depth: the far side of the liquid is in shade, the near edge catches the light */}
      <path d="M134 152h15v113a5 5 0 0 1 -5 5h-10z" fill={mix(c, DEEP, 0.3)} />
      <path d="M51 152h6v118h-1a5 5 0 0 1 -5 -5z" fill={mix(c, BONE, 0.5)} />
      <path d="M51 152h98" stroke={mix(c, BONE, 0.7)} strokeWidth="1.6" />
      <path d="M51 155.5h98" stroke={mix(c, DEEP, 0.35)} strokeWidth="1" />
      {/* the dip tube, seen through the glass and the liquid */}
      <path d="M100 104V262" stroke={BONE} strokeOpacity=".3" strokeWidth="1.8" />
      {/* the thick base, with the punt */}
      <path d="M58 291Q100 275 142 291z" fill={mix(c, DEEP, 0.45)} />
      <path d="M52 271.5h96" stroke={BONE} strokeOpacity=".4" strokeWidth="1" />
      {/* reflections on the outside of the glass */}
      <path d="M48 134v146" stroke={BONE} strokeOpacity=".6" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M152.5 140v60" stroke={BONE} strokeOpacity=".22" strokeWidth="1" strokeLinecap="round" />
      {/* neck, collar and cap */}
      <rect x="88" y="100" width="24" height="19" fill={glass} stroke={BONE} strokeOpacity=".4" strokeWidth="1" />
      <rect x="82" y="90" width="36" height="13" rx="1.5" fill={BRASS} />
      <path d="M82 94.5h36M82 98.5h36" stroke={mix(BRASS, DEEP, 0.55)} strokeWidth="1" />
      <rect x="86" y="91" width="3" height="11" fill={mix(BRASS, BONE, 0.55)} />
      <rect x="75" y="20" width="50" height="71" rx="3" fill={LACQUER} stroke={BONE} strokeOpacity=".32" strokeWidth="1" />
      <path d="M112 21h10a3 3 0 0 1 3 3v64a3 3 0 0 1 -3 3h-10z" fill="#0a0708" />
      <rect x="81" y="25" width="4.5" height="62" rx="2.25" fill={BONE} opacity=".26" />
      <rect x="89" y="25" width="1.4" height="62" rx=".7" fill={BONE} opacity=".16" />
      <path d="M77 86.5h46" stroke={BONE} strokeOpacity=".18" strokeWidth="1" />
      {/* the label */}
      <rect x="62" y="178" width="76" height="70" fill={BONE} />
      <rect x="65" y="181" width="70" height="64" fill="none" stroke={OCHRE} strokeOpacity=".45" strokeWidth=".6" />
      {!plain && (
        <g textAnchor="middle" fill={DEEP}>
          <text x="100.65" y="194" fontSize="4.6" letterSpacing="1.3" fontFamily="Jost, sans-serif" fontWeight="500">I &amp; A PARFUMS</text>
          <text x={100 + nameTrack / 2} y="215.5" fontSize={nameSize} letterSpacing={nameTrack} fontWeight="300" fontFamily="Jost, sans-serif">{caps}</text>
          <path d="M92 224h16" stroke={DEEP} strokeWidth=".6" />
          <text x="100.6" y="233" fontSize="4.4" letterSpacing="1.2" fontFamily="Jost, sans-serif">{small}</text>
          <text x="100.45" y="240.5" fontSize="3.4" letterSpacing=".9" fontFamily="Jost, sans-serif">EAU DE PARFUM</text>
        </g>
      )}
    </g>
  );
}

/* ---------- The 2ml vial: a glass tube in a 40 x 150 box, standing on y = 146 ---------- */
export function VialArt({ colour, name, transform }: { colour: string; name?: string; transform?: string }) {
  return (
    <g transform={transform}>
      <ellipse cx="20" cy="147" rx="12" ry="1.6" fill="#0d0a0b" opacity=".5" />
      <path d="M11 38h18v99a9 9 0 0 1 -18 0z" fill={mix(colour, DEEP, 0.7)} stroke={BONE} strokeOpacity=".55" strokeWidth="1" />
      <path d="M13.5 60h13v77a6.5 6.5 0 0 1 -13 0z" fill={colour} />
      <path d="M22.5 60h4v77a6.5 6.5 0 0 1 -4 6z" fill={mix(colour, DEEP, 0.3)} />
      <path d="M13.5 60h13" stroke={mix(colour, BONE, 0.7)} strokeWidth="1.2" />
      <path d="M13 44v88" stroke={BONE} strokeOpacity=".6" strokeWidth="1" strokeLinecap="round" />
      {name ? (
        <>
          {/* the paper label runs up the tube, the name written along it */}
          <rect x="10.5" y="68" width="19" height="52" fill={BONE} />
          <text x="20.4" y="94" transform="rotate(-90 20 94)" dominantBaseline="central" textAnchor="middle" fill={DEEP} fontSize="4.4" letterSpacing=".8" fontWeight="400" fontFamily="Jost, sans-serif">{name.toUpperCase()}</text>
        </>
      ) : (
        <>
          <rect x="10.5" y="84" width="19" height="24" fill={BONE} />
          <path d="M14 92h12M14 96h8" stroke={DEEP} strokeWidth=".8" opacity=".7" />
        </>
      )}
      <rect x="9" y="6" width="22" height="33" rx="2" fill={LACQUER} stroke={BONE} strokeOpacity=".32" strokeWidth="1" />
      <rect x="12.5" y="10" width="2.4" height="25" rx="1.2" fill={BONE} opacity=".26" />
    </g>
  );
}
export function Vial({ colour, name, className = "" }: { colour: string; name?: string; className?: string }) {
  return <svg viewBox="0 0 40 150" className={className} aria-hidden="true"><VialArt colour={colour} name={name} /></svg>;
}

/* ---------- The gift box: a lidded box with a paper band, the bottle standing in front of it ---------- */
export function GiftBox({ scent, className = "" }: { scent: Scent; className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={`A lidded gift box with a paper band, and a bottle of ${scent.name} standing in front of it`}>
      <ellipse cx="282" cy="293" rx="112" ry="3.2" fill="#0d0a0b" opacity=".5" />
      <rect x="184" y="128" width="196" height="164" fill={OCHRE} />
      <path d="M356 128h24v164h-24z" fill={mix(OCHRE, DEEP, 0.5)} />
      <rect x="176" y="104" width="212" height="36" rx="1.5" fill={mix(OCHRE, BONE, 0.12)} />
      <path d="M360 104h26.5a1.5 1.5 0 0 1 1.5 1.5v33a1.5 1.5 0 0 1 -1.5 1.5H360z" fill={OCHRE} />
      <path d="M180 108v28" stroke={BONE} strokeOpacity=".4" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="184" y="186" width="196" height="56" fill={BONE} />
      <path d="M356 186h24v56h-24z" fill={mix(BONE, DEEP, 0.25)} />
      <g textAnchor="middle" fill={DEEP}>
        <text x="271.1" y="206" fontSize="7" letterSpacing="2.2" fontFamily="Jost, sans-serif" fontWeight="500">I &amp; A PARFUMS</text>
        <text x="271.6" y="229" fontSize="15" letterSpacing="3.2" fontWeight="300" fontFamily="Jost, sans-serif">{scent.name.toUpperCase()}</text>
      </g>
      <BottleArt scent={scent} transform="translate(22 35.04) scale(.88)" />
    </svg>
  );
}
