import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Google Tag Manager (GTM) Tests
 *
 * These tests verify that Google Tag Manager is properly integrated:
 * 1. GTM script is loaded in the head section
 * 2. dataLayer is initialized
 * 3. GTM noscript fallback exists in body
 * 4. GTM ID is configured in the component
 *
 * Note: The GTM component uses Next.js Script with strategy="lazyOnload",
 * which defers loading until after the page is fully idle. Tests use
 * waitForFunction to properly wait for lazy-loaded resources.
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

/**
 * Helper: wait for the GTM script element to appear in the DOM.
 * The lazyOnload strategy means the script may not be present immediately.
 */
async function waitForGtmScript(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => document.querySelector('script[id="gtm-script"]') !== null, {
    timeout: 30000,
  })
}

/**
 * Helper: wait for dataLayer to be initialized.
 */
async function waitForDataLayer(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => typeof window.dataLayer !== 'undefined' && Array.isArray(window.dataLayer),
    { timeout: 30000 }
  )
}

test.describe('Google Tag Manager Integration', () => {
  test('should initialize dataLayer on page load', async ({ page }) => {
    await page.goto('/')

    // Wait for dataLayer to be initialized (may be delayed with lazyOnload)
    await waitForDataLayer(page)

    const hasDataLayer = await page.evaluate(() => {
      return typeof window.dataLayer !== 'undefined' && Array.isArray(window.dataLayer)
    })

    expect(hasDataLayer).toBe(true)
  })

  test('should load GTM script with correct ID', async ({ page }) => {
    await page.goto('/')

    // Wait for the lazy-loaded GTM script to appear
    await waitForGtmScript(page)

    // Check for GTM script element
    const gtmScript = await page.locator('script[id="gtm-script"]').count()
    expect(gtmScript).toBeGreaterThan(0)

    // Verify script contains GTM initialization code
    const scriptContent = await page.locator('script[id="gtm-script"]').innerHTML()
    expect(scriptContent).toContain('googletagmanager.com/gtm.js')
    expect(scriptContent).toContain('dataLayer')
  })

  test('should have GTM noscript fallback in body', async ({ page }) => {
    await page.goto('/')

    // Check for noscript iframe element
    // We verify it exists in the HTML even though it won't render with JavaScript enabled
    const pageContent = await page.content()
    expect(pageContent).toContain('googletagmanager.com/ns.html')
    expect(pageContent).toContain('noscript')
  })

  test('should push events to dataLayer', async ({ page }) => {
    await page.goto('/')

    // Wait for dataLayer to be initialized (may be delayed with lazyOnload)
    await waitForDataLayer(page)

    // Verify we can push events to dataLayer
    const canPushToDataLayer = await page.evaluate(() => {
      if (typeof window.dataLayer === 'undefined') return false

      const initialLength = window.dataLayer.length
      window.dataLayer.push({ event: 'test_event', test: true })
      return window.dataLayer.length > initialLength
    })

    expect(canPushToDataLayer).toBe(true)
  })

  test('should load GTM script after page interaction', async ({ page }) => {
    await page.goto('/')

    // Wait for the lazy-loaded GTM script to appear
    // Next.js Script component with lazyOnload strategy
    // defers script loading until after page is interactive
    await waitForGtmScript(page)

    const gtmScript = await page.evaluate(() => {
      const script = document.querySelector('script[id="gtm-script"]')
      return script !== null
    })

    expect(gtmScript).toBe(true)

    // Wait for dataLayer to be initialized (may be delayed with lazyOnload)
    await waitForDataLayer(page)

    const dataLayerInitialized = await page.evaluate(() => {
      return typeof window.dataLayer !== 'undefined'
    })

    expect(dataLayerInitialized).toBe(true)
  })

  test('should work with cookie consent system', async ({ page, context }) => {
    // Clear cookies and localStorage
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    // Wait for cookie banner
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).toBeVisible()

    // Accept all cookies
    await page.getByRole('button', { name: 'Accept All' }).click()

    // Wait for dataLayer to be initialized before checking events
    await waitForDataLayer(page)

    // Verify dataLayer receives consent update event
    const hasConsentEvent = await page.evaluate(() => {
      if (typeof window.dataLayer === 'undefined') return false

      // Check if dataLayer has any consent-related events
      return window.dataLayer.some((item: { event?: string }) => item.event === 'consent_update')
    })

    expect(hasConsentEvent).toBe(true)
  })
})

test.describe('Google Tag Manager Configuration', () => {
  test('should load GTM script with configured ID', async ({ page }) => {
    // This test verifies that GTM loads with the configured ID from test.config.ts
    // The GTM_ID is configured in the component

    await page.goto('/')

    // Wait for the lazy-loaded GTM script to appear
    await waitForGtmScript(page)

    // GTM script should always be present with the configured ID
    const gtmScript = await page.locator('script[id="gtm-script"]').count()

    // Script should be present
    expect(gtmScript).toBeGreaterThan(0)

    // Verify the script contains the correct GTM ID
    const scriptContent = await page.locator('script[id="gtm-script"]').innerHTML()
    expect(scriptContent).toContain(testConfig.googleTagManager.id)
  })
})
