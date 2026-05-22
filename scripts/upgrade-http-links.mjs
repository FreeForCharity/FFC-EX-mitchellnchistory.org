#!/usr/bin/env node

/**
 * Upgrade `http://` URLs in article and page content to `https://` where the
 * host has been verified to respond on TLS. The whitelist of upgradable hosts
 * comes from running the same HEAD/GET probe used by tmp/http-https-probe.json,
 * but is hardcoded here so the script can run without network access.
 *
 * Hosts known to be unreachable, SSL-broken, or HTTPS-incompatible are left
 * with the original http:// so click-through doesn't break.
 *
 * Idempotent.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const POSTS = join(ROOT, 'src', 'data', 'articles', 'posts.json')
const PAGES = join(ROOT, 'src', 'data', 'articles', 'pages.json')

// Verified TLS-reachable as of 2026-05. Re-probe if links break.
const UPGRADABLE_HOSTS = new Set([
  'averymuseum.org',
  'digital.ncdcr.gov',
  'en.wikipedia.org',
  'get.adobe.com',
  'michaeljoslin.com',
  'r20.rs6.net',
  'www.blueridgeheritage.com',
  'www.cdc.gov',
  'www.cfwnc.org',
  'www.fortwiki.com',
  'www.martygrant.com',
  'www.mitchellnews.com',
  'www.ncdar.org',
  'www.ncdhhs.gov',
  'www.oldtryon.com',
  'www.overmountainvictory.org',
  'www.piedmont-historical-society.org',
  'www.tngenweb.org',
  'yanceyhistoryassociation.org',
])

// Match http://<host> as a value inside `href="..."` only, so we never touch
// image src (where mixed content matters more and is handled elsewhere) or
// inline text mentions of urls.
function rewriteHrefs(content) {
  let changes = 0
  const out = content.replace(/href="http:\/\/([^/"]+)([^"]*)"/gi, (full, host, rest) => {
    if (UPGRADABLE_HOSTS.has(host.toLowerCase())) {
      changes++
      return `href="https://${host}${rest}"`
    }
    return full
  })
  return { content: out, changes }
}

function process(filePath) {
  const data = JSON.parse(readFileSync(filePath, 'utf-8'))
  let totalChanges = 0
  let docsChanged = 0
  for (const item of data) {
    if (!item.content) continue
    const { content, changes } = rewriteHrefs(item.content)
    if (changes > 0) {
      item.content = content
      totalChanges += changes
      docsChanged++
    }
  }
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
  return { totalChanges, docsChanged, total: data.length }
}

const postsResult = process(POSTS)
const pagesResult = process(PAGES)

console.log(
  `posts.json: upgraded ${postsResult.totalChanges} hrefs across ${postsResult.docsChanged}/${postsResult.total} articles`
)
console.log(
  `pages.json: upgraded ${pagesResult.totalChanges} hrefs across ${pagesResult.docsChanged}/${pagesResult.total} pages`
)
