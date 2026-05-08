import { test, expect, type Response } from '@playwright/test'

/**
 * Post-deployment smoke tests.
 *
 * Run against a deployed environment (production by default). These tests
 * exercise the failure modes that don't show up in local builds: custom-domain
 * routing, asset-path correctness without basePath, OG image absolute URLs,
 * 404 handling on GitHub Pages, and live third-party script loading.
 *
 * Local E2E suite (tests/) covers richer behavior; this suite is intentionally
 * fast, network-tolerant, and limited to "did the deploy actually work".
 */

const CRITICAL_ROUTES = [
  '/',
  '/about/',
  '/articles/',
  '/contact/',
  '/scholarship/',
  '/privacy-policy/',
  '/cookie-policy/',
  '/terms-of-service/',
  '/about-mitchell-county/',
]

/** A known-good article slug — used to verify the migrated article pipeline. */
const SAMPLE_ARTICLE =
  '/articles/mcbee-museum-building-has-witnessed-over-a-century-of-mitchell-county-history/'

test.describe('Infrastructure', () => {
  test('home returns 200', async ({ request }) => {
    const res = await request.get('/')
    expect(res.status()).toBe(200)
  })

  test('serves over HTTPS', async ({ baseURL }) => {
    expect(baseURL).toMatch(/^https:\/\//)
  })

  test('robots.txt is reachable and references the sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toMatch(/Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/i)
  })

  test('sitemap.xml is valid and lists static + article routes', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('<urlset')
    expect(body).toContain('</urlset>')
    expect(body).toContain('/articles/')
    // The site has hundreds of migrated WP posts; assert "many" without pinning a number.
    const articleEntries = body.match(/\/articles\/[^<]+/g) ?? []
    expect(articleEntries.length).toBeGreaterThan(50)
  })

  test('unknown path serves the 404 page', async ({ request }) => {
    const res = await request.get('/this-route-definitely-does-not-exist-xyz/')
    expect(res.status()).toBe(404)
  })
})

test.describe('Asset paths (custom domain has no basePath)', () => {
  // These assets are referenced absolutely in layout.tsx. If basePath were
  // accidentally applied to the prod build, they would 404.
  const assets = [
    '/favicon.ico',
    '/icon.png',
    '/apple-icon.png',
    '/site.webmanifest',
    '/Images/mchs-hero.webp',
  ]

  for (const path of assets) {
    test(`${path} returns 200`, async ({ request }) => {
      const res = await request.get(path)
      expect(res.status(), `expected ${path} to load`).toBe(200)
    })
  }
})

test.describe('Critical pages render', () => {
  for (const route of CRITICAL_ROUTES) {
    test(`${route} loads, has title and h1/h2`, async ({ page }) => {
      const res = await page.goto(route)
      expect(res?.status()).toBe(200)
      expect(await page.title()).not.toBe('')
      await expect(page.locator('h1, h2').first()).toBeVisible()
    })
  }

  test('sample migrated article renders sanitized content', async ({ page }) => {
    const res = await page.goto(SAMPLE_ARTICLE)
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1, h2').first()).toBeVisible()
    // sanitizeHtml strips <script>; assert none survived into the rendered article.
    const scriptInArticle = await page.locator('article script').count()
    expect(scriptInArticle).toBe(0)
  })
})

test.describe('No broken sub-resources on the home page', () => {
  test('home page loads without 4xx/5xx responses or console errors', async ({ page }) => {
    const failures: string[] = []
    const consoleErrors: string[] = []

    page.on('response', (res: Response) => {
      const status = res.status()
      if (status >= 400) {
        failures.push(`${status} ${res.url()}`)
      }
    })
    page.on('pageerror', (err) => consoleErrors.push(err.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto('/', { waitUntil: 'networkidle' })

    // Allow third-party tracking domains to fail (ad blockers, GTM rate limits, etc.)
    // — only fail on first-party resources.
    const ownOrigin = new URL(page.url()).origin
    const ownFailures = failures.filter((line) => line.includes(ownOrigin))

    expect(ownFailures, `Broken first-party resources:\n${ownFailures.join('\n')}`).toHaveLength(0)
    expect(consoleErrors, `Console errors:\n${consoleErrors.join('\n')}`).toHaveLength(0)
  })
})

test.describe('SEO & structured data', () => {
  test('home has title, description, and canonical URL', async ({ page, baseURL }) => {
    await page.goto('/')
    expect(await page.title()).toMatch(/Mitchell County/i)

    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toBeTruthy()
    expect((description ?? '').length).toBeGreaterThan(20)

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBeTruthy()
    // Canonical must point at the production origin, not localhost or a Pages preview.
    expect(canonical).toMatch(new RegExp(`^${baseURL}`))
  })

  test('home OG image resolves', async ({ page, request }) => {
    await page.goto('/')
    const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute('content')
    expect(ogImage).toBeTruthy()
    const res = await request.get(ogImage as string)
    expect(res.status()).toBe(200)
  })

  test('article page emits og:type=article', async ({ page }) => {
    await page.goto(SAMPLE_ARTICLE)
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
    expect(ogType).toBe('article')
  })

  test('home embeds valid JSON-LD organization schema', async ({ page }) => {
    await page.goto('/')
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(scripts.length).toBeGreaterThan(0)

    const orgScript = scripts.find(
      (s) => s.includes('"@type":"Organization"') || s.includes('"@type": "Organization"')
    )
    expect(orgScript, 'Organization JSON-LD missing').toBeTruthy()

    // Must parse cleanly — proves safeJsonLdStringify escaped correctly.
    const parsed = JSON.parse(orgScript!)
    expect(parsed['@context']).toBe('https://schema.org')
    expect(parsed['@type']).toBe('Organization')
    expect(parsed.url).toMatch(/^https:\/\//)
  })
})

test.describe('Interactivity', () => {
  test('cookie consent banner appears for new visitors', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/')
    // The banner heading is "We Value Your Privacy" (see tests/test.config.ts).
    await expect(page.getByText(/We Value Your Privacy/i)).toBeVisible({ timeout: 10_000 })
  })

  test('Google Tag Manager script tag is present', async ({ page }) => {
    await page.goto('/')
    const gtm = await page
      .locator('script[src*="googletagmanager.com/gtm.js"], script:has-text("gtm.start")')
      .count()
    expect(gtm).toBeGreaterThan(0)
  })

  test('header has navigation links to known routes', async ({ page }) => {
    await page.goto('/')
    const navHrefs = await page
      .locator('header a[href]')
      .evaluateAll((els) =>
        els.map((a) => (a as HTMLAnchorElement).getAttribute('href')).filter(Boolean)
      )
    // We expect at minimum a link to /about, /articles, /contact (any variant).
    const joined = navHrefs.join(' ')
    expect(joined).toMatch(/\/about/)
    expect(joined).toMatch(/\/articles/)
    expect(joined).toMatch(/\/contact/)
  })
})
