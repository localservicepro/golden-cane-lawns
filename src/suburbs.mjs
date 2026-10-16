// Suburb landing pages: the optional add-on from section 10 of the SEO report,
// in its priority order. Each targets "lawn mowing <suburb>" with unique local
// copy. Wellington Point is the homepage's keyword; Ormiston and Thorneside had
// no measured volume and are covered by the homepage, service pages and hub.

export const SUBURB_PAGES = [
  {
    slug: "capalaba", name: "Capalaba", volume: 30, council: "Redland City Council",
    nearby: ["Birkdale", "Thorneside", "Wellington Point", "Thornlands"],
    description: "Lawn mowing Capalaba homeowners rely on. Regular or one-off mows with edging, whipper snipping and green waste removal from a local, fully insured team.",
    lead: "Regular and one-off lawn mowing for Capalaba homes, rentals and larger blocks, from a family-run Redlands team just down the road in Wellington Point.",
    heroImg: "verge-mowing-capalaba", heroAlt: "Lawn mowing Capalaba — freshly mowed and edged street verge",
    intro: `Golden Cane Lawns provides reliable <strong>lawn mowing Capalaba</strong> residents can set their calendar by. We're based ten minutes away in Wellington Point, we're family-run and independent, and we've been mowing Redlands lawns for more than a decade. Every visit includes edging, whipper snipping, blow-down and green waste removal, and we're ABN registered and fully insured.`,
    localTitle: "Mowing Capalaba lawns",
    local: `<p>Capalaba is the western gateway to the Redlands, and its lawns reflect that mix: established family homes on generous suburban blocks, newer infill housing with compact yards, and bigger lots out towards the bushland edges around Tingalpa Creek and Leslie Harrison Dam. Many older Capalaba lawns are a blend of couch and kikuyu, which grows hard through summer and needs mowing every week or two to stay even.</p>
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
    nearby: ["Ormiston", "Thornlands", "Wellington Point", "Victoria Point"],
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
    slug: "victoria-point", name: "Victoria Point", volume: 20, council: "Redland City Council",
    nearby: ["Redland Bay", "Thornlands", "Cleveland"],
    description: "Lawn mowing Victoria Point: regular or one-off mows with edging, whipper snipping and green waste removal from a local, family-run Redlands team.",
    lead: "Regular and one-off lawn mowing for Victoria Point homes, from established bayside streets to the newer estates.",
    heroImg: "front-yard-mowing-victoria-point", heroAlt: "Lawn mowing Victoria Point — freshly mowed front yard",
    intro: `Golden Cane Lawns offers dependable <strong>lawn mowing Victoria Point</strong> residents can rely on all year. We're a family-run, independent Redlands business based in Wellington Point with more than a decade of hands-on experience. Every mow includes edging, whipper snipping, blow-down and green waste removal, and we're ABN registered and fully insured.`,
    localTitle: "Mowing in Victoria Point",
    local: `<p>Victoria Point has a bit of everything: established homes with big backyards in the older streets, waterfront properties looking across to Coochiemudlo Island, and newer estates where front lawns are compact and side access can be tight. Smaller lawns don't need less care; a neat edge along the driveway and footpath does most of the work of making a front yard look sharp.</p>
<p>Many newer Victoria Point homes have buffalo or zoysia lawns that were laid when the house was built. Both look best mowed regularly at the right height. Cutting them too short in summer causes scalping and brown patches that take weeks to recover.</p>`,
    extraImg: ["hedge-and-lawn-care-victoria-point", "Hedge and lawn care in Victoria Point"],
    ba: null,
    faqs: [
      ["Do you mow small lawns in new Victoria Point estates?", "Yes. Small lawns are welcome. Regular mows of compact front and back yards are quick, and the edging and blow-down make a big visual difference."],
      ["How short should I cut a buffalo lawn in Victoria Point?", "As a rule of thumb keep buffalo around 40–60 mm in summer and a little higher in shade. Cutting lower risks scalping in the heat."],
      ["Do you service Victoria Point for one-off mows?", "Yes, including end-of-lease and pre-sale tidy-ups. We can add hedge trimming and weed spraying to the same visit."],
    ],
  },
  {
    slug: "redland-bay", name: "Redland Bay", volume: 20, council: "Redland City Council",
    nearby: ["Victoria Point", "Thornlands", "Cleveland"],
    description: "Lawn mowing Redland Bay, from bayside homes to newer estates and larger blocks. Regular or one-off mows with edging and green waste removal. Free quotes.",
    lead: "Lawn mowing for Redland Bay's bayside homes, newer estates and larger blocks, from a family-run local team.",
    heroImg: "large-lawn-mowing-redland-bay", heroAlt: "Lawn mowing Redland Bay — large freshly mowed lawn",
    intro: `Golden Cane Lawns provides professional <strong>lawn mowing Redland Bay</strong> property owners count on, whether it's a bayside home near the foreshore, a new build in one of the growing estates, or a larger block on the edge of town. We're family-run and independent, based in Wellington Point, with over ten years of hands-on experience. Edging, whipper snipping, blow-down and green waste removal come with every mow, and we're ABN registered and fully insured.`,
    localTitle: "Larger lawns and new estates in Redland Bay",
    local: `<p>Redland Bay is one of the fastest-growing parts of the Redlands. New estates bring fresh turf that needs regular, careful mowing in its first year to thicken up, while the older bayside streets and the larger lots towards the rural fringe have big, established lawns that grow fast in the warm, wet months.</p>
<p>Redland Bay's red volcanic soil grows grass well, which is good news for the lawn and means more mowing for you in summer. A fortnightly round from September to April keeps big lawns manageable and stops them going to seed. If you're on a larger block or acreage, mention it in the quote form so we can give you an accurate price.</p>`,
    extraImg: ["waterfront-lawn-care-redlands", "Waterfront lawn care in the Redlands bayside"],
    ba: null,
    faqs: [
      ["Do you mow larger blocks and acreage in Redland Bay?", "We mow larger Redland Bay blocks regularly. For very large properties or acreage, choose that option in the quote form or call 0415 190 092 and we'll confirm whether it suits our equipment and schedule."],
      ["Can you look after new turf in a Redland Bay estate?", "Yes. New lawns need gentle, regular mowing at the right height to establish. We'll set a schedule that helps it thicken up."],
      ["Do you do one-off mows for rentals in Redland Bay?", "Yes. We do end-of-lease, inspection and pre-sale mows and tidy-ups for tenants, landlords and property managers."],
    ],
  },
  {
    slug: "wynnum", name: "Wynnum", volume: 20, council: "Brisbane City Council",
    nearby: ["Manly", "Thorneside", "Birkdale"],
    description: "Lawn mowing Wynnum: regular or one-off mows for character homes and family yards, with edging, whipper snipping and green waste removal. Free quotes.",
    lead: "Lawn mowing for Wynnum's character homes, family yards and bayside streets, from a local, family-run team.",
    heroImg: "front-lawn-mowing-ormiston", heroAlt: "Freshly mowed front lawn and garden edges — lawn mowing for Wynnum homes",
    intro: `Golden Cane Lawns brings professional <strong>lawn mowing Wynnum</strong> households can depend on, just across Tingalpa Creek from our Redlands base in Wellington Point. We're family-run and independent, with over a decade of hands-on experience, and every mow includes edging, whipper snipping, blow-down and green waste removal. ABN registered and fully insured.`,
    localTitle: "Character homes and classic Wynnum blocks",
    local: `<p>Wynnum is full of post-war cottages, Queenslanders and renovated character homes on classic Brisbane blocks, often around 400 to 600 m². These yards tend to have established couch or kikuyu lawns, fence lines on three sides, and garden beds, trees and clothes lines to work around. That makes whipper snipping and edging as important as the mow itself.</p>
<p>Wynnum is in the Brisbane City Council area rather than Redland City, but the Queensland rules on mowing hours are the same: 7am to 7pm Monday to Saturday and 8am to 7pm on Sundays and public holidays. We mow on weekdays within those hours, so your weekends stay quiet.</p>`,
    extraImg: ["lawn-mowing-poolside-ormiston", "Neatly mowed lawn beside a pool fence"],
    ba: null,
    faqs: [
      ["Do you service Wynnum even though it's in Brisbane City?", "Yes. Wynnum and Manly are part of our regular service area, alongside the Redlands suburbs."],
      ["Can you mow a small Wynnum backyard with tight side access?", "Yes. We regularly mow small and narrow-access yards and carry equipment through side gates where needed."],
      ["What time can you mow in Wynnum?", "Queensland's rules apply: 7am–7pm Monday to Saturday and 8am–7pm on Sundays and public holidays."],
    ],
  },
  {
    slug: "thornlands", name: "Thornlands", volume: 10, council: "Redland City Council",
    nearby: ["Cleveland", "Victoria Point", "Redland Bay", "Capalaba"],
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
    slug: "birkdale", name: "Birkdale", volume: 10, council: "Redland City Council",
    nearby: ["Wellington Point", "Thorneside", "Capalaba"],
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
  {
    slug: "manly", name: "Manly", volume: 10, council: "Brisbane City Council",
    nearby: ["Wynnum", "Thorneside", "Birkdale"],
    description: "Lawn mowing Manly QLD: regular or one-off mows for hillside and bayside homes, with edging, whipper snipping and green waste removal. Free quotes.",
    lead: "Lawn mowing for Manly's bayside and hillside homes, with careful whipper snipping on slopes and embankments.",
    heroImg: "striped-lawn-mowing-wellington-point", heroAlt: "Freshly striped lawn — lawn mowing for Manly QLD homes",
    intro: `Golden Cane Lawns provides professional <strong>lawn mowing Manly</strong> homeowners rely on, from the streets near the boat harbour to the hillside homes looking out over Moreton Bay. We're a family-run, independent business based in Wellington Point with over ten years of hands-on experience. Every mow includes edging, whipper snipping, blow-down and green waste removal, and we're ABN registered and fully insured.`,
    localTitle: "Slopes, views and character homes in Manly",
    local: `<p>Manly is one of the prettiest corners of the bayside, and many of its streets climb up from the waterfront. Sloping blocks, retaining walls and embankments are common, and they're where a lot of the work is: steep banks are often safer and neater with careful whipper snipping than with a mower, and the edges along steps and walls need a steady hand.</p>
<p>Like Wynnum, Manly is in the Brisbane City Council area, and we include it in our regular rounds alongside the Redlands suburbs just across Tingalpa Creek.</p>`,
    extraImg: ["privacy-hedge-trimming-ormiston", "Tall privacy hedge trimmed square"],
    ba: null,
    faqs: [
      ["Can you mow steep or sloping lawns in Manly?", "Yes. We mow sloping lawns and use whipper snippers on banks that are too steep to mow safely. Mention steep areas in the quote form notes."],
      ["Do you service Manly regularly?", "Yes. Manly and Wynnum are part of our regular service area, alongside Thorneside and Birkdale."],
      ["Do you do hedges and weed spraying in Manly too?", "Yes. All our services are available in Manly: lawn mowing, hedge trimming, weed spraying, whipper snipping and garden maintenance."],
    ],
  },
];

export const suburbPath = name => {
  const p = SUBURB_PAGES.find(s => s.name === name);
  return p ? `/lawn-mowing-${p.slug}` : null;
};
