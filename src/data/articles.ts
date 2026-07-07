import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { formatDate, parseUTCDateTime } from '@/lib/formatDate'

export interface Article {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  categories: string[]
  categorySlugs: string[]
  featuredImage: { url: string; alt: string } | null
}

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  categories: string[]
  featuredImage: { url: string; alt: string } | null
}

export interface Category {
  id: number
  name: string
  slug: string
}

const DATA_DIR = join(process.cwd(), 'src', 'data', 'articles')

let _postsCache: Article[] | null = null
let _slugMap: Map<string, Article> | null = null
let _categoriesCache: Category[] | null = null
let _pagesCache: WpPage[] | null = null

function loadPosts(): Article[] {
  if (!_postsCache) {
    const raw = readFileSync(join(DATA_DIR, 'posts.json'), 'utf-8')
    _postsCache = JSON.parse(raw) as Article[]
  }
  return _postsCache
}

function loadCategories(): Category[] {
  if (!_categoriesCache) {
    const raw = readFileSync(join(DATA_DIR, 'categories.json'), 'utf-8')
    _categoriesCache = JSON.parse(raw) as Category[]
  }
  return _categoriesCache
}

/** Get all articles (full data) */
export function getAllArticles(): Article[] {
  return loadPosts()
}

/** Get article metadata for listing (no content) */
export function getArticlesMeta(): ArticleMeta[] {
  return loadPosts().map(({ slug, title, date, excerpt, categories, featuredImage }) => ({
    slug,
    title,
    date,
    excerpt,
    categories,
    featuredImage,
  }))
}

/** Get all categories */
export function getAllCategories(): Category[] {
  return loadCategories()
}

/** Get a single article by slug (O(1) via cached Map) */
export function getArticleBySlug(slug: string): Article | undefined {
  if (!_slugMap) {
    _slugMap = new Map(loadPosts().map((a) => [a.slug, a]))
  }
  return _slugMap.get(slug)
}

/** Get all unique category names that have articles */
export function getActiveCategories(): string[] {
  const cats = new Set<string>()
  for (const a of loadPosts()) {
    for (const c of a.categories) {
      cats.add(c)
    }
  }
  return [...cats].sort()
}

/** Format an article date for display (UTC-safe) */
export function formatArticleDate(dateStr: string): string {
  return formatDate(dateStr)
}

function toMeta({ slug, title, date, excerpt, categories, featuredImage }: Article): ArticleMeta {
  return { slug, title, date, excerpt, categories, featuredImage }
}

let _chronoCache: Article[] | null = null

/** All articles sorted newest-first by publish timestamp (cached). */
function loadChronological(): Article[] {
  if (!_chronoCache) {
    _chronoCache = [...loadPosts()].sort(
      (a, b) => parseUTCDateTime(b.date).getTime() - parseUTCDateTime(a.date).getTime()
    )
  }
  return _chronoCache
}

/**
 * Chronological neighbors of an article: the next-newer and next-older
 * article in the archive. Either side is null at the archive's edges.
 */
export function getArticleNeighbors(slug: string): {
  newer: ArticleMeta | null
  older: ArticleMeta | null
} {
  const chrono = loadChronological()
  const index = chrono.findIndex((a) => a.slug === slug)
  if (index === -1) {
    return { newer: null, older: null }
  }
  return {
    newer: index > 0 ? toMeta(chrono[index - 1]) : null,
    older: index < chrono.length - 1 ? toMeta(chrono[index + 1]) : null,
  }
}

/**
 * Related articles: same-category articles nearest in publish date,
 * topped up with chronological neighbors when the category is small.
 */
export function getRelatedArticles(slug: string, limit = 3): ArticleMeta[] {
  const current = getArticleBySlug(slug)
  if (!current) {
    return []
  }
  const currentTime = parseUTCDateTime(current.date).getTime()
  const currentCategories = new Set(current.categories)

  const candidates = loadChronological().filter((a) => a.slug !== slug)
  const related = candidates
    .filter((a) => a.categories.some((c) => currentCategories.has(c)))
    .sort(
      (a, b) =>
        Math.abs(parseUTCDateTime(a.date).getTime() - currentTime) -
        Math.abs(parseUTCDateTime(b.date).getTime() - currentTime)
    )
    .slice(0, limit)

  if (related.length < limit) {
    const seen = new Set(related.map((a) => a.slug))
    const fillers = candidates
      .filter((a) => !seen.has(a.slug))
      .sort(
        (a, b) =>
          Math.abs(parseUTCDateTime(a.date).getTime() - currentTime) -
          Math.abs(parseUTCDateTime(b.date).getTime() - currentTime)
      )
    related.push(...fillers.slice(0, limit - related.length))
  }
  return related.map(toMeta)
}

export interface WpPage {
  slug: string
  title: string
  date: string
  content: string
  excerpt: string
}

function loadPages(): WpPage[] {
  if (!_pagesCache) {
    const raw = readFileSync(join(DATA_DIR, 'pages.json'), 'utf-8')
    _pagesCache = JSON.parse(raw) as WpPage[]
  }
  return _pagesCache
}

/** Get a WordPress page by slug */
export function getWpPage(slug: string): WpPage | undefined {
  return loadPages().find((p) => p.slug === slug)
}

/** Get multiple WordPress pages by slugs */
export function getWpPages(slugs: string[]): WpPage[] {
  const pages = loadPages()
  return slugs.map((s) => pages.find((p) => p.slug === s)).filter(Boolean) as WpPage[]
}
