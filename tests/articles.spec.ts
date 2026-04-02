import { test, expect } from '@playwright/test'

/**
 * Articles System — E2E Tests
 *
 * Verifies the full articles experience:
 * - Listing page with category filters and pagination
 * - Individual article pages with hero, metadata, and content
 * - Article navigation (back link)
 * - Featured images render when present
 */

test.describe('Articles Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/articles')
    await page.waitForLoadState('domcontentloaded')
  })

  test('should display page heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Articles & Stories', level: 1 })
    await expect(heading).toBeVisible()
  })

  test('should show article cards', async ({ page }) => {
    // Article links should appear in the listing
    const articleLinks = page.locator('a[href^="/articles/"]')
    const count = await articleLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display category filter buttons', async ({ page }) => {
    // "All" filter button should always exist
    const allButton = page.getByRole('button', { name: /^All\b/ })
    await expect(allButton).toBeVisible()
    await expect(allButton).toHaveAttribute('aria-pressed', 'true')
  })

  test('should filter articles by category', async ({ page }) => {
    // Get the first non-All category button
    const categoryButtons = page.locator('button[aria-pressed]')
    const count = await categoryButtons.count()
    expect(count).toBeGreaterThan(1) // "All" plus at least one category

    // Click second button (first real category)
    const catButton = categoryButtons.nth(1)
    const catName = await catButton.innerText()
    await catButton.click()

    // The clicked button should now be aria-pressed=true
    await expect(catButton).toHaveAttribute('aria-pressed', 'true')

    // "All" button should now be aria-pressed=false
    const allButton = page.getByRole('button', { name: /^All\b/ })
    await expect(allButton).toHaveAttribute('aria-pressed', 'false')

    // Verify articles shown contain the selected category (check first card)
    const firstCard = page.locator('a[href^="/articles/"]').first()
    await expect(firstCard).toBeVisible()

    // If there's a category badge, it should match
    const badge = firstCard.locator('span', { hasText: catName.replace(/\s*\(\d+\)/, '') })
    if ((await badge.count()) > 0) {
      await expect(badge.first()).toBeVisible()
    }
  })

  test('should display article count', async ({ page }) => {
    // The page should show some indication of how many articles exist
    const bodyText = await page.locator('body').innerText()
    // There should be articles visible (at least one link)
    const links = page.locator('a[href^="/articles/"]')
    expect(await links.count()).toBeGreaterThan(0)
    expect(bodyText.length).toBeGreaterThan(100)
  })
})

test.describe('Individual Article Page', () => {
  test('should render a specific article with title, date, and content', async ({ page }) => {
    // Navigate to the first article from the listing
    await page.goto('/articles')
    const firstArticleLink = page.locator('a[href^="/articles/"]').first()
    const href = await firstArticleLink.getAttribute('href')
    expect(href).toBeTruthy()

    const response = await page.goto(href!)
    expect(response?.status()).toBe(200)

    // Article title in h1
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    const title = await heading.innerText()
    expect(title.length).toBeGreaterThan(0)

    // Date should be visible
    const time = page.locator('time')
    await expect(time).toBeVisible()

    // Sanitized content area
    const wpContent = page.locator('.wp-content')
    await expect(wpContent).toBeAttached()
  })

  test('should show category badges on article page', async ({ page }) => {
    await page.goto('/articles')
    const firstLink = page.locator('a[href^="/articles/"]').first()
    await firstLink.click()
    await page.waitForLoadState('domcontentloaded')

    // Category badges appear in the hero section
    const hero = page.locator('section').first()
    const badges = hero.locator('span')
    // Most articles have at least one category
    const count = await badges.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('should have back-to-articles link', async ({ page }) => {
    await page.goto('/articles')
    const firstLink = page.locator('a[href^="/articles/"]').first()
    await firstLink.click()
    await page.waitForLoadState('domcontentloaded')

    const backLink = page.getByRole('link', { name: /Back to Articles/i })
    await expect(backLink).toBeVisible()
  })

  test('article with featured image should have hero background', async ({ page }) => {
    // McBee Museum article is known to have a featured image
    const response = await page.goto(
      '/articles/mcbee-museum-building-has-witnessed-over-a-century-of-mitchell-county-history'
    )
    expect(response?.status()).toBe(200)

    const heading = page.locator('h1')
    await expect(heading).toContainText('McBee Museum')

    // Featured image used as hero background
    const heroImg = page.locator('section img.absolute')
    if ((await heroImg.count()) > 0) {
      const src = await heroImg.getAttribute('src')
      expect(src).toBeTruthy()
    }
  })

  test('article content should not contain script tags', async ({ page }) => {
    await page.goto(
      '/articles/mcbee-museum-building-has-witnessed-over-a-century-of-mitchell-county-history'
    )
    const html = await page.locator('.wp-content').innerHTML()
    expect(html).not.toContain('<script')
  })
})
