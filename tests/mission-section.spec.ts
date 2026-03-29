import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Mission Section Tests
 *
 * These tests verify that the mission section is present and properly configured
 * on the homepage.
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

test.describe('Mission Section', () => {
  test('should display mission section on homepage', async ({ page }) => {
    await page.goto('/')

    const missionSection = page.locator(`#${testConfig.missionSection.sectionId}`)
    await expect(missionSection).toBeVisible()
  })

  test('should display Our Mission heading', async ({ page }) => {
    await page.goto('/')

    const heading = page.locator(`#${testConfig.missionSection.sectionId} h2`)
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(testConfig.missionSection.heading)
  })

  test('should display mission text with 501(c)(3)', async ({ page }) => {
    await page.goto('/')

    const missionSection = page.locator(`#${testConfig.missionSection.sectionId}`)
    await expect(missionSection).toContainText(testConfig.missionSection.text)
  })
})
