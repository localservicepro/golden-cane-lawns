# Quote form → GoHighLevel via API (no tracking script)

How the Golden Cane Lawns quote form sends leads, and photos, straight into the
GHL CRM using a Private Integration Token (PIT). It's built to be reused on other
local-service sites: copy the files, change the field map, set four things in GHL
and two env vars in Vercel.

---

## 1. Why API instead of the GHL external tracking script

| | Tracking script | API (this build) |
|---|---|---|
| Hidden fields | **Never captured** (GHL docs: hidden, password, payment fields are skipped) | Anything the server sends |
| File Upload fields | Can't fill them | Real files attached to the contact |
| Workflow trigger | "Form submitted", fires whenever the script decides | A **tag added last**, after every field and photo is saved |
| Failure handling | Silent; the lead is just missing | Visitor sees an error with the phone number and keeps their details |
| Third-party JS on every page | Yes | None |

The tracking script was removed from every page.

---

## 2. How it flows

```
Browser                         Vercel                              GHL (services.leadconnectorhq.com)
───────                         ──────                              ─────────────────────────────────
pick photo ─► resize (1600px) ─► POST /api/upload ─► Vercel Blob
                                  ◄── public URL ──┘
submit ─► validate + honeypot
       ─► wait for uploads
       ─► POST /api/quote {fields, photos[]}
                                  ├─ GET  /locations/{loc}/customFields   (field key → id, cached 10 min)
                                  ├─ POST /contacts/upsert                (contact + custom fields)
                                  ├─ GET  each photo from Blob
                                  ├─ POST /forms/upload-custom-files      (photos → add_photos)
                                  └─ POST /contacts/{id}/tags             ("website-quote", LAST)
       ◄── 200 ─► /thank-you                                        └─► workflow: Tag added = website-quote
       ◄── 4xx/5xx ─► error message + phone number, details kept
```

**Why the tag goes last:** the workflow is triggered by the tag. If the tag went on
with the upsert, the workflow could run (and send the internal email) before the
photos were attached, and `{{contact.add_photos}}` would be empty.

**Why upsert:** it matches an existing contact by email or phone (per the location's
"Allow duplicate contact" setting), so repeat customers update one record.

**Repeat customers:** the workflow removes `website-quote` after it sends the
confirmation. So the next quote adds the tag fresh and fires the workflow again.

---

## 3. GHL setup (per sub-account)

1. **Custom fields** (Settings → Custom Fields, object: Contact). The keys must match exactly:

   | Field | Key | Type |
   |---|---|---|
   | Property address | `contact.property_address` | Single line |
   | Property size | `contact.property_size` | Single line (or dropdown with the same options as the form) |
   | Service needed | `contact.service_needed` | Single line (or dropdown with the same options) |
   | Job notes | `contact.job_notes` | Multi line |
   | Add Photos | `contact.add_photos` | **File Upload** (allow multiple) |

   Name, email and phone are standard contact fields, so they need no custom field.

2. **Private Integration Token** (Settings → Private Integrations → Create). It needs these scopes:
   - **View/Edit Contacts**: `contacts.write`, for upsert and tags
   - **Edit Forms**: `forms.write`, for `/forms/upload-custom-files`
   - **View Custom Fields**: `locations/customFields.readonly`, to look up field IDs

   > This build first failed live with `401 "The token is not authorized for this
   > scope."` because the third scope was missing. If the lookup is refused, the
   > code now falls back to sending fields by key, but photos then need
   > `GHL_PHOTOS_FIELD_ID`. Add the scope.

3. **Location ID:** Settings → Business Profile (or the sub-account URL `/location/<ID>/...`).

4. **Workflow:**
   - Trigger: **Contact Tag → Tag Added → `website-quote`**
   - Actions: internal notification email, customer confirmation email (templates in
     `email-templates/`, using `{{contact.name}}`, `{{contact.add_photos}}`, etc.)
   - Last action: **Remove Contact Tag `website-quote`**

---

## 4. Vercel setup

1. **Blob store:** Storage → Create → Blob (public, a region close to the customers,
   e.g. syd1) → Connect to the project. This sets `BLOB_READ_WRITE_TOKEN` automatically.
2. **Environment variables** (Settings → Environment Variables, Production):

   | Name | Value | Notes |
   |---|---|---|
   | `GHL_PIT_TOKEN` | the PIT | Tick **Sensitive**. Never paste it in chat, code or a repo |
   | `GHL_LOCATION_ID` | sub-account ID | |
   | `GHL_QUOTE_TAG` | optional | defaults to `website-quote` |
   | `GHL_PHOTOS_FIELD_ID` | optional | only needed if the token can't read custom fields |

