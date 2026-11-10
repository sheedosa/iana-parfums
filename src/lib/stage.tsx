import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { wash, DEEP } from "../components/Art";
import { store } from "./store";

// Which scent the page is showing. The whole page takes that scent's wash and its bottle steps forward in the dock.
// A page with no scent of its own passes null and stands on the plain Deep ground.
type Ctx = { current: string | null; setCurrent: (h: string | null) => void; tone: string | null; setTone: (c: string | null) => void };
const StageContext = createContext<Ctx>({ current: null, setCurrent: () => {}, tone: null, setTone: () => {} });

export function StageProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null); // a wash for something that is not one of the four (the seasonal edition)
  useEffect(() => {
    const s = current ? store.scent(current) : undefined;
    document.documentElement.style.setProperty("--wash", s ? wash(s.colour) : tone ? wash(tone) : DEEP);
  }, [current, tone]);
  return <StageContext.Provider value={{ current, setCurrent, tone, setTone }}>{children}</StageContext.Provider>;
}

export const useCurrent = () => useContext(StageContext).current;
export const useSetCurrent = () => useContext(StageContext).setCurrent;

/** Put a scent on the stage for as long as this page shows it. */
export function useStage(handle: string | null, tone: string | null = null) {
  const { setCurrent, setTone } = useContext(StageContext);
  useEffect(() => { setCurrent(handle); setTone(tone); }, [handle, tone, setCurrent, setTone]);
}
