import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Scan Days',
  description:
    'Bring your old family photos and documents to our Scan Days events in Bakersville and Spruce Pine for free digital preservation.',
  alternates: { canonical: '/scan-days/' },
}

export default function ScanDaysPage() {
  const page = getWpPage('scan')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
