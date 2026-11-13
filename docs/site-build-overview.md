# Local service website build: how the Golden Cane Lawns site was built

A reference for turning this build into a reusable skill. It describes what was
built, the order it was built in, the conventions that made it work, and the
things that went wrong and had to be fixed. Client-specific values are marked
**[param]** so they can become skill inputs.

---

## 1. What the skill produces

A fast, static, SEO-structured website for an Australian local service business,
rebuilt from an existing site and an SEO research report, deployed as plain
HTML/CSS/JS with no framework.

Final Golden Cane Lawns output: 23 pages (21 in the sitemap), 104 optimised
images, one code-rendered service-area animation, a quote form wired to
GoHighLevel, and a Playwright QA suite of about 260 checks across desktop and
mobile.

| Page type | Count | URL pattern | Notes |
|---|---|---|---|
| Homepage | 1 | `/` | Targets the primary keyword, e.g. "lawn care Wellington Point" |
| Service pages | 4 | existing URLs kept, e.g. `/mowing`, `/hedging` | One regional keyword each, no overlap |
| Suburb pages | 6 | `/lawn-mowing-<suburb>` | One per target suburb except the homepage suburb |
| Service-areas hub | 1 | `/service-areas` | Map animation, suburb cards, Google Maps embed |
| About, Contact | 2 | `/about`, `/contact` | Contact has no quote popup, by design |
| Blog index + posts | 1 + 6 | `/blog`, `/blog/<slug>` | Topics picked from keyword volume |
| Thank-you, 404 | 2 | `/thank-you` (noindex), `404` | Thank-you is the form redirect target |

---

## 2. Inputs the skill needs

| Input | Golden Cane example | Used for |
|---|---|---|
| Business name, owner, phone, email, ABN **[param]** | Golden Cane Lawns, Levi Engstrom | Header, footer, schema, trust strip |
| Locality, state, postcode (street address hidden) **[param]** | Wellington Point QLD 4160 | Schema `address` has no `streetAddress` |
| Services **[param]** | Mowing, hedging, weed spraying, whipper snipping (+ gardening) | Service pages, cards, form dropdown |
| Target suburbs + radius **[param]** | 7 suburbs, 10 km | Suburb pages, map, schema `areaServed` + GeoCircle |
| Positioning (no invented tagline) **[param]** | Redlands local, family-run, 10+ years, insured | Hero, About, trust strip |
| Logo file | Green panel with yellow mark | Sample exact brand colours from the file |
| Photo source | Google Drive folder | All site photography |
| SEO research report (HTML) | Step 1 report | Titles, H1s, metas, keyword map, schema, blog topics |
| GBP short link + embed iframe **[param]** | maps.app.goo.gl link + embed | Links, `sameAs`, Contact/hub map |
| Facebook, Instagram **[param]** | URLs | Footer, `sameAs` |
| GHL PIT token, location ID + field keys **[param]** | env vars, `full_name`, `email`, … | Form `name` attributes and `/api/quote` |
| Review widget embed (optional) **[param]** | reputationhub iframe | Homepage + About review section |

---

## 3. Build pipeline (in order)

### Step 1: Read the SEO report and extract the spec
Pull out, per page: meta title, H1, meta description, target keyword. Also the
keyword-to-page map (one primary keyword per page, no two pages sharing one),
the existing URLs to preserve, redirects (e.g. `/home` → `/`), schema
requirements, the FAQ set and blog topics. SEO structure wins on headings and
copy; design wins on styling.

### Step 2: Brand system from the logo
- Sample exact colours from the logo file with PIL (most common pixel colours).
  Golden Cane: green `#2E6709`, yellow `#FFD900`. The brief said "approx
  #2F6F0E / #FFD60A", so always measure rather than trust the estimate.
- Palette: the two logo colours, white, off-white, neutral greys, plus darker
  shades of the primary for depth. No new accent colours.
- Fonts: a display face that echoes the wordmark (Michroma for a wide geometric
  wordmark) plus a clean body sans (DM Sans). **Self-host them** from npm
  `@fontsource` packages: faster than Google Fonts, and npm is reachable from the
  sandbox.
