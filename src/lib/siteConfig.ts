export const siteUrl = 'https://mitchellnchistory.org'

export const siteName = 'Mitchell County Historical Society'

export const siteDescription =
  'Stories of the people, places, history, and heritage of Mitchell County, North Carolina.'

/**
 * Default social-share (OpenGraph/Twitter/JSON-LD) image. Single source of
 * truth — referenced by the root layout, article metadata fallback, and
 * Article JSON-LD. Swap the asset and update here when rebranding.
 */
export const defaultOgImage = {
  url: '/Images/og-default.jpg',
  width: 1200,
  height: 630,
  alt: 'Mitchell County Historical Society',
} as const

export const sitemapRoutes = [
  '/',
  '/about/',
  '/museum/',
  '/membership/',
  '/events/',
  '/programs/',
  '/apple-butter-festival/',
  '/contact/',
  '/articles/',
  '/scholarship/',
  '/scan-days/',
  '/penland-cemetery/',
  '/overmountain-men/',
  '/newsletters/',
  '/history-bee/',
  '/red-wilson/',
  '/six-women-six-voices/',
  '/mitchell-county-nc-world-war-inductees/',
  '/mitchell-county-nc-world-war-enlistees/',
  '/videos/',
  '/resources/',
  '/cookie-policy/',
  '/donation-policy/',
  '/free-for-charity-donation-policy/',
  '/privacy-policy/',
  '/security-acknowledgements/',
  '/terms-of-service/',
  '/vulnerability-disclosure-policy/',
] as const
