import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div>
      <section className="bg-dark py-24 text-paper">
        <div className="ffc-container text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
            Page Not Found
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            We couldn&apos;t find the page you were looking for. It may have moved when the site was
            rebuilt, or the link may be out of date.
          </p>
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="ffc-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-lg">
              If you followed an old link to an article, our Articles page has search and category
              filters that can help you find it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/articles/"
                className="inline-block rounded bg-dark px-6 py-3 font-medium text-paper hover:opacity-90"
              >
                Search Articles
              </Link>
              <Link
                href="/"
                className="inline-block rounded border border-dark px-6 py-3 font-medium text-dark hover:bg-gray-100"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
