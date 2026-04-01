import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Mitchell County, NC World War I Inductees',
  description: 'Records of Mitchell County, North Carolina residents inducted during World War I.',
  alternates: { canonical: '/mitchell-county-nc-world-war-inductees/' },
}

export default function WwInducteesPage() {
  const page = getWpPage('mitchell-county-nc-world-war-inductees')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
