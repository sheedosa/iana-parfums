import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { wash, DEEP } from "../components/Art";
import { store } from "./store";

// Which scent the page is showing. The whole page takes that scent's wash and its bottle steps forward in the dock.
// A page with no scent of its own passes null and stands on the plain Deep ground.
// Two contexts: the setters never change, so a page that only sets the stage (Home, as it scrolls) is not rendered
// again each time the scent on screen changes. Only the dock reads the current scent.
type Setters = { setCurrent: (h: string | null) => void; setTone: (c: string | null) => void };
const CurrentContext = createContext<string | null>(null);
const SetContext = createContext<Setters>({ setCurrent: () => {}, setTone: () => {} });

export function StageProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null); // a wash for something that is not one of the four (the seasonal edition)
  useEffect(() => {
    const s = current ? store.scent(current) : undefined;
    document.documentElement.style.setProperty("--wash", s ? wash(s.colour) : tone ? wash(tone) : DEEP);
  }, [current, tone]);
  const setters = useMemo(() => ({ setCurrent, setTone }), []);
  return <SetContext.Provider value={setters}><CurrentContext.Provider value={current}>{children}</CurrentContext.Provider></SetContext.Provider>;
}

export const useCurrent = () => useContext(CurrentContext);
export const useSetCurrent = () => useContext(SetContext).setCurrent;

/** Put a scent on the stage for as long as this page shows it. */
export function useStage(handle: string | null, tone: string | null = null) {
  const { setCurrent, setTone } = useContext(SetContext);
  useEffect(() => { setCurrent(handle); setTone(tone); }, [handle, tone, setCurrent, setTone]);
}
