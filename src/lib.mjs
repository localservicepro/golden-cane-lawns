// Shared data, icons, layout and schema helpers for the static build.
import { readFileSync } from "node:fs";
import { suburbPath } from "./suburbs.mjs";

export const SITE = {
  name: "Golden Cane Lawns",
  url: "https://www.goldencanelawns.com.au",
  phone: "0415 190 092",
  phoneIntl: "+61415190092",
  email: "admin@goldencanelawns.com.au",
  owner: "Levi Engstrom",
  abn: "39 581 947 265",
  locality: "Wellington Point",
  region: "QLD",
  postcode: "4160",
  geo: { lat: -27.4840, lon: 153.2400 },
  facebook: "https://www.facebook.com/share/1DH79eo2d4/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/goldencanelawns",
  gbp: "https://maps.app.goo.gl/EN3i29DbcVP2TDBf9",
  gbpCid: "https://www.google.com/maps?cid=8359013510260214639",
  gbpEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3538.6451050331375!2d153.2333207!3d-27.511410599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x24ce2e4c69e9f177%3A0x74012e7fe7c04b6f!2sGolden%20Cane%20lawns!5e0!3m2!1sen!2sph!4v1792164036558!5m2!1sen!2sph",
  rating: "4.9",
  reviews: 54,
  trackingId: "tk_d4d7db7b0f0649dbbb4d49fa5cd5cc8e",
};

// Service area in tour order, home base first.
export const SUBURBS = [
  "Wellington Point", "Ormiston", "Cleveland", "Thornlands", "Victoria Point",
  "Redland Bay", "Capalaba", "Birkdale", "Thorneside", "Wynnum", "Manly",
];
export const suburbSentence = () =>
  SUBURBS.slice(0, -1).join(", ") + " and " + SUBURBS[SUBURBS.length - 1];

export const SERVICES = [
  { key: "mowing", name: "Lawn Mowing", href: "/mowing", icon: "mower", img: "striped-lawn-mowing-wellington-point",
    alt: "Freshly striped lawn after lawn mowing in Wellington Point",
    blurb: "Regular or one-off mows with crisp edges, blow-down and green waste taken away." },
  { key: "hedging", name: "Hedge Trimming", href: "/hedging", icon: "scissors", img: "hedge-trimming-poolside-cleveland",
    alt: "Hedge trimming beside a pool in Cleveland",
    blurb: "Clean lines and controlled growth for privacy screens, box hedges and shrubs." },
  { key: "weeds", name: "Weed Spraying", href: "/weed-control", icon: "spray", img: "weed-spraying-redlands-garden-bed",
    alt: "Weed growing through garden gravel before weed spraying in the Redlands",
    blurb: "Targeted spraying for bindii, clover and broadleaf weeds in lawns, beds and paths." },
  { key: "whipper", name: "Whipper Snipping", href: "/mowing#whipper-snipping", icon: "trimmer", img: "whipper-snipping-redlands-edges",
    alt: "Whipper snipping along a fence line in the Redlands",
    blurb: "Fence lines, garden edges, verges and tight spots the mower can't reach." },
];

