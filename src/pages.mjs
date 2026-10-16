// Page content. Titles, H1s, meta descriptions and target keywords follow the
// Step 1 SEO research report (keyword-to-page map, Phase 1 and Phase 4 tables).
import {
  SITE, SUBURBS, SERVICES, suburbSentence, icon, stars, img, esc, crumbs, faqBlock, suburbList,
  mapVideo, beforeAfter, quoteSection, ctaBand, faqSchema, serviceSchema, breadcrumbSchema, gbpMap,
} from "./lib.mjs";
import { AREA_PAGES } from "./area-pages.mjs";

// The hero video lives locally once exported; the Higgsfield render is used as a
// fallback source until then (sources are tried in order).
// Drop hero-lawn-mowing-wellington-point.{webm,mp4} into public/assets/video and
// rebuild: local files are picked up automatically and the remote fallback dropped.
import { existsSync } from "node:fs";
const LOCAL_HERO = ["webm", "mp4"]
  .map(ext => ({ src: `/assets/video/hero-lawn-mowing-wellington-point.${ext}`, type: `video/${ext}` }))
  .filter(s => existsSync(new URL(`../public${s.src}`, import.meta.url)));
const HERO_VIDEO = LOCAL_HERO.length ? LOCAL_HERO : [
  { src: "https://d8j0ntlcm91z4.cloudfront.net/user_3EWpoiN6nlg900Jz4gzZzRlxgtK/hf_20261016_142312_d42b87b0-8bc4-45d0-886d-8173c9f454a4.mp4", type: "video/mp4" },
];

const areaCopy = `${suburbSentence()}`;

/* ------------------------------------------------------------------ HOME */
const homeFaqs = [
  ["How much does lawn mowing cost in Wellington Point and the Redlands?",
   "Every lawn is different, so we price on the size of the block, the condition of the grass, access and how often you want us there. Regular mows on a two or three-weekly schedule cost less per visit than one-off cuts of overgrown lawns because there is less to cut and less green waste to remove. Quotes are free and there's no obligation, so the easiest way to get an exact price is to send us your address through the quote form or call 0415 190 092."],
  ["Do you mow lawns in Cleveland, Capalaba and Victoria Point?",
   `Yes. We're based in Wellington Point and mow lawns right across the Redlands and bayside, including ${areaCopy}. If you're just outside those suburbs, ask anyway and we'll let you know if we can fit you in.`],
  ["How often should I trim hedges in the Redlands climate?",
   "In the warm, wet Redlands growing season (roughly September to April) most hedges need a trim every four to eight weeks to stay dense and sharp. Through the cooler months growth slows and every eight to twelve weeks is usually enough. Fast growers like murraya and lilly pilly sit at the shorter end of that range."],
  ["Is weed spraying safe for pets and kids on Redlands lawns?",
   "We use registered herbicides applied strictly to the label directions, and we spot-spray the weeds themselves rather than blanket-spraying where we can. We'll let you know before we start, and we recommend keeping pets and children off treated areas until the spray has completely dried and for any longer period the product label specifies."],
  ["Do you do one-off mows for rentals in Redland Bay and Thornlands?",
   "Yes. We regularly do one-off mows and tidy-ups for tenants, landlords and property managers in Redland Bay, Thornlands and the rest of the Redlands, including end-of-lease, pre-inspection and pre-sale jobs. Mowing, edging, whipper snipping, hedge trimming and green waste removal can all be done in the one visit."],
  ["Do you service the bayside suburbs of Wynnum and Manly?",
   "Yes. Wynnum and Manly are part of our regular service area, along with Thorneside and Birkdale on the way through. We offer the same regular and one-off mowing, hedging, weed spraying and whipper snipping there as we do in Wellington Point."],
];

