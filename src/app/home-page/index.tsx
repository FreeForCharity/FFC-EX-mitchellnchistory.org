import React from 'react'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'
import { getFeaturedEvent } from '@/data/events'

export default function HomePage() {
  const featured = getFeaturedEvent()
  const featuredDetailHref = featured.href ?? featured.externalHref
  const featuredIsExternal = !featured.href && !!featured.externalHref
  const featuredImage = featured.image ?? '/Images/mchs-hero.webp'

  return (
    <div>
      {/* Bright historical montage and welcome */}
      <section id="hero" aria-labelledby="welcome-heading" className="bg-[#faf6ed]">
        <div className="mx-auto max-w-[1440px]">
          <img
            src={assetPath('/Images/mchs-home-hero-welcome.webp')}
            alt="Historic Mitchell County courthouse, railroad, mountain landscape, and portrait montage"
            width={1410}
            height={1115}
            fetchPriority="high"
            className="block h-auto w-full"
          />
        </div>
        <div className="ffc-container py-12 text-center md:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-dark md:text-base">
            The History &amp; Heritage of Mitchell County, NC
          </p>
          <h1
            id="welcome-heading"
            className="mx-auto mt-5 max-w-5xl font-serif-display text-4xl font-bold leading-tight tracking-tight text-dark md:text-5xl lg:text-6xl"
          >
            Every place has a story. Discover yours.
          </h1>
          <p className="mx-auto mt-7 max-w-4xl text-xl leading-relaxed text-dark md:text-2xl">
            From the slopes of Roan Mountain to the communities along the Toe River, Mitchell
            County&apos;s history lives in its people, places, and memories.
          </p>
          <p className="mx-auto mt-5 max-w-4xl text-lg leading-relaxed text-dark md:text-xl">
            Whether your roots run deep here or you are discovering the county for the first time,
            we invite you to explore the stories that connect us.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/articles/"
              className="rounded-lg bg-dark px-8 py-3 text-lg font-semibold text-paper transition hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark"
            >
              Explore Our Stories
            </Link>
            <Link
              href="/museum/"
              className="rounded-lg border-2 border-accent px-8 py-3 text-lg font-semibold text-dark transition hover:bg-dark hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark"
            >
              Visit the Museum
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Our Mission
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 font-serif-display text-2xl leading-relaxed text-gray-700 md:text-3xl">
              To light the past, enlighten the present, and illuminate the future.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              Through preservation, education, research assistance, community programs, and shared
              stories, MCHS helps Mitchell County residents connect the past to the present and
              carry it forward.
            </p>
            <Link
              href="/about/"
              className="mt-6 inline-block font-semibold text-accent hover:underline"
            >
              Read Our Vision &amp; Purpose →
            </Link>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mb-12 text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Get Involved
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              There are many ways to support the Mitchell County Historical Society and help
              preserve our county&apos;s heritage.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-paper p-8 shadow-sm transition hover:shadow-md">
              <h3 className="text-xl font-bold text-dark">Be A Member</h3>
              <p className="mt-3 text-gray-600">
                Your membership helps MCHS provide free programs, schedule special events, and offer
                services to our county. Plus, you get special perks as a member.
              </p>
              <Link
                href="/membership/"
                className="mt-4 inline-block font-semibold text-accent hover:underline"
              >
                Join Today →
              </Link>
            </div>
            <div className="rounded-xl border border-gray-200 bg-paper p-8 shadow-sm transition hover:shadow-md">
              <h3 className="text-xl font-bold text-dark">Be A Volunteer</h3>
              <p className="mt-3 text-gray-600">
                MCHS always needs volunteers for special programs, events, and the annual Apple
                Butter Festival. Your time and talent make a real difference.
              </p>
              <Link
                href="/contact/"
                className="mt-4 inline-block font-semibold text-accent hover:underline"
              >
                Get in Touch →
              </Link>
            </div>
            <div className="rounded-xl border border-gray-200 bg-paper p-8 shadow-sm transition hover:shadow-md">
              <h3 className="text-xl font-bold text-dark">Join The Board</h3>
              <p className="mt-3 text-gray-600">
                MCHS is seeking individuals interested in a greater role. Board members volunteer at
                events, work on projects, and help set priorities for the organization.
              </p>
              <Link
                href="/about/"
                className="mt-4 inline-block font-semibold text-accent hover:underline"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured upcoming event */}
      <section id="events" className="bg-dark py-20 text-paper">
        <div className="ffc-container">
          <h2 className="text-center font-serif-display text-3xl font-bold md:text-4xl">
            Events &amp; Festivals
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
          <p className="mt-4 text-center text-sm font-semibold uppercase tracking-widest text-accent">
            Up Next in Mitchell County
          </p>
          <div className="mt-12 items-center gap-12 md:flex">
            <div className="md:w-1/2">
              <h3 className="font-serif-display text-2xl font-bold md:text-3xl">{featured.name}</h3>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gray-300">
                {featured.dateLabel} · {featured.location}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-gray-300">{featured.summary}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                {featuredDetailHref &&
                  (featuredIsExternal ? (
                    <a
                      href={featuredDetailHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-paper transition hover:opacity-90"
                    >
                      Event Details
                    </a>
                  ) : (
                    <Link
                      href={featuredDetailHref}
                      className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-paper transition hover:opacity-90"
                    >
                      Event Details
                    </Link>
                  ))}
                <Link
                  href="/events/"
                  className="inline-block rounded-lg border-2 border-paper px-6 py-3 font-semibold text-paper transition hover:bg-paper hover:text-dark"
                >
                  See All Events
                </Link>
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:w-1/2">
              <img
                src={assetPath(featuredImage)}
                alt={featured.name}
                className="h-64 w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-paper p-8 shadow-sm">
            <h3 className="font-serif-display text-2xl font-bold text-primary">
              The Quarterly Review
            </h3>
            <div className="mt-3 h-1 w-16 rounded bg-accent" />
            <p className="mt-4 text-gray-700">
              Stay connected with Mitchell County history through our <em>Quarterly Review</em>{' '}
              newsletter. Each issue features articles on local history, genealogy tips, upcoming
              events, and society news. Members receive a preview of each edition!
            </p>
            <Link
              href="/membership/"
              className="mt-4 inline-block font-semibold text-accent hover:underline"
            >
              Become a Member for Early Access →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
