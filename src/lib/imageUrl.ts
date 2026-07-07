import { assetPath } from '@/lib/assetPath'
import { siteUrl } from '@/lib/siteConfig'

/**
 * Return a fully-qualified https URL for an image, suitable for og:image,
 * twitter:image, JSON-LD `image`, and any other context that requires an
 * absolute URL.
 *
 * Handles every shape a stored URL can take:
 *   - already absolute https://... -> returned as-is
 *   - absolute http://...          -> upgraded to https:// (mixed-content safe)
 *   - protocol-relative //host/... -> prefixed with https:
 *   - repo-relative /path          -> prefixed with siteUrl
 *
 * Does NOT apply basePath — for the production apex build basePath is empty,
 * and OG/JSON-LD URLs are crawled by external clients that always hit the
 * apex regardless of subpath. Use `localImageSrc` for in-page <img src>.
 */
export function absoluteImageUrl(url: string): string {
  if (!url) return url
  if (url.startsWith('https://')) return url
  if (url.startsWith('http://')) return 'https://' + url.slice('http://'.length)
  if (url.startsWith('//')) return 'https:' + url
  return `${siteUrl}${url.startsWith('/') ? url : '/' + url}`
}

/**
 * Return a path suitable for an in-page <img src>, accounting for the
 * GitHub-Pages subpath via assetPath(). External absolute URLs (http/https
 * or //) are upgraded to https but otherwise passed through.
 */
export function localImageSrc(url: string): string {
  if (!url) return url
  if (url.startsWith('https://')) return url
  if (url.startsWith('http://')) return 'https://' + url.slice('http://'.length)
  if (url.startsWith('//')) return 'https:' + url
  return assetPath(url.startsWith('/') ? url : '/' + url)
}

/**
 * Return a small WebP thumbnail path for a local `/wp-content` featured
 * image, for the articles-hub grid where the full-resolution original is
 * wasteful. Thumbnails are pre-generated at build time by
 * `scripts/generate-thumbnails.mjs` at a deterministic path — this helper
 * must produce the identical path. Non-`/wp-content` URLs (e.g. external
 * or already-processed) fall back to `localImageSrc`.
 */
export function thumbnailSrc(url: string): string {
  if (!url || !url.startsWith('/wp-content')) return localImageSrc(url)
  const thumb = '/thumbnails' + url.replace(/\.(jpe?g|png|webp|gif)$/i, '.webp')
  return assetPath(thumb)
}
