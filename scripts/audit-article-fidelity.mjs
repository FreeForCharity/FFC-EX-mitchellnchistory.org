#!/usr/bin/env node

/**
 * Article fidelity audit (Playwright, page-navigation strategy).
 *
 * For every article in src/data/articles/posts.json, fetch the equivalent
 * post from the live WordPress REST API by navigating a real Chromium tab
 * to the wp-json URL (so SiteGround's sg-captcha challenge can resolve
 * naturally), read the JSON from the rendered <pre>, then compare against
 * the stored snapshot after applying the migration script's cleanHTML.
 *
 * Uses page navigation rather than APIRequestContext because Playwright's
 * fetch backend can egress on a different proxy IP than the browser, which
 * breaks SiteGround's per-IP challenge cookie.
 *
 * Output: tmp/article-audit-report.json + console summary.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sanitize from 'sanitize-html'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const POSTS_JSON = join(ROOT, 'src', 'data', 'articles', 'posts.json')
const TMP_DIR = join(ROOT, 'tmp')
const REPORT_PATH = join(TMP_DIR, 'article-audit-report.json')

const ORIGIN = 'https://mitchellnchistory.org'
const WP_API = `${ORIGIN}/wp-json/wp/v2`
const POOL_SIZE = 3
const NAV_TIMEOUT_MS = 30_000
const POST_NAV_SETTLE_MS = 800

// ---------------------------------------------------------------------------
// Verbatim copies of normalization from scripts/migrate-wp-content.mjs.
// Keep in lockstep — drift here invalidates the audit.
// ---------------------------------------------------------------------------

function cleanHTML(html) {
  const sanitized = sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat([
      'img',
      'figure',
      'figcaption',
      'iframe',
      'video',
      'audio',
      'source',
      'h1',
      'h2',
    ]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height', 'loading', 'srcset', 'sizes'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      a: ['href', 'name', 'target', 'rel'],
      source: ['src', 'type'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'anchor.fm'],
  })
  return sanitized
    .replace(/\[\/?et_pb_[^\]]*\]/g, '')
    .replace(/src="data:image\/[^"]*"\s*/g, '')
    .replace(/data-src="/g, 'src="')
    .replace(/data-srcset="/g, 'srcset="')
    .replace(/data-sizes="/g, 'sizes="')
    .replace(/<p>\s*&nbsp;\s*<\/p>/g, '')
    .replace(/<div[^>]*wp-caption[^>]*>/g, '<figure>')
    .replace(
      /<p[^>]*wp-caption-text[^>]*>(.*?)<\/p>\s*<\/div>/g,
      '<figcaption>$1</figcaption></figure>'
    )
    .replace(/<\/div>\s*$/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function decodeEntities(str) {
  return str.replace(
    /&#(\d+);|&(amp|lt|gt|quot|hellip|#8217|#8216|#8220|#8221|#8211|#8212|#8230|#038);/g,
    (match, num, name) => {
      if (num) return String.fromCodePoint(Number(num))
      const entities = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        hellip: '…',
        '#8217': '’',
        '#8216': '‘',
        '#8220': '“',
        '#8221': '”',
        '#8211': '–',
        '#8212': '—',
        '#8230': '…',
        '#038': '&',
      }
      return entities[name] ?? match
    }
  )
}

function stripHTML(html) {
  return sanitize(html, { allowedTags: [], allowedAttributes: {} }).trim()
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

function firstDiffIndex(a, b) {
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i
  return a.length === b.length ? -1 : n
}

function snippetAround(str, idx, span = 80) {
  if (idx < 0 || idx >= str.length) return ''
  const start = Math.max(0, idx - span)
  const end = Math.min(str.length, idx + span)
  return str.slice(start, end).replace(/\n/g, '\\n')
}

/**
 * Reduce HTML to a normalized, visitor-facing text representation:
 *   - drop all tags
 *   - decode entities and collapse whitespace
 * Two posts that produce the same textOnly value display the same prose.
 */
function textOnly(html) {
  return stripHTML(html).replace(/\s+/g, ' ').trim()
}

function compare(stored, live) {
  const liveTitle = decodeEntities(live.title?.rendered ?? '')
  const liveExcerpt = stripHTML(decodeEntities(live.excerpt?.rendered ?? ''))
  const liveContent = cleanHTML(live.content?.rendered ?? '')
  const liveDate = live.date ?? ''
  const diffs = []
  if (stored.title !== liveTitle) {
    diffs.push({ field: 'title', stored: stored.title, live: liveTitle })
  }
  if (stored.excerpt !== liveExcerpt) {
    const idx = firstDiffIndex(stored.excerpt, liveExcerpt)
    diffs.push({
      field: 'excerpt',
      storedLen: stored.excerpt.length,
      liveLen: liveExcerpt.length,
      firstDiffAt: idx,
      storedSnippet: snippetAround(stored.excerpt, idx),
      liveSnippet: snippetAround(liveExcerpt, idx),
      textMatches: textOnly(stored.excerpt) === textOnly(liveExcerpt),
    })
  }
  if (stored.content !== liveContent) {
    const idx = firstDiffIndex(stored.content, liveContent)
    diffs.push({
      field: 'content',
      storedLen: stored.content.length,
      liveLen: liveContent.length,
      firstDiffAt: idx,
      storedSnippet: snippetAround(stored.content, idx),
      liveSnippet: snippetAround(liveContent, idx),
      textMatches: textOnly(stored.content) === textOnly(liveContent),
    })
  }
  if (stored.date !== liveDate) {
    diffs.push({ field: 'date', stored: stored.date, live: liveDate })
  }
  return diffs
}

// ---------------------------------------------------------------------------
// Browser-page fetcher (each navigation resolves the SG challenge naturally)
// ---------------------------------------------------------------------------

async function fetchPostBySlugViaPage(page, slug) {
  const url = `${WP_API}/posts?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,date,content,excerpt`
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS })
  // SG challenge resolves via meta refresh; final URL ends up at the api endpoint.
  // If we're still on /.well-known/sgcaptcha/, wait for the JS challenge to redirect.
  const deadline = Date.now() + NAV_TIMEOUT_MS
  while (Date.now() < deadline) {
    const cur = page.url()
    if (cur.includes('/wp-json/') && !cur.includes('/sgcaptcha/')) break
    await page.waitForTimeout(500)
  }
  if (page.url().includes('/sgcaptcha/') || page.url().includes('chrome-error://')) {
    throw new Error(`Challenge did not clear, stuck at ${page.url()}`)
  }
  // The browser pretty-prints JSON inside <pre>. Read the text and parse.
  const text = await page.evaluate(() => {
    const pre = document.querySelector('pre')
    return pre ? pre.textContent : document.body ? document.body.textContent : ''
  })
  if (!text) throw new Error('Empty body')
  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    throw new Error(`Non-JSON body: ${text.slice(0, 160)}`)
  }
  return Array.isArray(data) ? data : []
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true })
  const articles = JSON.parse(readFileSync(POSTS_JSON, 'utf-8'))
  console.log(`Loaded ${articles.length} articles from posts.json`)
  console.log(
    `Auditing against ${WP_API} via Playwright page navigation (${POOL_SIZE} parallel tabs)\n`
  )

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
    ignoreHTTPSErrors: true,
  })

  try {
    // Warm up the context: hit homepage so any cookie SG sets gets planted.
    console.log('  Warm-up: navigating homepage...')
    const warmup = await context.newPage()
    await warmup
      .goto(ORIGIN + '/', { waitUntil: 'domcontentloaded', timeout: 45_000 })
      .catch(() => {})
    await warmup.waitForTimeout(2500)
    await warmup.close()

    const pages = []
    for (let i = 0; i < POOL_SIZE; i++) pages.push(await context.newPage())

    const t0 = Date.now()
    const results = new Array(articles.length)
    let cursor = 0
    let done = 0

    async function worker(page) {
      while (true) {
        const idx = cursor++
        if (idx >= articles.length) return
        const article = articles[idx]
        let attempt = 0
        let lastErr
        while (attempt < 3) {
          try {
            const live = await fetchPostBySlugViaPage(page, article.slug)
            await page.waitForTimeout(POST_NAV_SETTLE_MS)
            if (live.length === 0) {
              results[idx] = { slug: article.slug, status: 'missing-on-live' }
            } else if (live.length > 1) {
              results[idx] = { slug: article.slug, status: 'multiple-on-live', count: live.length }
            } else {
              const diffs = compare(article, live[0])
              results[idx] =
                diffs.length === 0
                  ? { slug: article.slug, status: 'match' }
                  : { slug: article.slug, status: 'drift', diffs, liveId: live[0].id }
            }
            lastErr = null
            break
          } catch (err) {
            lastErr = err
            attempt++
            await page.waitForTimeout(1500 * attempt)
          }
        }
        if (lastErr) {
          results[idx] = {
            slug: article.slug,
            status: 'fetch-error',
            error: String(lastErr.message || lastErr),
          }
        }
        done++
        if (done % 10 === 0 || done === articles.length) {
          const rate = (done / ((Date.now() - t0) / 1000)).toFixed(2)
          process.stdout.write(`  ${done}/${articles.length}  (${rate}/s)\n`)
        }
      }
    }

    await Promise.all(pages.map(worker))

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
    const buckets = {
      match: [],
      drift: [],
      'missing-on-live': [],
      'multiple-on-live': [],
      'fetch-error': [],
    }
    for (const r of results) (buckets[r.status] ||= []).push(r)

    console.log(`\nFinished in ${elapsed}s`)
    console.log(`  match:            ${buckets.match.length}`)
    console.log(`  drift:            ${buckets.drift.length}`)
    console.log(`  missing-on-live:  ${buckets['missing-on-live'].length}`)
    console.log(`  multiple-on-live: ${buckets['multiple-on-live'].length}`)
    console.log(`  fetch-error:      ${buckets['fetch-error'].length}`)

    const report = {
      auditedAt: new Date().toISOString(),
      wpApi: WP_API,
      totalArticles: articles.length,
      summary: {
        match: buckets.match.length,
        drift: buckets.drift.length,
        missingOnLive: buckets['missing-on-live'].length,
        multipleOnLive: buckets['multiple-on-live'].length,
        fetchError: buckets['fetch-error'].length,
      },
      drifts: buckets.drift,
      missingOnLive: buckets['missing-on-live'].map((r) => r.slug),
      multipleOnLive: buckets['multiple-on-live'],
      fetchErrors: buckets['fetch-error'],
    }
    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
    console.log(`\nFull report written to ${REPORT_PATH}`)

    if (buckets.drift.length > 0) {
      console.log('\nFirst 15 drifts:')
      for (const d of buckets.drift.slice(0, 15)) {
        const fields = d.diffs.map((x) => x.field).join(',')
        console.log(`  - ${d.slug} [${fields}]`)
      }
    }
    if (buckets['missing-on-live'].length > 0) {
      console.log('\nFirst 15 missing-on-live:')
      for (const r of buckets['missing-on-live'].slice(0, 15)) console.log(`  - ${r.slug}`)
    }
    if (buckets['fetch-error'].length > 0) {
      console.log('\nFirst 5 fetch-errors:')
      for (const e of buckets['fetch-error'].slice(0, 5)) {
        console.log(`  - ${e.slug}: ${e.error.slice(0, 200)}`)
      }
    }
  } finally {
    await context.close()
    await browser.close()
  }
}

main().catch((err) => {
  console.error('Audit failed:', err)
  process.exit(1)
})
