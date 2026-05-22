import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Events Section Tests
 *
 * Verifies the homepage Events & Festivals section, which features whichever
 * Mitchell County event is nearest to the build date and links to the
 * standalone /events/ listing page. The featured event rotates, so the
 * assertions target the stable section heading and "See All Events" link
 * rather than a specific festival.
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

test.describe('Events Section', () => {
  test('should render the Events section on homepage', async ({ page }) => {
    await page.goto('/')

    const eventsSection = page.locator(`#${testConfig.events.sectionId}`)
    await expect(eventsSection).toBeVisible()

    const heading = eventsSection.locator('h2')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(testConfig.events.heading)
  })

  test('should be accessible via #events anchor link', async ({ page }) => {
    await page.goto(`/#${testConfig.events.sectionId}`)
    await page.waitForLoadState('domcontentloaded')

    const eventsSection = page.locator(`#${testConfig.events.sectionId}`)
    await expect(eventsSection).toBeVisible()

    const boundingBox = await eventsSection.boundingBox()
    expect(boundingBox).toBeTruthy()
  })

  test('should have festival link', async ({ page }) => {
    await page.goto('/')

    const festivalLink = page.locator(
      `#${testConfig.events.sectionId} a[href*="${testConfig.events.festivalLinkHref}"]`
    )
    await expect(festivalLink).toBeVisible()
    await expect(festivalLink).toContainText(testConfig.events.festivalLinkText)
  })

  test('should contain the configured description text in the events section', async ({ page }) => {
    await page.goto('/')

    const eventsSection = page.locator(`#${testConfig.events.sectionId}`)
    await expect(eventsSection).toContainText(testConfig.events.descriptionText)
  })

  test('should load on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await page.locator(`#${testConfig.events.sectionId}`).scrollIntoViewIfNeeded()

    const eventsSection = page.locator(`#${testConfig.events.sectionId}`)
    await expect(eventsSection).toBeVisible()

    const heading = eventsSection.locator('h2')
    await expect(heading).toBeVisible()
  })
})
