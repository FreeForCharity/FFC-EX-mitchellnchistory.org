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
  // ISO-8601 allows hour-only offsets (+05) but V8's Date does not parse
  // them — expand to +05:00 first. The test requires a time portion so the
  // trailing "-15" of a bare date like 2024-03-15 is not mistaken for one.
  const normalized = /T[\d:.]+[+-]\d{2}$/.test(dateStr) ? `${dateStr}:00` : dateStr
  // Accepts Z/z and offsets in ±hh:mm / ±hhmm form
  const hasTimezone = /(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(normalized)
  const parsed = new Date(hasTimezone ? normalized : `${normalized}Z`)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed
  }
  return parseUTCDate(dateStr)
}

/**
 * Date-only UTC fallback used when full-timestamp parsing fails. Prefer
 * parseUTCDateTime for all machine-readable contexts — it preserves the
 * time portion and delegates here only for malformed inputs.
 */
function parseUTCDate(dateStr: string): Date {
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