const home = {
  path: "/",
  file: "index.html",
  title: "Lawn Care Wellington Point & Redlands | Golden Cane Lawns",
  description: "Professional lawn care Wellington Point locals trust. Family-run, fully insured mowing, hedge trimming & weed spraying across the Redlands. Get a free quote.",
  preload: `<link rel="preload" as="image" href="/assets/img/lawn-mowing-wellington-point-owner-960.webp" imagesrcset="/assets/img/lawn-mowing-wellington-point-owner-640.webp 640w, /assets/img/lawn-mowing-wellington-point-owner-960.webp 960w, /assets/img/lawn-mowing-wellington-point-owner-1290.webp 1290w" imagesizes="100vw" fetchpriority="high">`,
  schema: [faqSchema(homeFaqs)],
  body: `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media">
    ${img("lawn-mowing-wellington-point-owner", "Golden Cane Lawns lawn care Wellington Point — owner Levi mowing a front lawn", { sizes: "100vw", eager: true, pick: 960 })}
    <video muted loop playsinline preload="none" aria-hidden="true" data-src='${JSON.stringify(HERO_VIDEO)}' poster="/assets/img/lawn-mowing-wellington-point-owner-960.webp"></video>
  </div>
  <div class="wrap hero__inner">
    <div class="hero__content">
      <span class="eyebrow" style="color:var(--yellow)">Redlands local · Family-run</span>
      <h1 id="hero-title">Lawn Care Wellington Point <span class="hl">&amp; Redlands</span> Garden Maintenance</h1>
      <p class="hero__lead">Independent, family-run lawn and garden care from a Redlands local with over a decade of hands-on experience. Mowing, hedge trimming, weed spraying and whipper snipping, done properly. ABN registered and fully insured.</p>
      <div class="hero__ctas">
        <a class="btn" href="#quote">Get a free quote ${icon("arrow")}</a>
        <a class="btn btn--ghost" href="tel:${SITE.phoneIntl}">${icon("phone")} ${SITE.phone}</a>
      </div>
      <ul class="hero__badges">
        <li>${icon("award")}10+ years experience</li>
        <li>${icon("shield")}Fully insured</li>
        <li>${icon("users")}Family-run</li>
      </ul>
    </div>
  </div>
  <a class="rating-card" href="${SITE.gbp}" target="_blank" rel="noopener">
    <span class="rating-card__score">${SITE.rating}</span>
    <span>${stars()}<small>${SITE.reviews} Google reviews</small></span>
  </a>
</section>

<div class="trust" aria-label="Why Golden Cane Lawns">
  <div class="wrap trust__grid">
    <div class="trust__item" data-reveal style="--d:0s"><span class="trust__icon">${icon("star")}</span><span>${SITE.rating}★ on Google<small>${SITE.reviews} local reviews</small></span></div>
    <div class="trust__item" data-reveal style="--d:.06s"><span class="trust__icon">${icon("home")}</span><span>Redlands local<small>Based in Wellington Point</small></span></div>
    <div class="trust__item" data-reveal style="--d:.12s"><span class="trust__icon">${icon("users")}</span><span>Family-run<small>Independent, not a franchise</small></span></div>
    <div class="trust__item" data-reveal style="--d:.18s"><span class="trust__icon">${icon("award")}</span><span>10+ years<small>Hands-on experience</small></span></div>
    <div class="trust__item" data-reveal style="--d:.24s"><span class="trust__icon">${icon("shield")}</span><span>Fully insured<small>ABN ${SITE.abn}</small></span></div>
  </div>
</div>

<div class="marquee" aria-hidden="true"><div class="marquee__track">${[...SUBURBS, ...SUBURBS].map(s => `<span>${s}</span>`).join("")}</div></div>

<section class="section" id="services" aria-labelledby="services-title">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <span class="eyebrow" data-reveal>Our services</span>
        <h2 id="services-title" data-reveal>Lawn mowing, hedging &amp; weed spraying across the Redlands</h2>
      </div>
      <p class="lead" data-reveal>One local team for the whole yard. Book a regular service and keep it looking sharp all year, or call us in for a one-off tidy-up.</p>
    </div>
    <div class="services">
      ${SERVICES.map((s, i) => `
      <a class="svc" href="${s.href}" data-reveal style="--d:${i * 0.08}s">
        <div class="svc__img">${img(s.img, s.alt, { sizes: "(max-width: 560px) 100vw, (max-width: 1060px) 50vw, 25vw" })}<span class="svc__icon">${icon(s.icon)}</span></div>
        <div class="svc__body"><h3>${s.name}</h3><p>${s.blurb}</p><span class="link-arrow">Learn more ${icon("arrow")}</span></div>
      </a>`).join("")}
    </div>
    <div class="svc-extra" data-reveal>
      <p><strong>Need more than a mow?</strong> We also do pruning, garden bed tidy-ups and ongoing <a href="/gardening">garden maintenance in Cleveland and across the Redlands</a>.</p>
      <a class="btn btn--sm" href="#quote">Get a quote ${icon("arrow")}</a>
    </div>
  </div>
</section>

<section class="section section--green" id="about" aria-labelledby="about-title">
  <div class="wrap">
    <div class="split">
      <div class="split__media" data-reveal="left">
        <div class="frame">${img("hedge-trimming-wellington-point-team", "Golden Cane Lawns hedge trimming in Wellington Point", { sizes: "(max-width: 860px) 100vw, 50vw" })}</div>
        <div class="split__badge"><strong>10+</strong><span>years on the tools</span></div>
      </div>
      <div data-reveal="right">
        <span class="eyebrow">Why locals choose us</span>
        <h2 id="about-title">Family-run, Redlands local and on the tools for over a decade</h2>
        <p class="lead">Golden Cane Lawns is an independent, family-run lawn and garden maintenance business based in Wellington Point. Owner Levi Engstrom has more than ten years of hands-on experience, and he still turns up to do the work himself.</p>
        <ul class="ticks">
          <li>${icon("check")}<span><strong>Local and reliable.</strong> We live in the Redlands, so we're never far away and we turn up when we say we will.</span></li>
          <li>${icon("check")}<span><strong>Professional finish.</strong> Sharp edges, tidy hedges and every clipping blown down or taken away.</span></li>
          <li>${icon("check")}<span><strong>Properly covered.</strong> ABN registered (${SITE.abn}) and fully insured for your peace of mind.</span></li>
        </ul>
        <a class="btn" href="/about">More about us ${icon("arrow")}</a>
      </div>
    </div>
    <div class="stats">
      <div class="stat" data-reveal><strong data-count="10" data-suffix="+">10+</strong><span>Years of hands-on experience</span></div>
      <div class="stat" data-reveal style="--d:.08s"><strong data-count="4.9" data-suffix="★">4.9★</strong><span>Average Google rating</span></div>
      <div class="stat" data-reveal style="--d:.16s"><strong data-count="54">54</strong><span>Google reviews from locals</span></div>
      <div class="stat" data-reveal style="--d:.24s"><strong data-count="11">11</strong><span>Redlands &amp; bayside suburbs</span></div>
    </div>
  </div>
</section>

<section class="section section--white" id="before-after" aria-labelledby="ba-title">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <span class="eyebrow" data-reveal>Our work</span>
        <h2 id="ba-title" data-reveal>Real Redlands jobs, before &amp; after</h2>
      </div>
      <p class="lead" data-reveal>Drag the handle to compare. Every photo here is one of our own jobs, not stock imagery.</p>
    </div>
    <div class="ba-grid ba-grid--feature">
      ${beforeAfter("hedge-trimming-before-after-wellington-point", "Hedge trimming, Wellington Point", { first: true })}
      ${beforeAfter("hedge-trimming-before-after-ormiston", "Front hedge reshape, Ormiston", { d: .08 })}
      ${beforeAfter("garden-maintenance-before-after-thornlands", "Shrub shaping, Thornlands", { d: .16 })}
      ${beforeAfter("lawn-edging-before-after-capalaba", "Verge edging and whipper snipping, Capalaba", { d: 0 })}
      ${beforeAfter("shrub-pruning-before-after-cleveland", "Shrub pruning, Cleveland", { d: .08 })}
      <a class="ba-cta" href="#quote" data-reveal style="--d:.16s">
        <span class="ba-cta__icon">${icon("leaf")}</span>
        <strong>Want results like these?</strong>
        <span>Free quotes for hedging, mowing and tidy-ups across the Redlands.</span>
        <span class="link-arrow">Get a free quote ${icon("arrow")}</span>
      </a>
    </div>
    <div class="gallery" style="margin-top:clamp(32px,5vw,56px)">
      ${[
        ["lawn-mowing-cleveland-canal-front", "Canal-front lawn mowing in Cleveland"],
        ["front-lawn-mowing-ormiston", "Front lawn mowing and garden edges in Ormiston"],
        ["box-hedge-trimming-waterfront-redlands", "Box hedge trimming on a waterfront property in the Redlands"],
        ["waterfront-lawn-care-redlands", "Waterfront lawn care in the Redlands"],
        ["lawn-mowing-poolside-ormiston", "Poolside lawn mowing in Ormiston"],
        ["hedge-trimming-white-wall-cleveland", "Hedge trimming along a rendered wall in Cleveland"],
      ].map(([s, a], i) => `<figure data-reveal style="--d:${(i % 3) * .06}s">${img(s, a, { sizes: "(max-width: 600px) 100vw, 33vw" })}<figcaption>${a}</figcaption></figure>`).join("")}
    </div>
  </div>
</section>

<section class="section section--deep" id="service-areas" aria-labelledby="areas-title">
  <div class="wrap areas">
    ${mapVideo()}
    <div data-reveal="right">
      <span class="eyebrow">Service areas</span>
      <h2 id="areas-title">Lawn care across Wellington Point and the Redlands bayside</h2>
      <p class="lead">We're based in Wellington Point and look after lawns and gardens in eleven Redlands and bayside suburbs within roughly 10 km of home.</p>
      ${suburbList()}
      <div class="hero__ctas" style="margin:0">
        <a class="btn" href="/service-areas">All service areas ${icon("arrow")}</a>
        <a class="btn btn--ghost" href="#quote">Check we cover you</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight" aria-label="Google reviews">
  <div class="wrap">
    <div class="review-band" data-reveal>
      <div class="review-band__score">${SITE.rating}</div>
      <div>${stars()}<p><strong>Rated ${SITE.rating} out of 5 from ${SITE.reviews} Google reviews.</strong> Read what Redlands locals say about Golden Cane Lawns on our Google Business Profile.</p></div>
      <a class="btn btn--green" href="${SITE.gbp}" target="_blank" rel="noopener">${icon("google")} Read our reviews</a>
    </div>
  </div>
</section>

<section class="section section--white" id="faq" aria-labelledby="faq-title">
  <div class="wrap">
    <div class="center" style="margin-bottom:clamp(32px,5vw,48px)">
      <span class="eyebrow" data-reveal>FAQ</span>
      <h2 id="faq-title" data-reveal>Lawn care questions from Redlands locals</h2>
    </div>
    ${faqBlock(homeFaqs)}
  </div>
</section>

${quoteSection()}
`,
};

