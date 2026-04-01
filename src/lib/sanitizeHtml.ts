import sanitize from 'sanitize-html'

const WP_ORIGIN = 'https://mitchellnchistory.org'

/** Normalize relative/protocol-relative WordPress URLs to absolute */
function normalizeWpUrl(url: string): string {
  if (url.startsWith('//mitchellnchistory.org')) {
    return `https:${url}`
  }
  if (url.startsWith('../wp-content/') || url.startsWith('/wp-content/')) {
    return `${WP_ORIGIN}${url.replace(/^\.\./, '')}`
  }
  return url
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
          attribs.href = normalizeWpUrl(attribs.href)
        }
        return { tagName, attribs }
      },
      img: (tagName, attribs) => {
        if (attribs.src) {
          attribs.src = normalizeWpUrl(attribs.src)
        }
        return { tagName, attribs }
      },
    },
  })
}
