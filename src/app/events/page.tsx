import React from 'react'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'
import type { Metadata } from 'next'
import { getEventsByNextOccurrence, getPastEventsByDate } from '@/data/events'

const PAST_EVENT_DATE_FMT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})

function formatPastEventDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return PAST_EVENT_DATE_FMT.format(new Date(Date.UTC(y, m - 1, d)))
}

export const metadata: Metadata = {
  title: 'Festivals & Events in Mitchell County',
  description:
    'A guide to festivals and events held throughout the year in Mitchell County, North Carolina — from the NC Rhododendron Festival to the Apple Butter Festival and more.',
  alternates: { canonical: '/events/' },
  openGraph: {
    url: '/events/',
    title: 'Festivals & Events in Mitchell County',
    description: 'A year-round guide to festivals and events in Mitchell County, North Carolina.',
  },
}

export default function EventsPage() {
  const upcoming = getEventsByNextOccurrence()
  const past = getPastEventsByDate()

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-dark text-paper">
        <img
          src={assetPath('/Images/mchs-hero.webp')}
          alt="Mitchell County, North Carolina mountain landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
            Festivals &amp; Events in Mitchell County
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
            A year-round calendar of celebrations across the Blue Ridge — from the bloom of
            rhododendrons in June to apple butter in October and a Christmas parade to close out the
            year.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-paper py-16">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              A Calendar of Mountain Traditions
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              Mitchell County is home to a remarkable number of festivals and community events. The
              list below is sorted by what&apos;s coming up next. Dates shown are typical — please
              check each organizer&apos;s website for exact dates and times.
            </p>
          </div>
        </div>
      </section>

      {/* Event list */}
      <section className="bg-gray-50 py-16">
        <div className="ffc-container">
          <ul className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {upcoming.map((event) => {
              const detailHref = event.href ?? event.externalHref
              const isExternal = !event.href && !!event.externalHref
              const cardImage = event.image ?? '/Images/mchs-hero.webp'
              return (
                <li
                  key={event.slug}
                  className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-paper shadow-sm transition hover:shadow-md"
                >
                  <div className="relative">
                    <img
                      src={assetPath(cardImage)}
                      alt={event.name}
                      className="aspect-[16/9] w-full object-cover"
                    />
                    {event.hostedByMchs && (
                      <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-paper shadow">
                        Hosted by MCHS
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif-display text-2xl font-bold text-primary">
                      {event.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-accent">
                      {event.dateLabel} · {event.location}
                    </p>
                    <p className="mt-4 flex-1 text-gray-700">{event.summary}</p>
                    {detailHref && (
                      <div className="mt-6">
                        {isExternal ? (
                          <a
                            href={detailHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit the organizer site for ${event.name} (opens in a new tab)`}
                            className="font-semibold text-accent hover:underline"
                          >
                            Visit organizer site →
                          </a>
                        ) : (
                          <Link
                            href={detailHref}
                            aria-label={`Read more about ${event.name}`}
                            className="font-semibold text-accent hover:underline"
                          >
                            Event details →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Past programs */}
      {past.length > 0 && (
        <section className="bg-paper py-16">
          <div className="ffc-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                Past Programs
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                A short record of one-time MCHS programs and tribute concerts from years past.
              </p>
            </div>
            <ul className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
              {past.map((event) => (
                <li
                  key={`${event.date}-${event.name}`}
                  className="flex flex-col rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                    {formatPastEventDate(event.date)} · {event.location}
                  </p>
                  <h3 className="mt-2 font-serif-display text-xl font-bold text-primary">
                    {event.name}
                  </h3>
                  <p className="mt-3 flex-1 text-gray-700">{event.summary}</p>
                  {event.href && (
                    <Link
                      href={event.href}
                      className="mt-4 inline-block font-semibold text-accent hover:underline"
                    >
                      Read more →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Add your event CTA */}
      <section className="bg-gray-50 py-16">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Missing an event?
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              We&apos;d love to highlight more of Mitchell County&apos;s community gatherings. If
              you organize a local festival, parade, or annual event, get in touch and we&apos;ll
              add it to this page.
            </p>
            <Link
              href="/contact/"
              className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-paper transition hover:opacity-90"
            >
              Suggest an Event
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
