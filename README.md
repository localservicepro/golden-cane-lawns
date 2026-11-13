# Golden Cane Lawns — website rebuild

Static rebuild of goldencanelawns.com.au, structured to the Step 1 SEO research
report (titles, H1s, meta descriptions, keyword-to-page map, schema, blog plan).

- `public/` is the deployable site (plain HTML/CSS/JS, no framework).
- `src/` holds page content (`pages.mjs`, `posts.mjs`) and shared layout/schema (`lib.mjs`).
- `node build.mjs` regenerates the HTML, `sitemap.xml` and `robots.txt` into `public/`.

## Pages and URLs

Existing URLs are kept: `/`, `/mowing`, `/hedging`, `/gardening`, `/weed-control`,
`/contact`. `/home` 301-redirects to `/` (configured for Netlify in `netlify.toml`
and `public/_redirects`, and for Vercel in `vercel.json`). New: `/about`,
`/service-areas` (hub with the Google Maps embed), suburb pages for the client's
target suburbs (`/lawn-mowing-capalaba`, `-cleveland`, `-alexandra-hills`,
`-thornlands`, `-ormiston`, `-birkdale`; content in `src/suburbs.mjs`), `/blog` plus six posts,
`/thank-you` (noindex) and `404`. Service area (updated Oct 2026): Wellington Point,
Ormiston, Birkdale, Cleveland, Thornlands, Alexandra Hills and Capalaba, within 10 km.
Wellington Point stays the homepage's keyword, so it has no separate suburb page. Whipper snipping is a section
on `/mowing#whipper-snipping`, as the SEO plan recommends.

## Quote form → GoHighLevel

No GHL tracking script. Forms post JSON to `api/quote.js`, which uses the GHL API
with a Private Integration Token, in this order:

1. upserts the contact (matched by email/phone) with name, email, phone (as +61…),
   source "Website quote form" and the custom fields below;
2. attaches any photos to the **File Upload** field `{{contact.add_photos}}`
   (`POST /forms/upload-custom-files`);
3. adds the tag **`website-quote`** last, so a workflow triggered by "Contact Tag
   added: website-quote" already sees every field and photo. The workflow removes
   the tag after sending the confirmation, so repeat customers trigger it again.

| Field | `name` | GHL |
|---|---|---|
| Name | `full_name` | `{{contact.name}}` / first + last name |
| Email | `email` | `{{contact.email}}` |
| Phone | `phone` | `{{contact.phone}}` |
| Property address | `property_address` | `{{contact.property_address}}` |
| Property size | `property_size` | `{{contact.property_size}}` |
| Service needed | `service_needed` | `{{contact.service_needed}}` |
| Job notes | `job_notes` | `{{contact.job_notes}}` |
| Photos (up to 5) | n/a | `{{contact.add_photos}}` (File Upload) |

The custom fields must exist in the GHL location with those exact keys. Photos are
resized in the browser and uploaded to Vercel Blob first by `api/upload.js` (images
only, max 4 MB, site origins only).

Vercel environment variables:

| Variable | Value |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | set automatically by the connected Blob store |
| `GHL_PIT_TOKEN` | GHL Private Integration Token (mark **Sensitive**). Scopes: `contacts.write`, `forms.write`, `locations/customFields.readonly` |
| `GHL_LOCATION_ID` | GHL sub-account (location) ID |
| `GHL_QUOTE_TAG` | optional, defaults to `website-quote` |

Submission flow (`public/assets/js/site.js`): honeypot and validation run first; if
photos are still uploading the form waits, then sends. On success the page goes to
`/thank-you`; if the API fails the visitor sees an error with the phone number and
keeps their details. The honeypot (`gcl_hp_check`) has a non-semantic name,
`autocomplete="off"`, is off-screen and isn't required; bots that fill it are sent
to `/thank-you` with nothing sent (the API also drops them).

Tests: `npm run test:quote` and `npm run test:upload` (stand-in APIs, no network).
Failures show in Vercel's runtime logs as `quote: ...`.

## Media

- Photos: client's Google Drive "Photos" folder, optimised to WebP at 2–3 widths
  by `tools/process_images.py`.
- Service-area animation: `public/assets/video/service-area-map.{mp4,webm}` plus a
  poster, rendered from `tools/service-area-map/map.html` (`npm run render:map`).
- Hero video: generated in Higgsfield from the owner's own mowing photo. To serve
  it locally, save it as `public/assets/video/hero-lawn-mowing-wellington-point.mp4`
  (and optionally `.webm`) and run `node build.mjs`. Until then the page streams
  the Higgsfield-hosted file after load, with the real photo as the poster/LCP image.

## QA

`node tools/browser-check.mjs http://localhost:4173 <screenshot-dir>` (with
`npx serve public -l 4173` running) checks every page on desktop and mobile:
status codes, one H1 per page, alt text, no horizontal overflow, no console errors,
the form flow (valid/invalid/honeypot/API error) against a stand-in `/api/quote`, the
service-area video looping, and the LocalBusiness schema.
