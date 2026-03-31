import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'History Bee',
  description:
    'The Mitchell County History Bee challenges local students on their knowledge of Mitchell County history and heritage.',
}

export default function HistoryBeePage() {
  const page = getWpPage('history-bee')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
