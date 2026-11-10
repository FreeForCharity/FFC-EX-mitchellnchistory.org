import type { Metadata } from 'next'
import ArticlesList from '@/components/articles/ArticlesList'
import { getArticlesMeta, getActiveCategories } from '@/data/articles'

export const metadata: Metadata = {
  title: 'Our Stories',
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
      <section className="bg-dark pt-[calc(var(--header-height)+3rem)] pb-14 text-paper">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
              Our Stories
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              Meet the people, explore the places, and discover the everyday experiences that shaped
              Mitchell County. Browse by topic or search our collection of local history.
            </p>
          </div>
        </div>
      </section>

      {/* Articles List — client component, but its default (unfiltered)
          view is server-rendered for fast LCP + SEO. URL filters are
          applied post-hydration (see ArticlesList). */}
      <section className="bg-paper py-12">
        <div className="ffc-container">
          <ArticlesList articles={articles} categories={categories} />
        </div>
      </section>
    </div>
  )
}
