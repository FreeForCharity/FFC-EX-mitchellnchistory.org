import { test, expect } from '@playwright/test'

/**
 * Contact Page Tests
 *
 * These tests verify that the Contact page renders correctly with all
 * expected content and form fields.
 */

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('domcontentloaded')
  })

  test('should display Contact Us heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Contact Us', level: 1 })
    await expect(heading).toBeVisible()
  })

  test('should display email link', async ({ page }) => {
    const emailLink = page.locator('a[href="mailto:mitchellnchistory@gmail.com"]')
    await expect(emailLink.first()).toBeVisible()
  })

  test('should display phone link', async ({ page }) => {
    const phoneLink = page.locator('a[href="tel:8286884371"]')
    await expect(phoneLink.first()).toBeVisible()
  })

  test('should display physical address', async ({ page }) => {
    await expect(page.getByText('11 N Mitchell Ave')).toBeVisible()
  })

  test('should display mailing address', async ({ page }) => {
    await expect(page.getByText('P.O. Box 651')).toBeVisible()
  })

  test('should display office hours', async ({ page }) => {
    await expect(page.getByText('Tuesday – Friday, 10:00 AM – 4:00 PM')).toBeVisible()
  })

  test('should display contact form fields', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const messageTextarea = page.locator('textarea[name="message"]')

    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(messageTextarea).toBeVisible()
  })
})
