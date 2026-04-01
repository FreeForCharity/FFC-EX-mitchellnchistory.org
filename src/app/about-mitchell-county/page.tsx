import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'About Mitchell County',
  description:
    'Learn about Mitchell County, North Carolina — its geography, history, communities, and cultural heritage in the Blue Ridge Mountains.',
  alternates: { canonical: '/about-mitchell-county/' },
}

export default function AboutMitchellCountyPage() {
  const page = getWpPage('about-mitchell-county')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