- Logo use: the logo has a baked-in green background, so it only goes on green
  bands (header, footer). Mark-only in the header, full lockup in the footer.
  Never recolour, crop or stretch it. Generate favicon, apple-touch-icon and a
  1200×630 OG card from it.

### Step 3: Get the photos (Google Drive MCP)
- Use `search_files` with `parentId = '<folder id>'`, page through with
  `pageToken`, and dedupe by file size (Drive folders often hold duplicates).
- Use `download_file_content`. Large results are **saved to a tool-results JSON
  file** (`{content: base64, id, mimeType, title}`); decode with a small Python
  script. Never pull base64 into the conversation.
- Files over roughly 7 MB crash the Drive connector, so skip originals that size
  and use the smaller copies. HEIC needs `pillow_heif` (not installed).
- Build a contact sheet (PIL grid of thumbnails) and look at it to pick shots
  for the hero, service cards, gallery and before/after. Direct Drive download
  URLs are blocked by the sandbox proxy.

### Step 4: Optimise images (`tools/process_images.py`)
- Each photo gets a keyword slug name (`hedge-trimming-poolside-cleveland`), an
  EXIF transpose, an optional crop, and WebP output at 2–3 widths, quality 74.
- Before/after composites (two photos side by side with a white gutter) are
  split automatically by detecting white columns/rows. Then check which half is
  "before"; both halves are fitted to one frame for the slider.
- Write `manifest.json` (widths and heights) so the HTML helper emits correct
  `srcset`, `sizes`, `width` and `height`. Lazy-load everything below the fold;
  eager + `fetchpriority=high` + `<link rel=preload>` for the hero.
- Alt text: service + suburb. **Flag to the client that suburb tags are
  assigned, not verified**, unless they confirm where each job was.

### Step 5: Generated media (Higgsfield), only to fill real gaps
- **Hero video:** outpaint the owner's real mowing photo to 16:9, then Kling 3.0
  image-to-video (10 s, pro, sound off, 16:9) with a prompt that keeps the face,
  clothes and mower identical. This keeps the owner's real likeness.
- **Vetting without viewing:** the sandbox can't download Higgsfield outputs, so
  import the result URL with `media_import_url`, then run `video_analysis_create`
  and read the scene description (continuous shot? same clothes? cuts?).
- **Moving media between Drive and Higgsfield:** use `media_import_url` on
  `https://drive.usercontent.google.com/download?id=<id>&export=download`, which
  works because Higgsfield's servers fetch it.
- **Blocked hosts:** `upload.higgsfield.ai` and the Higgsfield CloudFront CDNs
  are blocked by the sandbox. Report this to the user (they can allow the hosts
  in the environment network settings). Don't route around it, and don't embed
  unvetted generated stills. The hero video ships with local sources first and
  the Higgsfield CDN URL as a fallback; the build switches to local files
  automatically when they exist.

### Step 6: Service-area map animation (code-rendered, not AI)
AI video can't render 11 correctly spelled, correctly placed labels, so the map
is built in code. `tools/service-area-map/map.html` is an SVG with:
- an equirectangular projection tuned to the area, a stylised coastline polygon,
  islands and a few roads
- suburb pins with label anchors, a tour route of quadratic curves, and a mower
  sprite that flips with direction
- trail, pin pop and highlight effects, and a dashed 10 km radius ring
- a `window.render(t)` function that is deterministic for any time `t`

`render.mjs` screenshots 270 frames (9 s at 30 fps) with Playwright, then ffmpeg
makes an H.264 MP4 (CRF 26), a VP9 WebM (CRF 48) and a WebP poster. The loop is
seamless because the trail fades and the mower returns home. It's embedded
muted, looping, `playsinline`, `preload=none`, and played only when in view
(IntersectionObserver), with a crawlable text list of suburbs beside it.
Re-rendering for a new suburb list takes about a minute.

