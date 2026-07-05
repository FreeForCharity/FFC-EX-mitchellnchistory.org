import { formatDate, parseUTCDate, parseUTCDateTime } from '@/lib/formatDate'

describe('formatDate', () => {
  it('formats a standard date string', () => {
    expect(formatDate('2024-03-15')).toBe('March 15, 2024')
  })

  it('formats a date with time portion', () => {
    expect(formatDate('2024-03-15T14:30:00')).toBe('March 15, 2024')
  })

  it('returns the original string for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })

  it('handles single-digit month and day', () => {
    expect(formatDate('2024-01-05')).toBe('January 5, 2024')
  })

  it('handles December 31 without shifting to next year', () => {
    expect(formatDate('2024-12-31T23:59:59')).toBe('December 31, 2024')
  })

  it('handles January 1 without shifting to previous year', () => {
    expect(formatDate('2024-01-01T00:00:00')).toBe('January 1, 2024')
  })
})

describe('parseUTCDate', () => {
  it('returns a Date object for a valid date string', () => {
    const result = parseUTCDate('2024-03-15')
    expect(result).toBeInstanceOf(Date)
    expect(result.getUTCFullYear()).toBe(2024)
    expect(result.getUTCMonth()).toBe(2) // March = 2
    expect(result.getUTCDate()).toBe(15)
  })

  it('parses date with time portion as UTC', () => {
    const result = parseUTCDate('2024-12-31T23:59:59')
    expect(result.getUTCFullYear()).toBe(2024)
    expect(result.getUTCMonth()).toBe(11) // December = 11
    expect(result.getUTCDate()).toBe(31)
  })

  it('falls back to Date constructor for invalid format', () => {
    const result = parseUTCDate('not-a-date')
    expect(result).toBeInstanceOf(Date)
    expect(isNaN(result.getTime())).toBe(true)
  })
})

describe('parseUTCDateTime', () => {
  it('preserves the time portion, pinned to UTC', () => {
    const result = parseUTCDateTime('2022-04-23T16:47:46')
    expect(result.toISOString()).toBe('2022-04-23T16:47:46.000Z')
  })

  it('respects an explicit timezone offset', () => {
    const result = parseUTCDateTime('2022-04-23T16:47:46-05:00')
    expect(result.toISOString()).toBe('2022-04-23T21:47:46.000Z')
  })

  it('recognizes hour-only offsets, compact offsets, and lowercase z', () => {
    expect(parseUTCDateTime('2022-04-23T16:47:46+05').toISOString()).toBe(
      '2022-04-23T11:47:46.000Z'
    )
    expect(parseUTCDateTime('2022-04-23T16:47:46+0500').toISOString()).toBe(
      '2022-04-23T11:47:46.000Z'
    )
    expect(parseUTCDateTime('2022-04-23T16:47:46z').toISOString()).toBe('2022-04-23T16:47:46.000Z')
  })

  it('handles a bare date as midnight UTC', () => {
    const result = parseUTCDateTime('2024-03-15')
    expect(result.toISOString()).toBe('2024-03-15T00:00:00.000Z')
  })

  it('orders same-day timestamps correctly', () => {
    const morning = parseUTCDateTime('2020-04-01T08:00:00')
    const evening = parseUTCDateTime('2020-04-01T20:00:00')
    expect(evening.getTime()).toBeGreaterThan(morning.getTime())
  })
})
