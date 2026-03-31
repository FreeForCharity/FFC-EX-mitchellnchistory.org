import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Penland Cemetery Reclamation & Restoration',
  description:
    'Learn about the Penland Cemetery Reclamation and Restoration Project — preserving an African-American burial ground in Mitchell County, NC.',
}

export default function PenlandCemeteryPage() {
  const page = getWpPage('penland-cemetery')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
