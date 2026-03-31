import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'

export const metadata: Metadata = {
  title: 'Scan Days',
  description:
    'Bring your old family photos and documents to our Scan Days events in Bakersville and Spruce Pine for free digital preservation.',
}

export default function ScanDaysPage() {
  const page = getWpPage('scan')!
  return <WpPageContent title={page.title} content={page.content} />
}