/* --------------------------------------------------------- SERVICE PAGES */
function servicePage(cfg) {
  const trail = [["Home", "/"], [cfg.crumb, cfg.path]];
  const related = [
    ["Lawn Mowing Redlands", "/mowing"], ["Hedge Trimming Redlands", "/hedging"],
    ["Weed Spraying Redlands", "/weed-control"], ["Whipper Snipping", "/mowing#whipper-snipping"],
    ["Garden Maintenance Cleveland", "/gardening"], ["About Golden Cane Lawns", "/about"],
  ];
  return {
    path: cfg.path,
    file: cfg.path.slice(1) + ".html",
    title: cfg.title,
    description: cfg.description,
    ogImage: cfg.heroImg,
    schema: [serviceSchema(cfg.serviceName, cfg.path, cfg.description), faqSchema(cfg.faqs), breadcrumbSchema(trail)],
    body: `
<section class="page-hero">
  <div class="wrap page-hero__grid">
    <div>
      ${crumbs(trail)}
      <span class="eyebrow" style="color:var(--yellow)">${cfg.eyebrow}</span>
      <h1>${cfg.h1}</h1>
      <p class="lead">${cfg.lead}</p>
      <div class="hero__ctas" style="margin-bottom:0">
        <a class="btn" href="#quote">Get a free quote ${icon("arrow")}</a>
        <a class="btn btn--ghost" href="tel:${SITE.phoneIntl}">${icon("phone")} ${SITE.phone}</a>
      </div>
    </div>
    <div class="page-hero__media">${img(cfg.heroImg, cfg.heroAlt, { sizes: "(max-width: 860px) 100vw, 45vw", eager: true, pick: 960 })}</div>
  </div>
</section>
<div class="marquee" aria-hidden="true"><div class="marquee__track">${[...SUBURBS, ...SUBURBS].map(s => `<span>${cfg.short} ${s}</span>`).join("")}</div></div>
<section class="section">
  <div class="wrap content-grid">
    <article class="prose">
      ${cfg.content}
      <h2>Service areas</h2>
      <p>${cfg.areaIntro}</p>
      ${suburbList("")}
      <h2>${cfg.faqTitle}</h2>
      ${faqBlock(cfg.faqs)}
    </article>
    <aside class="aside">
      <div class="aside-card aside-card--green">
        <h3>Free quote</h3>
        <p>Family-run, Redlands local, fully insured. Call or send us the details.</p>
        <a class="btn btn--block" href="#quote">Get a free quote</a>
        <a class="btn btn--ghost btn--block" style="margin-top:10px" href="tel:${SITE.phoneIntl}">${icon("phone")} ${SITE.phone}</a>
      </div>
      <div class="aside-card">
        <h3>Our services</h3>
        <ul class="aside-links">${related.map(([n, h]) => `<li><a href="${h}"${h === cfg.path ? ' aria-current="page"' : ""}>${n}${icon("chevron")}</a></li>`).join("")}</ul>
      </div>
      <div class="aside-card">
        <h3>${stars()}</h3>
        <p style="margin:0"><strong>${SITE.rating}★ from ${SITE.reviews} Google reviews.</strong> <a href="${SITE.gbp}" target="_blank" rel="noopener">Read them on Google</a>.</p>
      </div>
    </aside>
  </div>
</section>
${cfg.extra || ""}
<section class="section section--white section--tight"><div class="wrap">${ctaBand(cfg.ctaTitle, cfg.ctaText)}</div></section>
${quoteSection({ title: cfg.quoteTitle, service: cfg.formService })}
`,
  };
}

const feature = (ic, h, p) => `<div class="feature" data-reveal><span class="feature__icon">${icon(ic)}</span><h3>${h}</h3><p>${p}</p></div>`;
const figure = (slug, alt, cap) => `<figure data-reveal>${img(slug, alt, { sizes: "(max-width: 980px) 100vw, 60vw" })}<figcaption>${cap || alt}</figcaption></figure>`;

