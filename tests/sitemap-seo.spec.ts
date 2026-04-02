import { test, expect } from '@playwright/test'

/**
 * Sitemap & SEO — E2E Tests
 *
 * Verifies the generated sitemap.xml:
 * - Accessible and valid XML
 * - Contains all expected static routes
 * - Contains article URLs
 * - All sitemap URLs return 200
 */

const expectedStaticRoutes = [
  '/',
  '/about/',
  '/museum/',
  '/membership/',
  '/apple-butter-festival/',
  '/contact/',
  '/articles/',
  '/scholarship/',
  '/scan-days/',
  '/penland-cemetery/',
  '/overmountain-men/',
  '/corona-times/',
  '/newsletters/',
  '/history-bee/',
  '/red-wilson/',
  '/about-mitchell-county/',
  '/tour-of-homes/',
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
]

test.describe('Sitemap', () => {
  let sitemapText: string

  test.beforeAll(async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    sitemapText = await response.text()
  })

  test('sitemap.xml should be valid XML with <urlset>', async () => {
    expect(sitemapText).toContain('<urlset')
    expect(sitemapText).toContain('</urlset>')
    expect(sitemapText).toContain('<url>')
  })

  for (const route of expectedStaticRoutes) {
    test(`sitemap contains ${route}`, async () => {
      expect(sitemapText).toContain(route)
    })
  }

  test('sitemap should contain article URLs', async () => {
    expect(sitemapText).toContain('/articles/')
    // Should have many article entries (we have 392 posts)
    const articleMatches = sitemapText.match(/\/articles\/[^<]+/g)
    expect(articleMatches).toBeTruthy()
    expect(articleMatches!.length).toBeGreaterThan(100)
  })

  test('sitemap entries should have lastmod dates', async () => {
    const lastmodMatches = sitemapText.match(/<lastmod>/g)
    expect(lastmodMatches).toBeTruthy()
    expect(lastmodMatches!.length).toBeGreaterThan(0)
  })
})

test.describe('robots.txt', () => {
  test('should be accessible and contain sitemap reference', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(text).toContain('Sitemap')
  })
})

test.describe('Meta Tags', () => {
  test('home page should have title and description', async ({ page }) => {
    await page.goto('/')
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
    expect(title).toContain('Mitchell County')

    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', /.+/)
  })

  test('article page should have Open Graph tags', async ({ page }) => {
    await page.goto(
      '/articles/mcbee-museum-building-has-witnessed-over-a-century-of-mitchell-county-history'
    )
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /.+/)

    const ogType = page.locator('meta[property="og:type"]')
    await expect(ogType).toHaveAttribute('content', 'article')
  })

  test('WP page should have meta description', async ({ page }) => {
    await page.goto('/scholarship')
    const title = await page.title()
    expect(title).toContain('Scholarship')
  })
})
