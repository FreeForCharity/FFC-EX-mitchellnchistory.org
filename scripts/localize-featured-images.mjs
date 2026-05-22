#!/usr/bin/env node

/**
 * Rewrite featuredImage.url in src/data/articles/posts.json from
 * `http(s)://mitchellnchistory.org/wp-content/...` to `/wp-content/...`
 * so the static export serves them locally after the DNS cutover instead of
 * round-tripping to the legacy host.
 *
 * Idempotent. Reports unchanged / rewritten / external counts.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const POSTS_JSON = join(__dirname, '..', 'src', 'data', 'articles', 'posts.json')

function localize(url) {
  if (!url) return url
  const m = url.match(/^https?:\/\/mitchellnchistory\.org(\/wp-content\/.*)$/i)
  if (m) return m[1]
  if (url.startsWith('//mitchellnchistory.org/wp-content/')) {
    return url.slice('//mitchellnchistory.org'.length)
  }
  return url
}

const posts = JSON.parse(readFileSync(POSTS_JSON, 'utf-8'))
let rewritten = 0,
  unchanged = 0,
  external = 0,
  none = 0

for (const post of posts) {
  const fi = post.featuredImage
  if (!fi || !fi.url) {
    none++
    continue
  }
  const newUrl = localize(fi.url)
  if (newUrl === fi.url) {
    if (/^https?:\/\//i.test(fi.url)) external++
    else unchanged++
  } else {
    fi.url = newUrl
    rewritten++
  }
}

writeFileSync(POSTS_JSON, JSON.stringify(posts, null, 2) + '\n')

console.log(`posts.json featured image URLs:`)
console.log(`  rewritten:           ${rewritten}`)
console.log(`  already-relative:    ${unchanged}`)
console.log(`  external (non-WP):   ${external}`)
console.log(`  no featuredImage:    ${none}`)
console.log(`  total posts:         ${posts.length}`)
