import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { recordings, recordingPath } from '@/data/videos'

export const dynamicParams = false
export function generateStaticParams() {
  return recordings.map((video) => ({ slug: video.slug }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const video = recordings.find((item) => item.slug === slug)
  return video
    ? {
        title: video.title,
        description: video.description,
        alternates: { canonical: recordingPath(slug) },
      }
    : {}
}
export default async function RecordingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const video = recordings.find((item) => item.slug === slug)
  if (!video) notFound()
  const related = recordings
    .filter((item) => item.topic === video.topic && item.slug !== slug)
    .slice(0, 3)
  return (
    <section className="bg-paper py-16">
      <div className="ffc-container">
        <div className="mx-auto max-w-4xl">
          <Link href="/videos/" className="font-semibold text-primary underline">
            ← All Videos
          </Link>
          <p className="mt-8 text-sm font-semibold text-primary">
            {video.topic}
            {video.year ? ` · ${video.year}` : ''}
            {video.related ? ' · Related video' : ''}
          </p>
          <h1 className="mt-3 font-serif-display text-4xl font-bold text-primary">{video.title}</h1>
          <p className="mt-4 text-gray-700">{video.presenter}</p>
          {video.dateLabel && <p className="mt-1 text-gray-600">Recorded {video.dateLabel}</p>}
          <div className="mt-8 aspect-video overflow-hidden rounded-lg bg-dark">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
              title={video.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">{video.description}</p>
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            className="mt-5 inline-block font-semibold text-primary underline"
          >
            Watch on YouTube
          </a>
          {video.related && (
            <p className="mt-4 text-sm text-gray-600">
              Related material from another creator, included with the Society’s historical video
              collection.
            </p>
          )}
          {related.length > 0 && (
            <div className="mt-12 border-t border-gray-300 pt-8">
              <h2 className="font-serif-display text-2xl font-bold text-primary">
                More to Explore
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={recordingPath(item.slug)}
                      className="font-semibold text-primary underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
