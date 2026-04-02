import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Newsletters',
  description:
    'Read past newsletters and stay up to date with the Mitchell County Historical Society.',
  alternates: { canonical: '/newsletters/' },
}

export default function NewslettersPage() {
  const page = getWpPage('newsletters')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
