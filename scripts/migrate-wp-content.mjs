#!/usr/bin/env node

/**
 * WordPress to Next.js Content Migration Script
 *
 * Fetches all posts and select pages from the Mitchell County Historical Society
 * WordPress site via the REST API and saves them as JSON data files for the
 * Next.js static site.
 *
 * Usage: node scripts/migrate-wp-content.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_DIR = join(ROOT, 'src', 'data', 'articles')

const WP_API = 'https://mitchellnchistory.org/wp-json/wp/v2'
const PER_PAGE = 100

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`)
  const totalPages = res.headers.get('x-wp-totalpages')
  const total = res.headers.get('x-wp-total')
  return { data: await res.json(), totalPages: Number(totalPages), total: Number(total) }
}

/**
 * Strip WordPress-specific markup to produce cleaner HTML.
 * We keep the HTML structure but remove lazy-load data attributes,
 * wp-caption wrappers, and inline styles.
 */
function cleanHTML(html) {
  return (
    html
      // --- Security: strip dangerous content ---
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/\s*on\w+="[^"]*"/gi, '')
      .replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
      // Replace data-src with src for lazy-loaded images
      .replace(/src="data:image\/[^"]*"\s*/g, '')
      .replace(/data-src="/g, 'src="')
      // Remove inline styles
      .replace(/\s*style="[^"]*"/g, '')
      // Remove WordPress-specific classes but keep general ones
      .replace(/\s*class="[^"]*"/g, '')
      // Remove empty paragraphs
      .replace(/<p>\s*&nbsp;\s*<\/p>/g, '')
      // Remove wp-caption divs but keep the image and caption
      .replace(/<div[^>]*wp-caption[^>]*>/g, '<figure>')
      .replace(
        /<p[^>]*wp-caption-text[^>]*>(.*?)<\/p>\s*<\/div>/g,
        '<figcaption>$1</figcaption></figure>'
      )
      // Clean up remaining unclosed divs from wp-caption
      .replace(/<\/div>\s*$/g, '')
      // Normalize whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

/**
 * Decode HTML entities in titles
 */
function decodeEntities(str) {
  return str
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8230;/g, '\u2026')
    .replace(/&hellip;/g, '\u2026')
}

/**
 * Strip HTML tags from a string (for plain-text excerpts)
 */
function stripHTML(html) {
  return html.replace(/<[^>]+>/g, '').trim()
}

// ---------------------------------------------------------------------------
// Fetch categories
// ---------------------------------------------------------------------------

async function fetchCategories() {
  const { data } = await fetchJSON(`${WP_API}/categories?per_page=100&_fields=id,name,slug`)
  const map = {}
  for (const cat of data) {
    map[cat.id] = { name: cat.name, slug: cat.slug }
  }
  return map
}

// ---------------------------------------------------------------------------
// Fetch all posts (paginated)
// ---------------------------------------------------------------------------

async function fetchAllPosts() {
  const posts = []
  let page = 1

  // First request to get total pages
  const first = await fetchJSON(
    `${WP_API}/posts?per_page=${PER_PAGE}&page=${page}&_fields=id,slug,title,date,content,excerpt,categories,featured_media`
  )
  posts.push(...first.data)
  const totalPages = first.totalPages
  console.log(`  Total posts: ${first.total}, pages: ${totalPages}`)

  // Fetch remaining pages
  for (page = 2; page <= totalPages; page++) {
    console.log(`  Fetching page ${page}/${totalPages}...`)
    const { data } = await fetchJSON(
      `${WP_API}/posts?per_page=${PER_PAGE}&page=${page}&_fields=id,slug,title,date,content,excerpt,categories,featured_media`
    )
    posts.push(...data)
  }

  return posts
}

// ---------------------------------------------------------------------------
// Fetch featured image URL for a media ID
// ---------------------------------------------------------------------------

const mediaCache = {}
async function fetchMediaURL(mediaId) {
  if (!mediaId || mediaId === 0) return null
  if (mediaCache[mediaId]) return mediaCache[mediaId]

  try {
    const { data } = await fetchJSON(`${WP_API}/media/${mediaId}?_fields=source_url,alt_text`)
    const result = { url: data.source_url, alt: data.alt_text || '' }
    mediaCache[mediaId] = result
    return result
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Fetch specific WordPress pages
// ---------------------------------------------------------------------------

const PAGE_SLUGS_TO_MIGRATE = [
  'scholarship',
  'scan',
  'penland-cemetery',
  'ovm',
  'the-corona-times',
  'newsletters',
  'tour-of-homes',
  'history-bee',
  'event-videos',
  'links',
  'mitchell-county-nc-world-war-inductees',
  'mitchell-county-nc-world-war-enlistees',
  'red-wilson',
  'about-mitchell-county',
  '2020-videos',
  '2019-videos',
  '2017-videos',
  '2016-videos',
  'resources',
]

async function fetchPages() {
  const pages = []
  for (const slug of PAGE_SLUGS_TO_MIGRATE) {
    console.log(`  Fetching page: ${slug}`)
    try {
      const { data } = await fetchJSON(
        `${WP_API}/pages?slug=${slug}&_fields=id,slug,title,content,excerpt,date`
      )
      if (data.length > 0) {
        pages.push(data[0])
      } else {
        console.log(`    ⚠ Page not found: ${slug}`)
      }
    } catch (err) {
      console.log(`    ✗ Error fetching ${slug}: ${err.message}`)
    }
  }
  return pages
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('WordPress Content Migration')
  console.log('===========================\n')

  // Ensure output directory
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }

  // 1. Fetch categories
  console.log('1. Fetching categories...')
  const categoryMap = await fetchCategories()
  console.log(`   Found ${Object.keys(categoryMap).length} categories\n`)

  // Save categories
  const categories = Object.entries(categoryMap).map(([id, cat]) => ({
    id: Number(id),
    name: cat.name,
    slug: cat.slug,
  }))
  writeFileSync(join(DATA_DIR, 'categories.json'), JSON.stringify(categories, null, 2))

  // 2. Fetch all posts
  console.log('2. Fetching all posts...')
  const rawPosts = await fetchAllPosts()
  console.log(`   Fetched ${rawPosts.length} posts\n`)

  // 3. Fetch featured images (batch with concurrency limit)
  console.log('3. Fetching featured images...')
  const uniqueMediaIds = [...new Set(rawPosts.map((p) => p.featured_media).filter(Boolean))]
  console.log(`   ${uniqueMediaIds.length} unique featured images to fetch`)

  // Fetch in batches of 10
  for (let i = 0; i < uniqueMediaIds.length; i += 10) {
    const batch = uniqueMediaIds.slice(i, i + 10)
    await Promise.all(batch.map((id) => fetchMediaURL(id)))
    if ((i + 10) % 50 === 0) {
      console.log(`   Fetched ${Math.min(i + 10, uniqueMediaIds.length)}/${uniqueMediaIds.length}`)
    }
  }
  console.log()

  // 4. Transform posts
  console.log('4. Transforming posts...')
  const articles = rawPosts.map((post) => {
    const catNames = (post.categories || []).map((id) => categoryMap[id]?.name).filter(Boolean)

    const catSlugs = (post.categories || []).map((id) => categoryMap[id]?.slug).filter(Boolean)

    const featuredImage = mediaCache[post.featured_media] || null

    return {
      slug: post.slug,
      title: decodeEntities(post.title.rendered),
      date: post.date,
      excerpt: stripHTML(decodeEntities(post.excerpt.rendered)),
      content: cleanHTML(post.content.rendered),
      categories: catNames,
      categorySlugs: catSlugs,
      featuredImage: featuredImage ? { url: featuredImage.url, alt: featuredImage.alt } : null,
    }
  })

  // Sort by date descending
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  writeFileSync(join(DATA_DIR, 'posts.json'), JSON.stringify(articles, null, 2))
  console.log(`   Saved ${articles.length} articles to posts.json\n`)

  // 5. Fetch WordPress pages
  console.log('5. Fetching WordPress pages...')
  const rawPages = await fetchPages()
  console.log(`   Fetched ${rawPages.length} pages\n`)

  console.log('6. Transforming pages...')
  const wpPages = rawPages.map((page) => ({
    slug: page.slug,
    title: decodeEntities(page.title.rendered),
    date: page.date,
    content: cleanHTML(page.content.rendered),
    excerpt: stripHTML(decodeEntities(page.excerpt?.rendered || '')),
  }))

  writeFileSync(join(DATA_DIR, 'pages.json'), JSON.stringify(wpPages, null, 2))
  console.log(`   Saved ${wpPages.length} pages to pages.json\n`)

  // Summary
  console.log('✓ Migration complete!')
  console.log(`  ${articles.length} articles → src/data/articles/posts.json`)
  console.log(`  ${wpPages.length} pages → src/data/articles/pages.json`)
  console.log(`  ${categories.length} categories → src/data/articles/categories.json`)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
