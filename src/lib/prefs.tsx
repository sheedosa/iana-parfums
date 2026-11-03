import { createContext, useContext, useState, type ReactNode } from "react";
import { type Answers } from "./store";

// What the shopper has told us, remembered on this device: the scent finder answers and which samples
// they have tried (so the bottle shows the sample credit). At launch this moves to the customer account.
type Ctx = {
  answers: Answers | null; setAnswers: (a: Answers | null) => void;
  sampled: string[]; toggleSampled: (handle: string) => void;
};
const PrefsContext = createContext<Ctx>({ answers: null, setAnswers: () => {}, sampled: [], toggleSampled: () => {} });
const KEY_A = "iana-parfums-finder", KEY_S = "iana-parfums-sampled";

function read<T>(key: string): T | null { try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : null; } catch { return null; } }
function write(key: string, v: unknown) { try { if (v === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(v)); } catch { /* private mode */ } }

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [answers, setA] = useState<Answers | null>(() => read<Answers>(KEY_A));
  const [sampled, setS] = useState<string[]>(() => read<string[]>(KEY_S) ?? []);
  const setAnswers = (a: Answers | null) => { setA(a); write(KEY_A, a); };
  const toggleSampled = (h: string) => setS((cur) => { const next = cur.includes(h) ? cur.filter((x) => x !== h) : [...cur, h]; write(KEY_S, next); return next; });
  return <PrefsContext.Provider value={{ answers, setAnswers, sampled, toggleSampled }}>{children}</PrefsContext.Provider>;
}

export const usePrefs = () => useContext(PrefsContext);
