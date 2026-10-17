// Service-area hub and suburb landing pages (lawn mowing <suburb>).
import {
  SITE, SUBURBS, icon, stars, img, crumbs, faqBlock, suburbList, mapVideo, beforeAfter,
  quoteSection, ctaBand, faqSchema, breadcrumbSchema, gbpMap,
} from "./lib.mjs";
import { SUBURB_PAGES, suburbPath } from "./suburbs.mjs";

const nearbyLinks = names => `<ul class="nearby">${names.map(n => {
  const href = n === "Wellington Point" ? "/" : suburbPath(n);
  return href ? `<li><a href="${href}">${icon("pin")}${n === "Wellington Point" ? "Wellington Point" : `Lawn mowing ${n}`}</a></li>` : "";
}).join("")}</ul>`;

function suburbPage(s) {
  const path = `/lawn-mowing-${s.slug}`;
  const trail = [["Home", "/"], ["Service Areas", "/service-areas"], [`Lawn Mowing ${s.name}`, path]];
  const title = `Lawn Mowing ${s.name} | Golden Cane Lawns`;
  return {
    path, file: path.slice(1) + ".html", title, description: s.description, ogImage: s.heroImg, formService: "Lawn Mowing",
    schema: [
      { "@type": "Service", name: `Lawn Mowing ${s.name}`, serviceType: "Lawn Mowing", description: s.description,
        url: `${SITE.url}${path}`, provider: { "@id": `${SITE.url}/#business` },
        areaServed: { "@type": "City", name: `${s.name} QLD`, containedInPlace: { "@type": "AdministrativeArea", name: s.council } } },
      faqSchema(s.faqs), breadcrumbSchema(trail),
    ],
    body: `
<section class="page-hero">
  <div class="wrap page-hero__grid">
    <div>
      ${crumbs(trail)}
      <span class="eyebrow" style="color:var(--yellow)">${s.name} · ${s.council.replace(" Council", "")}</span>
      <h1>Lawn Mowing ${s.name}</h1>
      <p class="lead">${s.lead}</p>
      <div class="hero__ctas" style="margin-bottom:0">
        <a class="btn" href="#quote">Get a free quote ${icon("arrow")}</a>
        <a class="btn btn--ghost" href="tel:${SITE.phoneIntl}">${icon("phone")} ${SITE.phone}</a>
      </div>
    </div>
    <div class="page-hero__media">${img(s.heroImg, s.heroAlt, { sizes: "(max-width: 860px) 100vw, 45vw", eager: true, pick: 960 })}</div>
  </div>
</section>
<section class="section">
  <div class="wrap content-grid">
    <article class="prose">
      <p class="lead">${s.intro}</p>
      <h2>${s.localTitle}</h2>
      ${s.local}
      <figure data-reveal>${img(s.extraImg[0], s.extraImg[1], { sizes: "(max-width: 980px) 100vw, 60vw" })}<figcaption>${s.extraImg[1]}</figcaption></figure>
      <h2>What's included in every ${s.name} mow</h2>
      <ul class="ticks">
        <li>${icon("check")}<span><strong>Mowing</strong> at the right height for your grass and the season</span></li>
        <li>${icon("check")}<span><strong>Edging</strong> along paths, driveways, kerbs and garden beds</span></li>
        <li>${icon("check")}<span><strong>Whipper snipping</strong> around fences, trees and tight spots</span></li>
        <li>${icon("check")}<span><strong>Blow-down and green waste removal</strong>, so nothing is left behind</span></li>
      </ul>
      ${s.ba ? `<div class="ba-grid" style="grid-template-columns:1fr">${beforeAfter(s.ba[0], s.ba[1])}</div>` : ""}
      <h2>More services in ${s.name}</h2>
      <p>Lawn mowing is our most-booked service in ${s.name}, but we can look after the rest of the yard on the same visit:</p>
      <ul>
        <li><a href="/hedging">Hedge trimming</a> for privacy screens, box hedges and shrubs</li>
        <li><a href="/weed-control">Weed spraying</a> for bindii, clover and weeds in beds and paths</li>
        <li><a href="/mowing#whipper-snipping">Whipper snipping</a> for verges, embankments and overgrown edges</li>
        <li><a href="/gardening">Garden maintenance</a> including tidy-ups, pruning and mulching</li>
      </ul>
      <p>See our full <a href="/mowing">lawn mowing Redlands</a> service, or go back to the <a href="/">Golden Cane Lawns homepage</a>.</p>
      <h2>Lawn mowing ${s.name} FAQs</h2>
      ${faqBlock(s.faqs)}
      <h2>Nearby suburbs we mow</h2>
      ${nearbyLinks(s.nearby)}
    </article>
    <aside class="aside">
      <div class="aside-card aside-card--green">
        <h3>Free ${s.name} quote</h3>
        <p>Family-run, Redlands local, fully insured. Call or send us the details.</p>
        <a class="btn btn--block" href="#quote">Get a free quote</a>
        <a class="btn btn--ghost btn--block" style="margin-top:10px" href="tel:${SITE.phoneIntl}">${icon("phone")} ${SITE.phone}</a>
      </div>
      <div class="aside-card">
        <h3>${stars()}</h3>
        <p style="margin:0"><strong>${SITE.rating}★ from ${SITE.reviews} Google reviews.</strong> <a href="${SITE.gbp}" target="_blank" rel="noopener">Read them on Google</a>.</p>
      </div>
      <div class="aside-card">
        <h3>Service areas</h3>
        <ul class="aside-links">${SUBURB_PAGES.map(o => `<li><a href="/lawn-mowing-${o.slug}"${o === s ? ' aria-current="page"' : ""}>${o.name}${icon("chevron")}</a></li>`).join("")}<li><a href="/service-areas">All service areas${icon("chevron")}</a></li></ul>
      </div>
    </aside>
  </div>
</section>
<section class="section section--white section--tight"><div class="wrap">${ctaBand(`Book your next ${s.name} mow`, "Regular rounds or a one-off cut. Free quotes from a local, fully insured team.")}</div></section>
${quoteSection({ title: `Get a free lawn mowing quote in ${s.name}`, service: "Lawn Mowing", intro: `Family-run and Redlands local. We mow lawns in ${s.name} and across our local Redlands service area.` })}
`,
  };
}

