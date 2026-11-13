// Tests api/_upload-core.js with a stand-in for Vercel Blob's `put`.
// Usage: node tools/upload-api-test.mjs
import { createUploadHandler, MAX_BYTES } from "../api/_upload-core.js";

const calls = [];
const POST = createUploadHandler(async (path, body, opts) => {
  calls.push({ path, size: body.byteLength, opts });
  return { url: `https://blob.example/${path}` };
});

const req = ({ origin = "https://www.goldencanelawns.com.au", type = "image/jpeg", size = 1000, name = "My Front Yard!.JPG" } = {}) =>
  new Request(`https://www.goldencanelawns.com.au/api/upload?name=${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { ...(origin ? { origin } : {}), "content-type": type },
    body: new Uint8Array(size),
  });

let failed = 0;
const check = async (label, request, status, extra) => {
  const res = await POST(request);
  const body = await res.json();
  const ok = res.status === status && (!extra || extra(body));
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label} → ${res.status} ${JSON.stringify(body)}`);
};

await check("live site, jpeg", req(), 200, b => /^https:\/\/blob\.example\/quote-photos\/\d{4}-\d{2}-\d{2}\/my-front-yard\.jpg$/.test(b.url));
await check("vercel preview origin", req({ origin: "https://golden-cane-lawns-git-main-lsp.vercel.app" }), 200);
await check("localhost origin", req({ origin: "http://localhost:4173", type: "image/webp" }), 200, b => b.url.endsWith(".webp"));
await check("iPhone HEIC", req({ type: "image/heic", name: "IMG_1234.HEIC" }), 200, b => b.url.endsWith("img-1234.heic"));
await check("foreign origin rejected", req({ origin: "https://evil.example" }), 403);
await check("missing origin rejected", req({ origin: "" }), 403);
await check("non-image rejected", req({ type: "application/pdf" }), 415);
await check("svg rejected", req({ type: "image/svg+xml" }), 415);
await check("over 4 MB rejected", req({ size: MAX_BYTES + 1 }), 413);
await check("empty body rejected", req({ size: 0 }), 400);
const last = calls[0];
const optsOk = last && last.opts.access === "public" && last.opts.addRandomSuffix === true && last.opts.contentType === "image/jpeg";
if (!optsOk) failed++;
console.log(`${optsOk ? "PASS" : "FAIL"}  put() called with public access, random suffix, content type`);
console.log(`\n${failed ? `${failed} FAILED` : "all upload API checks passed"}`);
process.exit(failed ? 1 : 0);
