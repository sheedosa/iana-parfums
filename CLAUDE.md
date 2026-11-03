# I&A Parfums storefront — repo rules

Static React storefront (Vite + Tailwind) on GitHub Pages; Shopify will be the commerce backend, as on iana-schoolwear, iana-fashions and iana-tailoring.

## Rules
1. **Facts come from `src/data/site.ts`; scents from `src/data/scents.json`.** Never invent prices, delivery or returns terms, the perfumer, materials, concentration, longevity or ingredient claims. Unconfirmed items go in `SITE.toConfirm` and appear on pages only as `[A LABELLED PLACEHOLDER]`. While `SITE.preview` is true, scents are samples and must stay labelled as such. Never use a real fragrance house's product name.
2. **Commerce goes through `src/lib/store.ts` only.** Components never read the data file directly. The scent finder's ranking lives in `findScents()` there.
3. **Every page sets `<Seo>`.** Add new routes to `scripts/prerender.mjs`.
4. **Imagery is drawn in code** (`src/components/Art.tsx`): one bottle shape parametrised by swatch and cap colour, the 2ml vial, the shelf, the top/heart/base diagram, labelled photo slots. Flat fills from the palette, 1.5px strokes, no gradients. No stock or made-up photography; no faces.
5. **Brand (I&A guide 2022, Parfums variant):** Ochre #45353a is the ground for hero, scent panels and footer (#2a2326 deep); warm white #fbfbf9 for reading; Sage #d8e2dc for notes diagrams and bands; Light Pink #ffcad4 only as a faint highlight, never text. Cormorant Garamond Bold headings (sentence case); Agrandir body and 0.15em uppercase labels, Lexend until licensed (change `--font-sans` only). Corners 3px. No pills, gradients as decoration, or card grids for prose. Darker and quieter than Fashions; softer than Tailoring.
6. **Smell it first is the core idea:** every scent is offered as a 2ml sample before the bottle, the sample price is credited against the 50ml/100ml, and the shopper's "I have the sample" state and scent-finder answers (saved on the device, `src/lib/prefs.tsx`) are respected on every page.
7. Tap targets ≥ 44px, no horizontal overflow at 375px, body text ≥ 16px, AA contrast with solid tones, British English, GBP.
