import { test, expect, type APIRequestContext } from '@playwright/test'
import postsData from '../../src/data/articles/posts.json'

/**
 * Broader asset audit.
 *
 * The base smoke suite checks a handful of layout-critical files (favicon,
 * site.webmanifest, the hero). This file goes wider:
 *  - Every layout-critical icon variant
 *  - A deterministic random sample of 20 article featured images (drawn
 *    from the same kind of seed the article-sampling spec uses)
 *  - Hero / page-specific images that the home page and major pages depend on
 *
 * Why sample instead of checking all 322: 322 sequential HEAD requests would
 * dominate the smoke runtime. 20 samples give us coverage breadth without
 * the time cost; over many runs every image gets exercised.
 */

interface Post {
  slug: string
  featuredImage: { url: string; alt: string } | null
}

const posts = postsData as Post[]
const FEATURED_SAMPLE_SIZE = 20

function mulberry32Shuffle<T>(arr: T[], seed: number): T[] {
  let s = seed >>> 0 || 1
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296
    const j = Math.floor(r * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Stable across worker processes — see article-sampling.spec.ts for rationale.
const seedStr = process.env.GITHUB_RUN_NUMBER || process.env.SMOKE_SEED
const seed = seedStr
  ? Number(seedStr)
  : parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''), 10)

const featuredImageUrls = posts
  .map((p) => p.featuredImage?.url)
  .filter((u): u is string => !!u && u.startsWith('/'))

const sampledFeatured = mulberry32Shuffle(featuredImageUrls, seed).slice(0, FEATURED_SAMPLE_SIZE)

const LAYOUT_ICONS = [
  '/favicon.ico',
  '/icon.png',
  '/apple-icon.png',
  '/site.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
]

const HERO_AND_PAGE_IMAGES = [
  '/Images/mchs-hero.webp',
  // Logos / branding (these come back as 200 if shipped, 404 if a typo)
  '/Images/mchs-logo.png',
]

async function checkAssetUrls(request: APIRequestContext, urls: string[]) {
  const results = await Promise.all(
    urls.map(async (url) => {
      const res = await request.head(url, { failOnStatusCode: false })
      return { url, status: res.status() }
    })
  )
  const failures = results.filter((r) => r.status !== 200)
  return { results, failures }
}

test.describe('Asset audit', () => {
  test('layout-critical icons + SEO files all return 200', async ({ request }) => {
    const { failures } = await checkAssetUrls(request, LAYOUT_ICONS)
    expect(
      failures,
      `Layout-critical asset failures:\n${failures.map((f) => `  ${f.status} ${f.url}`).join('\n')}`
    ).toHaveLength(0)
  })

  test('hero + page-level images return 200', async ({ request }) => {
    const { results, failures } = await checkAssetUrls(request, HERO_AND_PAGE_IMAGES)
    // Logo is best-effort — warn instead of fail if it's missing
    const heroFailure = failures.find((f) => f.url === '/Images/mchs-hero.webp')
    expect(heroFailure, `Hero image missing: ${JSON.stringify(heroFailure)}`).toBeFalsy()
    const other = failures.filter((f) => f.url !== '/Images/mchs-hero.webp')
    if (other.length > 0) {
      test.info().annotations.push({
        type: 'warning',
        description: `Non-critical page images missing: ${other.map((f) => f.url).join(', ')}`,
      })
    }
    // Log the all-OK image set for debugability
    test.info().attach('hero-image-check.json', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    })
  })

  test(`featured-image sample (seed=${seed}, n=${FEATURED_SAMPLE_SIZE}) all return 200`, async ({
    request,
  }) => {
    const { results, failures } = await checkAssetUrls(request, sampledFeatured)
    test.info().attach('featured-image-check.json', {
      body: JSON.stringify({ seed, sampleSize: FEATURED_SAMPLE_SIZE, results }, null, 2),
      contentType: 'application/json',
    })
    expect(
      failures,
      `Featured-image failures (seed=${seed}):\n${failures.map((f) => `  ${f.status} ${f.url}`).join('\n')}`
    ).toHaveLength(0)
  })
})
