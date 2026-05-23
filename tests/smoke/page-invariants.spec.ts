import { test, expect } from '@playwright/test'
import { sitemapRoutes } from '../../src/lib/siteConfig'

/**
 * Per-page invariants across every route in sitemapRoutes (~26 routes).
 *
 * The base smoke suite checks 7 hand-picked critical pages. This file
 * extends that to *every* top-level page so a layout regression on a less-
 * visited page (penland-cemetery, vulnerability-disclosure-policy, etc.)
 * still fails the smoke instead of going unnoticed until a user reports it.
 *
 * Invariants checked per page:
 *  - HTTP 200
 *  - Page title is non-empty
 *  - A visible h1 or h2
 *  - Footer is present (looks for the FFC attribution link)
 *  - Header navigation includes the core links (/about, /articles, /contact)
 *  - No console errors fired during page load
 */

const FOOTER_MARKER = /Free For Charity|freeforcharity/i

test.describe('Page invariants (every sitemap route)', () => {
  for (const route of sitemapRoutes) {
    test(`${route} renders with header, footer, and title`, async ({ page }) => {
      const consoleErrors: string[] = []
      page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`))
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(`console.error: ${msg.text()}`)
      })

      const res = await page.goto(route, { waitUntil: 'domcontentloaded' })
      expect(res?.status(), `expected ${route} to load`).toBe(200)

      const title = await page.title()
      expect(title, `${route} has empty title`).not.toBe('')

      await expect(page.locator('h1, h2').first()).toBeVisible()

      // Footer present — looks for the FFC attribution that ships with every
      // FFC-template site. If a layout regression drops the footer entirely,
      // this catches it.
      const footerText = await page.locator('footer').first().textContent()
      expect(footerText ?? '', `Footer missing FFC attribution on ${route}`).toMatch(FOOTER_MARKER)

      // Header nav — must link to at least the 3 always-on routes.
      const navHrefs = await page
        .locator('header a[href]')
        .evaluateAll((els) =>
          els.map((a) => (a as HTMLAnchorElement).getAttribute('href')).filter(Boolean)
        )
      const joined = navHrefs.join(' ')
      expect(joined, `Header nav missing /about link on ${route}`).toMatch(/\/about/)
      expect(joined, `Header nav missing /articles link on ${route}`).toMatch(/\/articles/)
      expect(joined, `Header nav missing /contact link on ${route}`).toMatch(/\/contact/)

      expect(
        consoleErrors,
        `Console errors on ${route}:\n${consoleErrors.join('\n')}`
      ).toHaveLength(0)
    })
  }
})
