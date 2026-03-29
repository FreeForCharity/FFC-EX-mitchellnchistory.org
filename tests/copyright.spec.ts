import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Copyright Notice Tests
 *
 * These tests verify that the copyright notice in the footer:
 * 1. Contains the copyright symbol (©)
 * 2. Displays the current year
 * 3. Renders the complete copyright text
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

test.describe('Footer Copyright Notice', () => {
  test('should display copyright notice with current year', async ({ page }) => {
    await page.goto('/')

    const currentYear = new Date().getFullYear()

    const footerText = page.locator(`footer p:has-text("© ${currentYear}")`)

    await expect(footerText).toBeVisible()
    await expect(footerText).toContainText(`© ${currentYear}`)
    await expect(footerText).toContainText(testConfig.copyright.text)
  })

  test('should display link to Free For Charity website in copyright notice', async ({ page }) => {
    await page.goto('/')

    const currentYear = new Date().getFullYear()

    const copyrightLink = page.locator(
      `footer p:has-text("© ${currentYear}") a[href="${testConfig.copyright.linkUrl}"]`
    )

    await expect(copyrightLink).toBeVisible()
    await expect(copyrightLink).toContainText(testConfig.copyright.linkText)
  })
})
