import type { Metadata } from 'next'
import ArticlesList from '@/components/articles/ArticlesList'
import { getArticlesMeta, getActiveCategories } from '@/data/articles'

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Explore stories of the people, places, history, and heritage of Mitchell County, North Carolina.',
  alternates: { canonical: '/articles/' },
}

export default function ArticlesPage() {
  const articles = getArticlesMeta()
  const categories = getActiveCategories()

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark py-20 text-paper">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
              Articles &amp; Stories
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              Discover the rich history and heritage of Mitchell County through our collection of
              articles, stories, and historical accounts.
            </p>
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section className="bg-paper py-16">
        <div className="ffc-container">
          <ArticlesList articles={articles} categories={categories} />
        </div>
      </section>
    </div>
  )
}
