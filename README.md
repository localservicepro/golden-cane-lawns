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
`/service-areas` (hub with the Google Maps embed), eight suburb pages from the SEO
report's priority list (`/lawn-mowing-capalaba`, `-cleveland`, `-victoria-point`,
`-redland-bay`, `-wynnum`, `-thornlands`, `-birkdale`, `-manly`; content in
`src/suburbs.mjs`), `/blog` plus six posts, `/thank-you` (noindex) and `404`.
Wellington Point stays the homepage's keyword; Ormiston and Thorneside had no
measured volume and are covered by the hub and homepage. Whipper snipping is a section
on `/mowing#whipper-snipping`, as the SEO plan recommends.

## Quote form → GoHighLevel

Every page loads the GHL external tracking script (`tk_d4d7db7b0f0649dbbb4d49fa5cd5cc8e`).
Form fields are named to match the CRM keys:

| Field | `name` | GHL |
|---|---|---|
| Name | `full_name` | `{{contact.full_name}}` |
| Email | `email` | `{{contact.email}}` |
| Phone | `phone` | `{{contact.phone}}` |
| Property address | `property_address` | `{{contact.property_address}}` |
| Property size | `property_size` | `{{contact.property_size}}` |
| Service needed | `service_needed` | `{{contact.service_needed}}` |
| Job notes | `job_notes` | `{{contact.job_notes}}` |

`property_address`, `property_size`, `service_needed` and `job_notes` must exist as
custom fields in the GHL location with those exact keys.

Submission flow (`public/assets/js/site.js`): validation and the honeypot run first,
then the tracker records the submission, then the page redirects to `/thank-you`
after 1.5 s. The honeypot (`gcl_hp_check`) has a non-semantic name, `autocomplete="off"`,
is off-screen, isn't required, and is disabled before tracking so it never
reaches the CRM. Bots that fill it are redirected without being tracked.

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
the form flow (valid/invalid/honeypot) against a stand-in tracker, the
service-area video looping, and the LocalBusiness schema.
