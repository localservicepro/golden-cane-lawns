// Real-browser QA: screenshots (desktop + mobile), console errors, form flow,
// honeypot, validation and service-area video looping.
// Usage: node tools/browser-check.mjs <base-url> <screenshot-dir>
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:4173";
const SHOTS = process.argv[3] || "shots";
const results = [];
const log = (ok, msg) => { results.push({ ok, msg }); console.log(`${ok ? "PASS" : "FAIL"}  ${msg}`); };

// Stand-in for link.msgsndr.com/js/external-tracking.js (blocked in this sandbox):
// records submissions the same way, from a document-level submit listener.
const TRACKER_STUB = `
  window.__tracked = [];
  document.addEventListener("submit", function (e) {
    var fd = new FormData(e.target), o = {};
    fd.forEach(function (v, k) { o[k] = v; });
    window.__tracked.push(o);
    try { sessionStorage.setItem("__tracked", JSON.stringify(window.__tracked)); } catch (x) {}
  });`;

const browser = await chromium.launch();

async function newPage(viewport, mobile = false) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  await ctx.route("https://link.msgsndr.com/**", r => r.fulfill({ contentType: "application/javascript", body: TRACKER_STUB }));
  // Third-party hosts the sandbox can't reach: fail fast instead of hanging.
  await ctx.route(/cloudfront\.net/, r => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", m => { if (m.type() === "error" && !/cloudfront|ERR_FAILED|net::/.test(m.text())) errors.push(m.text()); });
  page.on("pageerror", e => errors.push(String(e)));
  return { ctx, page, errors };
}

const PAGES = ["/", "/mowing", "/hedging", "/weed-control", "/gardening", "/about", "/contact", "/blog", "/blog/lawn-mowing-cost-redlands", "/thank-you", "/404"];

for (const [label, viewport, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const { ctx, page, errors } = await newPage(viewport, mobile);
  for (const p of PAGES) {
    const res = await page.goto(BASE + p, { waitUntil: "networkidle" });
    // Reveal everything for full-page screenshots.
    await page.evaluate(async () => {
      document.querySelectorAll("[data-reveal]").forEach(e => e.classList.add("is-in"));
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
      await Promise.race([
        Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))),
        new Promise(r => setTimeout(r, 4000)),
      ]);
    });
    await page.waitForTimeout(300);
    const name = p === "/" ? "home" : p.slice(1).replace(/\//g, "_");
    await page.screenshot({ path: `${SHOTS}/${label}-${name}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    log(res.status() < 400 || p === "/404", `${label} ${p} status ${res.status()}`);
    log(overflow <= 0, `${label} ${p} no horizontal overflow (${overflow}px)`);
    const h1 = await page.locator("h1").count();
    log(h1 === 1, `${label} ${p} has exactly one H1 (${h1})`);
    const badImgs = await page.evaluate(() => [...document.images].filter(i => !i.alt && !i.closest("dialog")).length);
    log(badImgs === 0, `${label} ${p} all images have alt text (${badImgs} missing)`);
  }
  log(errors.length === 0, `${label} no console errors ${errors.length ? JSON.stringify(errors.slice(0, 3)) : ""}`);
  await ctx.close();
}

// Homepage above-the-fold screenshots
for (const [label, viewport, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const { ctx, page } = await newPage(viewport, mobile);
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${SHOTS}/${label}-home-fold.png` });
  if (mobile) {
    await page.click(".menu-toggle");
    await page.waitForTimeout(500);
    log(await page.locator("#drawer.is-open").count() === 1, "mobile menu opens");
    await page.screenshot({ path: `${SHOTS}/mobile-menu.png` });
  }
  await ctx.close();
}

// Form: valid submission is tracked and redirects to /thank-you
{
  const { ctx, page } = await newPage({ width: 1280, height: 900 });
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  const f = page.locator("form.js-quote").first();
  await f.locator("[name=full_name]").fill("Test Person");
  await f.locator("[name=phone]").fill("0400 000 000");
  await f.locator("[name=email]").fill("test@example.com");
  await f.locator("[name=property_address]").fill("1 Test St, Wellington Point");
  await f.locator("[name=property_size]").selectOption({ index: 2 });
  await f.locator("[name=service_needed]").selectOption("Hedge Trimming");
  await f.locator("[name=job_notes]").fill("Front hedge, fortnightly.");
  const opts = await f.locator("[name=service_needed] option").allTextContents();
  log(JSON.stringify(opts) === JSON.stringify(["Select a service…", "Lawn Mowing", "Hedge Trimming", "Weed Spraying", "Whipper Snipping", "Other"]), `service dropdown options ${JSON.stringify(opts)}`);
  await Promise.all([page.waitForURL(/\/thank-you$/, { timeout: 8000 }), f.locator("[type=submit]").click()]);
  log(true, "valid submission redirected to /thank-you");
  const tracked = await page.evaluate(() => JSON.parse(sessionStorage.getItem("__tracked") || "[]"));
  const t = tracked[0] || {};
  const keys = ["full_name", "email", "phone", "property_address", "property_size", "service_needed", "job_notes"];
  log(tracked.length === 1 && keys.every(k => t[k]), `tracker saw one submission with all GHL fields: ${JSON.stringify(t)}`);
  log(!("gcl_hp_check" in t), "honeypot field not sent to tracker");
  log((await page.locator("h1").textContent()).includes("Test"), "thank-you page personalised with first name");
  await page.screenshot({ path: `${SHOTS}/desktop-thank-you-after-submit.png` });
  await ctx.close();
}

