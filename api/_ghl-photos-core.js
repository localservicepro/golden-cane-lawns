// Attaches quote-form photos to the GoHighLevel contact's File Upload custom
// field (`contact.add_photos`) using a Private Integration Token (PIT).
// Kept separate from the route so it can be tested with stand-in fetch/env.
//
// Flow: upsert the contact (matched by email/phone, the same contact the GHL
// tracking script creates) -> find the add_photos field id -> download each
// photo from our Vercel Blob store -> POST them to /forms/upload-custom-files.
//
// Env: GHL_PIT_TOKEN (scopes: contacts.write, forms.write,
// locations/customFields.readonly), GHL_LOCATION_ID, optional
// GHL_PHOTOS_FIELD_ID (skips the field lookup), optional GHL_API_VERSION.

import { ORIGIN_OK } from "./_upload-core.js";

export const API = "https://services.leadconnectorhq.com";
export const FIELD_KEY = "contact.add_photos";
const MAX_PHOTOS = 5;
const BLOB_HOST = /^[a-z0-9]+\.public\.blob\.vercel-storage\.com$/;

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

export function createAttachHandler({ fetch, env, sleep = ms => new Promise(r => setTimeout(r, ms)), delayMs = 3000, uuid = () => crypto.randomUUID() }) {
  let fieldId = env.GHL_PHOTOS_FIELD_ID || null;

  return async function POST(request) {
    const origin = request.headers.get("origin") || "";
    if (!ORIGIN_OK.test(origin)) return json(403, { error: "Only accepted from the website." });
    if (!env.GHL_PIT_TOKEN || !env.GHL_LOCATION_ID) {
      console.error("attach-photos: GHL_PIT_TOKEN or GHL_LOCATION_ID is not set");
      return json(503, { error: "Photo attachment is not configured." });
    }

    let body;
    try { body = await request.json(); } catch { return json(400, { error: "Invalid JSON." }); }
    const clean = (v, n) => String(v || "").trim().slice(0, n);
    const name = clean(body.name, 120), email = clean(body.email, 200), phone = clean(body.phone, 40);
    if (!email && !phone) return json(400, { error: "Email or phone is required." });
    const photos = (Array.isArray(body.photos) ? body.photos : []).filter(isOurPhoto).slice(0, MAX_PHOTOS);
    if (!photos.length) return json(400, { error: "No valid photos." });

    const loc = env.GHL_LOCATION_ID;
    const headers = { Authorization: `Bearer ${env.GHL_PIT_TOKEN}`, Version: env.GHL_API_VERSION || "2021-07-28", Accept: "application/json" };
    const fail = async (step, res) => {
      const text = res ? await res.text().catch(() => "") : "";
      console.error(`attach-photos: ${step} failed`, res && res.status, text.slice(0, 500));
      return json(502, { error: `GHL ${step} failed.`, status: res && res.status });
    };

    // Give the GHL tracking script a moment to create the contact first, so the
    // upsert matches it instead of racing it.
    if (delayMs) await sleep(delayMs);

    const contact = { locationId: loc };
    if (name) contact.name = name;
    if (email) contact.email = email;
    if (phone) contact.phone = phone;
    const up = await fetch(`${API}/contacts/upsert`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(contact) });
    if (!up.ok) return fail("contact upsert", up);
    const contactId = (await up.json())?.contact?.id;
    if (!contactId) return fail("contact upsert (no id)");

    if (!fieldId) {
      const cf = await fetch(`${API}/locations/${encodeURIComponent(loc)}/customFields?model=contact`, { headers });
      if (!cf.ok) return fail("custom field lookup", cf);
      const fields = (await cf.json())?.customFields || [];
      const f = fields.find(x => x.fieldKey === FIELD_KEY);
      if (!f) { console.error(`attach-photos: no custom field with key ${FIELD_KEY}`); return json(500, { error: `Custom field ${FIELD_KEY} not found.` }); }
      fieldId = f.id;
    }

    const form = new FormData();
    let attached = 0;
    for (const url of photos) {
      const r = await fetch(url);
      if (!r.ok) { console.error("attach-photos: could not read photo", url, r.status); continue; }
      const blob = await r.blob();
      form.append(`${fieldId}_${uuid()}`, blob, decodeURIComponent(new URL(url).pathname.split("/").pop()));
      attached++;
    }
    if (!attached) return json(502, { error: "Could not read any photos." });

    const qs = new URLSearchParams({ contactId, locationId: loc });
    const upl = await fetch(`${API}/forms/upload-custom-files?${qs}`, { method: "POST", headers, body: form });
    if (!upl.ok) return fail("file upload", upl);
    return json(200, { ok: true, contactId, attached });
  };
}
