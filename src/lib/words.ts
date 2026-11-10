import { usePrefs } from "./prefs";
import { findScents, type Scent } from "./store";

export const whenText = (s: Scent) => (s.when === "Both" ? "day or evening" : s.when.toLowerCase());
/** One line for a scent, from what the data holds: its family, strength and when. */
export const scentLine = (s: Scent) => `${s.family} eau de parfum. ${s.strength}, for ${whenText(s)}.`;

/** What the shopper has told us about this scent, in a few words; nothing if they have told us nothing. */
export function useNote(s: Scent) {
  const { answers, sampled } = usePrefs();
  if (sampled.includes(s.handle)) return "You have the sample";
  if (answers && findScents(answers).some((x) => x.handle === s.handle)) return "Your finder pick";
  return null;
}
