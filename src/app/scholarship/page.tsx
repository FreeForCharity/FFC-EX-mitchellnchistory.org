import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'

export const metadata: Metadata = {
  title: 'Inez McRae Memorial Scholarship',
  description:
    'The Mitchell County Historical Society awards the annual Inez McRae Memorial Scholarship to a Mitchell County high school senior.',
}

export default function ScholarshipPage() {
  const page = getWpPage('scholarship')!
  return <WpPageContent title={page.title} content={page.content} />
}