### Step 7: Static site generator (`build.mjs` + `src/`)
- `src/lib.mjs`: `SITE` constants, `SUBURBS`, `SERVICES`, an inline SVG icon
  set, the `img()` responsive-image helper, schema builders, and shared
  components (header, footer, drawer, quote form, quote section, quote popup,
  reviews section, FAQ block, suburb list, map video, before/after, CTA band)
  plus `layout()`.
- `src/pages.mjs`: home, service pages (a `servicePage(cfg)` factory), About,
  Contact, blog index, post pages, thank-you, 404.
- `src/suburbs.mjs`: suburb page data (slug, copy, images, FAQs, nearby).
  `src/area-pages.mjs`: the suburb page template plus the hub page.
- `src/posts.mjs`: blog post data (path, title, H1, meta, image, HTML body,
  FAQs).
- `node build.mjs` writes `public/<page>.html` with clean URLs (`mowing.html`
  serves at `/mowing`, matching the old site), plus `sitemap.xml` and
  `robots.txt`, and cache-busts CSS/JS with a content hash.
- Hosting configs: `netlify.toml`, `public/_redirects`, `vercel.json` (clean
  URLs, 301s, immutable asset caching).

### Step 8: Front end (`public/assets`)
- **CSS** (`site.css`): design tokens on `:root`, fluid type with `clamp()`,
  sections (default / white / green / deep green), buttons with a shine sweep,
  sticky header, mobile drawer, a mobile action bar (Call / Free quote) that
  appears after scrolling, cards, sliders, gallery, FAQ accordions,
  `prefers-reduced-motion` support.
- **JS** (`site.js`, no dependencies):
  - header shadow, drawer, scroll reveal (`[data-reveal]`) and counters
  - before/after sliders driven by an invisible `range` input, so pointer,
    touch and keyboard all work, with a hint wiggle on first view
  - hero video streamed in after `load` (the poster image stays as LCP)
  - lazy in-view video playback, gallery lightbox (`<dialog>`)
  - the quote popup and form handling (see section 5)
  - thank-you page personalisation

### Step 9: Content
- Copy follows the SEO report exactly for titles, H1s and metas. The primary
  keyword sits in the first 100 words of each page and its H1.
- **Exact-match density:** target about 1% on the homepage. The first version
  had the keyword only in the title and H1, and a comparison report showed the
  old site beating it (8 uses vs 1). Fix: put the phrase in the hero intro, the
  section H2s, the About paragraph, an FAQ question and the quote heading.
  `tools/keyword-density.mjs <url> "<kw>"` measures hits / words in the way
  those reports do.
- FAQs: every page has an `FAQPage` block. Homepage FAQs are AEO-style direct
  answers.
- Suburb pages: 400–600 words of unique local detail (block types, grass, slope,
  council, local landmarks). **Fact-check any local claim** with a web search
  before publishing (e.g. Ormiston House sugar history, Queensland mowing hours
  7am–7pm Mon–Sat, 8am–7pm Sun and public holidays).
- Don't invent prices, testimonials or start years. Pricing posts explain the
  factors instead of quoting dollar figures. The review count/rating comes from
  the GBP.

---

## 4. SEO and schema rules (enforced by QA)

- One H1 per page; titles and metas from the report; canonical on every page.
- Existing URLs kept; `/home` → `/` 301; no foreign template tags (old meta
  keywords from other clients were removed).
- `LocalBusiness` + `HomeAndConstructionBusiness`: name, URL, phone, email,
  logo, images, founder, `taxID` (ABN), an address with **locality, state,
  postcode and country only**, `geo`, `areaServed` (every target suburb),
  `serviceArea` GeoCircle (radius in metres), `sameAs` (Facebook, Instagram, GBP
  short link + CID URL), `hasMap`, `hasOfferCatalog`.
- No `aggregateRating` in schema (self-serving review markup); the rating is
  shown visually and linked to the GBP instead.
- Per page: `Service` (+ suburb `City` for suburb pages), `FAQPage`,
  `BreadcrumbList`, `BlogPosting`, `WebSite` (home), `ItemList` (hub).
