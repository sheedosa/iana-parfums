# I&A Parfums — eau de parfum storefront

Concept preview of the I&A Parfums store: a short range of seven scents, each sold as a 2ml sample before the bottle, with the sample price credited back against the 50ml or 100ml. A three-question scent finder narrows the range and remembers the answers. Built by Elconekt for IandA Group on the same stack as [I&A Schoolwear](https://github.com/sheedosa/iana-schoolwear), [I&A Fashions](https://github.com/sheedosa/iana-fashions) and [I&A Tailoring](https://github.com/sheedosa/iana-tailoring).

**Live preview:** https://sheedosa.github.io/iana-parfums/

## Stack
Vite + React 19 + TypeScript + Tailwind v4, react-router, deployed to GitHub Pages by `.github/workflows/deploy.yml`.
Every route is prerendered to static HTML (`scripts/prerender.mjs`) with titles, meta, Open Graph, JSON-LD, `sitemap.xml` and `llms.txt`.
All imagery is drawn in code (`src/components/Art.tsx`: bottle, vial, shelf, notes diagram, photo slots); there are no photographs yet.

## Commands
```bash
npm install
npm run dev          # http://localhost:5173/iana-parfums/
npm run build        # typecheck + build + prerender (needs Chromium)
npm run build:spa    # without prerender
```

## What's real and what's sample
- **Real:** business name, address, phone, hours, company and VAT numbers, brand (I&A brand guide 2022, Parfums lockup).
- **Sample:** every scent in `src/data/scents.json` (names, families, notes, stories, swatch colours), the discovery set, and the making process on `/our-scents`. Prices are `£[PRICE]`. Ordering is switched off (`SITE.preview`).
- **Proposed:** the trading name "I & A Parfums"; the sample credit (sample price off the bottle) and the discovery-set credit (`£[SAMPLE CREDIT]`), which the client confirms.
- Open questions for the client are in `SITE.toConfirm` and every unknown fact appears on the page as `[A LABELLED PLACEHOLDER]`.

## The two ideas
- **Smell it first.** Every scent page defaults to the 2ml sample. Pressing "I've already tried the sample" (saved on the device) switches the page to the bottle with the credit shown; sampled scents are flagged across the range. The discovery set can mark all seven at once.
- **Scent finder.** When (day/evening), family (fresh/floral/woody/warm), strength (light/present). `findScents()` in `src/lib/store.ts` ranks the range and returns two or three; answers are saved in `localStorage` and shown in the header strip, with matches flagged "For you" on cards.

## Going live
1. Replace `scents.json` with the client's range, or port `ShopifyStorefront` from the schoolwear repo into `src/lib/store.ts` (Size as the variant option: 2ml sample / 50ml / 100ml; family, strength and when as metafields; the discovery set as its own product).
2. Decide how the credit is applied (discount code in the sample box, customer account, or at the till) and wire it into checkout.
3. Set `SITE.preview = false`, add basket and checkout (schoolwear's `CartDrawer` + Shopify cart).
4. Add `VITE_SHOPIFY_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_TOKEN` as repository secrets.
5. Swap the drawn bottles for photography where wanted (the `PhotoSlot` components mark the places) and keep the swatch colours as fallbacks.
6. Custom domain: `public/CNAME`, `VITE_BASE=/`, update `SITE.url`, `index.html`, `robots.txt`, `404.html` and `scripts/prerender.mjs`.
