import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { formatDate } from '@/lib/formatDate'

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

/** Get a single article by slug */
export function getArticleBySlug(slug: string): Article | undefined {
  return loadPosts().find((a) => a.slug === slug)
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