const mowing = servicePage({
  path: "/mowing", crumb: "Lawn Mowing", short: "Lawn mowing", serviceName: "Lawn Mowing",
  title: "Lawn Mowing Redlands | Golden Cane Lawns",
  description: "Reliable lawn mowing Redlands wide, from Wellington Point to Capalaba. Regular or one-off mows with edging, blow-down and green waste removal. Get a free quote.",
  eyebrow: "Lawn mowing & whipper snipping",
  h1: "Lawn Mowing Redlands — Wellington Point to Capalaba",
  lead: "Regular and one-off lawn mowing Redlands homeowners, landlords and property managers rely on. Every mow includes edging, whipper snipping, blow-down and green waste removal.",
  heroImg: "lawn-mowing-thornlands-front-yard", heroAlt: "Lawn mowing Redlands — freshly mowed front yard in Thornlands",
  formService: "Lawn Mowing",
  areaIntro: `Our lawn mowing rounds start in Wellington Point and cover the whole Redlands and bayside: ${areaCopy}.`,
  faqTitle: "Lawn mowing FAQs",
  ctaTitle: "Book your next mow", ctaText: "Regular rounds or a one-off cut. Free quotes from a local, fully insured team.",
  quoteTitle: "Get a free lawn mowing quote",
  content: `
      <p class="lead">Golden Cane Lawns provides professional <strong>lawn mowing Redlands</strong> wide, from our home base in Wellington Point out to Capalaba, Victoria Point and Redland Bay. We're a family-run, independent local business with more than ten years of hands-on experience, ABN registered and fully insured.</p>
      <p>Whether you want your lawn looked after every fortnight through summer or need a one-off cut before an inspection, you get the same careful finish: an even cut at the right height for your grass, crisp edges along paths and driveways, and every clipping blown off hard surfaces or taken away.</p>
      <h2>What's included in every mow</h2>
      <div class="feature-grid">
        ${feature("mower", "Mowing at the right height", "Cut height matched to your grass type and the season, so the lawn stays thick and copes with the Queensland heat.")}
        ${feature("ruler", "Edging", "Clean, straight edges along paths, driveways, garden beds and kerbs.")}
        ${feature("trimmer", "Whipper snipping", "Fence lines, posts, trees and tight corners trimmed to match the rest of the lawn.")}
        ${feature("wind", "Blow-down", "Paths, driveways and patios blown clean before we leave.")}
        ${feature("bin", "Green waste removal", "Clippings taken away so there's nothing left for you to deal with.")}
        ${feature("calendar", "Regular or one-off", "Weekly, fortnightly or three-weekly rounds, or a single visit when you need it.")}
      </div>
      ${figure("striped-lawn-mowing-wellington-point", "Striped lawn mowing Wellington Point", "A freshly striped lawn in Wellington Point")}
      <h2>Regular lawn mowing rounds</h2>
      <p>Most Redlands lawns grow hard from September to April. A regular round keeps the grass at a consistent height, which means a healthier, denser lawn, fewer weeds and a lower cost per visit than letting it get away and paying for a big catch-up cut. Through summer most customers choose a fortnightly mow; through winter, every three to four weeks is usually plenty.</p>
      <h2>One-off mows for rentals, sales and catch-ups</h2>
      <p>We also do one-off lawn mowing for tenants, landlords and property managers in Redland Bay, Thornlands, Cleveland and the rest of the Redlands: end-of-lease cleans, routine inspections, pre-sale tidy-ups and overgrown lawns that need bringing back under control. Add hedge trimming, weed spraying or a garden tidy-up to the same visit to get the whole property presentation-ready.</p>
      <h2 id="whipper-snipping">Whipper snipping</h2>
      <p>Whipper snipping (line trimming) is what makes a mowed lawn look finished. We trim along fence lines, around trees, posts, letterboxes and garden edges, along verges and down the side of the house where a mower can't get in. It's included with every mow, and we also do whipper snipping on its own for verges, nature strips, embankments and overgrown side paths across the Redlands.</p>
      ${figure("curved-lawn-edging-birkdale", "Whipper snipping and lawn edging along a curved garden edge in Birkdale", "Whipper snipped edges along a curved lawn in Birkdale")}
      <div class="callout"><p><strong>Overgrown block or a verge the council won't touch?</strong> Send us a photo through the quote form notes or call ${SITE.phone} and we'll tell you what it'll take.</p></div>
      <h2>Lawn mowing photos from around the Redlands</h2>
      <div class="gallery">
        ${[["lawn-mowing-cleveland-canal-front", "Lawn mowing Cleveland — canal-front lawn"], ["front-yard-mowing-victoria-point", "Front yard lawn mowing Victoria Point"], ["verge-mowing-capalaba", "Verge mowing and edging in Capalaba"], ["large-lawn-mowing-redland-bay", "Large lawn mowing Redland Bay"]]
          .map(([s, a]) => `<figure data-reveal>${img(s, a, { sizes: "(max-width: 600px) 100vw, 30vw" })}<figcaption>${a}</figcaption></figure>`).join("")}
      </div>
      <p>Also see our <a href="/hedging">hedge trimming</a>, <a href="/weed-control">weed spraying</a> and <a href="/gardening">garden maintenance</a> services, or read <a href="/blog/how-often-should-you-mow-your-lawn">how often you should mow your lawn</a> and <a href="/blog/what-time-can-you-mow-your-lawn-queensland">what time you can mow in Queensland</a>.</p>`,
  faqs: [
    ["How often should my lawn be mowed in the Redlands?", "From September to April most Redlands lawns need mowing every one to two weeks; through the cooler months every three to four weeks is usually enough. We'll recommend a schedule based on your grass type and how quickly it grows."],
    ["Do you take the clippings away?", "Yes. Green waste removal is included, and we blow down your paths, driveway and patio before we leave."],
    ["Is whipper snipping and edging included?", "Yes. Every mow includes edging along hard surfaces and whipper snipping around fences, trees and garden edges."],
    ["Do you mow lawns in Capalaba and Victoria Point?", `Yes. We mow lawns right across the Redlands including Capalaba and Victoria Point, as well as ${SUBURBS.filter(s => s !== "Capalaba" && s !== "Victoria Point").join(", ")}.`],
    ["Can you do a one-off mow for an overgrown lawn or rental?", "Yes. We do one-off mows for overgrown lawns, end-of-lease cleans, inspections and pre-sale tidy-ups. Overgrown lawns take longer, so they're quoted separately from a regular mow."],
  ],
});

