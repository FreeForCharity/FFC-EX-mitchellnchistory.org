import Link from 'next/link'
import type { ArticleMeta } from '@/data/articles'
import { formatDate } from '@/lib/formatDate'
import { thumbnailSrc } from '@/lib/imageUrl'

/**
 * Presentational article card used by both the server-rendered fallback grid
 * (src/app/articles/page.tsx) and the client-side filtered list
 * (ArticlesList). Keeping one component means the pre-hydration and
 * post-hydration cards are byte-identical, so there is no flash on hydration.
 *
 * `priority` marks the first row eager (LCP) — leave it off for lazy cards.
 */
export default function ArticleCard({
  article,
  priority = false,
}: {
  article: ArticleMeta
  priority?: boolean
}) {
  return (
    <Link
      href={`/articles/${article.slug}/`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-paper shadow-sm transition-shadow hover:shadow-md"
    >
      {article.featuredImage && (
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={thumbnailSrc(article.featuredImage.url)}
            alt={article.featuredImage.alt || article.title}
            width={480}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...(priority ? { fetchPriority: 'high' as const } : {})}
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
  )
}
