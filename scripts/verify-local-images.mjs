#!/usr/bin/env node

/**
 * Visit a sample of built article pages on the local preview and assert that
 * no image request 404s. Confirms the wp-content localization holds end-to-end.
 */

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const POSTS = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'articles', 'posts.json'), 'utf-8'))
const BASE = process.env.LOCAL_BASE_URL || 'http://localhost:3000'
const SAMPLE = Number(process.env.SAMPLE_SIZE || 25)

function pickSample(arr, n) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

async function main() {
  const sample = pickSample(
    POSTS.filter((p) => p.featuredImage),
    SAMPLE
  )
  console.log(`Visiting ${sample.length} random articles at ${BASE}\n`)

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext()
  const page = await ctx.newPage()

  let totalImageReqs = 0
  let imageFailures = []

  page.on('response', (res) => {
    const url = res.url()
    const ct = res.headers()['content-type'] || ''
    if (url.includes('/wp-content/') || ct.startsWith('image/')) {
      totalImageReqs++
      const status = res.status()
      if (status >= 400) imageFailures.push({ url, status })
    }
  })

  let visited = 0
  for (const post of sample) {
    const url = `${BASE}/articles/${post.slug}/`
    try {
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
      if (!res || res.status() !== 200) {
        console.log(`  ${res?.status() || 'ERR'}  ${url}`)
      }
      visited++
    } catch (e) {
      console.log(`  EXC  ${url}  ${e.message}`)
    }
  }

  console.log(`\nVisited ${visited}/${sample.length} articles`)
  console.log(`Image-ish requests: ${totalImageReqs}`)
  console.log(`Image failures:     ${imageFailures.length}`)
  if (imageFailures.length) {
    console.log('\nFailures:')
    for (const f of imageFailures.slice(0, 25)) console.log(`  ${f.status}  ${f.url}`)
  }

  await browser.close()
  process.exit(imageFailures.length > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
