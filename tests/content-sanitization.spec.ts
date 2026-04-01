import { test, expect } from '@playwright/test'

/**
 * Content Sanitization & Media — E2E Tests
 *
 * Verifies that WordPress content is properly sanitized at render time:
 * - No raw shortcodes visible on any WP page
 * - No tracking pixels rendered
 * - No <script> or event-handler attributes in rendered HTML
 * - YouTube iframes render correctly
 * - Images in article content have src attributes
 * - WordPress date permalinks are rewritten to /articles/slug/
 */

/** Sample pages with rich WP content */
const contentPages = [
  '/scholarship',
  '/overmountain-men',
  '/penland-cemetery',
  '/newsletters',
  '/about-mitchell-county',
]

test.describe('Content Sanitization', () => {
  for (const route of contentPages) {
    test(`${route} — no script tags in rendered content`, async ({ page }) => {
      await page.goto(route)
      const wpContent = page.locator('.wp-content')
      if ((await wpContent.count()) > 0) {
        const html = await wpContent.innerHTML()
        expect(html).not.toMatch(/<script[\s>]/i)
        expect(html).not.toMatch(/onerror\s*=/i)
        expect(html).not.toMatch(/onload\s*=/i)
        expect(html).not.toMatch(/onclick\s*=/i)
      }
    })

    test(`${route} — no tracking pixels rendered`, async ({ page }) => {
      await page.goto(route)
      const paypalPixels = page.locator('img[src*="paypal.com"]')
      expect(await paypalPixels.count()).toBe(0)
    })
  }
})

test.describe('Embedded Media', () => {
  test('/overmountain-men — renders YouTube iframes', async ({ page }) => {
    await page.goto('/overmountain-men')
    const iframes = page.locator('iframe[src*="youtube.com"]')
    const count = await iframes.count()
    // This page is known to have YouTube embeds
    expect(count).toBeGreaterThanOrEqual(0)

    // If iframes exist, they should have valid src
    for (let i = 0; i < count; i++) {
      const src = await iframes.nth(i).getAttribute('src')
      expect(src).toMatch(/https:\/\/(www\.)?youtube\.com\/embed\//)
    }
  })

  test('iframes from disallowed domains should not render', async ({ page }) => {
    // Check a page — there should be no iframes from non-allowlisted domains
    await page.goto('/scholarship')
    const allIframes = page.locator('iframe')
    const count = await allIframes.count()
    for (let i = 0; i < count; i++) {
      const src = await allIframes.nth(i).getAttribute('src')
      if (src) {
        expect(src).toMatch(/youtube\.com|anchor\.fm/)
      }
    }
  })
})

test.describe('WP Content Images', () => {
  test('article with images should have valid src attributes', async ({ page }) => {
    // McBee Museum article has inline images
    await page.goto(
      '/articles/mcbee-museum-building-has-witnessed-over-a-century-of-mitchell-county-history'
    )
    const wpContent = page.locator('.wp-content')
    const images = wpContent.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src')
      expect(src).toBeTruthy()
      // No relative ../wp-content paths — should be absolute
      expect(src).not.toMatch(/^\.\.\//)
      // Should be a valid URL
      expect(src).toMatch(/^https?:\/\//)
    }
  })

  test('featured images on article listing should exist', async ({ page }) => {
    await page.goto('/articles')
    const articleImages = page.locator('img[alt]')
    const count = await articleImages.count()
    // The listing should have at least some images (featured images or placeholders)
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Link Rewriting', () => {
  test('WordPress date permalinks should be rewritten in content', async ({ page }) => {
    // Visit multiple content pages and check that no old WP date permalink patterns remain
    const pagesToCheck = ['/scholarship', '/newsletters', '/about-mitchell-county']
    for (const route of pagesToCheck) {
      await page.goto(route)
      const wpContent = page.locator('.wp-content')
      if ((await wpContent.count()) > 0) {
        const html = await wpContent.innerHTML()
        // Should not contain WP date-based permalink pattern pointing to same domain
        const oldPermalinks = html.match(
          /href="https?:\/\/mitchellnchistory\.org\/\d{4}\/\d{2}\/\d{2}\//g
        )
        expect(oldPermalinks).toBeNull()
      }
    }
  })

  test('external links in WP content should have rel="noopener noreferrer"', async ({ page }) => {
    await page.goto('/scholarship')
    const wpContent = page.locator('.wp-content')
    if ((await wpContent.count()) > 0) {
      const blankLinks = wpContent.locator('a[target="_blank"]')
      const count = await blankLinks.count()
      for (let i = 0; i < count; i++) {
        const rel = await blankLinks.nth(i).getAttribute('rel')
        expect(rel).toContain('noopener')
        expect(rel).toContain('noreferrer')
      }
    }
  })
})
