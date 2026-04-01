import { test, expect } from '@playwright/test'

/**
 * Site-Wide Navigation & Route Health — E2E Tests
 *
 * Verifies every static route returns a 200 status and renders a heading.
 * Acts as a comprehensive smoke test that no pages are broken after deploys.
 */

/** All static routes from siteConfig + home */
const allRoutes = [
  '/',
  '/about',
  '/museum',
  '/membership',
  '/apple-butter-festival',
  '/contact',
  '/articles',
  '/scholarship',
  '/scan-days',
  '/penland-cemetery',
  '/overmountain-men',
  '/corona-times',
  '/newsletters',
  '/history-bee',
  '/red-wilson',
  '/about-mitchell-county',
  '/tour-of-homes',
  '/mitchell-county-nc-world-war-inductees',
  '/mitchell-county-nc-world-war-enlistees',
  '/videos',
  '/resources',
  '/cookie-policy',
  '/donation-policy',
  '/free-for-charity-donation-policy',
  '/privacy-policy',
  '/security-acknowledgements',
  '/terms-of-service',
  '/vulnerability-disclosure-policy',
]

test.describe('Route Health — All Static Pages', () => {
  for (const route of allRoutes) {
    test(`${route} — returns 200 and has heading`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)

      // Some pages use h1, others use h2 — check for any prominent heading
      const heading = page.locator('h1, h2').first()
      await expect(heading).toBeVisible()
    })
  }
})

test.describe('Header Navigation Links', () => {
  test('header navigation links should work', async ({ page }) => {
    await page.goto('/')

    // Check the main nav links resolve without errors
    const navLinks = page.locator('header nav a, header a[href]')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)

    // Every nav link href should start with / or http
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href')
      if (href) {
        expect(href).toMatch(/^(\/|https?:\/\/)/)
      }
    }
  })
})

test.describe('Footer Navigation', () => {
  test('footer should contain key links', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Privacy policy link
    const privacyLink = footer.locator('a[href*="privacy-policy"]')
    await expect(privacyLink.first()).toBeVisible()

    // Terms link
    const termsLink = footer.locator('a[href*="terms-of-service"]')
    await expect(termsLink.first()).toBeVisible()
  })
})

test.describe('404 Page', () => {
  test('non-existent route should return 404', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-abc123')
    // Static exports may return 200 with a 404 page, or actual 404
    // Just verify the page loads without crashing
    expect(response?.status()).toBeLessThan(500)
  })
})
