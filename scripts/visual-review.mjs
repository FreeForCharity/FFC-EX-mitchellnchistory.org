#!/usr/bin/env node

/**
 * Full visual + behavioral review of every built page.
 *
 * Walks every HTML file in out/, opens it in headless Chromium, and captures:
 *   - HTTP status of the page nav
 *   - Console errors (page error events + console.error())
 *   - Sub-resource failures (any 4xx/5xx network response)
 *   - Render sanity (presence of <h1>, visible body text)
 *   - Layout sanity (no overflow scrollbar at 1280px width, no zero-height main)
 *   - Screenshot at 1280x800 (saved per page when flagged, or for the curated sample)
 *
 * Outputs:
 *   - tmp/visual-review-report.json  (machine-readable per-page report)
 *   - tmp/visual-review-report.md    (human report, sorted by severity)
 *   - tmp/screenshots/<slug>.jpg     (flagged pages + curated top-level sample)
 */

import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'out')
const TMP = join(ROOT, 'tmp')
const SHOTS = join(TMP, 'screenshots')
const BASE = process.env.LOCAL_BASE_URL || 'http://localhost:3000'
const PARALLEL = Number(process.env.PARALLEL || 4)

// Paths that intentionally render a meta-refresh redirect — no <h1>, no body
// text. Treat as expected.
const REDIRECT_PAGES = new Set(['/ovm/', '/online-store/'])

// Always screenshot these top-level chrome routes so the user can spot-check.
const ALWAYS_SHOT = new Set([
  '/', '/about/', '/articles/', '/contact/', '/events/', '/membership/',
  '/museum/', '/scholarship/', '/newsletters/', '/videos/', '/resources/',
  '/about-mitchell-county/', '/apple-butter-festival/', '/corona-times/',
  '/history-bee/', '/overmountain-men/', '/penland-cemetery/',
  '/red-wilson/', '/scan-days/', '/tour-of-homes/',
  '/mitchell-county-nc-world-war-inductees/',
  '/mitchell-county-nc-world-war-enlistees/',
  '/cookie-policy/', '/donation-policy/', '/free-for-charity-donation-policy/',
  '/privacy-policy/', '/security-acknowledgements/', '/terms-of-service/',
  '/vulnerability-disclosure-policy/',
  '/ovm/', '/online-store/',
])

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else if (e.isFile() && e.name === 'index.html') out.push(full)
    else if (e.isFile() && e.name === '404.html') out.push(full)
  }
  return out
}

function urlPath(htmlPath) {
  let rel = htmlPath.replace(OUT, '').replace(/\\/g, '/')
  if (rel.endsWith('/index.html')) rel = rel.slice(0, -'index.html'.length)
  if (!rel.startsWith('/')) rel = '/' + rel
  return rel
}

function slug(urlPath) {
  if (urlPath === '/') return 'root'
  return urlPath.replace(/^\/|\/$/g, '').replace(/[^a-zA-Z0-9._-]+/g, '_')
}

async function reviewPage(page, url) {
  const consoleErrors = []
  const pageErrors = []
  const subresFails = []

  page.removeAllListeners('console')
  page.removeAllListeners('pageerror')
  page.removeAllListeners('response')

  // Track the URLs of benign prefetch 404s so we can correlate console messages.
  const benignPrefetch404s = new Set()
  page.on('response', (r) => {
    const s = r.status()
    if (s < 400) return
    if (new URL(r.url()).origin !== new URL(BASE).origin) return
    // Next.js static-export quirk: <Link> prefetch tries .txt route files
    // that aren't generated for output:'export'. Links still navigate fine,
    // these 404s are benign and the matching console.error is too.
    // Static routes use __next.<seg>.__PAGE__.txt; dynamic [slug] routes use
    // __next.<seg>.$d$slug.txt. Match both shapes.
    if (/\/__next\.[^/]+\.(__PAGE__|\$d\$[^/]+)\.txt(\?|$)/.test(r.url())) {
      benignPrefetch404s.add(r.url())
      return
    }
    subresFails.push({ status: s, url: r.url() })
  })
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const text = m.text()
    // Filter the generic "Failed to load resource ... 404 ..." line — these
    // pair with the benign Next.js prefetch 404s above. Some servers say
    // "(Not Found)", python http.server says "(File not found)". We can't
    // associate the console msg with the underlying request URL via
    // Playwright in all cases, so drop the generic line categorically.
    if (/^Failed to load resource: the server responded with a status of 4\d\d/.test(text)) return
    // Cosmetic browser warnings about cross-origin iframe permissions
    // (YouTube, Spotify, Anchor.fm) — not a site defect.
    if (/^Permissions policy violation:/.test(text)) return
    consoleErrors.push(text.slice(0, 240))
  })
  page.on('pageerror', (e) => pageErrors.push((e.message || String(e)).slice(0, 240)))

  let status = 0
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
    status = res?.status() ?? 0
  } catch (e) {
    return {
      url, status: 0, error: e.message,
      consoleErrors, pageErrors, subresFails,
      hasH1: false, textLen: 0, overflowsX: false, mainHeight: 0,
    }
  }

  const probe = await page.evaluate(() => {
    const h1 = document.querySelectorAll('h1').length
    const bodyText = (document.body?.innerText || '').replace(/\s+/g, ' ').trim()
    const overflowsX = document.documentElement.scrollWidth > window.innerWidth + 2
    const main = document.querySelector('main') || document.body
    const rect = main.getBoundingClientRect()
    return {
      hasH1: h1 > 0,
      textLen: bodyText.length,
      overflowsX,
      mainHeight: Math.round(rect.height),
      title: document.title || '',
    }
  })

  return {
    url, status, consoleErrors, pageErrors, subresFails,
    hasH1: probe.hasH1, textLen: probe.textLen,
    overflowsX: probe.overflowsX, mainHeight: probe.mainHeight, title: probe.title,
  }
}