const ICONS = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="none"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
  spray: '<path d="M12 21v-6.5"/><path d="M12 15c-3.3 0-5.5-2.2-5.5-5.5 3.3 0 5.5 2.2 5.5 5.5Z"/><path d="M12 12.5c0-3.3 2.2-5.5 5.5-5.5 0 3.3-2.2 5.5-5.5 5.5Z"/><path d="M6.5 21h11"/><path d="M20.5 15.2a1.6 1.6 0 1 1-3.2 0c0-1.1 1.6-3.2 1.6-3.2s1.6 2.1 1.6 3.2Z"/><path d="M4.5 5.5h.01M7 3.5h.01M3 9h.01"/>',
  mower: '<path d="M21 3l-5.5 8.5"/><path d="M3 16.5V14a2.5 2.5 0 0 1 2.5-2.5h10L18 15v1.5"/><path d="M2.5 16.5h16"/><circle cx="6" cy="19" r="2"/><circle cx="15" cy="19" r="2"/>',
  trimmer: '<path d="M20.5 3.5 9 15"/><path d="M13.5 7.5l3 3"/><path d="M5.6 12.6a4.5 4.5 0 0 0 5.8 5.8"/><circle cx="8.5" cy="15.5" r="1.4"/><path d="M2.5 21.5l2.6-2.6M5.5 22.5l1-2.4M1.5 18.5l2.4-1"/>',
  sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  bin: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
  google: '<path d="M20.9 12.2c0-.6-.1-1.2-.2-1.8H12v3.5h5a4.3 4.3 0 0 1-1.9 2.8v2.3h3c1.8-1.6 2.8-4 2.8-6.8z"/><path d="M12 21c2.5 0 4.6-.8 6.1-2.2l-3-2.3c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H3.8v2.4A9 9 0 0 0 12 21z"/><path d="M6.9 13.6a5.4 5.4 0 0 1 0-3.4V7.8H3.8a9 9 0 0 0 0 8.2z"/><path d="M12 6.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6A9 9 0 0 0 3.8 7.8l3.1 2.4C7.6 8.1 9.6 6.6 12 6.6z"/>',
  chevrons: '<path d="m9 18-6-6 6-6"/><path d="m15 6 6 6-6 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
};
export const icon = (name, extra = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${ICONS[name]}</svg>`;
export const stars = () => `<span class="stars" aria-hidden="true">${icon("star").repeat(5)}</span>`;

// Responsive <img> from the optimised manifest.
const manifest = JSON.parse(readFileSync(new URL("../public/assets/img/manifest.json", import.meta.url)));
export function img(slug, alt, { sizes = "(max-width: 760px) 100vw, 50vw", eager = false, cls = "", pick } = {}) {
  const m = manifest[slug];
  if (!m) throw new Error(`Unknown image ${slug}`);
  const files = m.files;
  const def = pick ? files.find(f => f.w >= pick) || files[files.length - 1] : files[Math.min(1, files.length - 1)];
  const srcset = files.map(f => `/assets/img/${f.src} ${f.w}w`).join(", ");
  return `<img src="/assets/img/${def.src}" srcset="${srcset}" sizes="${sizes}" width="${def.w}" height="${def.h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ""} ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>`;
}
export const imgUrl = (slug, w = 1200) => {
  const f = manifest[slug].files; const pick = f.find(x => x.w >= w) || f[f.length - 1];
  return `${SITE.url}/assets/img/${pick.src}`;
};
export const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- Schema ---------- */
export function businessSchema() {
  return {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    url: `${SITE.url}/`,
    telephone: SITE.phoneIntl,
    email: SITE.email,
    logo: `${SITE.url}/assets/brand/golden-cane-lawns-logo-1200.png`,
    image: [imgUrl("lawn-mowing-wellington-point-owner"), imgUrl("hedge-trimming-poolside-cleveland")],
    description: "Redlands local, family-run independent lawn and garden maintenance company with over a decade of hands-on experience. Lawn mowing, hedge trimming, weed spraying and whipper snipping. ABN registered and fully insured.",
    founder: { "@type": "Person", name: SITE.owner },
    taxID: SITE.abn.replace(/\s/g, ""),
    address: { "@type": "PostalAddress", addressLocality: SITE.locality, addressRegion: SITE.region, postalCode: SITE.postcode, addressCountry: "AU" },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lon },
    areaServed: SUBURBS.map(s => ({ "@type": "City", name: `${s} QLD` })),
    serviceArea: { "@type": "GeoCircle", geoMidpoint: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lon }, geoRadius: "10000" },
    sameAs: [SITE.facebook, SITE.instagram, SITE.gbp, SITE.gbpCid],
    hasMap: SITE.gbpCid,
    hasOfferCatalog: {
      "@type": "OfferCatalog", name: "Lawn and garden maintenance services",
      itemListElement: ["Lawn Mowing", "Hedge Trimming", "Weed Spraying", "Whipper Snipping", "Garden Maintenance"].map(n => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
    },
  };
}
export const faqSchema = faqs => ({
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })),
});
export const serviceSchema = (name, path, desc) => ({
  "@type": "Service",
  name, serviceType: name, description: desc, url: `${SITE.url}${path}`,
  provider: { "@id": `${SITE.url}/#business` },
  areaServed: SUBURBS.map(s => ({ "@type": "City", name: `${s} QLD` })),
});
export const breadcrumbSchema = trail => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE.url}${path}` })),
});

/* ---------- Components ---------- */
export function crumbs(trail) {
  return `<ol class="crumbs">${trail.map(([n, p], i) => i === trail.length - 1 ? `<li aria-current="page">${n}</li>` : `<li><a href="${p}">${n}</a></li>`).join("")}</ol>`;
}

export function faqBlock(faqs) {
  return `<div class="faq">${faqs.map(([q, a], i) => `
    <details data-reveal style="--d:${(i % 4) * 0.06}s"${i === 0 ? " open" : ""}>
      <summary>${q}<span class="pm">${icon("plus")}</span></summary>
      <div class="faq__a"><p>${a}</p></div>
    </details>`).join("")}
  </div>`;
}

export function suburbList(cls = "") {
  return `<ul class="suburbs ${cls}">${SUBURBS.map((s, i) => {
    const href = i === 0 ? "/" : suburbPath(s);
    const inner = `${icon(i === 0 ? "home" : "pin")}${s}${i === 0 ? " <small>&nbsp;· home base</small>" : ""}`;
    return `<li${i === 0 ? ' class="is-home"' : ""}>${href ? `<a href="${href}">${inner}</a>` : inner}</li>`;
  }).join("")}</ul>`;
}

export function gbpMap(title = "Golden Cane Lawns on Google Maps") {
  return `<div class="gbp-map" data-reveal>
    <iframe src="${SITE.gbpEmbed}" title="${esc(title)}" width="600" height="450" style="border:0" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
  </div>`;
}

export function mapVideo() {
  return `<div class="map-frame" data-reveal="zoom">
    <video muted loop playsinline preload="none" data-lazy poster="/assets/video/service-area-map-poster.webp" width="900" height="900" aria-label="Animated map: a Golden Cane Lawns mower travels from Wellington Point to Ormiston, Cleveland, Thornlands, Victoria Point, Redland Bay, Capalaba, Birkdale, Thorneside, Manly and Wynnum">
      <source data-src="/assets/video/service-area-map.mp4" type="video/mp4">
      <source data-src="/assets/video/service-area-map.webm" type="video/webm">
    </video>
  </div>`;
}

export function beforeAfter(slug, caption, { first = false, d = 0 } = {}) {
  const sizes = first ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw";
  return `<figure class="ba" data-reveal style="--d:${d}s">
    ${img(slug + "-before", `Before: ${caption}`, { sizes })}
    <div class="ba__after">${img(slug + "-after", `After: ${caption}`, { sizes })}</div>
    <span class="ba__line"></span><span class="ba__handle">${icon("chevrons")}</span>
    <span class="ba__tag ba__tag--b">Before</span><span class="ba__tag ba__tag--a">After</span>
    <input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after: ${esc(caption)}">
    <figcaption>${caption}</figcaption>
  </figure>`;
}

export function quoteForm({ heading = "Get a free quote", id = "quote-form", service = "", reveal = true } = {}) {
  const opt = (v) => `<option value="${v}"${v === service ? " selected" : ""}>${v}</option>`;
  return `<div class="form-card"${reveal ? ' data-reveal="right"' : ""}>
    <h3${reveal ? "" : ' id="quote-modal-title"'}>${heading}</h3>
    <p>Tell us a little about the job and we'll get back to you with a free, no-obligation quote.</p>
    <form class="js-quote" id="${id}" name="quote" method="post" action="/thank-you" novalidate>
      <div class="form-grid">
        <div class="field">
          <label for="${id}-name">Name <span class="req">*</span></label>
          <input id="${id}-name" name="full_name" type="text" autocomplete="name" data-required>
          <span class="err">Please enter your name.</span>
        </div>
        <div class="field">
          <label for="${id}-phone">Phone <span class="req">*</span></label>
          <input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" data-required>
          <span class="err">Please enter a valid phone number.</span>
        </div>
        <div class="field field--full">
          <label for="${id}-email">Email <span class="req">*</span></label>
          <input id="${id}-email" name="email" type="email" inputmode="email" autocomplete="email" data-required>
          <span class="err">Please enter a valid email address.</span>
        </div>
        <div class="field field--full">
          <label for="${id}-address">Property address <span class="req">*</span></label>
          <input id="${id}-address" name="property_address" type="text" autocomplete="street-address" placeholder="Street and suburb" data-required>
          <span class="err">Please enter the property address.</span>
        </div>
        <div class="field">
          <label for="${id}-size">Property size</label>
          <select id="${id}-size" name="property_size">
            <option value="">Select…</option>
            <option>Small (up to 400 m²)</option>
            <option>Medium (400–800 m²)</option>
            <option>Large (800–1,500 m²)</option>
            <option>Very large / acreage (1,500 m²+)</option>
            <option>Not sure</option>
          </select>
        </div>
        <div class="field">
          <label for="${id}-service">Service needed <span class="req">*</span></label>
          <select id="${id}-service" name="service_needed" data-required>
            <option value="">Select a service…</option>
            ${["Lawn Mowing", "Hedge Trimming", "Weed Spraying", "Whipper Snipping", "Other"].map(opt).join("")}
          </select>
          <span class="err">Please choose a service.</span>
        </div>
        <div class="field field--full">
          <label for="${id}-notes">Job notes</label>
          <textarea id="${id}-notes" name="job_notes" rows="4" placeholder="How often, access, pets, anything we should know"></textarea>
        </div>
        <div class="hp-field" aria-hidden="true">
          <label for="${id}-hp">Leave this field empty</label>
          <input id="${id}-hp" name="gcl_hp_check" type="text" tabindex="-1" autocomplete="off" value="">
        </div>
      </div>
      <div class="form-foot">
        <button class="btn btn--block" type="submit"><span>Request my free quote</span>${icon("arrow")}</button>
        <small>No spam. Your details are only used to contact you about your quote.</small>
      </div>
    </form>
  </div>`;
}

export function quoteSection({ title = "Get a free lawn care quote", service = "", intro } = {}) {
  return `<section class="section section--deep" id="quote" aria-labelledby="quote-title">
    <div class="wrap quote">
      <div class="quote__info" data-reveal="left">
        <span class="eyebrow">Free quotes</span>
        <h2 id="quote-title">${title}</h2>
        <p class="lead">${intro || `Family-run and Redlands local. We service ${suburbSentence()}.`}</p>
        <ul class="ticks">
          <li>${icon("check")}<span>Free, no-obligation quotes</span></li>
          <li>${icon("check")}<span>Regular or one-off visits</span></li>
          <li>${icon("check")}<span>ABN registered and fully insured</span></li>
          <li>${icon("check")}<span>10+ years hands-on experience</span></li>
        </ul>
        <ul class="contact-lines">
          <li><a href="tel:${SITE.phoneIntl}">${icon("phone")}${SITE.phone}</a></li>
          <li><a href="mailto:${SITE.email}">${icon("mail")}${SITE.email}</a></li>
          <li><span>${icon("pin")}${SITE.locality} ${SITE.region} ${SITE.postcode}</span></li>
        </ul>
      </div>
      ${quoteForm({ service })}
    </div>
  </section>`;
}

export function ctaBand(title = "Ready for a lawn you're proud of?", text = "Book a regular service or a one-off tidy-up. Free quotes across the Redlands.") {
  return `<div class="cta-band" data-reveal>
    <div><h2>${title}</h2><p>${text}</p></div>
    <div class="cta-band__btns">
      <a class="btn" href="#quote">Get a free quote ${icon("arrow")}</a>
      <a class="btn btn--ghost" href="tel:${SITE.phoneIntl}">${icon("phone")} ${SITE.phone}</a>
    </div>
  </div>`;
}

// Popup quote form, opened by any "#quote" link (every page except Contact).
function quoteModal(service = "") {
  return `<dialog class="quote-modal" id="quote-modal" aria-labelledby="quote-modal-title">
  <button class="quote-modal__close" type="button" data-modal-close aria-label="Close quote form">${icon("x")}</button>
  ${quoteForm({ id: "modal-quote-form", service, reveal: false })}
  <ul class="quote-modal__trust">
    <li>${icon("shield")}Fully insured</li><li>${icon("users")}Family-run</li><li>${icon("star")}${SITE.rating}★ Google</li>
  </ul>
