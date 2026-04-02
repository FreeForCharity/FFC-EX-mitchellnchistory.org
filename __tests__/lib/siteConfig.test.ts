import robots from '../../src/app/robots'
import sitemap from '../../src/app/sitemap'
import { siteUrl, sitemapRoutes } from '../../src/lib/siteConfig'
import { getAllArticles } from '../../src/data/articles'

describe('site metadata configuration', () => {
  it('uses the production domain for robots.txt', () => {
    expect(robots().sitemap).toBe(`${siteUrl}/sitemap.xml`)
  })

  it('includes the public routes in sitemap.xml', () => {
    const entries = sitemap()
    const articles = getAllArticles()

    expect(entries).toHaveLength(sitemapRoutes.length + articles.length)

    const staticUrls = entries.slice(0, sitemapRoutes.length).map((e) => e.url)
    expect(staticUrls).toEqual(sitemapRoutes.map((route) => `${siteUrl}${route}`))

    const articleUrls = entries.slice(sitemapRoutes.length).map((e) => e.url)
    expect(articleUrls.length).toBe(articles.length)
    for (const url of articleUrls) {
      expect(url).toMatch(/\/articles\/[\w-]+\//)
    }
  })
})
