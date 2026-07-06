import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import ArticlesList from '../../src/components/articles/ArticlesList'
import type { ArticleMeta } from '@/data/articles'

function makeArticle(n: number, overrides: Partial<ArticleMeta> = {}): ArticleMeta {
  return {
    slug: `article-${n}`,
    title: `Article ${n}`,
    date: `2020-03-${String((n % 28) + 1).padStart(2, '0')}T12:00:00`,
    excerpt: `Excerpt for article ${n}`,
    categories: n % 2 === 0 ? ['History'] : ['Communities'],
    featuredImage: null,
    ...overrides,
  }
}

const CATEGORIES = ['Communities', 'History']

describe('ArticlesList', () => {
  it('renders all articles and the result count', () => {
    const articles = [
      makeArticle(1, { title: 'Bakersville Flood' }),
      makeArticle(2, { title: 'Altapass Depot' }),
    ]
    render(<ArticlesList articles={articles} categories={CATEGORIES} />)

    expect(screen.getByText('Bakersville Flood')).toBeInTheDocument()
    expect(screen.getByText('Altapass Depot')).toBeInTheDocument()
    expect(screen.getByText(/Showing 2 articles/)).toBeInTheDocument()
  })

  it('filters by search query and updates the live result count', () => {
    const articles = [
      makeArticle(1, { title: 'Bakersville Flood' }),
      makeArticle(2, { title: 'Altapass Depot' }),
    ]
    render(<ArticlesList articles={articles} categories={CATEGORIES} />)

    fireEvent.change(screen.getByLabelText('Search articles'), {
      target: { value: 'altapass' },
    })

    expect(screen.getByText('Altapass Depot')).toBeInTheDocument()
    expect(screen.queryByText('Bakersville Flood')).not.toBeInTheDocument()
    expect(screen.getByText(/Showing 1 article for "altapass"/)).toBeInTheDocument()
  })

  it('filters by category chips and shows per-category counts', () => {
    const articles = [makeArticle(1), makeArticle(2), makeArticle(3)]
    render(<ArticlesList articles={articles} categories={CATEGORIES} />)

    // 2 odd-numbered articles are Communities, 1 even is History
    const communitiesChip = screen.getByRole('button', { name: 'Communities (2)' })
    fireEvent.click(communitiesChip)

    expect(communitiesChip).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Article 1')).toBeInTheDocument()
    expect(screen.getByText('Article 3')).toBeInTheDocument()
    expect(screen.queryByText('Article 2')).not.toBeInTheDocument()
  })

  it('combines search and category filters', () => {
    const articles = [
      makeArticle(1, { title: 'Toecane Store', categories: ['Communities'] }),
      makeArticle(2, { title: 'Toecane Depot', categories: ['History'] }),
    ]
    render(<ArticlesList articles={articles} categories={CATEGORIES} />)

    fireEvent.click(screen.getByRole('button', { name: /History \(1\)/ }))
    fireEvent.change(screen.getByLabelText('Search articles'), {
      target: { value: 'toecane' },
    })

    expect(screen.getByText('Toecane Depot')).toBeInTheDocument()
    expect(screen.queryByText('Toecane Store')).not.toBeInTheDocument()
    expect(screen.getByText(/Showing 1 article for "toecane" in History/)).toBeInTheDocument()
  })

  it('paginates at 24 per page and resets to page 1 when filters change', () => {
    const articles = Array.from({ length: 30 }, (_, i) => makeArticle(i + 1))
    render(<ArticlesList articles={articles} categories={CATEGORIES} />)

    // 30 articles -> 2 pages
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()

    // Changing a filter resets pagination
    fireEvent.change(screen.getByLabelText('Search articles'), {
      target: { value: 'article' },
    })
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
  })

  it('shows the empty state and reset restores the full list', () => {
    const articles = [makeArticle(1), makeArticle(2)]
    render(<ArticlesList articles={articles} categories={CATEGORIES} />)

    fireEvent.change(screen.getByLabelText('Search articles'), {
      target: { value: 'no-such-article-anywhere' },
    })

    expect(screen.getByText('No articles found')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(screen.getByText(/Showing 2 articles/)).toBeInTheDocument()
    expect(screen.getByText('Article 1')).toBeInTheDocument()
  })

  it('clear-search button empties the query', () => {
    const articles = [makeArticle(1)]
    render(<ArticlesList articles={articles} categories={CATEGORIES} />)

    const input = screen.getByLabelText('Search articles')
    fireEvent.change(input, { target: { value: 'flood' } })
    fireEvent.click(screen.getByRole('button', { name: 'Clear article search' }))

    expect(input).toHaveValue('')
    expect(screen.getByText(/Showing 1 article/)).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const articles = [makeArticle(1), makeArticle(2)]
    const { container } = render(<ArticlesList articles={articles} categories={CATEGORIES} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
