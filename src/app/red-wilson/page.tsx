import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'A Tribute to Red Wilson',
  description: 'A tribute to Red Wilson and his contributions to Mitchell County, North Carolina.',
}

export default function RedWilsonPage() {
  const page = getWpPage('red-wilson')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
