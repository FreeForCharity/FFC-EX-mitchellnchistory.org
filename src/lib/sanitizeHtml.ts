import sanitize from 'sanitize-html'

const WP_ORIGIN = 'https://mitchellnchistory.org'

/** Known tracking pixel hostnames to strip */
const TRACKING_PIXEL_HOSTS = ['www.paypal.com']

/** Normalize relative/protocol-relative WordPress URLs to absolute */
function normalizeWpUrl(url: string): string {
  if (url.startsWith('//mitchellnchistory.org/') || url === '//mitchellnchistory.org') {
    return `https:${url}`
  }
  if (url.startsWith('../wp-content/') || url.startsWith('/wp-content/')) {
    return `${WP_ORIGIN}${url.replace(/^\.\./, '')}`
  }
  return url
}

/** Check if a URL is a known tracking pixel */
function isTrackingPixel(src: string): boolean {
  try {
    const url = new URL(src, WP_ORIGIN)
    return TRACKING_PIXEL_HOSTS.includes(url.hostname)
  } catch {
    return false
  }
}

/**
 * Rewrite old WordPress permalink URLs to new Next.js article routes.
 * Matches patterns like /YYYY/MM/DD/slug/ → /articles/slug/
 */
function rewriteWpPermalink(href: string): string {
  const wpPermalinkRe = /^(?:https?:\/\/mitchellnchistory\.org)?\/\d{4}\/\d{2}\/\d{2}\/([^/?#]+)\/?/
  const match = href.match(wpPermalinkRe)
  if (match) {
    return `/articles/${match[1]}/`
  }
  return href
}

/**
 * Sanitize HTML from WordPress content to prevent XSS.
 * Uses sanitize-html with an allowlist of safe tags and attributes.
 */
export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat([
      'img',
      'figure',
      'figcaption',
      'iframe',
      'video',
      'audio',
      'source',
      'h1',
      'h2',
    ]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height', 'loading', 'srcset', 'sizes'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      a: ['href', 'name', 'target', 'rel'],
      source: ['src', 'type'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'anchor.fm'],
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.target === '_blank') {
          attribs.rel = 'noopener noreferrer'
        }
        if (attribs.href) {
          attribs.href = rewriteWpPermalink(normalizeWpUrl(attribs.href))
        }
        return { tagName, attribs }
      },
      img: (tagName, attribs) => {
        if (attribs.src && isTrackingPixel(attribs.src)) {
          return { tagName: '', attribs: {} }
        }
        if (attribs.src) {
          attribs.src = normalizeWpUrl(attribs.src)
        }
        return { tagName, attribs }
      },
    },
  })
}