</dialog>`;
}

/* ---------- Layout ---------- */
const NAV = [
  { label: "Lawn Mowing", href: "/mowing" },
  { label: "Hedge Trimming", href: "/hedging" },
  { label: "Weed Spraying", href: "/weed-control" },
  { label: "Garden Maintenance", href: "/gardening" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

function header(path) {
  const cur = h => (path === h || (h !== "/" && path.startsWith(h + "/")) ? ' aria-current="page"' : "");
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Golden Cane Lawns home">
      <img src="/assets/brand/golden-cane-lawns-mark-256.webp" width="52" height="52" alt="Golden Cane Lawns logo">
      <span class="brand-name">Golden Cane<br>Lawns</span>
    </a>
    <nav class="nav" aria-label="Main">
      <a href="/"${path === "/" ? ' aria-current="page"' : ""}>Home</a>
      <div class="has-sub">
        <a href="/mowing"${cur("/mowing")}>Services</a>
        <div class="sub">
          ${SERVICES.map(s => `<a href="${s.href}">${s.name}</a>`).join("")}
          <a href="/gardening">Garden Maintenance</a>
        </div>
      </div>
      ${NAV.slice(3).map(n => `<a href="${n.href}"${cur(n.href)}>${n.label === "Garden Maintenance" ? "Gardening" : n.label}</a>`).join("")}
      <a href="/service-areas"${cur("/service-areas")}>Service Areas</a>
    </nav>
    <div class="header-cta">
      <a class="header-phone" href="tel:${SITE.phoneIntl}" aria-label="Call ${SITE.phone}">${icon("phone")}<span>${SITE.phone}</span></a>
      <a class="btn" href="#quote">Free Quote</a>
    </div>
    <button class="menu-toggle" type="button" aria-label="Open menu" aria-controls="drawer" aria-expanded="false">${icon("menu")}</button>
  </div>
</header>
<div class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="drawer__top">
      <img src="/assets/brand/golden-cane-lawns-mark-256.webp" width="48" height="48" alt="Golden Cane Lawns logo" loading="lazy">
      <button class="drawer__close" type="button" data-close aria-label="Close menu">${icon("x")}</button>
    </div>
    <nav aria-label="Mobile">
      <a href="/"${cur("/")}>Home ${icon("chevron")}</a>
      ${NAV.map(n => `<a href="${n.href}"${cur(n.href)}>${n.label} ${icon("chevron")}</a>`).join("")}
      <a href="/mowing#whipper-snipping">Whipper Snipping ${icon("chevron")}</a>
      <a href="/service-areas"${cur("/service-areas")}>Service Areas ${icon("chevron")}</a>
    </nav>
    <div class="drawer__cta">
      <a class="btn" href="#quote" data-close>Get a free quote</a>
      <a class="btn btn--ghost" href="tel:${SITE.phoneIntl}">${icon("phone")} Call ${SITE.phone}</a>
    </div>
  </div>
</div>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="footer-logo" href="/" aria-label="Golden Cane Lawns home">
          <img src="/assets/brand/golden-cane-lawns-logo-800.webp" width="800" height="480" alt="Golden Cane Lawns logo" loading="lazy">
        </a>
        <p>Redlands local, family-run, independent lawn and garden maintenance with over a decade of hands-on experience.</p>
        <div class="socials">
          <a href="${SITE.facebook}" target="_blank" rel="noopener" aria-label="Golden Cane Lawns on Facebook">${icon("facebook")}</a>
          <a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Golden Cane Lawns on Instagram">${icon("instagram")}</a>
          <a href="${SITE.gbp}" target="_blank" rel="noopener" aria-label="Golden Cane Lawns on Google">${icon("google")}</a>
        </div>
      </div>
      <div>
        <h3>Services</h3>
        <ul>
          <li><a href="/mowing">Lawn Mowing Redlands</a></li>
          <li><a href="/hedging">Hedge Trimming Redlands</a></li>
          <li><a href="/weed-control">Weed Spraying Redlands</a></li>
          <li><a href="/mowing#whipper-snipping">Whipper Snipping</a></li>
          <li><a href="/gardening">Garden Maintenance Cleveland</a></li>
        </ul>
      </div>
      <div>
        <h3>Company</h3>
        <ul>
          <li><a href="/about">About us</a></li>
          <li><a href="/#before-after">Before &amp; after</a></li>
          <li><a href="/service-areas">Service areas</a></li>
          <li><a href="/blog">Lawn care blog</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3>Contact</h3>
        <ul class="footer-contact">
          <li>${icon("phone")}<a href="tel:${SITE.phoneIntl}">${SITE.phone}</a></li>
          <li>${icon("mail")}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li>${icon("pin")}<span>${SITE.locality} ${SITE.region} ${SITE.postcode}</span></li>
        </ul>
      </div>
    </div>
    <div class="footer-trust">
      <span>${icon("file")}ABN ${SITE.abn}</span>
      <span>${icon("shield")}Fully insured</span>
      <span>${icon("users")}Family-run &amp; independent</span>
      <span>${icon("award")}10+ years experience</span>
      <span>${icon("star")}${SITE.rating}★ from ${SITE.reviews} Google reviews</span>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Golden Cane Lawns · ABN ${SITE.abn}</span>
      <span>Serving ${SUBURBS.map((s, i) => { const h = i === 0 ? "/" : suburbPath(s); return h ? `<a href="${h}">${s}</a>` : s; }).join(", ")}.</span>
    </div>
  </div>
</footer>
<div class="action-bar" aria-label="Quick actions">
  <a class="btn btn--ghost" href="tel:${SITE.phoneIntl}">${icon("phone")} Call</a>
  <a class="btn" href="#quote">Free quote</a>
</div>`;
}

