import { useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { Dock, Footer, Header } from "./components/Layout";
import { StageProvider } from "./lib/stage";
import { PrefsProvider } from "./lib/prefs";
import { Home } from "./pages/Home";
import { Range } from "./pages/Range";
import { ScentPage } from "./pages/ScentPage";
import { DiscoverySet } from "./pages/DiscoverySet";
import { FinderPage, OurScents, Visit } from "./pages/Info";
import { DeliveryReturns, GiftBoxPage, SeasonalEdition } from "./pages/Extras";
import { NotFound } from "./pages/NotFound";

/** Where the page stood, by history entry. A new page opens at the top (or at its #anchor); Back and Forward put the
    reader where they were. One passive listener notes the position; nothing is measured while scrolling. */
const seen = new Map<string, number>();
function ScrollTop() {
  const { pathname, hash, key } = useLocation();
  const type = useNavigationType();
  const here = useRef(key);
  useEffect(() => {
    try { history.scrollRestoration = "manual"; } catch { /* older browsers */ }
    const note = () => { seen.set(here.current, window.scrollY); };
    window.addEventListener("scroll", note, { passive: true });
    return () => window.removeEventListener("scroll", note);
  }, []);
  useLayoutEffect(() => {
    here.current = key;
    const back = type === "POP" ? seen.get(key) : undefined;
    if (back !== undefined) window.scrollTo(0, back);
    else if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash, key, type]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PrefsProvider><StageProvider>
        <ScrollTop />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-bone focus:px-4 focus:py-3 focus:text-deep">Skip to content</a>
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/range" element={<Range />} />
            <Route path="/range/:family" element={<Range />} />
            <Route path="/scents/:handle" element={<ScentPage />} />
            <Route path="/discovery-set" element={<DiscoverySet />} />
            <Route path="/scent-finder" element={<FinderPage />} />
            <Route path="/our-scents" element={<OurScents />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/gift-box" element={<GiftBoxPage />} />
            <Route path="/seasonal-edition" element={<SeasonalEdition />} />
            <Route path="/delivery-returns" element={<DeliveryReturns />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Dock />
      </StageProvider></PrefsProvider>
    </BrowserRouter>
  );
}
