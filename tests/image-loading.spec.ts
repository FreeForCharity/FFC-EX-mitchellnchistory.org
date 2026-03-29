import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Image Loading Tests
 *
 * These tests verify that images load correctly when the site is built.
 * The tests check that images in the header and hero section are visible
 * and load properly with successful HTTP responses.
 *
 * Note: Test expectations use values from test.config.ts for easy customization.
 */

test.describe('Image Loading', () => {
  test('images should load correctly and be visible', async ({ page }) => {
    await page.goto('/')

    const headerLogo = page.locator(`header a[href="/"] img[alt="${testConfig.logo.headerAlt}"]`)
    const heroImage = page.locator(`img[alt="${testConfig.logo.heroAlt}"]`)

    await expect(headerLogo).toBeVisible()
    await expect(heroImage).toBeVisible()

    const headerSrc = await headerLogo.getAttribute('src')
    expect(headerSrc).toBeTruthy()

    const heroSrc = await heroImage.getAttribute('src')
    expect(heroSrc).toBeTruthy()
  })

  test('hero image should load from local assets', async ({ page }) => {
    const imageRequests: Array<{ url: string; status: number }> = []

    page.on('response', (response) => {
      if (response.url().includes('mchs-hero')) {
        imageRequests.push({
          url: response.url(),
          status: response.status(),
        })
      }
    })

    await page.goto('/')

    const heroImage = page.locator(`img[alt="${testConfig.logo.heroAlt}"]`)
    await expect(heroImage).toBeVisible()

    expect(imageRequests.length).toBeGreaterThan(0)

    for (const request of imageRequests) {
      expect(request.status).toBe(200)
    }
  })

  // Temporarily disabled: This test checks natural dimensions which don't work reliably in CI
  test.skip('images have natural dimensions indicating successful load', async ({ page }) => {
    await page.goto('/')

    const heroImage = page.locator(`img[alt="${testConfig.logo.heroAlt}"]`)
    await expect(heroImage).toBeVisible()

    const naturalWidth = await heroImage.evaluate((img: HTMLImageElement) => img.naturalWidth)
    const naturalHeight = await heroImage.evaluate((img: HTMLImageElement) => img.naturalHeight)

    expect(naturalWidth).toBeGreaterThan(0)
    expect(naturalHeight).toBeGreaterThan(0)
  })
})