- Internal linking: suburb names link to their pages everywhere (lists, footer,
  nearby chips); service pages link to each other and to related posts.
- Sitemap excludes thank-you and 404; `robots.txt` disallows `/thank-you`.

---

## 5. Lead capture: GoHighLevel quote form

**Fields:** `name` attributes match the GHL contact keys exactly: `full_name`,
`email`, `phone`, `property_address`, `property_size` (select),
`service_needed` (select: the services plus "Other"), `job_notes`. The client
must create the custom fields in GHL with those exact keys.

**Sending leads (no tracking script):** the form posts JSON to a Vercel function
(`api/quote.js`) that calls the GHL API with a Private Integration Token
(`GHL_PIT_TOKEN`, `GHL_LOCATION_ID` env vars; scopes `contacts.write`,
`forms.write`, `locations/customFields.readonly`):
1. upsert the contact with every field (custom fields sent by ID, looked up from
   `/locations/{id}/customFields` and cached; AU phones normalised to +61);
2. attach photos (uploaded to Vercel Blob first) to the File Upload field via
   `/forms/upload-custom-files`;
3. add the `website-quote` tag **last**: it's the workflow trigger, so the
   workflow sees all fields and photos. The workflow removes the tag after the
   confirmation so repeat customers re-trigger.

Client: honeypot + validation, wait for photo uploads, POST, redirect to
`/thank-you` on success, or show an error with the phone number on failure.

**Honeypot fix:** the usual bug is browsers autofilling a honeypot named
`website` or `company`, which silently drops real leads. Use a non-semantic name
(`gcl_hp_check`), `autocomplete="off"`, `tabindex=-1`, off-screen positioning,
`aria-hidden`, and never `required`.

**Popup:** every `a[href$="#quote"]` opens the form in a `<dialog>` (bottom
sheet on mobile), preselecting the page's service. Contact has no popup, so its
quote links scroll to the in-page form. Pages with no quote section point to
`/contact#quote` so links still work without JS.

**Testing:** the GHL API is unreachable from the sandbox, so the function's
logic is tested with a stand-in `fetch` (call order, tag last, field mapping,
failures), and browser QA stubs `/api/quote`. **A live GHL test after deploy is
still needed.**

---

## 6. QA (`tools/browser-check.mjs`)

Run `npx serve public -l 4173` (use `setsid nohup … &` so it survives between
turns), then `node tools/browser-check.mjs http://localhost:4173 <shots-dir>`.

It checks every page at desktop 1440 and mobile 390:
- status code, exactly one H1, alt text on all images
- no horizontal overflow, no console errors
- before/after sliders have real height; full-page screenshots

Plus targeted checks:
- **Mobile first load** (390×844, 375×667, 360×740): the hero quote button is
  visible without scrolling; the header shows the business name and the Free
  Quote button, not the call icon.
- **Form:** a valid submission is tracked with all GHL fields and redirects to
  `/thank-you`; invalid submissions are blocked and not tracked; the honeypot
  drops bots; the dropdown options are right.
- **Popup:** opens, preselects the service, closes with Escape, submits; no
  popup on Contact.
- **Map video:** muted, looping, `playsinline`, plays in view, loops past its
  end; suburb text count matches.
- **Links and embeds:** all internal link targets resolve; GBP link and map
  embed present; review widget present.
- **Schema:** no street address; `areaServed` count; FAQPage; no leftover
  foreign template tags or dropped suburbs.

Always *look* at the screenshots too. Several real bugs were visual and passed
every automated check (see section 8).

---

## 7. Delivery

- Branch: `claude/<name>`. The repo was empty, so a `main` branch was created
  from an empty root commit and merged into the branch (force-push was blocked,
  and a merge avoids rewriting history), then a draft PR was opened.
- Commit messages list what changed and why, ending with the attribution
  trailer.
- The final summary to the user covers: what's built, what's missing, which
  images came from Drive vs were generated, blocked hosts and how to allow them,
  and things to confirm with the client (suburb tags on photos, GBP service
  areas, GHL custom fields, live form test).

---

## 8. Lessons learned (bugs and gotchas)

