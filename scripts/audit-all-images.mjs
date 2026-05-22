#!/usr/bin/env node

/**
 * Exhaustive image-reference audit of the built static site.
 *
 * Walks every HTML file in out/, extracts every image-ish reference
 * (img src, img srcset, source src, picture sources, video poster,
 * link href for icons/manifests, OG/Twitter meta image, JSON-LD image
 * fields including string and array shapes, Next.js __NEXT_DATA__ blob),
 * resolves each to a local out/ path (treating absolute
 * mitchellnchistory.org URLs as their path after cutover), and reports
 * every reference that does not resolve to a file on disk.
 *
 * Output: tmp/image-audit-report.json + console summary.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from 'node:fs'
import { join, dirname, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'out')
const REPORT = join(ROOT, 'tmp', 'image-audit-report.json')
const APEX_HOSTS = ['mitchellnchistory.org', 'www.mitchellnchistory.org']

// ---------------------------------------------------------------------------
// HTML walker
// ---------------------------------------------------------------------------

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full)
  }
  return out
}

// ---------------------------------------------------------------------------
// Reference extraction
// ---------------------------------------------------------------------------

const RE_IMG_SRC = /<img\b[^>]*?\bsrc=("([^"]*)"|'([^']*)')/gi
const RE_IMG_SRCSET = /<img\b[^>]*?\bsrcset=("([^"]*)"|'([^']*)')/gi
const RE_SOURCE_SRC = /<source\b[^>]*?\bsrc=("([^"]*)"|'([^']*)')/gi
const RE_SOURCE_SRCSET = /<source\b[^>]*?\bsrcset=("([^"]*)"|'([^']*)')/gi
const RE_VIDEO_POSTER = /<video\b[^>]*?\bposter=("([^"]*)"|'([^']*)')/gi
const RE_LINK_ICON = /<link\b[^>]*?\brel=("([^"]*)"|'([^']*)')[^>]*?\bhref=("([^"]*)"|'([^']*)')/gi
const RE_META_PROP =
  /<meta\b[^>]*?\bproperty=("([^"]*)"|'([^']*)')[^>]*?\bcontent=("([^"]*)"|'([^']*)')/gi
const RE_META_NAME =
  /<meta\b[^>]*?\bname=("([^"]*)"|'([^']*)')[^>]*?\bcontent=("([^"]*)"|'([^']*)')/gi
const RE_JSONLD =
  /<script\b[^>]*?\btype=("application\/ld\+json"|'application\/ld\+json')\s*>([\s\S]*?)<\/script>/gi
const RE_NEXT_DATA =
  /<script\b[^>]*?\bid=("__NEXT_DATA__"|'__NEXT_DATA__')[^>]*>([\s\S]*?)<\/script>/i

const ICON_RELS = new Set([
  'icon',
  'shortcut icon',
  'apple-touch-icon',
  'apple-touch-icon-precomposed',
  'mask-icon',
  'manifest',
])
const IMAGE_META_KEYS = new Set([
  'og:image',
  'og:image:url',
  'og:image:secure_url',
  'twitter:image',
  'twitter:image:src',
])

function pickAttr(match, ...indices) {
  for (const i of indices) {
    if (match[i] != null) return match[i]
  }
  return ''
}

function splitSrcset(value) {
  return value
    .split(',')
    .map((entry) => entry.trim().split(/\s+/)[0])
    .filter(Boolean)
}

function* walkJsonForImages(node, source) {
  if (node == null) return
  if (typeof node === 'string') return
  if (Array.isArray(node)) {
    for (const item of node) yield* walkJsonForImages(item, source)
    return
  }
  if (typeof node === 'object') {
    for (const [key, val] of Object.entries(node)) {
      const kl = key.toLowerCase()
      if (
        kl === 'image' ||
        kl === 'images' ||
        kl === 'logo' ||
        kl === 'thumbnailurl' ||
        kl === 'contenturl' ||
        kl === 'url'
      ) {
        if (typeof val === 'string' && looksLikeImageUrl(val)) {
          yield { url: val, source }
        } else if (Array.isArray(val)) {
          for (const item of val) {
            if (typeof item === 'string' && looksLikeImageUrl(item)) yield { url: item, source }
            else if (
              item &&
              typeof item === 'object' &&
              typeof item.url === 'string' &&
              looksLikeImageUrl(item.url)
            ) {
              yield { url: item.url, source }
            }
          }
        } else if (
          val &&
          typeof val === 'object' &&
          typeof val.url === 'string' &&
          looksLikeImageUrl(val.url)
        ) {
          yield { url: val.url, source }
        }
      }
      yield* walkJsonForImages(val, source)
    }
  }
}

function looksLikeImageUrl(s) {
  if (!s) return false
  if (s.startsWith('data:')) return false
  // Heuristic: ends in an image extension, OR points under /wp-content/uploads/, OR is in /Images/
  return (
    /\.(jpe?g|png|gif|webp|svg|tiff?|ico|avif)(?:[?#].*)?$/i.test(s) ||
    /\/wp-content\/uploads\//i.test(s) ||
    /\/Images\//i.test(s) ||
    /\/web-app-manifest/i.test(s)
  )
}

function extractReferences(html, fileBasename) {
  const refs = []
  function push(url, kind) {
    if (!url) return
    // Skip non-resolvable schemes. Case-insensitive on the scheme prefix so
    // mixed-case like JavaScript:... or VBScript:... is also skipped.
    if (/^(?:data|mailto|javascript|vbscript|tel|sms):/i.test(url) || url.startsWith('#')) return
    refs.push({ url: url.trim(), kind })
  }

  let m
  RE_IMG_SRC.lastIndex = 0
  while ((m = RE_IMG_SRC.exec(html))) push(pickAttr(m, 2, 3), 'img.src')
  RE_IMG_SRCSET.lastIndex = 0
  while ((m = RE_IMG_SRCSET.exec(html))) {
    for (const u of splitSrcset(pickAttr(m, 2, 3))) push(u, 'img.srcset')
  }
  RE_SOURCE_SRC.lastIndex = 0
  while ((m = RE_SOURCE_SRC.exec(html))) push(pickAttr(m, 2, 3), 'source.src')
  RE_SOURCE_SRCSET.lastIndex = 0
  while ((m = RE_SOURCE_SRCSET.exec(html))) {
    for (const u of splitSrcset(pickAttr(m, 2, 3))) push(u, 'source.srcset')
  }
  RE_VIDEO_POSTER.lastIndex = 0
  while ((m = RE_VIDEO_POSTER.exec(html))) push(pickAttr(m, 2, 3), 'video.poster')
  RE_LINK_ICON.lastIndex = 0
  while ((m = RE_LINK_ICON.exec(html))) {
    const rel = pickAttr(m, 2, 3).toLowerCase()
    if (ICON_RELS.has(rel)) push(pickAttr(m, 5, 6), `link.${rel}`)
  }
  RE_META_PROP.lastIndex = 0
  while ((m = RE_META_PROP.exec(html))) {
    const prop = pickAttr(m, 2, 3).toLowerCase()
    if (IMAGE_META_KEYS.has(prop)) push(pickAttr(m, 5, 6), `meta.${prop}`)
  }
  RE_META_NAME.lastIndex = 0
  while ((m = RE_META_NAME.exec(html))) {
    const name = pickAttr(m, 2, 3).toLowerCase()
    if (IMAGE_META_KEYS.has(name)) push(pickAttr(m, 5, 6), `meta.${name}`)
  }
  RE_JSONLD.lastIndex = 0
  while ((m = RE_JSONLD.exec(html))) {
    const raw = (m[2] || '')
      .replace(/\\u003c/gi, '<')
      .replace(/\\u003e/gi, '>')
      .replace(/\\u0026/gi, '&')
    try {
      const data = JSON.parse(raw)
      for (const { url } of walkJsonForImages(data, 'json-ld')) push(url, 'json-ld.image')
    } catch {
      /* ignore unparseable */
    }
  }
  const next = RE_NEXT_DATA.exec(html)
  if (next && next[2]) {
    try {
      const data = JSON.parse(next[2])
      for (const { url } of walkJsonForImages(data, 'next-data')) push(url, 'next-data.image')
    } catch {
      /* ignore */
    }
  }
  return refs
}

