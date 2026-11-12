// Measures Jost capitals once, so a name can be fitted to the page without measuring in the browser (no shift when
// the face arrives). Writes src/data/jost-caps.json: for weights 200 and 300, each character's advance and each
// kerned pair, in em. Run again only if the font package changes: `node scripts/caps-widths.mjs`.
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const font = readFileSync(new URL("../node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2", import.meta.url)).toString("base64");
const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage();
const out = await page.evaluate(async (b64) => {
  const face = new FontFace("Jost", `url(data:font/woff2;base64,${b64})`, { weight: "100 900" });
  document.fonts.add(await face.load());
  const chars = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&'-.".split("");
  const c = document.createElement("canvas").getContext("2d");
  const r = (n) => Math.round(n * 1e4) / 1e4;
  const res = {};
  for (const w of [200, 300]) {
    c.font = `${w} 1000px "Jost"`; c.fontKerning = "normal";
    const m = (t) => c.measureText(t).width / 1000;
    const adv = {}, kern = {};
    for (const ch of chars) adv[ch] = r(m(ch));
    for (const a of chars) for (const b of chars) { const k = r(m(a + b) - adv[a] - adv[b]); if (Math.abs(k) >= 0.0005) kern[a + b] = k; }
    res[w] = { adv, kern };
  }
  return res;
}, font);
await browser.close();
writeFileSync(new URL("../src/data/jost-caps.json", import.meta.url), JSON.stringify(out) + "\n");
console.log(`jost-caps.json: ${Object.keys(out[200].kern).length} kerned pairs at 200, ${Object.keys(out[300].kern).length} at 300`);
