import { test, expect } from '@playwright/test'

/**
 * Contact Page Tests
 *
 * These tests verify that the Contact page renders correctly with all
 * expected content and form fields.
 */

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('should display Contact Us heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Contact Us', level: 1 })
    await expect(heading).toBeVisible()
  })

  test('should display email link', async ({ page }) => {
    // Scope to main content area (not footer) by using the first visible occurrence
    const emailLink = page
      .locator(
        'main a[href="mailto:mitchellnchistory@gmail.com"], section a[href="mailto:mitchellnchistory@gmail.com"]'
      )
      .first()
    await expect(emailLink).toBeVisible()
  })

  test('should display phone link', async ({ page }) => {
    const phoneLink = page.locator('section a[href="tel:8286884371"]').first()
    await expect(phoneLink).toBeVisible()
  })

  test('should display physical address', async ({ page }) => {
    // The address appears in both the contact section and footer,
    // so we scope to the section containing "Physical Address" heading
    const addressSection = page.locator('section:has(h3:has-text("Physical Address"))')
    await expect(addressSection.getByText('11 N Mitchell Ave')).toBeVisible()
  })

  test('should display mailing address', async ({ page }) => {
    const mailingSection = page.locator('section:has(h3:has-text("Mailing Address"))')
    await expect(mailingSection.getByText('P.O. Box 651')).toBeVisible()
  })

  test('should display office hours', async ({ page }) => {
    const hoursSection = page.locator('section:has(h3:has-text("Office Hours"))')
    await expect(hoursSection.getByText('Tuesday')).toBeVisible()
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
