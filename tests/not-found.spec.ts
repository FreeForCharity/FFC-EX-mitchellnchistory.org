import { test, expect } from '@playwright/test'

/**
 * Branded 404 page — E2E Tests
 *
 * The static export emits out/404.html, which GitHub Pages (and the local
 * preview server) serve for any unknown path. It must carry the site chrome
 * and recovery links instead of Next.js's bare default error page.
 */

test.describe('404 page', () => {
  test('unknown URL renders the branded not-found page with site chrome', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/')
    expect(response?.status()).toBe(404)

    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible()

    // Site chrome is present
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('offers working recovery links', async ({ page }) => {
    await page.goto('/this-page-does-not-exist/')

    await expect(page.getByRole('link', { name: 'Search Articles' })).toHaveAttribute(
      'href',
      '/articles/'
    )
    await expect(page.getByRole('link', { name: 'Go to Homepage' })).toHaveAttribute('href', '/')

    await page.getByRole('link', { name: 'Search Articles' }).click()
    await expect(page).toHaveURL(/\/articles\/$/)
    await expect(page.getByRole('heading', { name: /Articles/ })).toBeVisible()
  })
})
