import { createContext, useContext, useState, type ReactNode } from "react";
import { type Answers } from "./store";

// What the shopper has told us, remembered on this device: the scent finder answers, which samples they have
// tried (so the bottle shows the sample credit) and interest in the seasonal edition. Nothing is sent anywhere.
// At launch this moves to the customer account.
export type Interest = { name: string; email: string; at: string };
type Ctx = {
  answers: Answers | null; setAnswers: (a: Answers | null) => void;
  sampled: string[]; toggleSampled: (handle: string) => void;
  interest: Interest | null; setInterest: (i: Interest | null) => void;
};
const PrefsContext = createContext<Ctx>({ answers: null, setAnswers: () => {}, sampled: [], toggleSampled: () => {}, interest: null, setInterest: () => {} });
const KEY_A = "iana-parfums-finder", KEY_S = "iana-parfums-sampled", KEY_I = "iana-parfums-seasonal";

function read<T>(key: string): T | null { try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : null; } catch { return null; } }
function write(key: string, v: unknown) { try { if (v === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(v)); } catch { /* private mode */ } }

const HANDLES = /^no-[1-4]-(fresh|floral|woody|warm)$/;
const FAMS = ["Fresh", "Floral", "Woody", "Warm"];

export function PrefsProvider({ children }: { children: ReactNode }) {
  // Saved state must stay valid when the range changes: drop answers or handles that no longer exist.
  const [answers, setA] = useState<Answers | null>(() => { const a = read<Answers>(KEY_A); return a && FAMS.includes(a.family) ? a : null; });
  const [sampled, setS] = useState<string[]>(() => (read<string[]>(KEY_S) ?? []).filter((h) => HANDLES.test(h)));
  const [interest, setI] = useState<Interest | null>(() => read<Interest>(KEY_I));
  const setAnswers = (a: Answers | null) => { setA(a); write(KEY_A, a); };
  const setInterest = (i: Interest | null) => { setI(i); write(KEY_I, i); };
  const toggleSampled = (h: string) => setS((cur) => { const next = cur.includes(h) ? cur.filter((x) => x !== h) : [...cur, h]; write(KEY_S, next); return next; });
  return <PrefsContext.Provider value={{ answers, setAnswers, sampled, toggleSampled, interest, setInterest }}>{children}</PrefsContext.Provider>;
}

export const usePrefs = () => useContext(PrefsContext);
