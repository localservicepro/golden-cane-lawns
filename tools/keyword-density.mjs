// Exact-match keyword count and density in a page's visible text.
// Usage: node tools/keyword-density.mjs <url> "<keyword>"
import { chromium } from "playwright";
const [url, kw] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage();
await p.route(/msgsndr|cloudfront|google\.com\/maps/, r => r.abort());
await p.goto(url, { waitUntil: "domcontentloaded" });
const r = await p.evaluate(kw => {
  const main = document.querySelector("main").innerText.replace(/\s+/g, " ");
  const all = document.body.innerText.replace(/\s+/g, " ");
  const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  const where = [...document.querySelectorAll("title,h1,h2,h3,meta[name=description],img")]
    .map(e => [e.tagName, e.tagName === "META" ? e.content : e.tagName === "IMG" ? e.alt : e.textContent])
    .filter(([, t]) => new RegExp(re.source, "i").test(t)).map(([t]) => t);
  const words = all.split(" ").filter(Boolean).length;
  const hits = (all.match(re) || []).length;
  return { hits, words, density: (hits / words * 100).toFixed(2) + "%", mainHits: (main.match(re) || []).length, in: where };
}, kw);
console.log(JSON.stringify(r));
await b.close();
