import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the site at /<repo>/ — set VITE_BASE=/ for a custom domain.
// Preload the one font file the first screen needs (Jost, latin, every weight), under the name the build gave it.
const preloadFont = (): Plugin => ({
  name: "preload-font",
  transformIndexHtml: {
    order: "post",
    handler(_html, ctx) {
      const file = Object.keys(ctx.bundle ?? {}).find((f) => /jost-latin-wght-normal.*\.woff2$/.test(f));
      return file ? [{ tag: "link", attrs: { rel: "preload", as: "font", type: "font/woff2", href: (process.env.VITE_BASE ?? "/iana-parfums/") + file, crossorigin: "" }, injectTo: "head-prepend" }] : [];
    },
  },
});

// `vite preview` answers /range with the home page's file; GitHub Pages answers it with /range/index.html. Serve the
// prerendered file here too, so what is measured locally is what the live site sends.
const pagesLike = (): Plugin => ({
  name: "pages-like-preview",
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      const [path, query] = (req.url ?? "").split("?");
      if (path && !path.endsWith("/") && !/\.[a-z0-9]+$/i.test(path) && existsSync(join(server.config.build.outDir, path.replace(server.config.base, "/"), "index.html"))) req.url = `${path}/${query ? `?${query}` : ""}`;
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFont(), pagesLike()],
  base: process.env.VITE_BASE ?? "/iana-parfums/",
});
