import { readFileSync } from 'node:fs'
import { join } from 'node:path'

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

function loadPosts(): Article[] {
  const raw = readFileSync(join(DATA_DIR, 'posts.json'), 'utf-8')
  return JSON.parse(raw) as Article[]
}

function loadCategories(): Category[] {
  const raw = readFileSync(join(DATA_DIR, 'categories.json'), 'utf-8')
  return JSON.parse(raw) as Category[]
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

/** Format an article date for display */
export function formatArticleDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export interface WpPage {
  slug: string
  title: string
  date: string
  content: string
  excerpt: string
}

function loadPages(): WpPage[] {
  const raw = readFileSync(join(DATA_DIR, 'pages.json'), 'utf-8')
  return JSON.parse(raw) as WpPage[]
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
