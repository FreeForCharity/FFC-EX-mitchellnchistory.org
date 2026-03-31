'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import type { ArticleMeta } from '@/data/articles'
import { formatDate } from '@/lib/formatDate'

const ARTICLES_PER_PAGE = 24

interface ArticlesListProps {
  articles: ArticleMeta[]
  categories: string[]
}

export default function ArticlesList({ articles, categories }: ArticlesListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
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

  const filtered =
    selectedCategory === 'All'
      ? articles
      : articles.filter((a) => a.categories.includes(selectedCategory))

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE)
  const pageArticles = filtered.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  )

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }

  return (
    <div>
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => handleCategoryChange('All')}
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
                  src={article.featuredImage.url}
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