3. **Redeploy** after changing env vars, since they're read at deploy time.
   The env vars are Production only, so the form shows its error on preview URLs.
   Test on the live domain.

`package.json` needs `"@vercel/blob": "~2.8.2"` in dependencies. Functions use Web
`Request`/`Response` with a named `POST` export (Node runtime).

---

## 5. The files

| File | Job |
|---|---|
| `api/upload.js` + `api/_upload-core.js` | Accepts one image (JPG/PNG/WebP/HEIC, ≤4 MB, site origins only), stores it at `quote-photos/YYYY-MM-DD/name-<random>.ext`, returns the public URL |
| `api/quote.js` + `api/_ghl-quote-core.js` | The GHL logic: validate, upsert, attach photos, tag |
| `public/assets/js/site.js` | Resize + upload photos, validation, honeypot, submit, error state |
| `src/lib.mjs` → `quoteForm()` | Form markup (field `name`s, photo picker, honeypot, error box) |
| `tools/quote-api-test.mjs` | 28 checks against a stand-in GHL API (`npm run test:quote`) |
| `tools/upload-api-test.mjs` | Upload endpoint checks (`npm run test:upload`) |
| `tools/browser-check.mjs` | Playwright QA with `/api/quote` stubbed (275 checks) |

Each `_*-core.js` takes `fetch`/`put`/`env` as arguments, so it's testable without
the network. The route file just wires in the real ones.

### 5a. Form markup (essentials)

```html
<form class="js-quote" novalidate>
  <input name="full_name" data-required>
  <input name="phone" type="tel" data-required>
  <input name="email" type="email" data-required>
  <input name="property_address" data-required>
  <select name="property_size">…</select>
  <select name="service_needed" data-required>…<option>Other</option></select>
  <textarea name="job_notes"></textarea>

  <!-- photos: the file input has NO name; links are kept in JS -->
  <div class="field--photos">
    <input class="photo-input" type="file" accept="image/*" multiple>
    <ul class="photo-list"></ul>
  </div>

  <!-- honeypot: non-semantic name so browsers never autofill it -->
  <div class="hp-field" aria-hidden="true">
    <input name="gcl_hp_check" type="text" tabindex="-1" autocomplete="off">
  </div>

  <button type="submit"><span>Request my free quote</span></button>
  <p class="form-error" role="alert" hidden>
    Sorry, your request didn't go through. Please try again or call … <a href="tel:+61…">…</a>
  </p>
</form>
```

### 5b. Browser: submit

```js
form.addEventListener("submit", e => {
  e.preventDefault();
  if (hp.value.trim()) return location.href = "/thank-you"; // bot: send nothing
  if (!validate(form)) return;
  if (form.dataset.photoErrors) return flagPhotos();          // must remove failed photos
  if (form.dataset.uploading) {                               // wait, then auto-resubmit
    form.dataset.pendingSubmit = "1"; setBusy("Uploading photos…"); return;
  }
  sendQuote(form);
});

function sendQuote(form) {
  const data = { full_name, email, phone, property_address, property_size,
                 service_needed, job_notes, gcl_hp_check,
                 photos: JSON.parse(form.dataset.photos || "[]") };
  setBusy("Sending…");
  fetch("/api/quote", { method: "POST", keepalive: true,
    headers: { "content-type": "application/json" }, body: JSON.stringify(data) })
    .then(r => { if (!r.ok) throw r; location.href = "/thank-you"; })
    .catch(() => { setBusy(""); errorBox.hidden = false; });      // details stay in the form
}
```

