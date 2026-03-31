/**
 * Sanitize HTML from WordPress content to prevent XSS.
 * Strips script tags, event-handler attributes, and javascript: URLs.
 * Uses loop-based removal to handle nested/obfuscated patterns.
 */
export function sanitizeHtml(html: string): string {
  let result = html
  let previous = ''

  // Loop until no more changes — handles nested or obfuscated patterns
  while (result !== previous) {
    previous = result
    // Remove <script> tags and their content (allows whitespace in closing tag)
    result = result.replace(/<script\b[^<]*(?:(?!<\/\s*script\s*>)<[^<]*)*<\/\s*script\s*>/gi, '')
    // Remove event-handler attributes (on*)
    result = result.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    // Remove javascript: URLs in href/src attributes
    result = result.replace(/(href|src)\s*=\s*["']?\s*javascript\s*:[^"'>]*/gi, '$1=""')
  }

  return result
}
