import { test, expect } from '@playwright/test'

/**
 * Get Involved Section Tests
 *
 * These tests verify that the Get Involved section is present and properly
 * configured on the homepage.
 */

test.describe('Get Involved Section', () => {
  test('should display Get Involved heading', async ({ page }) => {
    await page.goto('/')

    const heading = page.getByRole('heading', { name: 'Get Involved' })
    await expect(heading).toBeVisible()
  })

  test('should display three involvement cards', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Be A Member')).toBeVisible()
    await expect(page.getByText('Be A Volunteer')).toBeVisible()
    await expect(page.getByText('Join The Board')).toBeVisible()
  })

  test('should have link to membership page', async ({ page }) => {
    await page.goto('/')

    const membershipLink = page.locator('a[href="/membership"]', { hasText: 'Join Today' })
    await expect(membershipLink).toBeVisible()
  })

  test('should have link to about page', async ({ page }) => {
    await page.goto('/')

    const aboutLink = page.locator('a[href="/about"]', { hasText: 'Learn More' })
    await expect(aboutLink).toBeVisible()
  })
})