export function layout(page) {
  const canonical = `${SITE.url}${page.path === "/" ? "/" : page.path}`;
  const graph = [businessSchema(), ...(page.schema || [])];
  if (page.path === "/") graph.push({ "@type": "WebSite", "@id": `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.name, publisher: { "@id": `${SITE.url}/#business` } });
  const ogImg = page.ogImage ? imgUrl(page.ogImage) : `${SITE.url}/assets/brand/og-golden-cane-lawns.jpg`;
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="author" content="Golden Cane Lawns">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#2E6709">
<meta name="geo.region" content="AU-QLD">
<meta name="geo.placename" content="Wellington Point">
<meta property="og:type" content="${page.ogType || "website"}">
<meta property="og:site_name" content="Golden Cane Lawns">
<meta property="og:locale" content="en_AU">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${ogImg}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/michroma-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/dm-sans-var.woff2" as="font" type="font/woff2" crossorigin>
${page.preload || ""}
<link rel="stylesheet" href="/assets/css/site.css?v=${page.v}">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
</head>
<body class="${page.bodyClass || ""}">
${header(page.path)}
<main id="main">
${page.body}
</main>
${footer()}
${page.noModal ? "" : quoteModal(page.formService)}
<dialog class="lightbox" id="lightbox" aria-label="Photo viewer"><button type="button" aria-label="Close">${icon("x")}</button><img alt=""><p></p></dialog>
<script src="/assets/js/site.js?v=${page.v}" defer></script>
<script
  src="https://link.msgsndr.com/js/external-tracking.js"
  data-tracking-id="${SITE.trackingId}">
</script>
</body>
</html>
`;
}
