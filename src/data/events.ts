export type Event = {
  slug: string
  name: string
  /** Approximate month (1-12) the event recurs each year. */
  month: number
  /** Approximate day of month for the event (used to rank "nearest"). */
  day: number
  /** Human-readable date description shown on the page. */
  dateLabel: string
  /** Short blurb for cards and previews. */
  summary: string
  /** Town or venue. */
  location: string
  /** Optional internal page link if MCHS hosts a detail page for the event. */
  href?: string
  /** Optional external organizer URL. */
  externalHref?: string
  /** Optional hero image path (relative, use with assetPath). */
  image?: string
  /** True when MCHS organizes or co-hosts the event. */
  hostedByMchs?: boolean
}

export const events: Event[] = [
  {
    slug: 'rhododendron-festival',
    name: 'NC Rhododendron Festival',
    month: 6,
    day: 20,
    dateLabel: 'Third weekend of June',
    summary:
      "Bakersville's signature summer celebration, honoring the spectacular bloom of Catawba rhododendrons on nearby Roan Mountain. The festival features a parade, live music, arts and crafts vendors, a 10K road race, food, and the crowning of the festival queen.",
    location: 'Downtown Bakersville',
    externalHref: 'https://www.ncrhododendronfestival.org/',
    image: '/Images/event-rhododendron-festival.jpg',
  },
  {
    slug: 'mineral-and-gem-festival',
    name: 'NC Mineral & Gem Festival',
    month: 8,
    day: 1,
    dateLabel: 'Early August (4 days)',
    summary:
      'A long-running celebration of the mineral wealth of the Spruce Pine Mining District, featuring vendors selling gems, minerals, jewelry, beads, and fossils alongside demonstrations and family activities.',
    location: 'Spruce Pine',
    externalHref: 'https://ncgemfest.com/',
    image: '/Images/event-mineral-gem-festival.jpg',
  },
  {
    slug: 'toe-river-studio-tour',
    name: 'Toe River Studio Tour',
    month: 6,
    day: 1,
    dateLabel: 'First weekends of June and December',
    summary:
      'A self-guided driving tour through Mitchell and Yancey counties where visitors meet working artists in their studios. One of the most respected studio tours in the Southeast.',
    location: 'Mitchell & Yancey counties',
    externalHref: 'https://toeriverarts.org/studio-tour/',
    image: '/Images/event-toe-river-studio-tour.jpg',
  },
  {
    slug: 'penland-annual-benefit-auction',
    name: 'Penland Annual Benefit Auction',
    month: 8,
    day: 15,
    dateLabel: 'Mid-August',
    summary:
      'Penland School of Craft hosts its annual benefit auction featuring hundreds of works by leading contemporary craft artists. The event supports scholarships and programs at this internationally known craft school.',
    location: 'Penland School of Craft',
    externalHref: 'https://penland.org/the-auction/',
    image: '/Images/event-penland-auction.jpg',
  },
  {
    slug: 'apple-butter-festival',
    name: 'Apple Butter Festival',
    month: 10,
    day: 11,
    dateLabel: 'Second Saturday of October',
    summary:
      'MCHS hosts this beloved fall tradition along the Bakersville Creekwalk. Watch apple butter cooked over an open fire, enjoy live mountain music, browse arts and crafts vendors, and take part in our Chili & Cornbread Cookoff.',
    location: 'Bakersville Creekwalk',
    href: '/apple-butter-festival/',
    image: '/Images/mchs-festival.webp',
    hostedByMchs: true,
  },
  {
    slug: 'bakersville-christmas-parade',
    name: 'Bakersville Christmas Parade',
    month: 12,
    day: 6,
    dateLabel: 'Early December',
    summary:
      'The holiday season opens with a small-town Christmas parade through downtown Bakersville, complete with floats, fire trucks, music, and a visit from Santa.',
    location: 'Downtown Bakersville',
    image: '/Images/event-bakersville-christmas-parade.jpg',
  },
]

/**
 * One-time historical programs MCHS has hosted. Surfaced from the legacy
 * SiteGround WordPress My Calendar (`mc-events`) post type, filtered to
 * entries with real content (the bulk of `mc-events` were placeholder
 * titles whose detail lived in the plugin's custom tables). Annual
 * recurring festivals appear in `events` above instead.
 */
export type PastEvent = {
  /** ISO date (YYYY-MM-DD) — used for sort + display. */
  date: string
  name: string
  /** Short summary shown on the /events/ page. */
  summary: string
  /** Town or venue. */
  location: string
  /** Optional MCHS detail page (e.g. /red-wilson/). */
  href?: string
}

export const pastEvents: PastEvent[] = [
  {
    date: '2023-03-19',
    name: "A Tribute to Fiddlin' Red Wilson",
    summary:
      'A concert tribute to the late Red Wilson, longtime Mitchell County fiddler whose music and broadcasts on WTOE shaped local Old-Time tradition.',
    location: 'Mitchell County',
    href: '/red-wilson/',
  },
  {
    date: '2019-11-11',
    name: 'Veterans Day Celebration',
    summary:
      'MCHS hosted a Veterans Day program at the Mitchell County Senior Center in Ledger, honoring local veterans with stories, music, and a meal.',
    location: 'Mitchell County Senior Center, Ledger',
  },
  {
    date: '2017-03-30',
    name: 'A Sunday Afternoon of Old-Time, Mountain-Style Gospel Songs',
    summary:
      'Samuel McKinney and Rhonda Gouge presented an afternoon of traditional mountain-style gospel music as part of the MCHS program series.',
    location: 'Mitchell County',
  },
  {
    date: '2017-01-21',
    name: 'Scan Day in Spruce Pine',
    summary:
      'MCHS hosted a Scan Day inviting community members to bring historical photographs and documents for digital scanning, so they could be preserved as part of the public record while originals stayed with their families.',
    location: 'Spruce Pine',
  },
  {
    date: '2017-01-21',
    name: 'Scan Day in Bakersville',
    summary:
      'Companion Scan Day to the Spruce Pine event — the same offer of free digital scanning of community-held historical photos and documents, held in Bakersville for residents on that side of the county.',
    location: 'Bakersville',
  },
]

/** Returns past events sorted newest-first. */
export function getPastEventsByDate(): PastEvent[] {
  return [...pastEvents].sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Returns events sorted by their next upcoming occurrence relative to `now`.
 * Each event recurs annually, so an event whose month/day has already passed
 * rolls forward to the same date next year.
 *
 * Comparison is done at UTC-day granularity so that an event scheduled for
 * "today" stays featured all day rather than rolling to next year as soon
 * as UTC midnight passes (which is mid-evening in US Eastern time).
 *
 * On a static export, `now` is the build timestamp, not the visitor's clock.
 */
export function getEventsByNextOccurrence(
  now: Date = new Date()
): Array<Event & { nextDate: Date }> {
  const startOfToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const year = now.getUTCFullYear()
  return events
    .map((event) => {
      let nextDate = new Date(Date.UTC(year, event.month - 1, event.day))
      if (nextDate.getTime() < startOfToday) {
        nextDate = new Date(Date.UTC(year + 1, event.month - 1, event.day))
      }
      return { ...event, nextDate }
    })
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
}

/** Returns the single event nearest to `now`. */
export function getFeaturedEvent(now: Date = new Date()): Event & { nextDate: Date } {
  return getEventsByNextOccurrence(now)[0]
}
