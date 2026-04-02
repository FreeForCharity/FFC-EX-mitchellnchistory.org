import type { Metadata } from 'next'
import { getWpPages } from '@/data/articles'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { notFound } from 'next/navigation'

const videoSlugs = ['event-videos', '2020-videos', '2019-videos', '2017-videos', '2016-videos']

export const metadata: Metadata = {
  title: 'Videos',
  description:
    'Watch videos from Mitchell County Historical Society events, programs, and historical presentations.',
  alternates: { canonical: '/videos/' },
}

export default function VideosPage() {
  const videoPages = getWpPages(videoSlugs)

  if (videoPages.length === 0) {
    notFound()
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark py-20 text-paper">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
              Videos
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              Watch videos from Mitchell County Historical Society events and programs.
            </p>
          </div>
        </div>
      </section>

      {/* Video Sections */}
      {videoPages.map((page, i) => (
        <section key={page.slug} className={i % 2 === 0 ? 'bg-paper py-16' : 'bg-gray-50 py-16'}>
          <div className="ffc-container">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                {page.title}
              </h2>
              <div className="mt-4 h-1 w-20 rounded bg-accent" />
              <div
                className="wp-content mt-8"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
