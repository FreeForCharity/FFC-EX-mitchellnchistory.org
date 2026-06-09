import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, ExternalLink, Video } from 'lucide-react'
import { getProgramYears, youtubeChannelUrl } from '@/data/programs'
import { assetPath } from '@/lib/assetPath'

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
      <section className="relative flex min-h-[42vh] items-center justify-center overflow-hidden bg-dark text-paper">
        <img
          src={assetPath('/Images/mchs-hero.webp')}
          alt="Mitchell County mountain landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-200">
            Monthly Programs
          </p>
          <h1 className="mt-4 font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
            Programs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-200">
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
                Monthly Program Information
              </h2>
              <div className="mt-4 h-1 w-20 rounded bg-accent" />
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                MCHS presents public programs on topics of historical interest throughout the year.
                This page is designed as the central home for each year&apos;s monthly program
                schedule and archive.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-700">
                As new program details are confirmed, they can be added here by year with dates,
                locations, presenter names, topic descriptions, and video links after programs are
                recorded.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-primary">
                <CalendarDays className="h-7 w-7" aria-hidden="true" />
                <h2 className="font-serif-display text-2xl font-bold">Upcoming Programs</h2>
              </div>
              <p className="mt-4 text-gray-700">
                Current dates and special events are posted as they are confirmed. Visit the events
                page for the newest public schedule, or contact MCHS with questions about a program.
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

      <section className="bg-gray-50 py-16">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Recorded Programs
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              Browse the year-by-year archive below, or visit the MCHS YouTube channel for the full
              collection of available recordings.
            </p>
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-paper transition hover:opacity-90"
            >
              <Video className="h-5 w-5" aria-hidden="true" />
              MCHS YouTube Channel
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
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

                <ul className="mt-6 grid gap-5 md:grid-cols-2">
                  {year.programs.map((program) => (
                    <li
                      key={`${year.year}-${program.title}`}
                      className="flex h-full flex-col rounded-lg border border-gray-200 bg-gray-50 p-5"
                    >
                      <div className="flex flex-wrap gap-2 text-sm font-semibold text-accent">
                        {program.month && <span>{program.month}</span>}
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
                      <div className="mt-5">
                        {program.videoUrl ? (
                          <a
                            href={program.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-semibold text-accent hover:underline"
                          >
                            Watch video
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </a>
                        ) : (
                          <Link
                            href="/videos/"
                            className="inline-flex items-center gap-2 font-semibold text-accent hover:underline"
                          >
                            See video archive
                          </Link>
                        )}
                      </div>
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
