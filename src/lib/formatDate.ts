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