const hedging = servicePage({
  path: "/hedging", crumb: "Hedge Trimming", short: "Hedge trimming", serviceName: "Hedge Trimming",
  title: "Hedge Trimming Redlands | Golden Cane Lawns",
  description: "Hedge trimming Redlands homeowners trust. Clean lines, controlled growth and full clean-up across Wellington Point, Cleveland and Thornlands. Book a free quote.",
  eyebrow: "Hedges, screens & shrubs",
  h1: "Hedge Trimming Redlands &amp; Wellington Point",
  lead: "Sharp lines, healthy growth and a full clean-up. Hedge trimming Redlands homeowners and body corporates book again and again.",
  heroImg: "hedge-trimming-driveway-wellington-point", heroAlt: "Hedge trimming Redlands — neatly trimmed driveway hedge in Wellington Point",
  formService: "Hedge Trimming",
  areaIntro: `We trim hedges from Wellington Point across the Redlands and bayside: ${areaCopy}.`,
  faqTitle: "Hedge trimming FAQs",
  ctaTitle: "Get your hedges back in shape", ctaText: "One-off reshapes or regular trims, with every clipping cleaned up.",
  quoteTitle: "Get a free hedge trimming quote",
  content: `
      <p class="lead">Golden Cane Lawns offers professional <strong>hedge trimming Redlands</strong> wide, based in Wellington Point and working across Cleveland, Thornlands, Ormiston and the bayside. We're a family-run, independent business with over a decade of hands-on experience, and we're ABN registered and fully insured.</p>
      <p>A well-kept hedge does a lot of work: privacy from the street and the neighbours, shelter from wind, and a clean frame for the rest of your garden. Left alone through a Redlands summer it can get leggy, patchy and out of control quickly. We trim to keep hedges dense, even and the size you want them.</p>
      <h2>Hedges and shrubs we trim</h2>
      <div class="feature-grid">
        ${feature("leaf", "Privacy screens", "Lilly pilly, murraya, viburnum and other tall screening hedges kept dense and level.")}
        ${feature("scissors", "Formal &amp; box hedges", "Square, flat-topped and box hedges cut to crisp, straight lines.")}
        ${feature("sprout", "Shrubs &amp; topiary", "Rounded shrubs, garden-bed plantings and feature shrubs shaped and tidied.")}
        ${feature("bin", "Full clean-up", "Every clipping raked, blown and taken away. Nothing left on paths or lawns.")}
      </div>
      ${figure("hedge-trimming-poolside-cleveland", "Hedge trimming Cleveland — poolside privacy hedge", "A poolside privacy hedge trimmed level in Cleveland")}
      <h2>How often should hedges be trimmed?</h2>
      <p>In the Redlands' warm, wet growing season most hedges need a trim every four to eight weeks to stay tight. Fast growers such as murraya and lilly pilly sit at the shorter end; slower species can go longer. Through the cooler months every eight to twelve weeks is usually enough. Regular light trims keep a hedge thicker and healthier than an occasional hard cut. Read our <a href="/blog/when-to-trim-hedges-south-east-queensland">season-by-season hedge trimming guide for South-East Queensland</a> for more detail.</p>
      <h2>One-off hedge reshapes</h2>
      <p>Moving in, selling up, or a hedge that's been left too long? We do one-off reshapes to bring overgrown hedges back to a clean shape and a manageable height, then you can keep them there with a regular trim. Combine it with <a href="/mowing">lawn mowing</a> and <a href="/weed-control">weed spraying</a> for a full property tidy-up in one visit.</p>
      <h2>Hedge trimming before &amp; after</h2>
      <div class="ba-grid" style="grid-template-columns:1fr 1fr">
        ${beforeAfter("hedge-trimming-before-after-wellington-point", "Hedge trimming, Wellington Point")}
        ${beforeAfter("hedge-trimming-before-after-ormiston", "Front hedge reshape, Ormiston", { d: .08 })}
      </div>
      <div class="gallery" style="margin-top:20px">
        ${[["privacy-hedge-trimming-ormiston", "Privacy hedge trimming Ormiston"], ["box-hedge-trimming-waterfront-redlands", "Box hedge trimming on a Redlands waterfront"], ["hedge-trimming-front-garden-birkdale", "Front garden hedge trimming Birkdale"], ["street-hedge-trimming-thorneside", "Street-front hedge trimming Thorneside"]]
          .map(([s, a]) => `<figure data-reveal>${img(s, a, { sizes: "(max-width: 600px) 100vw, 30vw" })}<figcaption>${a}</figcaption></figure>`).join("")}
      </div>`,
  faqs: [
    ["How much does hedge trimming cost in the Redlands?", "It depends on the length, height and condition of the hedge and how easy it is to get to. We give free, no-obligation quotes, and regular trims cost less per visit than a big reshape of an overgrown hedge."],
    ["Do you take the hedge clippings away?", "Yes. Clean-up and green waste removal are included. We rake and blow down paths, lawns and garden beds before we leave."],
    ["When is the best time to trim hedges in South-East Queensland?", "Light trims through the growing season (spring to autumn) keep hedges dense. Heavier reshapes are best done in late winter or early spring, just before strong new growth starts."],
    ["Can you trim tall hedges and privacy screens?", "Yes. We trim tall privacy screens and boundary hedges. Very tall or hard-to-access hedges are quoted after a quick look so we can plan safe access."],
    ["Do you do hedge trimming in Wellington Point, Cleveland and Thornlands?", `Yes, along with ${SUBURBS.filter(s => !["Wellington Point", "Cleveland", "Thornlands"].includes(s)).join(", ")}.`],
  ],
});

const weeds = servicePage({
  path: "/weed-control", crumb: "Weed Spraying", short: "Weed spraying", serviceName: "Weed Spraying",
  title: "Weed Spraying Redlands | Golden Cane Lawns",
  description: "Targeted weed spraying Redlands lawns and garden beds. Bindii, clover and broadleaf control from a local, fully insured team. Request a free quote today.",
  eyebrow: "Lawns, beds & paths",
  h1: "Weed Spraying Redlands — Lawns &amp; Garden Beds",
  lead: "Targeted weed spraying for Redlands lawns, garden beds, gravel and paths. Bindii, clover and broadleaf weeds dealt with properly, by a local, fully insured team.",
  heroImg: "shrub-shaping-garden-maintenance-capalaba", heroAlt: "Weed spraying Redlands — weed-free garden bed and lawn edge in Capalaba",
  formService: "Weed Spraying",
  areaIntro: `We spray weeds in lawns, garden beds and hard surfaces across ${areaCopy}.`,
  faqTitle: "Weed spraying FAQs",
  ctaTitle: "Get on top of the weeds", ctaText: "Targeted spraying for lawns, garden beds and paths, from a local, insured team.",
  quoteTitle: "Get a free weed spraying quote",
  content: `
      <p class="lead">Golden Cane Lawns provides targeted <strong>weed spraying Redlands</strong> wide, from Wellington Point across Cleveland, Capalaba, Thornlands and the bayside. We're family-run and independent with over ten years of hands-on experience, ABN registered and fully insured.</p>
      <p>Weeds compete with your lawn for water and nutrients, spread fast through the warm, humid Redlands summer, and the prickly ones like bindii make the yard unpleasant for kids and pets. We identify what's growing and treat it with the right product, applied to label directions, so you get results without damaging the lawn or garden you're trying to protect.</p>
      <h2>Weeds we treat</h2>
      <div class="feature-grid">
        ${feature("leaf", "Bindii (jo-jo)", "Best treated in winter and early spring, before the prickles form.")}
        ${feature("sprout", "Clover &amp; broadleaf", "Clover, cudweed, creeping oxalis and other broadleaf weeds in lawns.")}
        ${feature("spray", "Garden beds &amp; gravel", "Weeds in mulched beds, pebble gardens, driveways and paver joints.")}
        ${feature("shield", "Selective spraying", "Lawn-safe selective products where possible, matched to your grass type.")}
      </div>
      ${figure("weed-spraying-redlands-garden-bed", "Weed spraying Redlands — weed growing through gravel beside a fence", "A weed coming through decorative gravel: the kind of spot we treat")}
      <h2>How our weed spraying works</h2>
      <p>We start by identifying the weeds and your grass type, because the wrong product can damage buffalo, couch or zoysia lawns. Where we can we use selective herbicides that target the weed and leave the lawn, and we spot-spray rather than blanket-spray. Garden beds, gravel and hard surfaces are treated with non-selective products applied carefully around your plants. All products are registered and applied according to the label.</p>
      <h2>Is it safe for pets and kids?</h2>
      <p>We'll tell you before we spray so you can keep pets inside. We recommend keeping pets and children off treated areas until the spray has completely dried, and for any longer period the product label specifies. If you have a fish pond, veggie patch or anything else we should avoid, just let us know.</p>
      <h2>Regular treatments work best</h2>
      <p>Got prickles in the lawn? Read our guide to <a href="/blog/how-to-get-rid-of-bindii">how to get rid of bindii and when to spray it in Queensland</a>.</p>
      <p>One spray rarely fixes a weed problem for good, because seeds already in the soil keep germinating. A follow-up treatment and a regular <a href="/mowing">lawn mowing</a> schedule keep the lawn thick enough to crowd weeds out. Pair weed spraying with <a href="/gardening">garden maintenance</a> to keep beds clean all year.</p>
      ${figure("front-lawn-mowing-ormiston", "Weed-free front lawn and garden beds in Ormiston", "A clean, weed-free front lawn and garden in Ormiston")}`,
  faqs: [
    ["When is the best time to spray bindii in the Redlands?", "Late autumn through winter into early spring, while the plants are young and before they set their prickly seeds. Once the prickles have formed the seed is already in the lawn for next year."],
    ["Will weed spraying kill my lawn?", "Not when the right product is used. We match selective herbicides to your grass type (buffalo, couch, zoysia or kikuyu) and apply them at the label rate so the weeds are targeted and the lawn isn't."],
    ["Is weed spraying safe for pets and children?", "We apply registered products to label directions and recommend keeping pets and children off treated areas until the spray has dried and for any longer period the label requires. We'll let you know before we start."],
    ["Do you spray weeds in garden beds, gravel and driveways?", "Yes. We treat weeds in mulched beds, pebble and gravel areas, driveways, paths and paver joints, working carefully around your plants."],
    ["How long until the weeds die?", "Most weeds start to yellow within a week or two depending on the weed, the product and the weather. Tough perennial weeds can need a follow-up treatment."],
  ],
});

