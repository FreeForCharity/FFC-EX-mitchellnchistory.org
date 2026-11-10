import { getAllArticles, getArticlesMeta, getActiveCategories } from '@/data/articles'
import editorial from '@/data/articles/story-editorial.json'
import originalPosts from '@/data/articles/posts.json'
import { STORY_TOPICS } from '@/data/storyTopics'

describe('Our Stories editorial organization', () => {
  it('covers the entire archive without losing or changing original stories', () => {
    const articles = getAllArticles()
    expect(Object.keys(editorial).sort()).toEqual(originalPosts.map((a) => a.slug).sort())
    expect(articles).toHaveLength(originalPosts.length)
    articles.forEach((article, index) => {
      expect(article.content).toBe(originalPosts[index].content)
      expect(article.date).toBe(originalPosts[index].date)
      expect(article.legacyCategories).toEqual(originalPosts[index].categories)
      expect(article.categories.length).toBeGreaterThan(0)
      article.categories.forEach((topic) => expect(STORY_TOPICS).toContain(topic))
    })
    expect(getActiveCategories()).toEqual([...STORY_TOPICS])
  })

  it('passes legacy categories to the searchable listing and supplies reviewed summaries', () => {
    const metadata = getArticlesMeta()
    expect(metadata[0].legacyCategories).toEqual(originalPosts[0].categories)
    expect(metadata[0].excerpt).toContain('doctor’s office')
    expect(metadata[0].excerpt).not.toContain('[…]')
  })
})
