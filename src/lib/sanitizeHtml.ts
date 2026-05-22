import sanitize from 'sanitize-html'
import { assetPath } from '@/lib/assetPath'

// Anchored on the character right after the hostname (`/`, `:`, `?`, `#`, or
// end-of-string) so look-alikes like `mitchellnchistory.org.evil.com` cannot
// match. Defense in depth — every consumer also re-checks the post-strip path.
const WP_ORIGIN_RE = /^https?:\/\/mitchellnchistory\.org(?=\/|:|\?|#|$)/i

/** Known tracking pixel hostnames to strip */
const TRACKING_PIXEL_HOSTS = ['www.paypal.com']

/**
 * Hosts allowed for cross-origin <source> elements (video/audio/picture).
 * Mirrors allowedIframeHostnames below — sanitize-html does not apply that
 * allowlist to <source>, so we enforce it ourselves.
 */
const SOURCE_ALLOWED_HOSTS = new Set(['www.youtube.com', 'youtube.com', 'anchor.fm'])

/**
 * Rewrite any reference to a WordPress-hosted asset under /wp-content/ to a
 * repo-relative path so it resolves against the static export instead of the
 * legacy WP host. Handles absolute (http/https), protocol-relative, dot-prefixed,
 * and already-relative variants. Applies assetPath() so the GitHub-Pages
 * subpath build also works.
 */
function localizeWpUrl(url: string): string {
  if (!url) return url
  let path = url
  if (path.startsWith('//mitchellnchistory.org')) {
    path = path.slice('//mitchellnchistory.org'.length) || '/'
  } else if (WP_ORIGIN_RE.test(path)) {
    path = path.replace(WP_ORIGIN_RE, '')
  } else if (path.startsWith('../wp-content/')) {
    path = path.slice(2)
  }
  if (path.startsWith('/wp-content/')) {
    return assetPath(path)
  }
  return url
}

/** Localize every URL in a srcset value, preserving the descriptors. */
function localizeSrcset(srcset: string): string {
  return srcset
    .split(',')
    .map((entry) => {
      const trimmed = entry.trim()
      if (!trimmed) return ''
      const space = trimmed.search(/\s/)
      if (space === -1) return localizeWpUrl(trimmed)
      const url = trimmed.slice(0, space)
      const descriptor = trimmed.slice(space)
      return `${localizeWpUrl(url)}${descriptor}`
    })
    .filter(Boolean)
    .join(', ')
}

/** Upgrade protocol-relative WordPress URLs in <a> hrefs to absolute https. */
function normalizeWpHref(href: string): string {
  if (href.startsWith('//mitchellnchistory.org/') || href === '//mitchellnchistory.org') {
    return `https:${href}`
  }
  return href
}

/** Check if a URL is a known tracking pixel */
function isTrackingPixel(src: string): boolean {
  try {
    const url = new URL(src, 'https://mitchellnchistory.org')
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
          // Run localization first so /wp-content/uploads/*.pdf|docx download
          // links resolve to the self-hosted copy after the cutover. Falls
          // through to https-upgrade + permalink rewrite for non-asset hrefs.
          const localized = localizeWpUrl(attribs.href)
          attribs.href = localized.startsWith('/wp-content/')
            ? localized
            : rewriteWpPermalink(normalizeWpHref(localized))
        }
        return { tagName, attribs }
      },
      img: (tagName, attribs) => {
        if (attribs.src && isTrackingPixel(attribs.src)) {
          return { tagName: '', attribs: {} }
        }
        if (attribs.src) {
          attribs.src = localizeWpUrl(attribs.src)
        }
        if (attribs.srcset) {
          attribs.srcset = localizeSrcset(attribs.srcset)
        }
        return { tagName, attribs }
      },
      source: (tagName, attribs) => {
        if (!attribs.src) return { tagName, attribs }
        const localized = localizeWpUrl(attribs.src)
        if (localized.startsWith('/wp-content/') || localized.startsWith('/')) {
          attribs.src = localized
          return { tagName, attribs }
        }
        // Cross-origin <source> on <video>/<audio>/<picture> must come from the
        // same allowlist as iframes — sanitize-html's allowedIframeHostnames
        // does not cover <source>, so drop unrecognized hosts.
        try {
          const host = new URL(localized).hostname.toLowerCase()
          if (SOURCE_ALLOWED_HOSTS.has(host)) {
            attribs.src = localized
            return { tagName, attribs }
          }
        } catch {
          /* fall through to strip */
        }
        return { tagName: '', attribs: {} }
      },
    },
  })
}
