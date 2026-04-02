import { formatDate, parseUTCDate } from '@/lib/formatDate'

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
