// Static site build: renders src/pages.mjs into public/ as clean-URL .html files.
// Usage: node build.mjs
import { writeFileSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { PAGES } from "./src/pages.mjs";
import { layout, SITE } from "./src/lib.mjs";

const OUT = "public";
// Cache-busting version from the CSS + JS contents.
const v = createHash("sha1")
  .update(readFileSync(`${OUT}/assets/css/site.css`))
  .update(readFileSync(`${OUT}/assets/js/site.js`))
  .digest("hex").slice(0, 8);

const today = new Date().toISOString().slice(0, 10);
const urls = [];
for (const page of PAGES) {
  let html = layout({ ...page, v });
  // Pages without a quote section send "Free quote" buttons to the contact form.
  if (page.noQuote) html = html.replaceAll('href="#quote"', 'href="/contact#quote"');
  const file = path.join(OUT, page.file);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (!page.noindex) urls.push(page.path);
  console.log(`${page.file.padEnd(58)} ${(statSync(file).size / 1024).toFixed(1)} KB`);
}

writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE.url}${u === "/" ? "/" : u}</loc><lastmod>${today}</lastmod><priority>${u === "/" ? "1.0" : u.startsWith("/blog/") ? "0.6" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *
Allow: /
Disallow: /thank-you

Sitemap: ${SITE.url}/sitemap.xml
`);
console.log(`built ${PAGES.length} pages, ${urls.length} in sitemap (assets v=${v})`);
