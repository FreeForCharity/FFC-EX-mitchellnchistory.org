import type { MetadataRoute } from 'next'
import { siteUrl, sitemapRoutes } from '@/lib/siteConfig'
import { getAllArticles } from '@/data/articles'
import { recordings, recordingPath } from '@/data/videos'
import { parseUTCDateTime } from '@/lib/formatDate'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = sitemapRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }))

  const articleRoutes: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${siteUrl}/articles/${article.slug}/`,
    lastModified: parseUTCDateTime(article.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...recordings.map((video) => ({
      url: `${siteUrl}${recordingPath(video.slug)}`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
