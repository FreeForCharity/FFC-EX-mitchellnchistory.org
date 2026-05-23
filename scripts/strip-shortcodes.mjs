#!/usr/bin/env node

/**
 * One-shot cleanup: strip unrendered WordPress shortcodes from migrated
 * content. The shortcodes were originally expanded by WP plugins
 * (Shortcodes Ultimate, et al) on the legacy host; the migration captured
 * post_content as-is, so they leak through as literal text on the static
 * site.
 *
 * Targeted shortcodes:
 *   - [su_button …]        — Shortcodes Ultimate self-closing button.
 *                            Mostly "back to Corona Times Home" buttons
 *                            on Corona Times posts; the target page is
 *                            going away. Strip entirely.
 *   - [/su_button]         — closing tag of the same family (if any).
 *   - [half] / [/half] /   — Shortcodes Ultimate column markers used on
 *     [one_half] / [/one_half] — Footsteps for Freedom episode pages.
 *     Render as literal text. Strip; if wrapped in a <p>...</p>, drop
 *     the empty paragraph too.
 *
 * Idempotent.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const FILES = [
  join(ROOT, 'src', 'data', 'articles', 'posts.json'),
  join(ROOT, 'src', 'data', 'articles', 'pages.json'),
]

function strip(content) {
  let n = 0
  // [su_button …]  — self-closing variant uses ”…” (curly quotes) for params;
  // match anything up to the first ] that's not inside a quoted param. Since
  // the params don't contain literal ], a non-greedy [^\]]* is safe.
  content = content.replace(/\[su_button[^\]]*\]/gi, () => {
    n++
    return ''
  })
  // [/su_button] closing tag (if any survive)
  content = content.replace(/\[\/su_button\]/gi, () => {
    n++
    return ''
  })
  // [half] / [/half] / [one_half] / [/one_half] column markers
  content = content.replace(/\[\/?(?:one_)?half\]/gi, () => {
    n++
    return ''
  })
  // Drop now-empty <p> wrappers that contained nothing but the stripped
  // shortcode + whitespace (or &nbsp;).
  content = content.replace(/<p>\s*(?:&nbsp;\s*)*<\/p>/gi, '')
  return { content, n }
}

let totalStripped = 0
for (const file of FILES) {
  const data = JSON.parse(readFileSync(file, 'utf-8'))
  let changedDocs = 0
  let stripped = 0
  for (const item of data) {
    if (!item.content) continue
    const { content, n } = strip(item.content)
    if (n > 0) {
      item.content = content
      stripped += n
      changedDocs++
    }
  }
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
  console.log(
    `  ${file.split(/[\\/]/).pop()}: stripped ${stripped} shortcode(s) across ${changedDocs} doc(s)`
  )
  totalStripped += stripped
}
console.log(`\nTotal shortcodes stripped: ${totalStripped}`)
