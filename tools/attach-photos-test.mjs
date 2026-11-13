// Tests api/_ghl-photos-core.js against a stand-in GHL API (no network).
// Run: npm run test:attach
import { createAttachHandler, isOurPhoto, API } from "../api/_ghl-photos-core.js";

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? "PASS" : "FAIL"} ${m}`); };
const ORIGIN = "https://goldencanelawns.com.au";
const PHOTO = "https://abc123.public.blob.vercel-storage.com/quote-photos/2026-11-13/yard-1-XyZ.jpg";
const PHOTO2 = "https://abc123.public.blob.vercel-storage.com/quote-photos/2026-11-13/yard-2-AbC.jpg";
const ENV = { GHL_PIT_TOKEN: "pit-test", GHL_LOCATION_ID: "loc123" };

function fakeGhl({ upsert = 201, fields = [{ id: "fld999", fieldKey: "contact.add_photos" }], upload = 200, photo = 200 } = {}) {
  const calls = [];
  const fetch = async (url, opts = {}) => {
    calls.push({ url: String(url), opts });
    const j = (s, b) => new Response(JSON.stringify(b), { status: s, headers: { "content-type": "application/json" } });
    if (url === `${API}/contacts/upsert`) return upsert < 300 ? j(upsert, { new: false, contact: { id: "c42" } }) : j(upsert, { message: "nope" });
    if (String(url).startsWith(`${API}/locations/loc123/customFields`)) return j(200, { customFields: fields });
    if (String(url).startsWith(`${API}/forms/upload-custom-files`)) return upload < 300 ? j(upload, { id: "c42" }) : j(upload, { message: "bad" });
    if (String(url).includes("blob.vercel-storage.com")) return photo < 300 ? new Response(new Blob([new Uint8Array([255, 216, 255])], { type: "image/jpeg" }), { status: 200 }) : new Response("", { status: photo });
    return j(404, {});
  };
  return { fetch, calls };
}
const req = (body, origin = ORIGIN) => new Request("https://x/api/attach-photos", { method: "POST", headers: { origin, "content-type": "application/json" }, body: typeof body === "string" ? body : JSON.stringify(body) });
const make = (g, env = ENV) => createAttachHandler({ fetch: g.fetch, env, delayMs: 0, uuid: (() => { let i = 0; return () => `u${++i}`; })() });
const good = { name: "Jo Bloggs", email: "jo@example.com", phone: "0400 000 000", photos: [PHOTO, PHOTO2] };

ok(isOurPhoto(PHOTO), "accepts our Blob quote-photos URL");
ok(!isOurPhoto("https://evil.com/quote-photos/x.jpg"), "rejects other hosts");
ok(!isOurPhoto("https://abc.public.blob.vercel-storage.com/other/x.jpg"), "rejects other Blob folders");
ok(!isOurPhoto("http://abc.public.blob.vercel-storage.com/quote-photos/x.jpg"), "rejects http");
ok(!isOurPhoto("https://abc.public.blob.vercel-storage.com.evil.com/quote-photos/x.jpg"), "rejects lookalike hosts");

{ const g = fakeGhl(); const r = await make(g)(req(good, "https://evil.com")); ok(r.status === 403 && g.calls.length === 0, "403 for foreign origin"); }
{ const g = fakeGhl(); const r = await make(g, {})(req(good)); ok(r.status === 503 && g.calls.length === 0, "503 when PIT/location not configured"); }
{ const g = fakeGhl(); const r = await make(g)(req("{bad")); ok(r.status === 400, "400 for bad JSON"); }
{ const g = fakeGhl(); const r = await make(g)(req({ ...good, email: "", phone: "" })); ok(r.status === 400 && g.calls.length === 0, "400 without email or phone"); }
{ const g = fakeGhl(); const r = await make(g)(req({ ...good, photos: ["https://evil.com/a.jpg"] })); ok(r.status === 400 && g.calls.length === 0, "400 when no valid photos (never fetches foreign URLs)"); }

{
  const g = fakeGhl(); const h = make(g);
  const r = await h(req(good)); const d = await r.json();
  ok(r.status === 200 && d.attached === 2 && d.contactId === "c42", `200 attaches 2 photos ${JSON.stringify(d)}`);
  const up = g.calls[0];
  const ub = JSON.parse(up.opts.body);
  ok(up.url === `${API}/contacts/upsert` && up.opts.headers.Authorization === "Bearer pit-test" && up.opts.headers.Version && ub.locationId === "loc123" && ub.email === "jo@example.com" && ub.phone === "0400 000 000" && ub.name === "Jo Bloggs", "upserts contact with PIT, Version header, location, name/email/phone");
  ok(g.calls[1].url.startsWith(`${API}/locations/loc123/customFields`), "looks up the add_photos field id");
  const last = g.calls.at(-1);
  ok(last.url === `${API}/forms/upload-custom-files?contactId=c42&locationId=loc123` && last.opts.method === "POST", "posts to /forms/upload-custom-files with contactId + locationId");
  const keys = [...last.opts.body.keys()];
  ok(keys.length === 2 && keys.every(k => /^fld999_u\d$/.test(k)), `multipart keys are <fieldId>_<fileId>: ${keys}`);
  const file = last.opts.body.get(keys[0]);
  ok(file.name === "yard-1-XyZ.jpg" && file.type === "image/jpeg" && !("Content-Type" in last.opts.headers), "file keeps its name/type; fetch sets the multipart boundary");
  g.calls.length = 0; await h(req(good));
  ok(!g.calls.some(c => c.url.includes("/customFields")), "field id is cached after the first lookup");
}
{ const g = fakeGhl(); await createAttachHandler({ fetch: g.fetch, env: { ...ENV, GHL_PHOTOS_FIELD_ID: "envfld" }, delayMs: 0 })(req(good)); ok(!g.calls.some(c => c.url.includes("/customFields")) && [...g.calls.at(-1).opts.body.keys()][0].startsWith("envfld_"), "GHL_PHOTOS_FIELD_ID skips the lookup"); }
{ const g = fakeGhl({ upsert: 401 }); const r = await make(g)(req(good)); ok(r.status === 502 && g.calls.length === 1, "502 and stops if the upsert is refused (bad token/scope)"); }
{ const g = fakeGhl({ fields: [{ id: "x", fieldKey: "contact.other" }] }); const r = await make(g)(req(good)); ok(r.status === 500, "500 when contact.add_photos field doesn't exist"); }
{ const g = fakeGhl({ photo: 404 }); const r = await make(g)(req(good)); ok(r.status === 502 && !g.calls.some(c => c.url.includes("upload-custom-files")), "502 when no photo can be read"); }
{ const g = fakeGhl({ upload: 422 }); const r = await make(g)(req(good)); ok(r.status === 502, "502 when GHL rejects the file upload"); }
{ const g = fakeGhl(); const many = Array.from({ length: 9 }, (_, i) => PHOTO.replace("yard-1", `y${i}`)); const r = await make(g)(req({ ...good, photos: many })); ok((await r.json()).attached === 5, "caps at 5 photos"); }

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