const gardening = servicePage({
  path: "/gardening", crumb: "Garden Maintenance", short: "Garden maintenance", serviceName: "Garden Maintenance",
  title: "Garden Maintenance Cleveland QLD | Golden Cane Lawns",
  description: "Garden maintenance Cleveland QLD and across the Redlands. Tidy-ups, pruning, mulching and ongoing garden care from a local family-run team. Get a free quote.",
  eyebrow: "Tidy-ups, pruning & ongoing care",
  h1: "Garden Maintenance Cleveland &amp; the Redlands",
  lead: "Garden tidy-ups, pruning, mulching and ongoing care for homes, rentals and properties heading to market, from a local, family-run team.",
  heroImg: "hedge-and-lawn-care-victoria-point", heroAlt: "Garden maintenance Cleveland and the Redlands — tidy hedge and lawn",
  formService: "Other",
  areaIntro: `Garden maintenance is available across ${areaCopy}.`,
  faqTitle: "Garden maintenance FAQs",
  ctaTitle: "Let us look after the garden", ctaText: "Regular visits or a one-off tidy-up before guests, inspections or a sale.",
  quoteTitle: "Get a free garden maintenance quote",
  content: `
      <p class="lead">Golden Cane Lawns provides <strong>garden maintenance Cleveland</strong> homeowners and landlords can count on, along with Wellington Point, Ormiston, Thornlands and the rest of the Redlands. We're a family-run, independent business with more than ten years of hands-on experience, ABN registered and fully insured.</p>
      <p>Some people want the whole garden handled; others just want the jobs they don't have time for taken off their hands. We can do a single tidy-up or come back on a regular schedule, and it can all be combined with your <a href="/mowing">lawn mowing</a> visit.</p>
      <h2>Garden maintenance services</h2>
      <div class="feature-grid">
        ${feature("sprout", "Garden tidy-ups", "Weeding, cutting back, clearing debris and refreshing tired beds.")}
        ${feature("scissors", "Pruning &amp; shaping", "Shrubs and small trees pruned and shaped. See also <a href=\"/hedging\">hedge trimming</a>.")}
        ${feature("leaf", "Mulching", "Fresh mulch to hold moisture, suppress weeds and finish beds neatly.")}
        ${feature("spray", "Weed control", "Beds, gravel and paths kept clean. See <a href=\"/weed-control\">weed spraying</a>.")}
        ${feature("bin", "Green waste removal", "All garden waste removed so you're left with a clean, finished yard.")}
        ${feature("home", "Rentals &amp; sales", "End-of-lease, inspection and pre-sale garden presentation.")}
      </div>
      <h2>Garden maintenance before &amp; after</h2>
      <div class="ba-grid" style="grid-template-columns:1fr 1fr">
        ${beforeAfter("garden-maintenance-before-after-thornlands", "Shrub shaping, Thornlands")}
        ${beforeAfter("shrub-pruning-before-after-cleveland", "Shrub pruning, Cleveland", { d: .08 })}
      </div>
      <h2>Homes, rentals and pre-sale tidy-ups</h2>
      <p>For homeowners we offer regular visits that keep the garden looking cared for without you spending your weekends on it. For landlords and property managers we handle routine inspections and end-of-lease presentation, and for anyone selling we do pre-sale tidy-ups so the garden helps the property photograph and present at its best.</p>
      ${figure("shrub-shaping-garden-maintenance-capalaba", "Shrub shaping and garden maintenance in Capalaba", "Shaped shrubs and a clean pebble bed in Capalaba")}`,
  faqs: [
    ["What does garden maintenance include?", "Weeding, pruning and shaping shrubs, cutting back overgrowth, mulching, tidying beds and removing all the green waste. We tailor each visit to what your garden needs."],
    ["Do you offer regular garden maintenance in Cleveland?", "Yes. We offer weekly, fortnightly, monthly or seasonal visits in Cleveland and across the Redlands, and garden work can be combined with your lawn mowing."],
    ["Can you do a one-off garden tidy-up before selling or moving out?", "Yes. We do one-off pre-sale and end-of-lease garden tidy-ups, usually combined with mowing, edging and hedge trimming so the whole property is ready."],
    ["Do you remove the garden waste?", "Yes. Green waste removal is included and we leave paths and lawns blown clean."],
    ["Which suburbs do you cover for garden maintenance?", `We cover ${areaCopy}.`],
  ],
});

