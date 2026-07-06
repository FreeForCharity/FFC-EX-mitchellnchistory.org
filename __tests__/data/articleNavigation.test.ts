import { getAllArticles, getArticleNeighbors, getRelatedArticles } from '@/data/articles'
import { parseUTCDateTime } from '@/lib/formatDate'

describe('getArticleNeighbors', () => {
  const chrono = [...getAllArticles()].sort(
    (a, b) => parseUTCDateTime(b.date).getTime() - parseUTCDateTime(a.date).getTime()
  )

  it('newest article has no newer neighbor', () => {
    const { newer, older } = getArticleNeighbors(chrono[0].slug)
    expect(newer).toBeNull()
    expect(older?.slug).toBe(chrono[1].slug)
  })

  it('oldest article has no older neighbor', () => {
    const { newer, older } = getArticleNeighbors(chrono[chrono.length - 1].slug)
    expect(older).toBeNull()
    expect(newer?.slug).toBe(chrono[chrono.length - 2].slug)
  })

  it('middle article has both neighbors in date order', () => {
    const mid = Math.floor(chrono.length / 2)
    const { newer, older } = getArticleNeighbors(chrono[mid].slug)
    expect(newer?.slug).toBe(chrono[mid - 1].slug)
    expect(older?.slug).toBe(chrono[mid + 1].slug)
  })

  it('unknown slug returns null on both sides', () => {
    expect(getArticleNeighbors('no-such-article')).toEqual({ newer: null, older: null })
  })
})

describe('getRelatedArticles', () => {
  const sample = getAllArticles()[0]

  it('returns the requested number of articles, excluding the current one', () => {
    const related = getRelatedArticles(sample.slug)
    expect(related).toHaveLength(3)
    expect(related.map((a) => a.slug)).not.toContain(sample.slug)
  })

  it('returns unique articles', () => {
    const related = getRelatedArticles(sample.slug, 5)
    expect(new Set(related.map((a) => a.slug)).size).toBe(related.length)
  })

  it('prefers articles sharing a category', () => {
    const related = getRelatedArticles(sample.slug)
    const sampleCategories = new Set(sample.categories)
    // The archive has hundreds of same-category articles, so all top picks
    // should share a category with the source article.
    for (const rel of related) {
      expect(rel.categories.some((c) => sampleCategories.has(c))).toBe(true)
    }
  })

  it('returns empty for an unknown slug', () => {
    expect(getRelatedArticles('no-such-article')).toEqual([])
  })
})
