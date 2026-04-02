#!/usr/bin/env node
/**
 * Post-process migrated WordPress JSON data to clean up
 * Divi/ET Builder shortcodes, normalize URLs, and convert
 * lazy-load attributes. Run once after migration.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sanitize from 'sanitize-html'

const DATA_DIR = join(process.cwd(), 'src', 'data', 'articles')
const WP_ORIGIN = 'https://mitchellnchistory.org'

function cleanContent(html) {
  // Sanitize with allowlist
  let cleaned = sanitize(html, {
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

  cleaned = cleaned
    // Strip Divi/ET Builder shortcodes
    .replace(/\[\/?(et_pb_|et_fb_)[^\]]*\]/g, '')
    // Replace data-src with src for lazy-loaded images
    .replace(/src="data:image\/[^"]*"\s*/g, '')
    .replace(/data-src="/g, 'src="')
    // Convert data-srcset/data-sizes
    .replace(/data-srcset="/g, 'srcset="')
    .replace(/data-sizes="/g, 'sizes="')
    // Normalize relative wp-content URLs
    .replace(/src="\.\.\/wp-content\//g, `src="${WP_ORIGIN}/wp-content/`)
    .replace(/href="\.\.\/wp-content\//g, `href="${WP_ORIGIN}/wp-content/`)
    .replace(/src="\/wp-content\//g, `src="${WP_ORIGIN}/wp-content/`)
    .replace(/href="\/wp-content\//g, `href="${WP_ORIGIN}/wp-content/`)
    // Normalize protocol-relative URLs
    .replace(/src="\/\/mitchellnchistory\.org\//g, `src="https://mitchellnchistory.org/`)
    .replace(/href="\/\/mitchellnchistory\.org\//g, `href="https://mitchellnchistory.org/`)
    // Remove empty paragraphs
    .replace(/<p>\s*&nbsp;\s*<\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return cleaned
}

function processFile(filename) {
  const filepath = join(DATA_DIR, filename)
  const data = JSON.parse(readFileSync(filepath, 'utf-8'))

  for (const item of data) {
    if (item.content) {
      item.content = cleanContent(item.content)
    }
  }

  writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  console.log(`Processed ${data.length} items in ${filename}`)
}

processFile('pages.json')
processFile('posts.json')
console.log('Done!')
