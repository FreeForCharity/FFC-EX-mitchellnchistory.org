import { test, expect, type Response } from '@playwright/test'
import postsData from '../../src/data/articles/posts.json'

/**
 * Random article sampling smoke check.
 *
 * Why: there are ~390 migrated articles. Checking every one on every
 * deploy is slow and most of them haven't changed. Sampling N per run
 * gives broad surface coverage without pinning to specific slugs
 * (which would let long-tail migration regressions slip through).
 *
 * Why deterministic: seeded by GITHUB_RUN_NUMBER (or SMOKE_SEED locally)
 * so a failing run is reproducible — re-running the same workflow re-
 * tests the same sample, and an investigator can reproduce locally via
 *   SMOKE_SEED=<n> npm run smoke
 */

interface Post {
  slug: string
  title: string
}

const posts = postsData as Post[]
const SAMPLE_SIZE = 10

function mulberry32Shuffle<T>(arr: T[], seed: number): T[] {
  let s = seed >>> 0 || 1
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296
    const j = Math.floor(r * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Seed must be stable across worker processes within one Playwright run,
// otherwise test titles enumerated by the test-list phase won't match the
// titles registered in worker processes ("Test not found in worker"). Date.now()
// changes between those phases; GITHUB_RUN_NUMBER is stable in CI; SMOKE_SEED
// lets a developer reproduce a failed CI run locally. Default falls back to
// the UTC date so local runs are stable within a day and rotate naturally.
const seedStr = process.env.GITHUB_RUN_NUMBER || process.env.SMOKE_SEED
const seed = seedStr
  ? Number(seedStr)
  : parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''), 10)
const sample = mulberry32Shuffle(posts, seed).slice(0, SAMPLE_SIZE)

test.describe(`Article sampling (seed=${seed}, n=${SAMPLE_SIZE} of ${posts.length})`, () => {
  for (const post of sample) {
    test(`/articles/${post.slug}/ renders cleanly`, async ({ page, baseURL }) => {
      const url = `/articles/${post.slug}/`
      const ownOrigin = new URL(baseURL!).origin
      const failures: string[] = []

      page.on('response', (res: Response) => {
        if (res.status() >= 400 && res.url().startsWith(ownOrigin)) {
          failures.push(`${res.status()} ${res.url()}`)
        }
      })

      const res = await page.goto(url, { waitUntil: 'domcontentloaded' })
      expect(res?.status(), `expected ${url} to load`).toBe(200)

      const title = await page.title()
      expect(title, `${url} has empty title`).not.toBe('')

      // Article hero h1 is always present; .wp-content is the sanitized body
      // injected via dangerouslySetInnerHTML.
      await expect(page.locator('h1').first()).toBeVisible()
      await expect(page.locator('.wp-content')).toBeAttached()

      // sanitizeHtml() strips <script>; assert nothing survived into the body.
      const scriptInArticle = await page.locator('.wp-content script').count()
      expect(scriptInArticle, `<script> survived sanitization in ${url}`).toBe(0)

      expect(
        failures,
        `Broken first-party resources on ${url}:\n${failures.join('\n')}`
      ).toHaveLength(0)
    })
  }
})
