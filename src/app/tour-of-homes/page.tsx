import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Tour of Homes',
  description:
    'Annual Tour of Homes event by the Mitchell County Historical Society in North Carolina.',
}

export default function TourOfHomesPage() {
  const page = getWpPage('tour-of-homes')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
