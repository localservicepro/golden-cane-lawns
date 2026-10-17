// Suburb landing pages: the optional add-on from section 10 of the SEO report,
// updated to the client's target suburbs (Oct 2026). Each targets "lawn mowing <suburb>" with unique local
// copy. Wellington Point is the homepage's keyword (no separate page).

export const SUBURB_PAGES = [
  {
    slug: "capalaba", name: "Capalaba", volume: 30, council: "Redland City Council",
    nearby: ["Alexandra Hills", "Birkdale", "Wellington Point", "Thornlands"],
    description: "Lawn mowing Capalaba homeowners rely on. Regular or one-off mows with edging, whipper snipping and green waste removal from a local, fully insured team.",
    lead: "Regular and one-off lawn mowing for Capalaba homes, rentals and larger blocks, from a family-run Redlands team just down the road in Wellington Point.",
    heroImg: "verge-mowing-capalaba", heroAlt: "Lawn mowing Capalaba — freshly mowed and edged street verge",
    intro: `Golden Cane Lawns provides reliable <strong>lawn mowing Capalaba</strong> residents can set their calendar by. We're based ten minutes away in Wellington Point, we're family-run and independent, and we've been mowing Redlands lawns for more than a decade. Every visit includes edging, whipper snipping, blow-down and green waste removal, and we're ABN registered and fully insured.`,
    localTitle: "Mowing Capalaba lawns",
    local: `<p>Capalaba is the western gateway to the Redlands, and its lawns reflect that mix: established family homes on generous suburban blocks, newer infill housing with compact yards, and bigger lots out towards the bushland edges around Tingalpa Creek and Leslie Harrison Dam, with Alexandra Hills just next door. Many older Capalaba lawns are a blend of couch and kikuyu, which grows hard through summer and needs mowing every week or two to stay even.</p>
<p>Bigger blocks are where a regular round pays off most. A large lawn that gets away for a month in January can take twice as long to bring back, with far more green waste to remove. We'll suggest a schedule that suits your block and the season, and we're happy to quote one-off catch-up cuts as well.</p>`,
    extraImg: ["shrub-shaping-garden-maintenance-capalaba", "Shrub shaping and a weed-free pebble garden bed in Capalaba"],
    ba: ["lawn-edging-before-after-capalaba", "Verge edging and whipper snipping, Capalaba"],
    faqs: [
      ["Do you mow large blocks in Capalaba?", "Yes. We mow everything from compact infill yards to larger Capalaba blocks. Bigger or overgrown lawns are quoted on size and condition. Use the property size option in the quote form so we can price it accurately."],
      ["How often should a Capalaba lawn be mowed in summer?", "Most couch and kikuyu lawns in Capalaba need mowing every 7–14 days from December to March. Through winter, every three to four weeks is usually enough."],
      ["Can you mow the verge and nature strip too?", "Yes. Verges and nature strips are mowed and edged along the kerb as part of the visit, and whipper snipped around posts, poles and letterboxes."],
    ],
  },
  {
    slug: "cleveland", name: "Cleveland", volume: 20, council: "Redland City Council",
    nearby: ["Thornlands", "Alexandra Hills", "Wellington Point", "Ormiston"],
    description: "Lawn mowing Cleveland QLD, from Raby Bay canal homes to Cleveland Point. Regular or one-off mows with edging and green waste removal. Free quotes.",
    lead: "Lawn mowing for Cleveland's canal-front, bayside and suburban homes. Crisp edges, a clean finish and every clipping taken away.",
    heroImg: "lawn-mowing-cleveland-canal-front", heroAlt: "Lawn mowing Cleveland QLD — canal-front lawn with clean edges",
    intro: `Golden Cane Lawns provides professional <strong>lawn mowing Cleveland QLD</strong> homeowners trust, from Raby Bay canal homes to the older streets around Cleveland Point. We're a family-run, independent team based in nearby Wellington Point, with over ten years of hands-on experience. Every mow includes edging, whipper snipping, blow-down and green waste removal, and we're ABN registered and fully insured.`,
    localTitle: "Waterfront and canal lawns in Cleveland",
    local: `<p>A lot of Cleveland lawns sit right on the water. Canal-front yards in Raby Bay and the bayside streets towards Cleveland Point look their best with a sharp edge along the revetment wall, pool fence or deck, and they're on show to every passing boat. Salt air, wind and sandy soils on the canal estates mean these lawns dry out quickly in summer, so we keep the cut height a little higher in the hot months to help the grass hold moisture.</p>
<p>Plenty of Cleveland homes also have narrow side access, pool areas and hedges to work around, which is exactly where careful whipper snipping and a full blow-down make the difference between "mowed" and "finished".</p>`,
    extraImg: ["hedge-trimming-poolside-cleveland", "Poolside hedge trimming in Cleveland"],
    ba: ["shrub-pruning-before-after-cleveland", "Shrub pruning, Cleveland"],
    faqs: [
      ["Do you mow canal-front lawns in Raby Bay?", "Yes. We mow and edge canal-front and waterfront lawns across Cleveland, including Raby Bay, taking care along revetment walls, pool fences and decks."],
      ["Can you trim hedges at the same time as mowing in Cleveland?", "Yes. Many Cleveland customers combine mowing with hedge trimming and weed spraying in one visit. See our hedge trimming Redlands service for details."],
      ["How much does lawn mowing cost in Cleveland?", "It depends on lawn size, condition, access and frequency. Quotes are free. Send your address through the form or call 0415 190 092."],
    ],
  },
  {
    slug: "alexandra-hills", name: "Alexandra Hills", volume: 10, council: "Redland City Council",
    nearby: ["Capalaba", "Birkdale", "Thornlands", "Cleveland"],
    description: "Lawn mowing Alexandra Hills: regular or one-off mows for family homes and sloping blocks, with edging, whipper snipping and green waste removal. Free quotes.",
    lead: "Lawn mowing for Alexandra Hills family homes, from big flat backyards to sloping blocks, by a local team ten minutes away.",
    heroImg: "front-yard-mowing-alexandra-hills", heroAlt: "Lawn mowing Alexandra Hills — freshly mowed front yard and garden",
    intro: `Golden Cane Lawns provides dependable <strong>lawn mowing Alexandra Hills</strong> families can count on. We're based just up the road in Wellington Point, we're family-run and independent, and we've been mowing Redlands lawns for more than a decade. Every visit includes edging, whipper snipping, blow-down and green waste removal, and we're ABN registered and fully insured.`,
    localTitle: "Family blocks and sloping yards in Alexandra Hills",
    local: `<p>Alexandra Hills sits in the middle of the Redlands between Capalaba, Birkdale, Cleveland and Thornlands. It's an established family suburb, and many homes sit on the generous suburban blocks that were standard when the area was built, with decent-sized front lawns and backyards made for kids and dogs.</p>
<p>As the name suggests, plenty of Alexandra Hills streets aren't flat. Sloping lawns, banks and retaining walls are common, and they need a careful approach: an even cut across the slope, whipper snipping on banks too steep to mow safely, and a sharp edge along steps and walls. Big lawns grow fast in the Redlands summer, so a fortnightly round from September to April keeps them under control.</p>`,
    extraImg: ["hedge-and-lawn-care-alexandra-hills", "Hedge and lawn care for an Alexandra Hills home"],
    ba: null,
    faqs: [
      ["Do you mow sloping lawns in Alexandra Hills?", "Yes. We mow sloping lawns and whipper snip banks that are too steep to mow safely. Mention any steep areas in the quote form notes."],
      ["How often should an Alexandra Hills lawn be mowed?", "Every 7–14 days from spring to autumn for most lawns, and every three to four weeks through winter."],
      ["Do you do one-off mows for rentals in Alexandra Hills?", "Yes. We do end-of-lease, inspection and pre-sale mows and tidy-ups, and can add hedge trimming and weed spraying to the same visit."],
    ],
  },
  {
    slug: "thornlands", name: "Thornlands", volume: 10, council: "Redland City Council",
    nearby: ["Cleveland", "Alexandra Hills", "Capalaba"],
    description: "Lawn mowing Thornlands: regular or one-off mows for modern estates and larger blocks, with edging, whipper snipping and green waste removal. Free quotes.",
    lead: "Lawn mowing for Thornlands' modern estates and bigger blocks, with edging, whipper snipping and a full clean-up every visit.",
    heroImg: "lawn-mowing-thornlands-front-yard", heroAlt: "Lawn mowing Thornlands — freshly mowed front yard",
    intro: `Golden Cane Lawns provides reliable <strong>lawn mowing Thornlands</strong> homeowners and landlords use week in, week out. We're a family-run, independent Redlands business based in Wellington Point, with more than ten years of hands-on experience. Every mow includes edging, whipper snipping, blow-down and green waste removal, and we're ABN registered and fully insured.`,
    localTitle: "Estates, acreage and everything between",
    local: `<p>Thornlands has grown quickly, and its lawns range from compact front yards in modern estates to larger blocks and semi-rural lots on the suburb's edges. Estate homes often have hedges along the front boundary and garden beds edged in pavers or concrete, so a sharp edge and a tidy hedge do a lot for street appeal.</p>
<p>Plenty of Thornlands properties are rentals, so we also do a lot of one-off mows and tidy-ups for inspections and end-of-lease cleans. Mowing, edging, hedge trimming and weed spraying can all be done in a single visit.</p>`,
    extraImg: ["hedge-trimming-side-path-thornlands", "Hedge trimming along a side path in Thornlands"],
    ba: ["garden-maintenance-before-after-thornlands", "Shrub shaping, Thornlands"],
    faqs: [
      ["Do you do one-off mows for rentals in Thornlands?", "Yes. We do inspection, end-of-lease and pre-sale mows and tidy-ups, and can include hedging and weed spraying."],
      ["Do you mow larger blocks in Thornlands?", "Yes. Larger blocks are quoted on size, condition and access. Choose the property size in the form for an accurate quote."],
      ["Can you trim the front hedge when you mow?", "Yes. Many Thornlands customers add hedge trimming to their regular mow. See our hedge trimming Redlands page."],
    ],
  },
  {
    slug: "ormiston", name: "Ormiston", volume: 0, council: "Redland City Council",
    nearby: ["Wellington Point", "Cleveland", "Alexandra Hills", "Birkdale"],
    description: "Lawn mowing Ormiston from your Wellington Point neighbours. Regular or one-off mows with edging, whipper snipping and green waste removal. Free quotes.",
    lead: "Lawn mowing for Ormiston's leafy streets and bayside homes, from a family-run team based right next door in Wellington Point.",
    heroImg: "front-lawn-mowing-ormiston", heroAlt: "Lawn mowing Ormiston — freshly mowed front lawn and garden edges",
    intro: `Golden Cane Lawns provides careful, reliable <strong>lawn mowing Ormiston</strong> homeowners can count on. Ormiston sits right between our home base in Wellington Point and Cleveland, so it's part of every regular round. We're family-run and independent with more than a decade of hands-on experience, every mow includes edging, whipper snipping, blow-down and green waste removal, and we're ABN registered and fully insured.`,
    localTitle: "Leafy streets and bayside gardens in Ormiston",
    local: `<p>Ormiston is one of the Redlands' most established suburbs, with quiet, tree-lined streets, generous blocks and homes running down towards the bay. It also has a fitting bit of history for a business called Golden Cane: historic Ormiston House is where Queensland's commercial sugar industry began, with the state's first sugar milled there in 1864.</p>
<p>Today, Ormiston gardens tend to be well kept and well established: mature trees, hedges along the front boundary, and lawns that are on show to the street. That means a sharp edge along the footpath and driveway, careful whipper snipping around garden beds, and hedges kept dense and level. Big trees also mean shaded patches, so we lift the cut height where the grass is under canopy.</p>`,
    extraImg: ["privacy-hedge-trimming-ormiston", "Tall privacy hedge trimmed square in Ormiston"],
    ba: ["hedge-trimming-before-after-ormiston", "Front hedge reshape, Ormiston"],
    faqs: [
      ["Do you mow lawns in Ormiston regularly?", "Yes. Ormiston is right next to our Wellington Point base and part of every regular round, so it's easy to fit in fortnightly or monthly visits."],
      ["Can you trim the front hedge when you mow in Ormiston?", "Yes. Many Ormiston customers add hedge trimming to their mow. See our hedge trimming Redlands page for details."],
      ["My Ormiston lawn is patchy under big trees. What can you do?", "Shaded grass needs a higher cut and less wear. We'll mow it at the right height and can point out anything else that might help it recover."],
    ],
  },
  {
    slug: "birkdale", name: "Birkdale", volume: 10, council: "Redland City Council",
    nearby: ["Wellington Point", "Capalaba", "Alexandra Hills"],
    description: "Lawn mowing Birkdale from your Wellington Point neighbours. Regular or one-off mows with edging, whipper snipping and green waste removal. Free quotes.",
    lead: "Lawn mowing for Birkdale homes from a family-run team based right next door in Wellington Point.",
    heroImg: "curved-lawn-edging-birkdale", heroAlt: "Lawn mowing Birkdale — curved lawn with crisp whipper snipped edges",
    intro: `Golden Cane Lawns provides friendly, reliable <strong>lawn mowing Birkdale</strong> families can count on. Birkdale sits right next door to our home base in Wellington Point, so we're never far away. We're family-run and independent with more than a decade of hands-on experience, every mow includes edging, whipper snipping, blow-down and green waste removal, and we're ABN registered and fully insured.`,
    localTitle: "Our neighbours in Birkdale",
    local: `<p>Birkdale is an established family suburb with leafy streets, generous backyards and plenty of mature trees. Big trees bring shade and leaf litter, so Birkdale lawns often have a mix of sunny and shaded areas that grow at different rates. We adjust the cut height for shaded patches so the grass there isn't stressed, and blow leaves and clippings off paths and driveways before we leave.</p>
<p>Being this close to home means we can usually fit Birkdale customers into regular rounds easily, whether you want a fortnightly mow through summer or a monthly visit in winter.</p>`,
    extraImg: ["hedge-trimming-front-garden-birkdale", "Front garden hedge trimming in Birkdale"],
    ba: null,
    faqs: [
      ["How quickly can you start mowing in Birkdale?", "Birkdale is right next to our base in Wellington Point, so we can usually fit new regular customers in quickly. Send the quote form or call 0415 190 092."],
      ["My Birkdale lawn is patchy under trees. Can you help?", "Shaded lawn needs a higher cut and less wear. We'll mow it at the right height and can advise on what else might help."],
      ["Do you remove leaves and clippings?", "Yes. We blow down paths and driveways and take the green waste away."],
    ],
  },
];

export const suburbPath = name => {
  const p = SUBURB_PAGES.find(s => s.name === name);
  return p ? `/lawn-mowing-${p.slug}` : null;
};
