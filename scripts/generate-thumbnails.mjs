#!/usr/bin/env node
/**
 * Generate small WebP thumbnails for every article featured image.
 *
 * The articles hub renders up to 24 featured images in a grid at ~400px
 * wide, but the stored featured images are full-resolution originals
 * (averaging ~210 KB, 66 MB total) — a large, wasteful download for
 * thumbnail-sized cells. This script produces a 480px-wide WebP for each
 * local featured image at a deterministic path under public/thumbnails/,
 * which `thumbnailSrc()` (src/lib/imageUrl.ts) resolves at render time.
 *
 * Idempotent: skips a thumbnail that already exists and is newer than its
 * source. Run via `npm run thumbnails`; committed output ships with the repo.
 */
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const POSTS = join(ROOT, 'src', 'data', 'articles', 'posts.json')
const PUBLIC = join(ROOT, 'public')
const THUMB_ROOT = join(PUBLIC, 'thumbnails')
const THUMB_WIDTH = 480

/** Deterministic thumbnail path for a featured-image URL (mirrors imageUrl.ts). */
export function thumbnailRelPath(url) {
  return '/thumbnails' + url.replace(/\.(jpe?g|png|webp|gif)$/i, '.webp')
}

async function main() {
  const posts = JSON.parse(readFileSync(POSTS, 'utf-8'))
  const featured = posts
    .map((p) => p.featuredImage?.url)
    .filter((u) => u && u.startsWith('/wp-content'))

  let generated = 0
  let skipped = 0
  const missingSources = []

  for (const url of featured) {
    const src = join(PUBLIC, url)
    if (!existsSync(src)) {
      missingSources.push(url)
      continue
    }
    const dest = join(PUBLIC, thumbnailRelPath(url))
    if (existsSync(dest) && statSync(dest).mtimeMs >= statSync(src).mtimeMs) {
      skipped++
      continue
    }
    mkdirSync(dirname(dest), { recursive: true })
    await sharp(src)
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(dest)
    generated++
  }

  console.log(`Thumbnails: ${generated} generated, ${skipped} up-to-date, ${featured.length} total`)
  if (missingSources.length) {
    console.warn(`WARNING: ${missingSources.length} featured images missing on disk:`)
    missingSources.forEach((u) => console.warn('  ' + u))
    process.exitCode = 1
  }
  void THUMB_ROOT
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
