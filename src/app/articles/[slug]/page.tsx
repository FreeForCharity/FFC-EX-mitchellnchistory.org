import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllArticles, getArticleBySlug, formatArticleDate } from '@/data/articles'
import { notFound } from 'next/navigation'

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
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      ...(article.featuredImage && {
        images: [{ url: article.featuredImage.url, alt: article.featuredImage.alt }],
      }),
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-dark py-16 text-paper">
        {article.featuredImage && (
          <img
            src={article.featuredImage.url}
            alt={article.featuredImage.alt || article.title}
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
        )}
        <div className="ffc-container relative z-10">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-block rounded bg-white/20 px-3 py-1 text-xs font-medium text-gray-200"
                >
                  {cat}
                </span>
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
            <div className="wp-content" dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Back to articles */}
            <div className="mt-12 border-t border-gray-200 pt-8">
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
    </div>
  )
}
