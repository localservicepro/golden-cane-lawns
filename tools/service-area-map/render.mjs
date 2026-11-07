// Renders map.html frame-by-frame and encodes a seamless loop.
// Usage: node tools/service-area-map/render.mjs [--preview]
// Requires Playwright (Chromium) and ffmpeg with libx264 + libvpx-vp9.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../../public/assets/video");
const FPS = 30;
const preview = process.argv.includes("--preview");

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
await page.goto("file://" + path.join(here, "map.html"));
await page.evaluate(() => document.fonts.ready);
const DUR = await page.evaluate(() => window.DUR);

if (preview) {
  for (const t of [0, 2.5, 5, 7.9]) {
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: path.join(here, `preview-${t}.png`) });
  }
  await browser.close();
  process.exit(0);
}

const dir = mkdtempSync(path.join(tmpdir(), "gcl-map-"));
const frames = Math.round(DUR * FPS);
for (let i = 0; i < frames; i++) {
  await page.evaluate(t => window.render(t), i / FPS);
  await page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, "0")}.png`) });
}
// Poster: a mid-tour frame that shows the route and highlighted suburbs.
await page.evaluate(t => window.render(t), 7.9);
await page.screenshot({ path: path.join(dir, "poster.png") });
await browser.close();

const input = ["-y", "-framerate", String(FPS), "-i", path.join(dir, "f%04d.png")];
execFileSync("ffmpeg", [...input, "-vf", "scale=900:900:flags=lanczos", "-c:v", "libx264", "-pix_fmt", "yuv420p",
  "-profile:v", "high", "-crf", "26", "-preset", "veryslow", "-movflags", "+faststart", "-an",
  path.join(out, "service-area-map.mp4")], { stdio: "inherit" });
execFileSync("ffmpeg", [...input, "-vf", "scale=900:900:flags=lanczos", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "48",
  "-row-mt", "1", "-deadline", "good", "-an", path.join(out, "service-area-map.webm")], { stdio: "inherit" });
execFileSync("ffmpeg", ["-y", "-i", path.join(dir, "poster.png"), "-vf", "scale=900:900", "-c:v", "libwebp", "-quality", "80",
  path.join(out, "service-area-map-poster.webp")], { stdio: "inherit" });
rmSync(dir, { recursive: true, force: true });
console.log("done");
