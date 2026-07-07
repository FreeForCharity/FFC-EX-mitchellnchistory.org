import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { getAllArticles } from '@/data/articles'
import { thumbnailSrc } from '@/lib/imageUrl'

/**
 * Guard: every local featured image must have a committed grid thumbnail.
 * If this fails after adding articles, run `npm run thumbnails` and commit
 * the generated public/thumbnails/ files.
 */
describe('article grid thumbnails', () => {
  const PUBLIC = join(process.cwd(), 'public')

  const localFeatured = getAllArticles()
    .map((a) => a.featuredImage?.url)
    .filter((u): u is string => !!u && u.startsWith('/wp-content'))

  it('has at least one featured image to check', () => {
    expect(localFeatured.length).toBeGreaterThan(0)
  })

  it('has a committed thumbnail for every local featured image', () => {
    const missing = localFeatured.filter((url) => {
      // thumbnailSrc may prefix a basePath; strip it back to the public path
      const rel = '/thumbnails' + url.replace(/\.(jpe?g|png|webp|gif)$/i, '.webp')
      return !existsSync(join(PUBLIC, rel))
    })
    expect(missing).toEqual([])
  })

  it('thumbnailSrc points at a .webp under /thumbnails for local images', () => {
    expect(thumbnailSrc('/wp-content/uploads/2022/04/photo.jpg')).toContain(
      '/thumbnails/wp-content/uploads/2022/04/photo.webp'
    )
  })

  it('thumbnailSrc falls back for non-wp-content URLs', () => {
    expect(thumbnailSrc('https://example.com/x.jpg')).toBe('https://example.com/x.jpg')
  })
})
