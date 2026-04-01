import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Inez McRae Memorial Scholarship',
  description:
    'The Mitchell County Historical Society awards the annual Inez McRae Memorial Scholarship to a Mitchell County high school senior.',
  alternates: { canonical: '/scholarship/' },
}

export default function ScholarshipPage() {
  const page = getWpPage('scholarship')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
