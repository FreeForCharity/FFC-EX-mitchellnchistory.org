import { siteUrl } from '@/lib/siteConfig'

/**
 * Safely serialize a JSON-LD object for embedding in a <script> tag.
 * Escapes characters that could break out of the script context.
 */
export function safeJsonLdStringify(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mitchell County Historical Society',
    url: siteUrl,
    logo: `${siteUrl}/web-app-manifest-512x512.png`,
    description:
      'Preserving, protecting, and sharing the rich history and cultural heritage of Mitchell County, North Carolina.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bakersville',
      addressRegion: 'NC',
      addressCountry: 'US',
    },
    sameAs: [],
  }
}

export function articleJsonLd(article: {
  title: string
  date: string
  excerpt: string
  slug: string
  featuredImage: { url: string; alt: string } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.date,
    description: article.excerpt,
    url: `${siteUrl}/articles/${article.slug}/`,
    publisher: {
      '@type': 'Organization',
      name: 'Mitchell County Historical Society',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/web-app-manifest-512x512.png`,
      },
    },
    ...(article.featuredImage && {
      image: article.featuredImage.url,
    }),
  }
}
