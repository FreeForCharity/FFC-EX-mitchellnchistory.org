import { test, expect } from '@playwright/test'

/**
 * Accessibility affordances — E2E Tests
 *
 * Covers keyboard-navigation features that automated audits (Lighthouse,
 * jest-axe) do not score, starting with the skip-to-content link required
 * by WCAG 2.4.1 (Bypass Blocks).
 */

test.describe('Skip-to-content link', () => {
  test('is the first focusable element and becomes visible on focus', async ({ page }) => {
    await page.goto('/')

    const skipLink = page.getByRole('link', { name: 'Skip to main content' })
    await expect(skipLink).toHaveAttribute('href', '#main-content')

    // Hidden until focused: collapsed to the 1px clipped sr-only box
    await expect(skipLink).toHaveCSS('position', 'absolute')
    await expect(skipLink).toHaveCSS('width', '1px')

    // First Tab press lands on the skip link and reveals it as a fixed overlay
    await page.keyboard.press('Tab')
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toHaveCSS('position', 'fixed')
    await expect(skipLink).not.toHaveCSS('width', '1px')
  })

  test('targets the main landmark present on every page', async ({ page }) => {
    for (const route of ['/', '/about/', '/articles/']) {
      await page.goto(route)
      await expect(page.locator('main#main-content')).toHaveCount(1)
    }
  })

  test('activating it moves focus/scroll target to main content', async ({ page }) => {
    await page.goto('/about/')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main-content$/)
  })
})
