'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import type { ArticleMeta } from '@/data/articles'
import { formatDate } from '@/lib/formatDate'
import { localImageSrc } from '@/lib/imageUrl'

const ARTICLES_PER_PAGE = 24

interface ArticlesListProps {
  articles: ArticleMeta[]
  categories: string[]
}

export default function ArticlesList({ articles, categories }: ArticlesListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of articles) {
      for (const c of a.categories) {
        counts[c] = (counts[c] || 0) + 1
      }
    }
    return counts
  }, [articles])

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const filtered = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.categories.includes(selectedCategory)

    if (!matchesCategory) {
      return false
    }

    if (!normalizedSearchQuery) {
      return true
    }

    const searchableText = [
      article.title,
      article.excerpt,
      article.categories.join(' '),
      formatDate(article.date),
    ]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(normalizedSearchQuery)
  })

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE)
  const pageArticles = filtered.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  )

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setCurrentPage(1)
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-8">
        <label htmlFor="article-search" className="mb-2 block text-sm font-semibold text-dark">
          Search articles
        </label>
        <div className="relative max-w-2xl">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
          />
          <input
            id="article-search"
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title, excerpt, category, or date"
            className="h-12 w-full rounded-lg border border-gray-300 bg-paper pl-12 pr-12 text-base text-dark shadow-sm outline-none transition-colors placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Clear article search"
              title="Clear search"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="mt-3 text-sm text-gray-600" aria-live="polite">
          Showing {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          {normalizedSearchQuery ? ` for "${searchQuery.trim()}"` : ''}
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => handleCategoryChange('All')}
          aria-pressed={selectedCategory === 'All'}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-primary text-paper'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({articles.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            aria-pressed={selectedCategory === cat}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-paper'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat} ({categoryCounts[cat] || 0})
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {pageArticles.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pageArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}/`}
              className="group block overflow-hidden rounded-xl border border-gray-200 bg-paper shadow-sm transition-shadow hover:shadow-md"
            >
              {article.featuredImage && (
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={localImageSrc(article.featuredImage.url)}
                    alt={article.featuredImage.alt || article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-2">
                  {article.categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-block rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <h2 className="font-serif-display text-lg font-bold text-dark group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <time className="mt-1 block text-sm text-gray-500">{formatDate(article.date)}</time>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <h2 className="font-serif-display text-2xl font-bold text-dark">No articles found</h2>
          <p className="mx-auto mt-2 max-w-xl text-gray-600">
            Try another search term or choose a different category.
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setCurrentPage(1)
              }}
              className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              Reset filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  )
}
