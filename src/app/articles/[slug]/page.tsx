import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  getAllArticles,
  getArticleBySlug,
  getArticleNeighbors,
  getRelatedArticles,
  formatArticleDate,
} from '@/data/articles'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { absoluteImageUrl, localImageSrc } from '@/lib/imageUrl'
import { notFound } from 'next/navigation'
import { articleJsonLd, safeJsonLdStringify } from '@/lib/jsonLd'
import { defaultOgImage } from '@/lib/siteConfig'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Article Not Found' }

  return {
    title: article.title,
    description: article.excerpt || `Read about ${article.title} from Mitchell County history.`,
    alternates: {
      canonical: `/articles/${slug}/`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      images: article.featuredImage
        ? [
            {
              url: absoluteImageUrl(article.featuredImage.url),
              alt: article.featuredImage.alt,
            },
          ]
        : [defaultOgImage],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const related = getRelatedArticles(slug)
  const { newer, older } = getArticleNeighbors(slug)

  return (
    <div>
      {/* Article JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleJsonLd(article)) }}
      />

      {/* Hero */}
      {/* Top padding clears the fixed header (shared --header-height token)
          so the category chips stay visible/clickable */}
      <section className="relative bg-dark pt-[calc(var(--header-height)+2rem)] pb-16 text-paper">
        {article.featuredImage && (
          <img
            src={localImageSrc(article.featuredImage.url)}
            alt={article.featuredImage.alt || article.title}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
        )}
        <div className="ffc-container relative z-10">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/articles/?category=${encodeURIComponent(cat)}`}
                  className="inline-block rounded bg-white/20 px-3 py-1 text-xs font-medium text-gray-200 transition-colors hover:bg-white/30 hover:text-white"
                >
                  {cat}
                </Link>
              ))}
            </div>
            <h1 className="font-serif-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <time className="mt-4 block text-gray-300">{formatArticleDate(article.date)}</time>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-paper py-16">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <div
              className="wp-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
            />

            {/* Previous / next in the archive */}
            <nav
              className="mt-12 grid gap-4 border-t border-gray-200 pt-8 sm:grid-cols-2"
              aria-label="Adjacent articles"
            >
              {older ? (
                <Link
                  href={`/articles/${older.slug}/`}
                  className="group rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <span className="text-sm text-gray-500">&larr; Older</span>
                  <span className="mt-1 block font-serif-display font-bold text-dark group-hover:text-primary">
                    {older.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
              {newer && (
                <Link
                  href={`/articles/${newer.slug}/`}
                  className="group rounded-lg border border-gray-200 p-4 text-right transition-shadow hover:shadow-md"
                >
                  <span className="text-sm text-gray-500">Newer &rarr;</span>
                  <span className="mt-1 block font-serif-display font-bold text-dark group-hover:text-primary">
                    {newer.title}
                  </span>
                </Link>
              )}
            </nav>

            {/* Back to articles */}
            <div className="mt-8">
              <Link
                href="/articles/"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                &larr; Back to Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 bg-paper py-12">
          <div className="ffc-container">
            <div className="mx-auto max-w-5xl">
              <h2 className="font-serif-display text-2xl font-bold text-dark">Related Articles</h2>
              <div className="mt-6 grid gap-8 md:grid-cols-3">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/articles/${rel.slug}/`}
                    className="group block overflow-hidden rounded-xl border border-gray-200 bg-paper shadow-sm transition-shadow hover:shadow-md"
                  >
                    {rel.featuredImage && (
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={localImageSrc(rel.featuredImage.url)}
                          alt={rel.featuredImage.alt || rel.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-serif-display text-lg font-bold text-dark transition-colors group-hover:text-primary">
                        {rel.title}
                      </h3>
                      <time className="mt-1 block text-sm text-gray-500">
                        {formatArticleDate(rel.date)}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
