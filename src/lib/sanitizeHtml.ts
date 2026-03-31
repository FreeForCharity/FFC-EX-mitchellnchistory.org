/**
 * Sanitize HTML from WordPress content to prevent XSS.
 * Strips script tags, event-handler attributes, and javascript: URLs.
 */
export function sanitizeHtml(html: string): string {
  return (
    html
      // Remove <script> tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove event-handler attributes (on*)
      .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
      // Remove javascript: URLs in href/src attributes
      .replace(/(href|src)\s*=\s*["']?\s*javascript\s*:[^"'>]*/gi, '$1=""')
  )
}