/* ------------------------------------------------------------------ ABOUT */
const about = {
  path: "/about", file: "about.html",
  title: "About Golden Cane Lawns | Redlands Family Lawn Care",
  description: "Meet Golden Cane Lawns: a Redlands local, family-run lawn and garden business in Wellington Point with 10+ years' hands-on experience. ABN registered, fully insured.",
  ogImage: "lawn-mowing-wellington-point-owner",
  schema: [breadcrumbSchema([["Home", "/"], ["About", "/about"]])],
  body: `
<section class="page-hero">
  <div class="wrap page-hero__grid">
    <div>
      ${crumbs([["Home", "/"], ["About", "/about"]])}
      <span class="eyebrow" style="color:var(--yellow)">About us</span>
      <h1>Redlands Local, Family-Run Lawn Care for 10+ Years</h1>
      <p class="lead">Golden Cane Lawns is an independent, family-run lawn and garden maintenance business based in Wellington Point, run by owner Levi Engstrom.</p>
    </div>
    <div class="page-hero__media">${img("lawn-mowing-wellington-point-owner", "Owner Levi Engstrom lawn mowing in the Redlands", { sizes: "(max-width: 860px) 100vw, 45vw", eager: true, pick: 960 })}</div>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div data-reveal="left">
      <span class="eyebrow">Our story</span>
      <h2>A local business, not a franchise</h2>
      <p class="lead">We're Redlands locals. We live here, our kids grow up here, and the lawns we look after belong to our neighbours.</p>
      <p>Levi has been mowing, trimming and maintaining gardens for over a decade. Golden Cane Lawns grew from that hands-on experience into an independent, family-run business that looks after homes, rentals and properties across Wellington Point and the Redlands bayside.</p>
      <p>Being independent means you deal directly with the people doing the work. No call centres, no franchise fees built into your price, and no rotating crew who've never seen your yard before.</p>
      <ul class="ticks">
        <li>${icon("check")}<span><strong>Family-run and independent</strong>, based in Wellington Point</span></li>
        <li>${icon("check")}<span><strong>10+ years</strong> of hands-on lawn and garden experience</span></li>
        <li>${icon("check")}<span><strong>ABN registered</strong> (${SITE.abn}) and <strong>fully insured</strong></span></li>
        <li>${icon("check")}<span><strong>${SITE.rating}★ from ${SITE.reviews} Google reviews</strong> from local customers</span></li>
      </ul>
    </div>
    <div class="split__media" data-reveal="right">
      <div class="frame">${img("golden-cane-lawns-family-redlands", "The Engstrom family behind Golden Cane Lawns, a family-run Redlands lawn care business", { sizes: "(max-width: 860px) 100vw, 50vw" })}</div>
      <div class="split__badge"><strong>100%</strong><span>local &amp; family-run</span></div>
    </div>
  </div>
</section>
<section class="section section--green">
  <div class="wrap">
    <div class="center" style="margin-bottom:clamp(32px,5vw,48px)">
      <span class="eyebrow">How we work</span>
      <h2>Simple, reliable and done properly</h2>
    </div>
    <div class="steps">
      <div class="step" data-reveal><h3>Get in touch</h3><p>Call ${SITE.phone} or send the quote form with your address and what you need.</p></div>
      <div class="step" data-reveal style="--d:.08s"><h3>Free quote</h3><p>We'll give you a clear, no-obligation price, and a suggested schedule if you want regular visits.</p></div>
      <div class="step" data-reveal style="--d:.16s"><h3>We do the work</h3><p>Mowing, edging, hedging, spraying or a full tidy-up, finished to a professional standard.</p></div>
      <div class="step" data-reveal style="--d:.24s"><h3>We clean up</h3><p>Paths blown down and green waste taken away. You just enjoy the yard.</p></div>
    </div>
  </div>
</section>
<section class="section section--white">
  <div class="wrap">
    <div class="sec-head">
      <div><span class="eyebrow" data-reveal>What we do</span><h2 data-reveal>Our services</h2></div>
      <p class="lead" data-reveal>Everything your lawn and garden needs, from a single local team.</p>
    </div>
    <div class="services">
      ${SERVICES.map((s, i) => `
      <a class="svc" href="${s.href}" data-reveal style="--d:${i * 0.08}s">
        <div class="svc__img">${img(s.img, s.alt, { sizes: "(max-width: 560px) 100vw, (max-width: 1060px) 50vw, 25vw" })}<span class="svc__icon">${icon(s.icon)}</span></div>
        <div class="svc__body"><h3>${s.name}</h3><p>${s.blurb}</p><span class="link-arrow">Learn more ${icon("arrow")}</span></div>
      </a>`).join("")}
    </div>
  </div>
</section>
<section class="section section--deep">
  <div class="wrap areas">
    ${mapVideo()}
    <div data-reveal="right">
      <span class="eyebrow">Where we work</span>
      <h2>Proudly servicing the Redlands bayside</h2>
      <p class="lead">From our home base in Wellington Point we look after lawns and gardens across eleven local suburbs.</p>
      ${suburbList()}
    </div>
  </div>
</section>
${quoteSection()}
`,
};

/* ---------------------------------------------------------------- CONTACT */
const contact = {
  path: "/contact", file: "contact.html",
  title: "Contact Golden Cane Lawns | Free Lawn Care Quotes Redlands",
  description: "Get a free lawn mowing, hedge trimming or weed spraying quote from Golden Cane Lawns. Call 0415 190 092 or send the form. Wellington Point QLD 4160.",
  schema: [breadcrumbSchema([["Home", "/"], ["Contact", "/contact"]])],
  body: `
<section class="page-hero">
  <div class="wrap" style="padding-block:clamp(40px,7vw,80px)">
    ${crumbs([["Home", "/"], ["Contact", "/contact"]])}
    <span class="eyebrow" style="color:var(--yellow)">Contact</span>
    <h1>Contact Golden Cane Lawns</h1>
    <p class="lead">Free, no-obligation quotes for lawn mowing, hedge trimming, weed spraying, whipper snipping and garden maintenance across the Redlands.</p>
  </div>
</section>
${quoteSection({ title: "Request a free quote", intro: "Fill in the form and we'll be in touch, or call us directly. We service " + suburbSentence() + "." })}
<section class="section section--white">
  <div class="wrap areas">
    <div>
      ${gbpMap("Golden Cane Lawns, Wellington Point, on Google Maps")}
      <p style="margin-top:14px"><a class="btn btn--green" href="${SITE.gbp}" target="_blank" rel="noopener">${icon("google")} Find us on Google Maps</a></p>
    </div>
    <div data-reveal="right">
      <span class="eyebrow">Service areas</span>
      <h2>Where we work</h2>
      <p class="lead">Based in ${SITE.locality} ${SITE.region} ${SITE.postcode}. We travel to customers across the Redlands bayside.</p>
      ${suburbList()}
      <ul class="ticks">
        <li>${icon("phone")}<span><a href="tel:${SITE.phoneIntl}">${SITE.phone}</a></span></li>
        <li>${icon("mail")}<span><a href="mailto:${SITE.email}">${SITE.email}</a></span></li>
        <li>${icon("facebook")}<span><a href="${SITE.facebook}" target="_blank" rel="noopener">Facebook</a> · <a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a> · <a href="${SITE.gbp}" target="_blank" rel="noopener">Google</a></span></li>
      </ul>
    </div>
  </div>
</section>
`,
};

