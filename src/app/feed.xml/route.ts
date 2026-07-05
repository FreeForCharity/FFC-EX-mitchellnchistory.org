import { getArticlesMeta } from '@/data/articles'
import { buildRssFeed } from '@/lib/feed'

export const dynamic = 'force-static'

export async function GET() {
  const feed = buildRssFeed(getArticlesMeta())
  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
