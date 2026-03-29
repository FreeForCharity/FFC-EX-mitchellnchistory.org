import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Footer from '../../src/components/footer'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('Footer component', () => {
  it('should render the footer', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('should display About MCHS section', () => {
    render(<Footer />)
    expect(screen.getByText('About MCHS')).toBeInTheDocument()
  })

  it('should display Quick Links section', () => {
    render(<Footer />)
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
  })

  it('should display Contact Us section with contact information', () => {
    render(<Footer />)
    const headings = screen.getAllByText('Contact Us')
    expect(headings.length).toBeGreaterThanOrEqual(1)
  })

  it('should have social media links', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should display the current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument()
  })

  it('should have Online Store link', () => {
    render(<Footer />)
    const storeLink = screen.getByText('Online Store')
    expect(storeLink).toBeInTheDocument()
  })

  it('should have email contact link', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    const emailLink = links.find(
      (link) => link.getAttribute('href') === 'mailto:mitchellnchistory@gmail.com'
    )
    expect(emailLink).toBeDefined()
  })

  it('should display Mitchell County Historical Society copyright', () => {
    render(<Footer />)
    const matches = screen.getAllByText(/Mitchell County Historical Society/)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Footer />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