const hubTrail = [["Home", "/"], ["Service Areas", "/service-areas"]];
const hub = {
  path: "/service-areas", file: "service-areas.html",
  title: "Service Areas | Lawn Care Wellington Point & Redlands | Golden Cane Lawns",
  description: "Golden Cane Lawns mows lawns and maintains gardens within 10 km of Wellington Point: Ormiston, Birkdale, Cleveland, Thornlands, Alexandra Hills and Capalaba.",
  schema: [breadcrumbSchema(hubTrail), {
    "@type": "ItemList", name: "Golden Cane Lawns service areas",
    itemListElement: SUBURB_PAGES.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: `Lawn Mowing ${s.name}`, url: `${SITE.url}/lawn-mowing-${s.slug}` })),
  }],
  body: `
<section class="page-hero">
  <div class="wrap" style="padding-block:clamp(40px,7vw,80px)">
    ${crumbs(hubTrail)}
    <span class="eyebrow" style="color:var(--yellow)">Service areas</span>
    <h1>Lawn Care Service Areas Within 10 km of Wellington Point</h1>
    <p class="lead">From our home base in Wellington Point we mow lawns, trim hedges, spray weeds and look after gardens in seven local Redlands suburbs, all within about 10 km.</p>
  </div>
</section>
<section class="section section--deep">
  <div class="wrap areas">
    ${mapVideo()}
    <div data-reveal="right">
      <span class="eyebrow">Where we work</span>
      <h2>Seven suburbs, one local team</h2>
      <p class="lead">Tap a suburb for local lawn mowing details. Don't see yours? Ask anyway and we'll let you know if we can fit you in.</p>
      ${suburbList()}
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div><span class="eyebrow" data-reveal>Lawn mowing by suburb</span><h2 data-reveal>Find your suburb</h2></div>
      <p class="lead" data-reveal>Every suburb gets the same family-run service: mowing, edging, whipper snipping, blow-down and green waste removal.</p>
    </div>
    <div class="area-cards">
      ${SUBURB_PAGES.map((s, i) => `
      <a class="area-card" href="/lawn-mowing-${s.slug}" data-reveal style="--d:${(i % 4) * 0.06}s">
        <div class="area-card__img">${img(s.heroImg, s.heroAlt, { sizes: "(max-width: 520px) 100vw, (max-width: 1060px) 50vw, 25vw" })}</div>
        <div class="area-card__body"><h3>Lawn Mowing ${s.name}</h3><p>${s.lead.split(". ")[0].replace(/\.$/, "")}.</p><span class="link-arrow">View suburb ${icon("arrow")}</span></div>
      </a>`).join("")}
    </div>
    <div class="svc-extra" style="margin-top:28px" data-reveal>
      <p><strong>Wellington Point</strong> is our home base and part of every regular round. See our <a href="/">Wellington Point lawn care</a> homepage.</p>
      <a class="btn btn--sm" href="#quote">Get a quote ${icon("arrow")}</a>
    </div>
  </div>
</section>
<section class="section section--white">
  <div class="wrap split">
    <div data-reveal="left">
      <span class="eyebrow">Find us on Google</span>
      <h2>Golden Cane Lawns on Google Maps</h2>
      <p class="lead">We're a mobile, service-area business based in ${SITE.locality} ${SITE.region} ${SITE.postcode}, rated ${SITE.rating}★ from ${SITE.reviews} Google reviews.</p>
      <p><a class="btn btn--green" href="${SITE.gbp}" target="_blank" rel="noopener">${icon("google")} Open in Google Maps</a></p>
    </div>
    ${gbpMap()}
  </div>
</section>
${quoteSection()}
`,
};

export const AREA_PAGES = [hub, ...SUBURB_PAGES.map(suburbPage)];
