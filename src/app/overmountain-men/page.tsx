import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import WpPageContent from '@/components/wp-page-content'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Overmountain Men',
  description:
    'Explore the story of the Overmountain Men and the Overmountain Victory National Historic Trail through Mitchell County, NC.',
  alternates: { canonical: '/overmountain-men/' },
}

export default function OvermountainMenPage() {
  const page = getWpPage('ovm')
  if (!page) notFound()
  return <WpPageContent title={page.title} content={page.content} />
}
