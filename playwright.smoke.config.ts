import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for post-deployment smoke tests.
 *
 * Targets a live deployed URL (default: https://mitchellnchistory.org).
 * Override via SMOKE_BASE_URL env var, e.g.:
 *   SMOKE_BASE_URL=https://freeforcharity.github.io/FFC-EX-mitchellnchistory.org npm run smoke
 *
 * Unlike the main playwright.config.ts, this config does NOT start a local
 * preview server — it hits whatever host SMOKE_BASE_URL points at.
 */
const baseURL = process.env.SMOKE_BASE_URL || 'https://mitchellnchistory.org'

export default defineConfig({
  testDir: './tests/smoke',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  // Live network: be a bit more patient than the local-preview suite.
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: 'on-first-retry',
    // Live deployments may set HSTS / strict cookies — accept the prod environment as-is.
    ignoreHTTPSErrors: false,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
