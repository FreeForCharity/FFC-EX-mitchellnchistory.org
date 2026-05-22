#!/usr/bin/env node

/**
 * Download all wp-content images referenced by stored articles+pages and
 * stash them in public/wp-content/uploads/... preserving the WP path so URLs
 * map 1:1 once we rewrite absolute → relative in sanitizeHtml.ts.
 *
 * Uses Playwright Chromium (drives through SiteGround's sg-captcha challenge),
 * reuses the resulting cookies via APIRequestContext for fast binary fetches,
 * and falls back to page navigation if the API client gets challenged again.
 *
 * Resumable: skips files already on disk. Run multiple times safely.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const URL_LIST = join(ROOT, 'tmp', 'article-image-urls.json')
const PUBLIC_DIR = join(ROOT, 'public')

const ORIGIN = 'https://mitchellnchistory.org'
const CONCURRENCY = 6
const TIMEOUT_MS = 30_000

function localPathForUrl(url) {
  // Upgrade http -> https for consistency before mapping; path is what matters.
  const u = new URL(url)
  // Path will be like /wp-content/uploads/2021/05/foo.jpg
  return join(PUBLIC_DIR, u.pathname.replace(/^\//, '').split('/').join('/'))
}

function normalizeUrl(url) {
  // Upgrade http -> https; site supports both, https avoids mixed-content concerns at fetch time.
  return url.startsWith('http://') ? 'https://' + url.slice(7) : url
}

async function clearChallenge(context) {
  const page = await context.newPage()
  await page.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded', timeout: 45_000 }).catch(() => {})
  await page.waitForTimeout(2500)
  // Hit a wp-content URL once to plant the cookie on that subtree if SG scopes it.
  await page
    .goto(ORIGIN + '/wp-content/uploads/', { waitUntil: 'domcontentloaded', timeout: 45_000 })
    .catch(() => {})
  await page.waitForTimeout(1500)
  await page.close()
}

async function fetchViaRequest(context, url) {
  const res = await context.request.get(url, { timeout: TIMEOUT_MS })
  if (!res.ok()) throw new Error(`HTTP ${res.status()}`)
  const ct = res.headers()['content-type'] || ''
  if (!ct.startsWith('image/') && !ct.includes('octet-stream')) {
    const peek = (await res.text()).slice(0, 80)
    throw new Error(`Non-image content-type ${ct}: ${peek}`)
  }
  return await res.body()
}

async function fetchViaPage(page, url) {
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS })
  if (!res) throw new Error('No response from page.goto')
  if (!res.ok()) throw new Error(`HTTP ${res.status()}`)
  const ct = res.headers()['content-type'] || ''
  if (!ct.startsWith('image/') && !ct.includes('octet-stream')) {
    throw new Error(`Non-image content-type ${ct}`)
  }
  return await res.body()
}

async function downloadOne(context, page, url) {
  const norm = normalizeUrl(url)
  const dest = localPathForUrl(norm)
  if (existsSync(dest) && statSync(dest).size > 0) return { status: 'skip', dest }
  let buf
  try {
    buf = await fetchViaRequest(context, norm)
  } catch (err1) {
    try {
      buf = await fetchViaPage(page, norm)
    } catch (err2) {
      return { status: 'error', error: `${err1.message} / ${err2.message}` }
    }
  }
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, buf)
  return { status: 'downloaded', bytes: buf.length, dest }
}

async function main() {
  const data = JSON.parse(readFileSync(URL_LIST, 'utf-8'))
  const urls = data.all_unique.filter((u) => u.includes('mitchellnchistory.org/wp-content/'))
  console.log(`Downloading ${urls.length} wp-content images → public/wp-content/uploads/`)
  console.log(`Concurrency: ${CONCURRENCY}\n`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
    ignoreHTTPSErrors: true,
  })
  try {
    console.log('Clearing sg-captcha challenge...')
    await clearChallenge(context)
    console.log('Challenge cleared. Starting downloads.\n')

    const pages = []
    for (let i = 0; i < CONCURRENCY; i++) pages.push(await context.newPage())

    const t0 = Date.now()
    let cursor = 0,
      downloaded = 0,
      skipped = 0,
      errors = 0,
      totalBytes = 0
    const errorList = []

    async function worker(page) {
      while (true) {
        const idx = cursor++
        if (idx >= urls.length) return
        const url = urls[idx]
        let attempt = 0,
          last
        while (attempt < 3) {
          const r = await downloadOne(context, page, url).catch((e) => ({
            status: 'error',
            error: e.message,
          }))
          if (r.status === 'downloaded') {
            downloaded++
            totalBytes += r.bytes
            break
          }
          if (r.status === 'skip') {
            skipped++
            break
          }
          last = r.error
          attempt++
          await page.waitForTimeout(800 * attempt)
        }
        if (attempt === 3) {
          errors++
          errorList.push({ url, error: last })
        }
        const done = downloaded + skipped + errors
        if (done % 25 === 0 || done === urls.length) {
          const rate = (done / ((Date.now() - t0) / 1000)).toFixed(2)
          const mb = (totalBytes / 1024 / 1024).toFixed(1)
          process.stdout.write(
            `  ${done}/${urls.length}  d=${downloaded} s=${skipped} e=${errors}  ${mb}MB  (${rate}/s)\n`
          )
        }
      }
    }

    await Promise.all(pages.map(worker))
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
    console.log(`\nDone in ${elapsed}s`)
    console.log(`  downloaded: ${downloaded}  (${(totalBytes / 1024 / 1024).toFixed(1)} MB)`)
    console.log(`  skipped:    ${skipped}`)
    console.log(`  errors:     ${errors}`)
    if (errorList.length) {
      const errPath = join(ROOT, 'tmp', 'image-download-errors.json')
      writeFileSync(errPath, JSON.stringify(errorList, null, 2))
      console.log(`  error list → ${errPath}`)
      console.log('  first 10:')
      for (const e of errorList.slice(0, 10)) console.log(`    - ${e.url}: ${e.error}`)
    }
    process.exit(errors > 0 ? 2 : 0)
  } finally {
    await context.close()
    await browser.close()
  }
}

main().catch((err) => {
  console.error('Downloader failed:', err)
  process.exit(1)
})
