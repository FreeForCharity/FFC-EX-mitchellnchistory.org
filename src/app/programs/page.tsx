import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, Video } from 'lucide-react'
import { getProgramYears, youtubeChannelUrl } from '@/data/programs'
import { recordingPath } from '@/data/videos'

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Explore Mitchell County Historical Society monthly programs, annual program archives, and videos of past presentations.',
  alternates: { canonical: '/programs/' },
  openGraph: {
    url: '/programs/',
    title: 'Programs',
    description:
      'A year-by-year archive of Mitchell County Historical Society programs and recorded presentations.',
  },
}

export default function ProgramsPage() {
  const programYears = getProgramYears()

  return (
    <div>
      <section className="bg-dark py-24 text-paper">
        <div className="ffc-container text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
            Programs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Follow Mitchell County Historical Society programs by year, revisit recorded
            presentations, and find information about upcoming monthly gatherings.
          </p>
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="ffc-container">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                History, Shared Together
              </h2>
              <div className="mt-4 h-1 w-20 rounded bg-accent" />
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                Discover local history through presentations, storytelling, and conversation. Our
                public programs bring the people and places of the Toe River Valley to life.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-700">
                Explore past programs below. When a recording is available, select Watch Recording
                to go directly to its video page.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-primary">
                <CalendarDays className="h-7 w-7" aria-hidden="true" />
                <h2 className="font-serif-display text-2xl font-bold">Upcoming Programs</h2>
              </div>
              <p className="mt-4 text-gray-700">
                Visit Events for upcoming gatherings and newly announced programs. Programs are free
                and open to the public unless otherwise noted.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/events/"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-paper transition hover:opacity-90"
                >
                  View Events
                </Link>
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary px-5 py-3 font-semibold text-primary transition hover:bg-green-50"
                >
                  Contact MCHS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="program-schedule" className="bg-gray-50 py-16">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Past Programs
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              Browse presentations by year, or explore our video collection by topic, presenter, or
              place.
            </p>
            <Link
              href="/videos/"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-paper"
            >
              <Video className="h-5 w-5" aria-hidden="true" />
              Browse All Videos
            </Link>
            <p className="mt-4">
              <a href={youtubeChannelUrl} className="font-semibold text-primary underline">
                Visit our YouTube channel
              </a>
            </p>
          </div>

          <div className="mt-12 space-y-8">
            {programYears.map((year) => (
              <section
                key={year.year}
                aria-labelledby={`programs-${year.year}`}
                className="rounded-lg border border-gray-200 bg-paper p-6 shadow-sm md:p-8"
              >
                <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                      Program Archive
                    </p>
                    <h2
                      id={`programs-${year.year}`}
                      className="font-serif-display text-3xl font-bold text-primary"
                    >
                      {year.year}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-gray-700">{year.summary}</p>
                </div>

                <ul className="mt-6 divide-y divide-gray-200">
                  {year.programs.map((program) => (
                    <li key={`${year.year}-${program.title}`} className="py-6 first:pt-0">
                      <div className="flex flex-wrap gap-2 text-sm font-semibold text-accent">
                        {program.dateLabel && <span>{program.dateLabel}</span>}
                      </div>
                      <h3 className="mt-2 font-serif-display text-xl font-bold text-primary">
                        {program.title}
                      </h3>
                      {program.presenter && (
                        <p className="mt-2 font-semibold text-gray-800">{program.presenter}</p>
                      )}
                      {program.location && (
                        <p className="mt-1 text-sm text-gray-600">{program.location}</p>
                      )}
                      <p className="mt-4 flex-1 leading-relaxed text-gray-700">
                        {program.description}
                      </p>
                      {program.videoSlug && (
                        <Link
                          href={recordingPath(program.videoSlug)}
                          className="mt-4 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                        >
                          Watch Recording →
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
