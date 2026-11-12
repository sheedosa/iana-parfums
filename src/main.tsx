import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// GitHub Pages SPA fallback: 404.html redirects to /?p=<path>; restore it before React mounts.
const params = new URLSearchParams(window.location.search);
const p = params.get("p");
if (p) window.history.replaceState(null, "", import.meta.env.BASE_URL.replace(/\/$/, "") + p);

// A prerendered page is taken over as it stands (no second paint, no bottle arriving twice). The prerender stamps
// the route it drew on <html data-prerendered>; anything else (the 404 fallback, a route with no file) starts clean.
const root = document.getElementById("root")!;
const app = <StrictMode><App /></StrictMode>;
const here = window.location.pathname.slice(import.meta.env.BASE_URL.length - 1).replace(/\/+$/, "") || "/";
if (!p && root.firstElementChild && document.documentElement.dataset.prerendered === here) hydrateRoot(root, app);
else createRoot(root).render(app);
