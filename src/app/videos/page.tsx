import type { Metadata } from 'next'
import Link from 'next/link'
import VideoCollection from '@/components/VideoCollection'
import { recordings, recordingPath } from '@/data/videos'
import { youtubeChannelUrl } from '@/data/programs'

export const metadata: Metadata = {
  title: 'Videos | Watch & Discover',
  description:
    'Explore Mitchell County history through recorded presentations, music, local stories, and historic places.',
  alternates: { canonical: '/videos/' },
}
export default function VideosPage() {
  const featured = recordings[0]
  return (
    <div>
      <section className="bg-dark py-20 text-paper">
        <div className="ffc-container text-center">
          <p className="text-sm font-semibold uppercase tracking-widest">
            Mitchell County Historical Society
          </p>
          <h1 className="mt-4 font-serif-display text-4xl font-bold md:text-5xl">
            Watch &amp; Discover: Mitchell County History
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
            Meet the people, explore the places, and hear the stories that shaped our mountain
            communities.
          </p>
        </div>
      </section>
      <section className="bg-paper py-12">
        <div className="ffc-container">
          <div className="grid overflow-hidden rounded-xl bg-white shadow-sm md:grid-cols-2">
            <Link
              href={recordingPath(featured.slug)}
              aria-label={`Watch ${featured.title}`}
              className="relative aspect-video bg-dark"
            >
              <img
                src={`https://img.youtube.com/vi/${featured.youtubeId}/hqdefault.jpg`}
                alt="Lost Cove presentation video thumbnail"
                className="h-full w-full object-cover"
              />
              <span
                className="absolute inset-0 flex items-center justify-center text-5xl text-white"
                aria-hidden="true"
              >
                ▶
              </span>
            </Link>
            <div className="p-8">
              <p className="font-semibold text-primary">Featured Recording</p>
              <h2 className="mt-3 font-serif-display text-3xl font-bold text-primary">
                {featured.title}
              </h2>
              <p className="mt-3 text-gray-600">
                {featured.presenter} · {featured.dateLabel}
              </p>
              <p className="mt-4 text-gray-700">{featured.description}</p>
              <Link
                href={recordingPath(featured.slug)}
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-paper"
              >
                Watch Video
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-12">
        <div className="ffc-container">
          <h2 className="mb-8 font-serif-display text-3xl font-bold text-primary">
            Explore the Collection
          </h2>
          <VideoCollection />
        </div>
      </section>
      <section className="bg-paper py-12">
        <div className="ffc-container text-center">
          <h2 className="font-serif-display text-2xl font-bold text-primary">Keep exploring</h2>
          <p className="mt-4 text-gray-700">
            Join us for a public program, or visit our YouTube channel for more recordings and
            subscriptions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6">
            <Link href="/programs/" className="font-semibold text-primary underline">
              Programs &amp; Presentations
            </Link>
            <a href={youtubeChannelUrl} className="font-semibold text-primary underline">
              Visit MCHS on YouTube
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