/* -------------------------------------------------------------- THANK YOU */
const thankYou = {
  path: "/thank-you", file: "thank-you.html", noindex: true, noQuote: true,
  title: "Thank You | Golden Cane Lawns",
  description: "Thanks for contacting Golden Cane Lawns. We'll be in touch about your free quote shortly.",
  body: `
<section class="notice">
  <div class="wrap">
    <div class="notice__icon">${icon("check")}</div>
    <span class="eyebrow">Request received</span>
    <h1>Thanks<span data-first-name></span>! We've got your request.</h1>
    <p class="lead" style="margin-inline:auto">We'll be in touch shortly about your free quote. If it's urgent, give us a call on <a href="tel:${SITE.phoneIntl}" style="color:var(--yellow)">${SITE.phone}</a>.</p>
    <p>
      <a class="btn" href="/">Back to home</a>
      <a class="btn btn--ghost" href="${SITE.facebook}" target="_blank" rel="noopener">${icon("facebook")} Follow us</a>
    </p>
  </div>
</section>
`,
};

const notFound = {
  path: "/404", file: "404.html", noindex: true, noQuote: true,
  title: "Page Not Found | Golden Cane Lawns",
  description: "Sorry, that page couldn't be found.",
  body: `
<section class="notice">
  <div class="wrap">
    <div class="notice__icon">${icon("leaf")}</div>
    <span class="eyebrow">404</span>
    <h1>This page has been mowed down</h1>
    <p class="lead" style="margin-inline:auto">The page you're looking for doesn't exist. Try one of these instead.</p>
    <p>
      <a class="btn" href="/">Home</a>
      <a class="btn btn--ghost" href="/mowing">Lawn mowing</a>
      <a class="btn btn--ghost" href="/contact">Contact</a>
    </p>
  </div>
</section>
`,
};

/* ------------------------------------------------------------------- BLOG */
import { POSTS } from "./posts.mjs";

const blogIndex = {
  path: "/blog", file: "blog.html",
  title: "Lawn Care Blog | Redlands Tips | Golden Cane Lawns",
  description: "Practical lawn mowing, hedge trimming and garden tips for Redlands and South-East Queensland homeowners from local family-run team Golden Cane Lawns.",
  schema: [breadcrumbSchema([["Home", "/"], ["Blog", "/blog"]])],
  body: `
<section class="page-hero">
  <div class="wrap" style="padding-block:clamp(40px,7vw,80px)">
    ${crumbs([["Home", "/"], ["Blog", "/blog"]])}
    <span class="eyebrow" style="color:var(--yellow)">Lawn care blog</span>
    <h1>Lawn &amp; Garden Tips for Redlands Homeowners</h1>
    <p class="lead">Straight answers to the questions Redlands locals ask us most, from a family-run team with 10+ years on the tools.</p>
  </div>
</section>
<section class="section">
  <div class="wrap posts">
    ${POSTS.map((p, i) => `
    <a class="post-card" href="${p.path}" data-reveal style="--d:${i * 0.08}s">
      <div class="post-card__img">${img(p.img, p.imgAlt, { sizes: "(max-width: 600px) 100vw, 33vw" })}</div>
      <div class="post-card__body"><div class="post-meta">${p.dateLabel} · ${p.read} min read</div><h2>${p.h1}</h2><p>${p.excerpt}</p><span class="link-arrow">Read article ${icon("arrow")}</span></div>
    </a>`).join("")}
  </div>
</section>
${quoteSection()}
`,
};

const postPages = POSTS.map(p => {
  const trail = [["Home", "/"], ["Blog", "/blog"], [p.crumb, p.path]];
  return {
    path: p.path, file: p.path.slice(1) + ".html", ogType: "article", ogImage: p.img,
    title: p.title, description: p.description,
    schema: [
      { "@type": "BlogPosting", headline: p.h1, description: p.description, datePublished: p.date, dateModified: p.date,
        author: { "@type": "Organization", name: SITE.name, url: SITE.url }, publisher: { "@id": `${SITE.url}/#business` },
        mainEntityOfPage: `${SITE.url}${p.path}`, image: `${SITE.url}/assets/img/${p.img}-960.webp` },
      faqSchema(p.faqs), breadcrumbSchema(trail),
    ],
    body: `
<section class="page-hero">
  <div class="wrap page-hero__grid">
    <div>
      ${crumbs(trail)}
      <div class="post-meta">${p.dateLabel} · ${p.read} min read · Golden Cane Lawns</div>
      <h1>${p.h1}</h1>
      <p class="lead">${p.excerpt}</p>
    </div>
    <div class="page-hero__media">${img(p.img, p.imgAlt, { sizes: "(max-width: 860px) 100vw, 45vw", eager: true, pick: 960 })}</div>
  </div>
</section>
<section class="section">
  <div class="wrap content-grid">
    <article class="prose">
      ${p.body}
      <h2>Frequently asked questions</h2>
      ${faqBlock(p.faqs)}
    </article>
    <aside class="aside">
      <div class="aside-card aside-card--green">
        <h3>Need a hand?</h3>
        <p>Golden Cane Lawns is a family-run Redlands lawn care business. Free quotes.</p>
        <a class="btn btn--block" href="#quote">Get a free quote</a>
        <a class="btn btn--ghost btn--block" style="margin-top:10px" href="tel:${SITE.phoneIntl}">${icon("phone")} ${SITE.phone}</a>
      </div>
      <div class="aside-card">
        <h3>More articles</h3>
        <ul class="aside-links">${POSTS.filter(o => o !== p).map(o => `<li><a href="${o.path}">${o.crumb}${icon("chevron")}</a></li>`).join("")}<li><a href="/blog">All articles${icon("chevron")}</a></li></ul>
      </div>
    </aside>
  </div>
</section>
${quoteSection({ service: p.service })}
`,
  };
});

export const PAGES = [home, mowing, hedging, weeds, gardening, about, contact, ...AREA_PAGES, blogIndex, ...postPages, thankYou, notFound];
