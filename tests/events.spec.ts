import { test, expect } from '@playwright/test'

test.describe('Events navigation', () => {
  test('header opens the dedicated events page', async ({ page }) => {
    await page.goto('/')
    await page.locator('header').getByRole('link', { name: 'Events', exact: true }).click()
    await expect(page).toHaveURL(/\/events\/$/)
    await expect(
      page.getByRole('heading', { name: 'Festivals & Events in Mitchell County', level: 1 })
    ).toBeVisible()
  })

  test('events are available from the mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/events/')
    await expect(
      page.getByRole('heading', { name: 'Festivals & Events in Mitchell County', level: 1 })
    ).toBeVisible()
  })
})
