import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import { PrefsProvider } from "./lib/prefs";
import { Home } from "./pages/Home";
import { Range } from "./pages/Range";
import { ScentPage } from "./pages/ScentPage";
import { DiscoverySet } from "./pages/DiscoverySet";
import { FinderPage, OurScents, Visit } from "./pages/Info";
import { NotFound } from "./pages/NotFound";

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); else window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PrefsProvider>
        <ScrollTop />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-paper focus:px-4 focus:py-3">Skip to content</a>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </PrefsProvider>
    </BrowserRouter>
  );
}
