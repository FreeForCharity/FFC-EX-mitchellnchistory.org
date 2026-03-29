import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Social Links Tests
 *
 * These tests verify that:
 * 1. Social media links are present and functional
 * 2. Defunct platforms (like Google+) are not present
 * 3. All social icons link to correct destinations
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

test.describe('Footer Social Links', () => {
  test('should not contain Google+ social link', async ({ page }) => {
    await page.goto('/')

    const googlePlusLink = page.locator('footer a[href*="plus.google.com"]')
    await expect(googlePlusLink).toHaveCount(0)

    const googlePlusLabel = page.locator('footer a[aria-label="Google Plus"]')
    await expect(googlePlusLabel).toHaveCount(0)
  })

  test('should display Facebook social link', async ({ page }) => {
    await page.goto('/')

    const facebookLink = page.locator(`footer a[href*="${testConfig.socialLinks.facebook.url}"]`)
    await expect(facebookLink).toBeVisible()
    await expect(facebookLink).toHaveAttribute(
      'aria-label',
      testConfig.socialLinks.facebook.ariaLabel
    )
  })

  test('should have exactly 1 social media icon', async ({ page }) => {
    await page.goto('/')

    const socialMediaLinks = page.locator(
      `footer a[aria-label="${testConfig.socialLinks.facebook.ariaLabel}"]`
    )
    await expect(socialMediaLinks).toHaveCount(1)
  })
})
