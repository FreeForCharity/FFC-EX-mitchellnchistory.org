import { test, expect } from '@playwright/test'

test.describe('Get Involved invitation', () => {
  test('offers membership and contact links', async ({ page }) => {
    await page.goto('/')
    const invitation = page.getByRole('region', { name: 'Get Involved' })
    await expect(invitation).toBeVisible()
    await expect(invitation.getByRole('link', { name: 'Become a Member' })).toHaveAttribute(
      'href',
      '/membership/'
    )
    await invitation.getByRole('link', { name: 'Volunteer or Share a Story' }).click()
    await expect(page).toHaveURL(/\/contact\/$/)
  })

  test('membership invitation opens the membership page', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('region', { name: 'Get Involved' })
      .getByRole('link', { name: 'Become a Member' })
      .click()
    await expect(page).toHaveURL(/\/membership\/$/)
  })
})