// Form: invalid submission is blocked and not tracked
{
  const { ctx, page } = await newPage({ width: 1280, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const f = page.locator("form.js-quote").first();
  await f.locator("[name=full_name]").fill("Only Name");
  await f.locator("[type=submit]").click();
  await page.waitForTimeout(2000);
  log(!page.url().includes("thank-you"), "invalid submission stays on page");
  log(await f.locator(".field.is-invalid").count() >= 3, "invalid fields are flagged");
  log((await page.evaluate(() => (window.__tracked || []).length)) === 0, "invalid submission not tracked");
  await f.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SHOTS}/desktop-form-validation.png` });
  await ctx.close();
}

// Form: honeypot filled (bot) is not tracked, quietly redirected
{
  const { ctx, page } = await newPage({ width: 1280, height: 900 });
  await page.goto(BASE + "/mowing", { waitUntil: "networkidle" });
  const f = page.locator("form.js-quote").first();
  for (const [n, v] of [["full_name", "Bot"], ["phone", "0400000000"], ["email", "bot@example.com"], ["property_address", "x"]]) await f.locator(`[name=${n}]`).fill(v);
  await f.locator("[name=service_needed]").selectOption("Other");
  await f.locator("[name=gcl_hp_check]").evaluate(el => { el.value = "http://spam"; });
  await Promise.all([page.waitForURL(/\/thank-you$/, { timeout: 8000 }), f.locator("[type=submit]").click()]);
  const tracked = await page.evaluate(() => JSON.parse(sessionStorage.getItem("__tracked") || "[]"));
  log(tracked.length === 0, "honeypot submission not tracked (bot dropped)");
  await ctx.close();
}

// Browser autofill should not trip the honeypot: it has autocomplete=off and a non-semantic name.
{
  const { ctx, page } = await newPage({ width: 1280, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const hp = await page.locator("[name=gcl_hp_check]").first().evaluate(el => ({ ac: el.getAttribute("autocomplete"), tab: el.tabIndex, req: el.required, vis: el.getBoundingClientRect().left }));
  log(hp.ac === "off" && hp.tab === -1 && !hp.req && hp.vis < 0, `honeypot is off-screen, not tabbable, not required, autocomplete off ${JSON.stringify(hp)}`);
  await ctx.close();
}

// Service-area animation: embedded, muted, autoplaying when in view, looping
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.locator("#service-areas").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const v1 = await page.evaluate(() => { const v = document.querySelector("#service-areas video"); return { muted: v.muted, loop: v.loop, playsInline: v.playsInline, paused: v.paused, t: v.currentTime, dur: v.duration, src: v.currentSrc }; });
  log(v1.muted && v1.loop && v1.playsInline && !v1.paused && v1.t > 0, `map video playing muted/loop/playsinline ${JSON.stringify(v1)}`);
  await page.waitForTimeout(Math.max(1000, (v1.dur - v1.t + 1.5) * 1000));
  const v2 = await page.evaluate(() => { const v = document.querySelector("#service-areas video"); return { paused: v.paused, t: v.currentTime }; });
  log(!v2.paused && v2.t < v1.dur, `map video looped past its ${v1.dur?.toFixed?.(1)}s end and kept playing (t=${v2.t.toFixed(2)})`);
  const crawlable = await page.locator("#service-areas .suburbs li").allTextContents();
  log(crawlable.length === 11, `11 suburbs listed as crawlable text: ${crawlable.map(s => s.replace(/\s+·.*/, "").trim()).join(", ")}`);
  await page.locator("#service-areas").screenshot({ path: `${SHOTS}/desktop-service-areas.png` });
  await ctx.close();
}

// Structured data sanity
{
  const { ctx, page } = await newPage({ width: 1280, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const ld = await page.evaluate(() => JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent));
  const biz = ld["@graph"].find(n => Array.isArray(n["@type"]) && n["@type"].includes("LocalBusiness"));
  log(biz && !biz.address.streetAddress && biz.address.addressLocality === "Wellington Point" && biz.address.postalCode === "4160", "LocalBusiness address has suburb/postcode only, no street address");
  log(biz.areaServed.length === 11 && biz.serviceArea.geoRadius === "10000", "areaServed lists 11 suburbs + 10 km GeoCircle");
  log(ld["@graph"].some(n => n["@type"] === "FAQPage"), "FAQPage schema present on homepage");
  const html = await page.content();
  log(!/Toowoomba|Mackay|Banora|Shaun Lawson/i.test(html), "no leftover foreign template tags");
  await ctx.close();
}

await browser.close();
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
