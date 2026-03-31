import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'The Corona Times',
  description:
    'Documenting life in Mitchell County during the COVID-19 pandemic — a community diary project by MCHS.',
}

export default function CoronaTimesPage() {
  const page = getWpPage('the-corona-times')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