| Problem | Cause | Fix |
|---|---|---|
| Headline covered the owner in the hero | Subject sat left in the photo, under the text | Mirror the hero media container (`scaleX(-1)`) so the subject walks into the copy |
| Owner invisible on mobile hero | Full-bleed `cover` crop on a tall viewport | On mobile, stack the photo as a block above the text |
| Quote button below the fold on mobile | Tall photo and big type | Shorter photo (`clamp(200px,32vh,290px)`), tighter H1 and lead; QA at 3 phone sizes |
| Duplicate trust badges | Hero pills repeated the trust strip | Remove the hero pills |
| Icon tiles cut in half on service cards | Tile was absolutely positioned outside the image, which has `overflow:hidden` | Move the tile into the card body with a negative margin |
| Before/after slider collapsed to a sliver in articles | "First tile spans two rows" rule hit single-column grids | Scope the rule to `.ba-grid--feature`; QA asserts slider height |
| Popup submit hidden on mobile | Absolutely positioned trust strip covered the button | Popup as a flex column: form scrolls, strip sits below |
| Mobile layout 20 px too wide | Off-canvas drawer (`translateX(100%)`) widened the layout viewport | `.drawer{overflow:hidden}` and `html{overflow-x:clip}` |
| Nav wrapped and the button clipped at about 1100 px | Business name in header plus a Home link | `white-space:nowrap`, centre items, hamburger below 1240 px |
| Yellow text on a yellow button | Generic link colour rule overrode `.btn` | `a:not(.btn)` |
| Primary keyword weaker than the old site | Copy paraphrased the keyword | Exact-match placements to about 1% (step 9) |
| Client changed the suburb list after build | Scope change | Data-driven suburbs: edit `SUBURBS` + `src/suburbs.mjs`, re-render the map, grep for dropped names, rename suburb-tagged images |
| QA hung | Waited on lazy images that never enter the viewport | Wrap image waits in `Promise.race` with a timeout |
| Killed my own shell | `pkill -f <script>` matched the shell's own command line | Don't `pkill -f` on a string in the same command |

---

## 9. Client change requests: how they were handled

- **Suburb list change after build:** replied diplomatically (offer to keep
  outer pages as a lead source, or switch fully), then switched fully. Pages for
  dropped suburbs that were never live were deleted without redirects. Added a
  page for the new suburb, re-rendered the map with a 10 km ring, and updated
  FAQs, copy, schema and photo names.
- **Mobile tweaks:** removed duplicate badges, made the quote button visible on
  first load, put the business name in the header, swapped the call icon for a
  Free Quote button, added the quote popup.
- **Reviews:** reputationhub widget in a shared `reviewsSection()` (iframe
  `loading=lazy`, script `defer`, `min-height` container), on the homepage and
  About.

---

## 10. Skill checklist (condensed)

1. Extract the SEO spec (titles, H1s, metas, keyword map, URLs, schema, FAQs,
   blog topics).
2. Sample brand colours from the logo; self-host the fonts; generate favicon and
   OG assets.
3. Pull Drive photos via the MCP (decode the saved JSON, skip >7 MB files),
   review a contact sheet, choose shots.
4. Run `process_images.py`: WebP, `srcset`, keyword file names, before/after
   splits, manifest.
5. Higgsfield only for genuine gaps: owner photo → outpaint → image-to-video;
   vet with video analysis; report blocked hosts.
6. Render the service-area map from code (projection, tour, 10 km ring) to
   MP4/WebM/poster.
7. Fill the `src/` data (`SITE`, `SUBURBS`, `SERVICES`, suburb pages, posts);
   run `node build.mjs`.
8. Wire the GHL form (exact field keys, three-phase submit, safe honeypot,
   popup) and add embeds (GBP map, review widget).
9. Check homepage exact-match density is about 1%; fact-check local claims.
10. Run the browser QA, look at the screenshots, fix, re-run until all checks
    pass.
11. Commit, push, open a draft PR; report what's built, what's missing,
    generated vs real media, and the client confirmations needed.