Photo upload: each file is drawn to a canvas, capped at 1600 px and saved as JPEG
at quality 0.82 (HEIC that the browser can't decode is sent as-is). It's then
`POST`ed raw to `/api/upload?name=<file>` with its content type. The returned
`url`s go into `form.dataset.photos`.

### 5c. Server: `/api/quote` (core logic)

```js
const API = "https://services.leadconnectorhq.com";
const headers = { Authorization: `Bearer ${env.GHL_PIT_TOKEN}`, Version: "2021-07-28", Accept: "application/json" };

// guards: origin allowlist (403), env set (503), honeypot (fake 200),
// name + valid email + phone ≥ 8 digits (400), photos must be
// https://<store>.public.blob.vercel-storage.com/quote-photos/… (SSRF guard), max 5

// 0. field key → id (cached 10 min)
GET  `${API}/locations/${loc}/customFields?model=contact`
     → customFields[].{ id, fieldKey: "contact.property_address" }

// 1. contact
POST `${API}/contacts/upsert`
{ locationId, name, firstName, lastName, email,
  phone: "+61415190092",                    // AU numbers normalised to E.164
  source: "Website quote form",
  customFields: [{ id: "<fieldId>", field_value: "1 Main St, Ormiston" }, …] }
  → { new: true|false, contact: { id } }    // failure → 502, visitor sees error

// 2. photos (failure is logged, lead still saved)
POST `${API}/forms/upload-custom-files?contactId=${id}&locationId=${loc}`
     multipart/form-data, one part per file:
     key  = `${addPhotosFieldId}_${crypto.randomUUID()}`
     file = the Blob downloaded from our store, with its filename
     (don't set Content-Type yourself; fetch adds the multipart boundary)

// 3. tag (last)
POST `${API}/contacts/${id}/tags`   { tags: ["website-quote"] }
  → failure → 502 (the workflow wouldn't fire, so treat it as not delivered)
```

**The `upload-custom-files` key format is the non-obvious part.** Each file's
multipart field name must be `<customFieldId>_<anyUniqueId>`. GHL reads the field ID
from before the underscore and attaches the file to that File Upload field. That's
why the ID lookup (and the custom-fields scope) matters.

---

## 6. Security

- The PIT only lives in Vercel env vars (Sensitive). It's never sent to the browser
  or committed.
- Both endpoints only accept requests whose `Origin` is the live domain,
  `*.vercel.app` previews or localhost.
- `/api/quote` only downloads photo URLs from our own Blob store's
  `quote-photos/` folder, so it can't be used to make the server fetch arbitrary
  URLs (SSRF).
- `/api/upload` only accepts image types, ≤4 MB, and generates its own filename.
- The honeypot is checked in the browser **and** on the server; bots get a fake
  success.
- Inputs are trimmed and length-capped before they reach GHL.

---

## 7. Testing

- `npm run test:quote`: 28 checks against a stand-in GHL API. Covers:
  - call order with the tag last
  - E.164 phones and the custom-field map by ID
  - the multipart key format
  - honeypot, validation and origin checks
  - photo failure still saves the lead
  - upsert or tag failure returns 502
  - missing-scope fallback
- `npm run test:upload`: upload endpoint rules.
- `node tools/browser-check.mjs http://localhost:4173 shots`: real Chromium on
  desktop and mobile with `/api/quote` stubbed. Checks:
  - the payload carries all fields and photo links
  - submit waits for uploads
  - failed uploads block submit
  - an API failure shows the error and a retry works
  - no tracking script is on the page
- **Live test (always do one):** submit with a photo on the production domain, then
  in GHL check:
  - the contact has all fields filled
  - the photo is in Add Photos
  - the `website-quote` tag is on, and the workflow ran

---

## 8. Troubleshooting

Vercel → Project → Logs (Hobby keeps 1 hour). Every failure is logged as
`quote: <step> failed <status> <GHL message>`:

| Log line | Cause | Fix |
|---|---|---|
| `GHL_PIT_TOKEN or GHL_LOCATION_ID is not set` | env vars missing for this environment | Add them for Production and redeploy |
| `custom field lookup … 401 not authorized for this scope` | PIT lacks `locations/customFields.readonly` | Add **View Custom Fields** to the PIT (or set `GHL_PHOTOS_FIELD_ID`) |
| `contact upsert failed 401` | bad/expired token or wrong location | Regenerate the PIT, check `GHL_LOCATION_ID` |
| `contact upsert failed 422` | GHL rejected a value (often phone format or a dropdown value that isn't an option) | Match dropdown options exactly; phones are sent as +61… |
| `no custom field with key contact.x` | field missing or key differs | Create it with that exact key |
| `photo upload failed 4xx` | `add_photos` isn't a File Upload field, or `forms.write` is missing | Fix the field type or scope |
| `add tag failed` | `contacts.write` missing | Add the scope |
| No log and no contact | request never reached `/api/quote` | Check the browser console/network; test on the production domain, not a preview |

Success writes nothing to the logs, so silence after a test means it worked.
Confirm in GHL.

---

## 9. Reusing on another site

1. Copy `api/` (4 files), the photo and submit sections of `site.js`, and the form markup.
2. Edit `CUSTOM_FIELDS` in `_ghl-quote-core.js` and the field list in `sendQuote()`
   to match the new form's `name`s and GHL keys.
3. Edit `ORIGIN_OK` in `_upload-core.js` for the new domain.
4. Change `toE164()` if the business isn't in Australia.
5. Do the GHL setup (§3) and the Vercel setup (§4), then run a live test.
