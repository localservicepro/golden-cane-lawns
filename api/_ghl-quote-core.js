// Sends a quote-form lead to GoHighLevel with a Private Integration Token (PIT).
// Kept separate from the route so it can be tested with stand-in fetch/env.
//
// Order matters, because the GHL workflow triggers on the tag:
//   1. upsert the contact (matched by email/phone) with all form custom fields
//   2. attach photos (from our Vercel Blob store) to the File Upload field
//      contact.add_photos via /forms/upload-custom-files
//   3. add the "website-quote" tag LAST, so the workflow sees the photos
//
// Env: GHL_PIT_TOKEN (scopes: contacts.write, forms.write,
// locations/customFields.readonly), GHL_LOCATION_ID, optional GHL_QUOTE_TAG
// (default "website-quote"), optional GHL_API_VERSION.

import { ORIGIN_OK } from "./_upload-core.js";

export const API = "https://services.leadconnectorhq.com";
export const TAG = "website-quote";
const MAX_PHOTOS = 5;
const BLOB_HOST = /^[a-z0-9]+\.public\.blob\.vercel-storage\.com$/;
// form field name -> GHL custom field key
export const CUSTOM_FIELDS = {
  property_address: "contact.property_address",
  property_size: "contact.property_size",
  service_needed: "contact.service_needed",
  job_notes: "contact.job_notes",
};
const PHOTOS_KEY = "contact.add_photos";
const FIELDS_TTL = 10 * 60 * 1000;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

// Only photos from our own Blob store's quote-photos folder are accepted, so the
// function can't be used to fetch arbitrary URLs.
export function isOurPhoto(u) {
  try {
    const url = new URL(u);
    return url.protocol === "https:" && BLOB_HOST.test(url.hostname) && url.pathname.startsWith("/quote-photos/");
  } catch { return false; }
}

// Australian numbers to E.164 so GHL matches/dedupes them: 0415 190 092 -> +61415190092
export function toE164(phone) {
  const d = phone.replace(/[^\d+]/g, "");
  if (/^\+\d{8,15}$/.test(d)) return d;
  if (/^61\d{9}$/.test(d)) return "+" + d;
  if (/^0\d{9}$/.test(d)) return "+61" + d.slice(1);
  return phone;
}

export function createQuoteHandler({ fetch, env, uuid = () => crypto.randomUUID(), now = () => Date.now() }) {
  let fieldCache = null, fieldCacheAt = 0;

  return async function POST(request) {
    const origin = request.headers.get("origin") || "";
    if (!ORIGIN_OK.test(origin)) return json(403, { error: "Only accepted from the website." });
    if (!env.GHL_PIT_TOKEN || !env.GHL_LOCATION_ID) {
      console.error("quote: GHL_PIT_TOKEN or GHL_LOCATION_ID is not set");
      return json(503, { error: "Quote form is not configured." });
    }

    let body;
    try { body = await request.json(); } catch { return json(400, { error: "Invalid JSON." }); }
    if (!body || typeof body !== "object") return json(400, { error: "Invalid JSON." });
    const clean = (v, n = 500) => String(v ?? "").trim().slice(0, n);
    // Honeypot: pretend it worked, send nothing.
    if (clean(body.gcl_hp_check)) return json(200, { ok: true });
    const name = clean(body.full_name, 120), email = clean(body.email, 200), phone = clean(body.phone, 40);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || phone.replace(/\D/g, "").length < 8) {
      return json(400, { error: "Name, a valid email and phone are required." });
    }
    const photos = (Array.isArray(body.photos) ? body.photos : []).filter(isOurPhoto).slice(0, MAX_PHOTOS);

    const loc = env.GHL_LOCATION_ID;
    const headers = { Authorization: `Bearer ${env.GHL_PIT_TOKEN}`, Version: env.GHL_API_VERSION || "2021-07-28", Accept: "application/json" };
    const logFail = async (step, res) => {
      const text = res ? await res.text().catch(() => "") : "";
      console.error(`quote: ${step} failed`, res && res.status, text.slice(0, 500));
    };

    // Custom field ids by key (cached for a few minutes per warm instance)
    if (!fieldCache || now() - fieldCacheAt > FIELDS_TTL) {
      const cf = await fetch(`${API}/locations/${encodeURIComponent(loc)}/customFields?model=contact`, { headers });
      if (!cf.ok) { await logFail("custom field lookup", cf); return json(502, { error: "Could not reach the CRM." }); }
      fieldCache = Object.fromEntries(((await cf.json())?.customFields || []).map(f => [f.fieldKey, f.id]));
      fieldCacheAt = now();
    }
    const customFields = [];
    for (const [formName, key] of Object.entries(CUSTOM_FIELDS)) {
      const value = clean(body[formName], formName === "job_notes" ? 3000 : 300);
      if (!value) continue;
      if (fieldCache[key]) customFields.push({ id: fieldCache[key], field_value: value });
      else console.error(`quote: no custom field with key ${key}`);
    }

    // 1. contact
    const [firstName, ...rest] = name.split(/\s+/);
    const contact = { locationId: loc, name, firstName, email, phone: toE164(phone), source: "Website quote form", customFields };
    if (rest.length) contact.lastName = rest.join(" ");
    const up = await fetch(`${API}/contacts/upsert`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(contact) });
    if (!up.ok) { await logFail("contact upsert", up); return json(502, { error: "Could not save your details." }); }
    const contactId = (await up.json())?.contact?.id;
    if (!contactId) { await logFail("contact upsert (no id)"); return json(502, { error: "Could not save your details." }); }

    // 2. photos (a failure here doesn't lose the lead)
    let attached = 0;
    if (photos.length) {
      const fieldId = fieldCache[PHOTOS_KEY];
      if (!fieldId) console.error(`quote: no custom field with key ${PHOTOS_KEY}`);
      else {
        const form = new FormData();
        for (const url of photos) {
          const r = await fetch(url);
          if (!r.ok) { console.error("quote: could not read photo", url, r.status); continue; }
          form.append(`${fieldId}_${uuid()}`, await r.blob(), decodeURIComponent(new URL(url).pathname.split("/").pop()));
          attached++;
        }
        if (attached) {
          const qs = new URLSearchParams({ contactId, locationId: loc });
          const upl = await fetch(`${API}/forms/upload-custom-files?${qs}`, { method: "POST", headers, body: form });
          if (!upl.ok) { await logFail("photo upload", upl); attached = 0; }
        }
      }
    }

    // 3. tag last: this is what triggers the workflow (the workflow removes the
    //    tag again after the confirmation is sent, so repeat customers re-trigger).
    const tag = env.GHL_QUOTE_TAG || TAG;
    const tg = await fetch(`${API}/contacts/${encodeURIComponent(contactId)}/tags`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ tags: [tag] }) });
    if (!tg.ok) { await logFail("add tag", tg); return json(502, { error: "Could not save your details." }); }

    return json(200, { ok: true, contactId, photos: attached });
  };
}
