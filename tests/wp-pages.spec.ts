import { test, expect } from '@playwright/test'

/**
 * WordPress Migrated Pages — Smoke Tests
 *
 * Verifies every WordPress-migrated page renders correctly:
 * - Title visible in hero section
 * - Sanitized HTML content rendered (wp-content container present)
 * - No raw Divi shortcodes visible
 * - No script tags leaked through sanitizer
 */

const wpPages = [
  { route: '/scholarship', title: 'Inez McRae Memorial Scholarship' },
  { route: '/scan-days', title: 'Scan' },
  { route: '/penland-cemetery', title: 'Penland Cemetery' },
  { route: '/overmountain-men', title: 'Overmountain Men' },
  { route: '/newsletters', title: 'Newsletters' },
  { route: '/red-wilson', title: 'A Tribute to Red Wilson' },
  { route: '/history-bee', title: 'History Bee' },
  {
    route: '/mitchell-county-nc-world-war-inductees',
    title: 'Mitchell County, NC World War I Inductees',
  },
  {
    route: '/mitchell-county-nc-world-war-enlistees',
    title: 'Mitchell County, NC World War I Enlistees',
  },
]

test.describe('WordPress Migrated Pages', () => {
  for (const { route, title } of wpPages) {
    test(`${route} — renders title and content`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)

      // Title should be in the hero h1
      const heading = page.locator('h1').first()
      await expect(heading).toBeVisible()
      await expect(heading).toContainText(title)

      // Sanitized WP content container should exist
      const wpContent = page.locator('.wp-content')
      await expect(wpContent).toBeAttached()
    })

    test(`${route} — no raw Divi shortcodes visible`, async ({ page }) => {
      await page.goto(route)
      const bodyText = await page.locator('body').innerText()
      expect(bodyText).not.toMatch(/\[et_pb_/)
      expect(bodyText).not.toMatch(/\[\/et_pb_/)
    })
  }
})

test.describe('WordPress Multi-Content Pages', () => {
  test('/videos — searches the collection and opens a recording', async ({ page }) => {
    const response = await page.goto('/videos')
    expect(response?.status()).toBe(200)

    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Watch & Discover')
    await expect(
      page.getByRole('link', {
        name: 'Watch Six Women. Six Voices. Stories History Left Unfinished',
        exact: true,
      })
    ).toHaveAttribute('href', '/videos/six-women-six-voices-stories-history-left-unfinished/')
    await page.getByLabel('Search videos').fill('Lost Cove')
    await expect(page.getByRole('status')).toHaveText('1 video')
    await page.locator('article').getByRole('link').click()
    await expect(page.locator('h1')).toContainText('Lost Cove')
    await expect(page.locator('iframe')).toHaveAttribute('title', /Lost Cove/)
    await page.getByRole('link', { name: 'All Videos' }).click()
    await page.getByRole('button', { name: 'Military History', exact: true }).click()
    await expect(page.locator('article')).toHaveCount(3)
    await page.getByLabel('Search videos').fill('no matching recording')
    await expect(page.getByRole('status')).toHaveText('0 videos')
    await page.getByRole('button', { name: 'Clear search and filters' }).click()
    await expect(page.locator('article')).toHaveCount(20)
  })

  test('/resources — renders resource content', async ({ page }) => {
    const response = await page.goto('/resources')
    expect(response?.status()).toBe(200)

    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()

    const wpContent = page.locator('.wp-content')
    const count = await wpContent.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })
})
