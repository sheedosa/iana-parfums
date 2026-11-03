// Drawn imagery. Flat fills from the palette, one 1.5px stroke weight, no gradients.
import type { Scent } from "../lib/store";

type BottleProps = { colour: string; cap?: string; stroke?: string; label?: string; className?: string; title?: string };

/** One bottle silhouette, parametrised by the scent's swatch colour and a cap colour. */
export function Bottle({ colour, cap = "#45353a", stroke = "#45353a", label = "#fbfbf9", className = "", title }: BottleProps) {
  return (
    <svg viewBox="0 0 120 200" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round">
      {title && <title>{title}</title>}
      <rect x="42" y="8" width="36" height="34" rx="2" fill={cap} />
      <path d="M50 42h20v14H50z" fill={label} />
      <path d="M20 72c0-6 4-10 10-10h60c6 0 10 4 10 10v112c0 3-2 5-5 5H25c-3 0-5-2-5-5V72z" fill={colour} />
      <path d="M50 56h20l10 6H40l10-6z" fill={colour} />
      <rect x="36" y="104" width="48" height="44" rx="1.5" fill={label} />
      <path d="M46 120h28M46 128h20" stroke={cap} />
    </svg>
  );
}

/** The 2ml sample vial. */
export function Vial({ colour = "#d8e2dc", stroke = "currentColor", className = "" }: { colour?: string; stroke?: string; className?: string }) {
  return (
    <svg viewBox="0 0 40 120" className={className} aria-hidden="true" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round">
      <rect x="12" y="4" width="16" height="18" rx="1.5" fill={stroke} />
      <path d="M14 22h12v8H14z" />
      <path d="M11 30h18v74c0 6-4 10-9 10s-9-4-9-10V30z" fill={colour} />
      <path d="M15 58h10" />
    </svg>
  );
}

/** The shelf: every scent as a bottle in a row, on an Ochre ground. */
export function Shelf({ scents, className = "" }: { scents: Scent[]; className?: string }) {
  return (
    <div className={`flex items-end justify-between gap-2 border-b border-paper/40 pb-0 ${className}`} role="img" aria-label={`${scents.length} bottles on a shelf: ${scents.map((s) => s.name).join(", ")}`}>
      {scents.map((s, i) => <Bottle key={s.handle} colour={s.colour} cap={s.cap} stroke="#fbfbf9" label="#fbfbf9" className={`w-full max-w-[72px] ${i % 2 ? "h-[120px] sm:h-[160px]" : "h-[104px] sm:h-[140px]"}`} />)}
    </div>
  );
}

/** Three stacked arcs: top, heart, base. Note names live in HTML next to it, so this is decorative. */
/** True when white text reads better on this hex. */
export function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.55;
}

export function NotesDiagram({ colour, className = "" }: { colour: string; className?: string }) {
  const baseText = isDark(colour) ? "#fbfbf9" : "#45353a";
  const arc = (r: number) => `M${160 - r} 190 A${r} ${r} 0 0 1 ${160 + r} 190`;
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden="true" fill="none" stroke="#45353a" strokeWidth="1.5">
      <path d={arc(150)} fill="#d8e2dc" />
      <path d={arc(104)} fill="#fbfbf9" />
      <path d={arc(58)} fill={colour} />
      <path d="M6 190h308" />
      <text x="160" y="68" textAnchor="middle" fontSize="12" letterSpacing="1.8" fill="#45353a" stroke="none" fontFamily="Lexend, sans-serif">TOP</text>
      <text x="160" y="114" textAnchor="middle" fontSize="12" letterSpacing="1.8" fill="#45353a" stroke="none" fontFamily="Lexend, sans-serif">HEART</text>
      <text x="160" y="168" textAnchor="middle" fontSize="12" letterSpacing="1.8" fill={baseText} stroke="none" fontFamily="Lexend, sans-serif">BASE</text>
    </svg>
  );
}

/** A labelled slot where the client's photograph will go. */
export function PhotoSlot({ label, className = "", dark = false }: { label: string; className?: string; dark?: boolean }) {
  return (
    <div className={`relative flex items-end overflow-hidden rounded-pill border ${dark ? "border-paper/30 bg-ink-soft text-mute-dark" : "border-line bg-stone text-mute"} ${className}`} role="img" aria-label={`Photograph to come: ${label}`}>
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" preserveAspectRatio="none"><path d="M0 100 L100 0" vectorEffect="non-scaling-stroke" opacity=".35" /></svg>
      <span className="label relative p-4" aria-hidden="true">Photo: {label}</span>
    </div>
  );
}

/** The monogram used in heroes: the marque's I in a tall rectangle, drawn in rules. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 410" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="298" height="408" />
      <rect x="31" y="31" width="238" height="348" />
      <path d="M150 90v230M110 90h80M110 320h80" strokeWidth="6" />
    </svg>
  );
}
