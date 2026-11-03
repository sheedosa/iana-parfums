// Post-build: render every route to static HTML inside dist/ so GitHub Pages serves real pages
// (titles, meta, JSON-LD and content) to Google, social scrapers and search crawlers. Also writes sitemap.xml and llms.txt.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const BASE = "/iana-parfums";
const SITE = "https://sheedosa.github.io" + BASE;
const dist = new URL("../dist/", import.meta.url).pathname;
const cat = JSON.parse(readFileSync(new URL("../src/data/scents.json", import.meta.url)));

const routes = ["/", "/range", "/discovery-set", "/scent-finder", "/our-scents", "/visit",
  ...cat.families.map((f) => `/range/${f.handle}`),
  ...cat.scents.map((s) => `/scents/${s.handle}`)];

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]).replace(BASE, "") || "/";
  let f = join(dist, p);
  if (!existsSync(f) || statSync(f).isDirectory()) f = join(dist, "index.html");
  res.setHeader("Content-Type", types[extname(f)] ?? "application/octet-stream");
  res.end(readFileSync(f));
}).listen(4999);

const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort()); // fonts aren't needed for markup
let n = 0;
for (const r of routes) {
  await page.goto(`http://localhost:4999${BASE}${r}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("h1") && !document.body.innerText.includes("Loading"), null, { timeout: 10000 }).catch(() => {});
  let html = await page.content();
  html = html.replace("<html", '<html data-prerendered="1"'); // informational only
  const out = r === "/" ? join(dist, "index.html") : join(dist, r.slice(1), "index.html");
  mkdirSync(join(out, ".."), { recursive: true });
  writeFileSync(out, "<!doctype html>\n" + html.replace(/^<!doctype html>\s*/i, ""));
  n++;
}
await browser.close(); server.close();

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod><changefreq>${r.startsWith("/scents") ? "weekly" : "monthly"}</changefreq><priority>${r === "/" ? "1.0" : r.startsWith("/range") || r.startsWith("/scents") ? "0.9" : "0.7"}</priority></url>`).join("\n")}\n</urlset>\n`);

const fams = cat.families.map((f) => `- [${f.title}](${SITE}/range/${f.handle}): ${f.blurb}`).join("\n");
const scents = cat.scents.map((s) => `- [${s.name}](${SITE}/scents/${s.handle}): ${s.line}. ${s.family}, ${s.strength.toLowerCase()}, for ${s.when === "Both" ? "day or evening" : s.when.toLowerCase()}. Top: ${s.notes.top.join(", ")}. Heart: ${s.notes.heart.join(", ")}. Base: ${s.notes.base.join(", ")}.`).join("\n");
writeFileSync(join(dist, "llms.txt"), `# I&A Parfums

> Eau de parfum from I & A Fashions Limited (trading as I & A Parfums), a family business at 84 Mitcham Road, Tooting, London SW17 9NG, trading since 1993. A short range of seven scents in four families (fresh, floral, woody, warm), each sold as a 2ml sample before the bottle; the sample price is credited back against the 50ml or 100ml. A discovery set holds all seven samples. A three-question scent finder (when, family, strength) narrows the range to two or three. Open Monday to Sunday 9am to 6pm. Phone 020 8767 8613. Sister shops: I&A Fashions, I&A Tailoring, I&A Schoolwear.

Note: this site is a concept preview. Scents, names, notes and prices are samples; ordering opens at launch.

## Families
${fams}

## Scents
${scents}

## Help
- [Discovery set](${SITE}/discovery-set): all seven samples in one box
- [Scent finder](${SITE}/scent-finder): three questions, two or three scents
- [Our scents](${SITE}/our-scents): how the scents are made, the notes diagram, the sample credit
- [Visit the shop](${SITE}/visit): address and hours
`);
console.log(`prerendered ${n} routes, sitemap + llms.txt written`);
