import { test, expect } from '@playwright/test'

/**
 * Visual capture for review.
 *
 * Captures full-page screenshots of the key user-facing pages and attaches
 * each to the test report so they appear in the workflow artifact. Reviewers
 * can flip through them after deploy to spot layout regressions, broken
 * hero images, font swaps, etc.
 *
 * This is NOT pixel-diff regression yet — Playwright's toHaveScreenshot()
 * comparisons need OS-matched baselines (Windows vs Linux render text
 * slightly differently). Adding true diffing is a follow-up: it requires
 * generating Linux baselines (e.g. via the Playwright Docker image) and
 * committing them under tests/smoke/visual-capture.spec.ts-snapshots/.
 *
 * What this spec does catch:
 *  - Page renders something non-trivial (screenshot >50KB, sanity floor)
 *  - Page actually paints visible content (body is visible, h1/h2 present)
 *  - Hero images load (waitUntil networkidle gates the screenshot on them)
 *
 * Reviewers can spot more subtle layout drift by visual inspection of the
 * uploaded artifact.
 */

const PAGES_TO_CAPTURE = [
  { name: 'home', path: '/' },
  { name: 'articles-index', path: '/articles/' },
  { name: 'about', path: '/about/' },
  { name: 'events', path: '/events/' },
  { name: 'museum', path: '/museum/' },
] as const

test.describe('Visual capture for review', () => {
  for (const { name, path } of PAGES_TO_CAPTURE) {
    test(`${name} (${path})`, async ({ page }, testInfo) => {
      const res = await page.goto(path, { waitUntil: 'networkidle' })
      expect(res?.status(), `expected ${path} to load`).toBe(200)

      await expect(page.locator('body')).toBeVisible()
      await expect(page.locator('h1, h2').first()).toBeVisible()

      // Give hero images / web fonts / animations one beat to settle.
      await page.waitForTimeout(500)

      const buffer = await page.screenshot({ fullPage: true, animations: 'disabled' })
      await testInfo.attach(`${name}.png`, { body: buffer, contentType: 'image/png' })

      // Sanity floor: a blank/error page would be <10KB. A real page should be
      // well above that even at low quality.
      expect(buffer.length, `${path} screenshot suspiciously small`).toBeGreaterThan(50_000)
    })
  }
})
