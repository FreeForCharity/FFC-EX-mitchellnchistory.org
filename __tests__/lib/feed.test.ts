import { buildRssFeed, escapeXml, stripHtml, FEED_ITEM_LIMIT } from '@/lib/feed'

describe('escapeXml', () => {
  it('escapes XML special characters', () => {
    expect(escapeXml(`Tom & Jerry's <"quoted">`)).toBe(
      'Tom &amp; Jerry&apos;s &lt;&quot;quoted&quot;&gt;'
    )
  })
})

describe('stripHtml', () => {
  it('removes tags and collapses whitespace', () => {
    expect(stripHtml('<p>Hello&nbsp;<strong>world</strong></p>\n<p>again</p>')).toBe(
      'Hello world again'
    )
  })
})

describe('buildRssFeed', () => {
  const article = (n: number, overrides = {}) => ({
    slug: `article-${n}`,
    title: `Article ${n}`,
    date: `2020-01-${String(n).padStart(2, '0')}T12:00:00`,
    excerpt: `<p>Excerpt ${n}</p>`,
    ...overrides,
  })

  it('produces a valid RSS 2.0 skeleton', () => {
    const xml = buildRssFeed([article(1)])
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('<title>Mitchell County Historical Society</title>')
    expect(xml).toContain('<link>https://mitchellnchistory.org/articles/article-1/</link>')
    expect(xml).toContain('<description>Excerpt 1</description>')
    expect(xml).toContain('<pubDate>')
  })

  it('sorts newest first and caps at the item limit', () => {
    const articles = Array.from({ length: 28 }, (_, i) => article(i + 1))
    const xml = buildRssFeed(articles)
    const items = xml.match(/<item>/g) || []
    expect(items.length).toBe(FEED_ITEM_LIMIT)
    // Newest (day 28) is present, oldest (day 1) is cut
    expect(xml).toContain('article-28')
    expect(xml).not.toContain('article-1/')
  })

  it('preserves publish times in pubDate and orders same-day posts by time', () => {
    const xml = buildRssFeed([
      article(1, { slug: 'morning-post', date: '2020-04-01T08:15:00' }),
      article(2, { slug: 'evening-post', date: '2020-04-01T20:30:00' }),
    ])
    expect(xml).toContain('Wed, 01 Apr 2020 20:30:00 GMT')
    expect(xml.indexOf('evening-post')).toBeLessThan(xml.indexOf('morning-post'))
  })

  it('escapes markup in titles and excerpts', () => {
    const xml = buildRssFeed([
      article(1, { title: 'Fish & Chips <est. 1900>', excerpt: '<p>A & B</p>' }),
    ])
    expect(xml).toContain('Fish &amp; Chips &lt;est. 1900&gt;')
    expect(xml).toContain('<description>A &amp; B</description>')
    expect(xml).not.toContain('<est. 1900>')
  })
})
