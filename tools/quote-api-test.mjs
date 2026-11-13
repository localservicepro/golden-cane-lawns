// Tests api/_ghl-quote-core.js against a stand-in GHL API (no network).
// Run: npm run test:quote
import { createQuoteHandler, isOurPhoto, toE164, API } from "../api/_ghl-quote-core.js";

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? "PASS" : "FAIL"} ${m}`); };
const ORIGIN = "https://goldencanelawns.com.au";
const PHOTO = "https://abc123.public.blob.vercel-storage.com/quote-photos/2026-11-13/yard-1-XyZ.jpg";
const PHOTO2 = "https://abc123.public.blob.vercel-storage.com/quote-photos/2026-11-13/yard-2-AbC.jpg";
const ENV = { GHL_PIT_TOKEN: "pit-test", GHL_LOCATION_ID: "loc123" };
const FIELDS = [
  { id: "f_addr", fieldKey: "contact.property_address" }, { id: "f_size", fieldKey: "contact.property_size" },
  { id: "f_svc", fieldKey: "contact.service_needed" }, { id: "f_notes", fieldKey: "contact.job_notes" },
  { id: "f_photos", fieldKey: "contact.add_photos" },
];

function fakeGhl({ upsert = 201, isNew = true, fields = FIELDS, upload = 200, photo = 200, tag = 201 } = {}) {
  const calls = [];
  const fetch = async (url, opts = {}) => {
    url = String(url); calls.push({ url, opts });
    const j = (s, b) => new Response(JSON.stringify(b), { status: s, headers: { "content-type": "application/json" } });
    if (url === `${API}/contacts/upsert`) return upsert < 300 ? j(upsert, { new: isNew, contact: { id: "c42" } }) : j(upsert, { message: "nope" });
    if (url.startsWith(`${API}/locations/loc123/customFields`)) return j(200, { customFields: fields });
    if (url.startsWith(`${API}/forms/upload-custom-files`)) return upload < 300 ? j(upload, { id: "c42" }) : j(upload, { message: "bad" });
    if (url === `${API}/contacts/c42/tags`) return opts.method === "DELETE" ? j(200, { tags: [] }) : tag < 300 ? j(tag, { tags: ["website-quote"] }) : j(tag, { message: "x" });
    if (url.includes("blob.vercel-storage.com")) return photo < 300 ? new Response(new Blob([new Uint8Array([255, 216, 255])], { type: "image/jpeg" }), { status: 200 }) : new Response("", { status: photo });
    return j(404, {});
  };
  return { fetch, calls };
}
const req = (body, origin = ORIGIN) => new Request("https://x/api/quote", { method: "POST", headers: { origin, "content-type": "application/json" }, body: typeof body === "string" ? body : JSON.stringify(body) });
const make = (g, env = ENV) => createQuoteHandler({ fetch: g.fetch, env, uuid: (() => { let i = 0; return () => `u${++i}`; })() });
const lead = {
  full_name: "Jo Van Bloggs", email: "jo@example.com", phone: "0415 190 092", property_address: "1 Main St, Ormiston",
  property_size: "Medium (400–800 m²)", service_needed: "Lawn Mowing", job_notes: "Dog in yard", gcl_hp_check: "", photos: [PHOTO, PHOTO2],
};

ok(isOurPhoto(PHOTO) && !isOurPhoto("https://evil.com/quote-photos/x.jpg") && !isOurPhoto("https://abc.public.blob.vercel-storage.com.evil.com/quote-photos/x.jpg") && !isOurPhoto("https://abc.public.blob.vercel-storage.com/other/x.jpg"), "only our Blob quote-photos URLs are accepted");
ok(toE164("0415 190 092") === "+61415190092" && toE164("+61 415 190 092") === "+61415190092" && toE164("61415190092") === "+61415190092" && toE164("(07) 3821 0000") === "+61738210000", "AU phones normalised to E.164");

{ const g = fakeGhl(); const r = await make(g)(req(lead, "https://evil.com")); ok(r.status === 403 && !g.calls.length, "403 for foreign origin"); }
{ const g = fakeGhl(); const r = await make(g, {})(req(lead)); ok(r.status === 503 && !g.calls.length, "503 when PIT/location not set"); }
{ const g = fakeGhl(); const r = await make(g)(req("{bad")); ok(r.status === 400, "400 for bad JSON"); }
{ const g = fakeGhl(); const r = await make(g)(req({ ...lead, gcl_hp_check: "http://spam" })); ok(r.status === 200 && !g.calls.length, "honeypot: 200 but nothing sent to GHL"); }
{ const g = fakeGhl(); const r = await make(g)(req({ ...lead, email: "nope" })); ok(r.status === 400 && !g.calls.length, "400 for invalid email"); }
{ const g = fakeGhl(); const r = await make(g)(req({ ...lead, phone: "12" })); ok(r.status === 400 && !g.calls.length, "400 for short phone"); }

{
  const g = fakeGhl(); const h = make(g);
  const r = await h(req(lead)); const d = await r.json();
  ok(r.status === 200 && d.ok && d.photos === 2 && d.contactId === "c42", `200 full lead ${JSON.stringify(d)}`);
  const urls = g.calls.map(c => `${c.opts.method || "GET"} ${c.url.replace(API, "").split("?")[0]}`);
  ok(JSON.stringify(urls.filter(u => !u.includes("blob"))) === JSON.stringify(["GET /locations/loc123/customFields", "POST /contacts/upsert", "POST /forms/upload-custom-files", "POST /contacts/c42/tags"]), `order: fields, upsert, photos, then tag LAST: ${urls.join(" | ")}`);
  const up = g.calls.find(c => c.url.endsWith("/contacts/upsert")); const ub = JSON.parse(up.opts.body);
  ok(up.opts.headers.Authorization === "Bearer pit-test" && up.opts.headers.Version, "PIT bearer + Version header");
  ok(ub.locationId === "loc123" && ub.name === "Jo Van Bloggs" && ub.firstName === "Jo" && ub.lastName === "Van Bloggs" && ub.email === "jo@example.com" && ub.phone === "+61415190092" && ub.source === "Website quote form", `contact fields ${JSON.stringify({ ...ub, customFields: undefined })}`);
  const cf = Object.fromEntries(ub.customFields.map(f => [f.id, f.field_value]));
  ok(cf.f_addr === "1 Main St, Ormiston" && cf.f_size === "Medium (400–800 m²)" && cf.f_svc === "Lawn Mowing" && cf.f_notes === "Dog in yard" && !("f_photos" in cf), `custom fields mapped by id ${JSON.stringify(cf)}`);
  ok(!("tags" in ub), "tag not set on upsert (added last)");
  const upl = g.calls.find(c => c.url.includes("upload-custom-files"));
  ok(upl.url.endsWith("?contactId=c42&locationId=loc123") && [...upl.opts.body.keys()].every(k => /^f_photos_u\d$/.test(k)) && upl.opts.body.get("f_photos_u1").name === "yard-1-XyZ.jpg", "photos posted as <fieldId>_<fileId> to the contact");
  const tg = g.calls.at(-1);
  ok(JSON.parse(tg.opts.body).tags[0] === "website-quote", "adds website-quote tag");
  g.calls.length = 0; await h(req(lead));
  ok(!g.calls.some(c => c.url.includes("/customFields")), "field ids cached between requests");
}
{
  const g = fakeGhl(); const r = await make(g)(req({ ...lead, photos: [], job_notes: "", property_size: "" }));
  const ub = JSON.parse(g.calls.find(c => c.url.endsWith("/upsert")).opts.body);
  ok(r.status === 200 && !g.calls.some(c => c.url.includes("upload-custom-files")) && ub.customFields.length === 2, "no photos / empty fields: nothing extra sent, still tagged");
}
{
  const g = fakeGhl({ isNew: false }); await make(g)(req(lead));
  const t = g.calls.filter(c => c.url.endsWith("/contacts/c42/tags")).map(c => c.opts.method);
  ok(JSON.stringify(t) === '["POST"]', `returning contact: tag only added, never removed (${t})`);
}
{ const g = fakeGhl({ upload: 422 }); const r = await make(g)(req(lead)); const d = await r.json(); ok(r.status === 200 && d.photos === 0 && g.calls.at(-1).url.endsWith("/tags"), "photo upload rejected: lead still saved and tagged"); }
{ const g = fakeGhl({ photo: 404 }); const r = await make(g)(req(lead)); ok(r.status === 200 && !g.calls.some(c => c.url.includes("upload-custom-files")), "unreadable photos: lead still saved and tagged"); }
{ const g = fakeGhl({ upsert: 401 }); const r = await make(g)(req(lead)); ok(r.status === 502 && !g.calls.some(c => c.url.includes("/tags")), "502 if the contact can't be saved (bad token/scope), no tag"); }
{ const g = fakeGhl({ tag: 403 }); const r = await make(g)(req(lead)); ok(r.status === 502, "502 if the tag can't be added (workflow wouldn't fire)"); }
{ const g = fakeGhl({ fields: FIELDS.filter(f => f.fieldKey !== "contact.job_notes") }); const r = await make(g)(req(lead)); ok(r.status === 200, "missing custom field is logged, lead still saved"); }
{ const g = fakeGhl(); await make(g, { ...ENV, GHL_QUOTE_TAG: "other-tag" })(req(lead)); ok(JSON.parse(g.calls.at(-1).opts.body).tags[0] === "other-tag", "GHL_QUOTE_TAG overrides the tag"); }
{ const g = fakeGhl(); const many = Array.from({ length: 9 }, (_, i) => PHOTO.replace("yard-1", `y${i}`)); const d = await (await make(g)(req({ ...lead, photos: many }))).json(); ok(d.photos === 5, "caps at 5 photos"); }

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
