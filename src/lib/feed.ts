import { siteUrl, siteName, siteDescription } from '@/lib/siteConfig'
import { parseUTCDateTime } from '@/lib/formatDate'

export interface FeedItem {
  slug: string
  title: string
  date: string
  excerpt: string
}

/** Number of most-recent articles included in the feed. */
export const FEED_ITEM_LIMIT = 20

/** Escape a string for safe inclusion in XML text content or attributes. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Strip HTML tags and collapse whitespace for plain-text descriptions. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Build an RSS 2.0 feed from article metadata. Articles are sorted by
 * publish date descending and capped at FEED_ITEM_LIMIT items.
 */
export function buildRssFeed(articles: FeedItem[]): string {
  const items = [...articles]
    .sort((a, b) => parseUTCDateTime(b.date).getTime() - parseUTCDateTime(a.date).getTime())
    .slice(0, FEED_ITEM_LIMIT)
    .map((article) => {
      const url = `${siteUrl}/articles/${article.slug}/`
      const pubDate = parseUTCDateTime(article.date).toUTCString()
      return [
        '    <item>',
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(stripHtml(article.excerpt))}</description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(siteName)}</title>`,
    `    <link>${siteUrl}/</link>`,
    `    <description>${escapeXml(siteDescription)}</description>`,
    '    <language>en-us</language>',
    `    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}
