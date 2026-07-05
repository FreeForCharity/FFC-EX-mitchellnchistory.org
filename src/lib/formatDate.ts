/**
 * Format a date string for display, treating the date portion as UTC
 * to avoid timezone-dependent day shifts across build environments.
 */
export function formatDate(dateStr: string): string {
  const datePart = dateStr.split('T')[0]
  const [yearStr, monthStr, dayStr] = datePart.split('-')

  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return dateStr
  }

  const utcDate = new Date(Date.UTC(year, month - 1, day))

  return utcDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Parse a full date-time string as UTC, preserving the time portion.
 * WordPress-migrated dates ("2022-04-23T16:47:46") carry no timezone
 * marker, and bare `new Date(...)` would interpret them in the build
 * machine's local zone — pin them to UTC instead so output is stable
 * across build environments. Used for RSS pubDate and same-day ordering.
 */
export function parseUTCDateTime(dateStr: string): Date {
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(dateStr)
  const parsed = new Date(hasTimezone ? dateStr : `${dateStr}Z`)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed
  }
  return parseUTCDate(dateStr)
}

/**
 * Parse a date string as UTC, returning a Date object.
 * Useful for sitemap lastModified and other machine-readable contexts.
 */
export function parseUTCDate(dateStr: string): Date {
  const datePart = dateStr.split('T')[0]
  const [yearStr, monthStr, dayStr] = datePart.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return new Date(dateStr)
  }

  return new Date(Date.UTC(year, month - 1, day))
}