function severity(r) {
  if (r.error || r.status === 0 || r.status >= 500) return 'CRITICAL'
  if (r.status >= 400 && r.status !== 404) return 'CRITICAL'
  if (r.pageErrors.length || r.consoleErrors.length) return 'HIGH'
  if (r.subresFails.length) return 'HIGH'
  // Meta-refresh redirect pages legitimately render no h1 and minimal text.
  if (REDIRECT_PAGES.has(r.path)) return r.overflowsX ? 'LOW' : 'OK'
  if (!r.hasH1) return 'MEDIUM'
  if (r.textLen < 100) return 'MEDIUM'
  if (r.overflowsX) return 'LOW'
  return 'OK'
}

async function main() {
  mkdirSync(SHOTS, { recursive: true })
  const files = walk(OUT)
  const urls = files.map((f) => `${BASE}${urlPath(f)}`).sort()
  console.log(`Reviewing ${urls.length} pages at ${BASE}\n`)

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 visual-review',
  })
  const pages = []
  for (let i = 0; i < PARALLEL; i++) pages.push(await ctx.newPage())

  const results = new Array(urls.length)
  let cursor = 0
  let done = 0
  const t0 = Date.now()

  async function worker(page) {
    while (true) {
      const idx = cursor++
      if (idx >= urls.length) return
      const url = urls[idx]
      const path = url.replace(BASE, '') || '/'
      const r = await reviewPage(page, url)
      r.path = path
      r.severity = severity(r)
      const sev = r.severity
      // Screenshot if flagged or curated
      if (sev !== 'OK' || ALWAYS_SHOT.has(path)) {
        try {
          const fn = join(SHOTS, slug(path) + '.jpg')
          await page.screenshot({ path: fn, fullPage: false, quality: 70, type: 'jpeg' })
          r.screenshot = fn.replace(ROOT, '').replace(/\\/g, '/')
        } catch (e) {
          r.screenshotError = e.message
        }
      }
      results[idx] = r
      done++
      if (done % 25 === 0 || done === urls.length) {
        const rate = (done / ((Date.now() - t0) / 1000)).toFixed(2)
        process.stdout.write(`  ${done}/${urls.length}  (${rate}/s)\n`)
      }
    }
  }

  await Promise.all(pages.map(worker))
  await browser.close()

  // Sort by severity rank then path
  const rank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, OK: 4 }
  results.sort((a, b) => rank[a.severity] - rank[b.severity] || a.path.localeCompare(b.path))

  // Summary
  const counts = {}
  for (const r of results) counts[r.severity] = (counts[r.severity] || 0) + 1
  console.log(`\nDone in ${((Date.now() - t0) / 1000).toFixed(1)}s`)
  for (const k of ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'OK']) {
    if (counts[k]) console.log(`  ${k.padEnd(8)} ${counts[k]}`)
  }

  // JSON report
  writeFileSync(join(TMP, 'visual-review-report.json'), JSON.stringify(results, null, 2))

  // Markdown report — show all non-OK pages, then a short summary table
  const md = []
  md.push('# Visual Review Report\n')
  md.push(`Pages reviewed: **${results.length}** at \`${BASE}\` on ${new Date().toISOString()}\n`)
  md.push('| Severity | Count |')
  md.push('| --- | ---: |')
  for (const k of ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'OK']) {
    md.push(`| ${k} | ${counts[k] || 0} |`)
  }
  md.push('')
  const flagged = results.filter((r) => r.severity !== 'OK')
  if (flagged.length) {
    md.push(`## ${flagged.length} flagged page(s)\n`)
    for (const r of flagged) {
      md.push(`### \`${r.path}\` — **${r.severity}**`)
      md.push(`- status: ${r.status}`)
      md.push(`- title: ${r.title || '(empty)'}`)
      md.push(`- hasH1: ${r.hasH1}, textLen: ${r.textLen}, mainHeight: ${r.mainHeight}px, overflowsX: ${r.overflowsX}`)
      if (r.error) md.push(`- ERROR: \`${r.error}\``)
      if (r.consoleErrors.length) md.push(`- console errors (${r.consoleErrors.length}):\n  - ${r.consoleErrors.slice(0, 5).join('\n  - ')}`)
      if (r.pageErrors.length) md.push(`- page errors (${r.pageErrors.length}):\n  - ${r.pageErrors.slice(0, 5).join('\n  - ')}`)
      if (r.subresFails.length) {
        md.push(`- sub-resource fails (${r.subresFails.length}):`)
        for (const s of r.subresFails.slice(0, 10)) md.push(`  - ${s.status} \`${s.url}\``)
      }
      if (r.screenshot) md.push(`- screenshot: [\`${r.screenshot}\`](.${r.screenshot})`)
      md.push('')
    }
  } else {
    md.push('## ✅ No flagged pages — every reviewed route is OK.\n')
  }
  md.push('## Curated screenshots (always captured)\n')
  for (const r of results) {
    if (r.severity === 'OK' && r.screenshot) {
      md.push(`- \`${r.path}\` → [\`${r.screenshot}\`](.${r.screenshot})`)
    }
  }
  writeFileSync(join(TMP, 'visual-review-report.md'), md.join('\n'))
  console.log(`\nReports:`)
  console.log(`  tmp/visual-review-report.json`)
  console.log(`  tmp/visual-review-report.md`)
  console.log(`  tmp/screenshots/  (${results.filter((r) => r.screenshot).length} images)`)

  process.exit(counts.CRITICAL ? 2 : counts.HIGH ? 1 : 0)
}

main().catch((e) => { console.error(e); process.exit(3) })
