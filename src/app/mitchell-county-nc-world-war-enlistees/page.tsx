import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Mitchell County, NC World War I Enlistees',
  description:
    'Records of Mitchell County, North Carolina residents who enlisted during World War I.',
}

export default function WwEnlisteesPage() {
  const page = getWpPage('mitchell-county-nc-world-war-enlistees')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
