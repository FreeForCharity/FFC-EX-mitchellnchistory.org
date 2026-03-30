import robots from '../../src/app/robots'
import sitemap from '../../src/app/sitemap'
import { siteUrl, sitemapRoutes } from '../../src/lib/siteConfig'

describe('site metadata configuration', () => {
  it('uses the production domain for robots.txt', () => {
    expect(robots().sitemap).toBe(`${siteUrl}/sitemap.xml`)
  })

  it('includes the public routes in sitemap.xml', () => {
    const entries = sitemap()

    expect(entries).toHaveLength(sitemapRoutes.length)
    expect(entries.map((entry) => entry.url)).toEqual(
      sitemapRoutes.map((route) => `${siteUrl}${route}`)
    )
  })
})
