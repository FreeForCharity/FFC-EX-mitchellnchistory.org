'use client'

import { useState } from 'react'
import Link from 'next/link'
import { recordings, recordingPath } from '@/data/videos'

export default function VideoCollection() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('All Videos')
  const [order, setOrder] = useState('newest')
  const topics = [
    'All Videos',
    ...Array.from(new Set(recordings.map((video) => video.topic))).sort(),
  ]
  const visible = recordings
    .filter(
      (video) =>
        (topic === 'All Videos' || video.topic === topic) &&
        `${video.title} ${video.presenter ?? ''} ${video.description} ${video.year ?? ''} ${video.topic}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
    )
    .sort((a, b) =>
      order === 'title' ? a.title.localeCompare(b.title) : (b.year ?? 0) - (a.year ?? 0)
    )
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label className="font-semibold text-primary">
          Search videos
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a person, place, or subject"
            className="mt-2 block w-full rounded-lg border border-gray-400 bg-white p-3 text-gray-900"
          />
        </label>
        <label className="font-semibold text-primary">
          Sort by
          <select
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            className="mt-2 block w-full rounded-lg border border-gray-400 bg-white p-3 text-gray-900"
          >
            <option value="newest">Newest first</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>
      <div className="my-6 flex flex-wrap gap-2" role="group" aria-label="Browse by topic">
        {topics.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={topic === item}
            onClick={() => setTopic(item)}
            className={`rounded-full border border-primary px-4 py-2 font-semibold ${topic === item ? 'bg-primary text-paper' : 'bg-white text-primary hover:bg-gray-100'}`}
          >
            {item}
          </button>
        ))}
      </div>
      <p role="status" className="mb-6 text-gray-600">
        {visible.length} {visible.length === 1 ? 'video' : 'videos'}
      </p>
      {visible.length === 0 && (
        <div className="rounded-lg bg-white p-8">
          <p>No videos match your search. Try another name or subject.</p>
          <button
            className="mt-4 font-semibold text-primary underline"
            onClick={() => {
              setQuery('')
              setTopic('All Videos')
            }}
          >
            Clear search and filters
          </button>
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((video) => (
          <article
            key={video.slug}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <Link
              href={recordingPath(video.slug)}
              className="group block h-full focus-visible:outline-4 focus-visible:outline-primary"
            >
              <div className="relative aspect-video bg-dark">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-white group-hover:scale-110"
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                </span>
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold text-primary">
                  {video.topic}
                  {video.year ? ` · ${video.year}` : ''}
                  {video.related ? ' · Related video' : ''}
                </p>
                <h3 className="mt-2 font-serif-display text-2xl font-bold text-primary group-hover:underline">
                  {video.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{video.presenter}</p>
                <p className="mt-3 text-gray-700">{video.description}</p>
                <span className="mt-5 inline-block font-semibold text-primary">Watch Video →</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