// ---------------------------------------------------------------------------
// URL → on-disk resolution
// ---------------------------------------------------------------------------

function resolveToOutPath(url, htmlPath) {
  // Strip query and hash.
  const stripped = url.replace(/[?#].*$/, '')
  let pathname
  if (/^https?:\/\//i.test(stripped)) {
    let u
    try {
      u = new URL(stripped)
    } catch {
      return { resolvable: false, reason: 'unparseable-url' }
    }
    if (!APEX_HOSTS.includes(u.hostname.toLowerCase())) {
      return { resolvable: false, reason: 'external-host', host: u.hostname }
    }
    pathname = u.pathname
  } else if (stripped.startsWith('//')) {
    let u
    try {
      u = new URL('https:' + stripped)
    } catch {
      return { resolvable: false, reason: 'unparseable-url' }
    }
    if (!APEX_HOSTS.includes(u.hostname.toLowerCase())) {
      return { resolvable: false, reason: 'external-host', host: u.hostname }
    }
    pathname = u.pathname
  } else if (stripped.startsWith('/')) {
    pathname = stripped
  } else {
    // Relative — resolve against this page's directory.
    const base = posix.dirname(htmlPath.replace(OUT.replace(/\\/g, '/'), '').replace(/\\/g, '/'))
    pathname = posix.normalize(posix.join('/', base, stripped))
  }
  // Out path is OUT + pathname; pathname may need decodeURI for accented filenames.
  let local
  try {
    local = join(OUT, decodeURI(pathname))
  } catch {
    local = join(OUT, pathname)
  }
  return {
    resolvable: true,
    pathname,
    local,
    exists: existsSync(local) && statSync(local).isFile(),
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  if (!existsSync(OUT)) {
    console.error(`No build output at ${OUT}. Run \`npm run build\` first.`)
    process.exit(1)
  }
  mkdirSync(dirname(REPORT), { recursive: true })

  const htmlFiles = walk(OUT)
  console.log(`Scanning ${htmlFiles.length} HTML files in out/...\n`)

  let totalRefs = 0
  const buckets = {
    ok: 0,
    missing: [], // resolves to out/ but file not present
    externalHosts: new Map(), // host -> count
    unparseable: [],
  }
  // Track per-URL missing so we don't print the same broken thing 400 times.
  const missingByUrl = new Map()

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf-8')
    const refs = extractReferences(html, file)
    const fileShort = file.replace(OUT, '').replace(/\\/g, '/') || '/index.html'
    for (const { url, kind } of refs) {
      totalRefs++
      const res = resolveToOutPath(url, file)
      if (!res.resolvable) {
        if (res.reason === 'external-host') {
          buckets.externalHosts.set(res.host, (buckets.externalHosts.get(res.host) || 0) + 1)
        } else {
          buckets.unparseable.push({ url, kind, file: fileShort })
        }
        continue
      }
      if (res.exists) {
        buckets.ok++
      } else {
        const key = `${res.pathname}|${kind}`
        if (!missingByUrl.has(key)) {
          missingByUrl.set(key, { pathname: res.pathname, kind, refs: [] })
        }
        missingByUrl.get(key).refs.push(fileShort)
      }
    }
  }

  buckets.missing = [...missingByUrl.values()].map((m) => ({
    pathname: m.pathname,
    kind: m.kind,
    referencingPages: m.refs.length,
    samplePages: m.refs.slice(0, 5),
  }))

  console.log(`Total image references scanned: ${totalRefs}`)
  console.log(`  resolved & exists on disk:   ${buckets.ok}`)
  console.log(
    `  external hosts (skipped):    ${[...buckets.externalHosts.values()].reduce((a, b) => a + b, 0)}`
  )
  console.log(`  unparseable URLs:            ${buckets.unparseable.length}`)
  console.log(
    `  MISSING (broken refs):       ${buckets.missing.reduce((s, m) => s + m.referencingPages, 0)}  (${buckets.missing.length} unique paths)`
  )

  if (buckets.externalHosts.size > 0) {
    console.log('\nExternal hosts seen:')
    for (const [host, n] of [...buckets.externalHosts.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${n.toString().padStart(5)}  ${host}`)
    }
  }

  if (buckets.missing.length > 0) {
    console.log('\nMissing (unique paths):')
    for (const m of buckets.missing) {
      console.log(`  [${m.kind}] ${m.pathname}  — referenced by ${m.referencingPages} page(s)`)
      for (const r of m.samplePages) console.log(`      e.g. ${r}`)
    }
  }
  if (buckets.unparseable.length > 0) {
    console.log('\nUnparseable URLs (first 10):')
    for (const u of buckets.unparseable.slice(0, 10)) {
      console.log(`  [${u.kind}] ${u.url}  in ${u.file}`)
    }
  }

  writeFileSync(
    REPORT,
    JSON.stringify(
      {
        scannedHtmlFiles: htmlFiles.length,
        totalRefs,
        ok: buckets.ok,
        externalHosts: Object.fromEntries(buckets.externalHosts),
        unparseable: buckets.unparseable,
        missing: buckets.missing,
      },
      null,
      2
    )
  )
  console.log(`\nFull report → ${REPORT}`)
  process.exit(buckets.missing.length > 0 ? 1 : 0)
}

main()
