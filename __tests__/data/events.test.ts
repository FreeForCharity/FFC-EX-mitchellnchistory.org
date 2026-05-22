import { events, getEventsByNextOccurrence, getFeaturedEvent } from '../../src/data/events'

describe('events data', () => {
  it('uses unique slugs for every event', () => {
    const slugs = events.map((e) => e.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('uses valid month/day pairs', () => {
    for (const event of events) {
      expect(event.month).toBeGreaterThanOrEqual(1)
      expect(event.month).toBeLessThanOrEqual(12)
      expect(event.day).toBeGreaterThanOrEqual(1)
      expect(event.day).toBeLessThanOrEqual(31)
    }
  })
})

describe('getEventsByNextOccurrence', () => {
  it('sorts events with the nearest upcoming first', () => {
    const may22 = new Date('2026-05-22T12:00:00Z')
    const sorted = getEventsByNextOccurrence(may22)

    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].nextDate.getTime()).toBeGreaterThanOrEqual(sorted[i - 1].nextDate.getTime())
    }
  })

  it('treats an event scheduled for today as upcoming, not as a year away', () => {
    // June 20 is the Rhododendron Festival. On June 20 itself, it should still
    // appear at the top of the list (this year, not next).
    const onTheDay = new Date('2026-06-20T18:00:00Z')
    const [first] = getEventsByNextOccurrence(onTheDay)

    expect(first.slug).toBe('rhododendron-festival')
    expect(first.nextDate.getUTCFullYear()).toBe(2026)
  })

  it('rolls events past their date forward to the next year', () => {
    // The day after Rhododendron Festival, it should no longer be the nearest
    // event and should be scheduled for the following year.
    const dayAfter = new Date('2026-06-21T00:00:00Z')
    const sorted = getEventsByNextOccurrence(dayAfter)
    const rhododendron = sorted.find((e) => e.slug === 'rhododendron-festival')

    expect(rhododendron).toBeDefined()
    expect(rhododendron!.nextDate.getUTCFullYear()).toBe(2027)
  })

  it('handles the December-to-January boundary', () => {
    // After the Christmas parade, the next-soonest event should be in the
    // following calendar year.
    const lateDecember = new Date('2026-12-15T00:00:00Z')
    const [first] = getEventsByNextOccurrence(lateDecember)

    expect(first.nextDate.getUTCFullYear()).toBe(2027)
  })
})

describe('getFeaturedEvent', () => {
  it('returns the first event from the sorted list', () => {
    const now = new Date('2026-05-22T12:00:00Z')
    expect(getFeaturedEvent(now).slug).toBe(getEventsByNextOccurrence(now)[0].slug)
  })
})
