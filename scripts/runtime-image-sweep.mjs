#!/usr/bin/env node

/**
 * Runtime image sweep: visit every built HTML page in a headless browser,
 * watch every image network request, and report any 4xx/5xx responses.
 * Complement to the static audit-all-images.mjs scan.
 */

import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'out')
const REPORT = join(ROOT, 'tmp', 'runtime-image-sweep-report.json')
const BASE = process.env.LOCAL_BASE_URL || 'http://localhost:3000'
const PARALLEL = Number(process.env.PARALLEL || 6)

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.isFile() && entry.name === 'index.html') out.push(full)
    else if (entry.isFile() && entry.name === '404.html') out.push(full)
  }
  return out
}

function htmlPathToUrlPath(htmlPath) {
  let rel = htmlPath.replace(OUT, '').replace(/\\/g, '/')
  if (rel.endsWith('/index.html')) rel = rel.slice(0, -'index.html'.length)
  if (!rel.startsWith('/')) rel = '/' + rel
  return rel
}

async function main() {
  if (!existsSync(OUT)) {
    console.error(`No build at ${OUT}. Run \`npm run build\` first.`)
    process.exit(1)
  }
  mkdirSync(dirname(REPORT), { recursive: true })

  const files = walk(OUT)
  const urls = files.map((f) => `${BASE}${htmlPathToUrlPath(f)}`)
  console.log(`Visiting ${urls.length} pages at ${BASE} with ${PARALLEL} parallel tabs\n`)

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext()
  const pages = []
  for (let i = 0; i < PARALLEL; i++) pages.push(await ctx.newPage())

  const failures = new Map() // url -> { status, sourcePages: Set }
  let totalImageReqs = 0

  for (const page of pages) {
    page.on('response', (res) => {
      const u = res.url()
      const ct = res.headers()['content-type'] || ''
      const isImg =
        /\.(jpe?g|png|gif|webp|svg|tiff?|ico|avif)(?:$|\?|#)/i.test(u) ||
        u.includes('/wp-content/') ||
        u.includes('/Images/') ||
        ct.startsWith('image/')
      if (!isImg) return
      totalImageReqs++
      const status = res.status()
      if (status >= 400) {
        if (!failures.has(u)) failures.set(u, { status, sourcePages: new Set() })
      }
    })
  }

  const t0 = Date.now()
  let cursor = 0,
    done = 0
  async function worker(page) {
    while (true) {
      const idx = cursor++
      if (idx >= urls.length) return
      const url = urls[idx]
      // Track which page each failure originated on.
      const seenBefore = new Set(failures.keys())
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
      } catch (e) {
        // Best-effort: timeouts can happen, keep going.
      }
      for (const k of failures.keys()) {
        if (!seenBefore.has(k)) failures.get(k).sourcePages.add(url.replace(BASE, ''))
      }
      done++
      if (done % 25 === 0 || done === urls.length) {
        const rate = (done / ((Date.now() - t0) / 1000)).toFixed(2)
        process.stdout.write(
          `  ${done}/${urls.length}  (${rate}/s)  imageReqs=${totalImageReqs}  failures=${failures.size}\n`
        )
      }
    }
  }

  await Promise.all(pages.map(worker))

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  console.log(`\nDone in ${elapsed}s`)
  console.log(`Total pages visited:    ${urls.length}`)
  console.log(`Total image requests:   ${totalImageReqs}`)
  console.log(`Unique failure URLs:    ${failures.size}`)

  if (failures.size) {
    console.log('\nFailures:')
    for (const [u, info] of failures.entries()) {
      const pages = [...info.sourcePages].slice(0, 5)
      console.log(`  ${info.status}  ${u}  (seen on ${info.sourcePages.size} page(s))`)
      for (const p of pages) console.log(`      ${p}`)
    }
  }

  writeFileSync(
    REPORT,
    JSON.stringify(
      {
        base: BASE,
        pagesVisited: urls.length,
        totalImageRequests: totalImageReqs,
        failures: [...failures.entries()].map(([u, v]) => ({
          url: u,
          status: v.status,
          pagesSeenOn: [...v.sourcePages],
        })),
      },
      null,
      2
    )
  )
  console.log(`\nReport → ${REPORT}`)

  await browser.close()
  process.exit(failures.size > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
