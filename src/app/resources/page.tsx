import type { Metadata } from 'next'
import { getWpPage } from '@/data/articles'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Resources & Links',
  description:
    'Helpful resources and links for genealogy, local history research, and Mitchell County information.',
  alternates: { canonical: '/resources/' },
}

export default function ResourcesPage() {
  const linksPage = getWpPage('links')
  const resourcesPage = getWpPage('resources')

  if (!linksPage && !resourcesPage) {
    notFound()
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark py-20 text-paper">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
              Resources &amp; Links
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              Helpful resources for genealogy, local history research, and Mitchell County
              information.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Content */}
      {resourcesPage && (
        <section className="bg-paper py-16">
          <div className="ffc-container">
            <div className="mx-auto max-w-3xl">
              <div
                className="wp-content"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(resourcesPage.content) }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Links Content */}
      {linksPage && (
        <section className="bg-gray-50 py-16">
          <div className="ffc-container">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                Useful Links
              </h2>
              <div className="mt-4 h-1 w-20 rounded bg-accent" />
              <div
                className="wp-content mt-8"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(linksPage.content) }}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
