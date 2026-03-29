import React from 'react'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        id="hero"
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-dark text-paper"
      >
        <img
          src={assetPath('/Images/mchs-hero.webp')}
          alt="Mitchell County, North Carolina mountain landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-6xl">
            The History &amp; Heritage of Mitchell County, NC
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200 md:text-xl">
            The Mitchell County Historical Society is committed to preserving, protecting, and
            sharing the rich history and cultural heritage of Mitchell County, North Carolina.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/membership"
              className="rounded-lg bg-accent px-8 py-3 font-semibold text-paper transition hover:opacity-90"
            >
              Become a Member
            </Link>
            <Link
              href="/museum"
              className="rounded-lg border-2 border-paper px-8 py-3 font-semibold text-paper transition hover:bg-paper hover:text-dark"
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
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              Our mission as a nonpolitical, non-profit 501(c)(3) corporation is to collect,
              preserve, protect, and publicly display material that is historically significant to
              Mitchell County. The Society also strives to make the citizens of Mitchell County
              aware of their heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Museum Feature */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="items-center gap-12 md:flex">
            <div className="md:w-1/2">
              <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                The McBee Museum
              </h2>
              <div className="mt-4 h-1 w-20 rounded bg-accent" />
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                Step back in time at the McBee Museum, housed in a historic building dating to the
                1890s in downtown Bakersville. Explore exhibits showcasing the rich history of
                Mitchell County — from early settlers and the heritage of the Blue Ridge Mountains
                to the stories that shaped our community.
              </p>
              <Link
                href="/museum"
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-paper transition hover:opacity-90"
              >
                Learn More About the Museum
              </Link>
            </div>
            <div className="mt-8 md:mt-0 md:w-1/2">
              <img
                src={assetPath('/Images/mchs-museum.webp')}
                alt="The McBee Museum in Bakersville, North Carolina"
                className="h-64 w-full rounded-xl object-cover"
              />
            </div>
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
                href="/membership"
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
                href="/contact"
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
                href="/about"
                className="mt-4 inline-block font-semibold text-accent hover:underline"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events / Festival */}
      <section id="events" className="bg-dark py-20 text-paper">
        <div className="ffc-container">
          <div className="items-center gap-12 md:flex">
            <div className="md:w-1/2">
              <h2 className="font-serif-display text-3xl font-bold md:text-4xl">
                Apple Butter Festival
              </h2>
              <div className="mt-4 h-1 w-20 rounded bg-accent" />
              <p className="mt-6 text-lg leading-relaxed text-gray-300">
                Join us each October along the Bakersville Creekwalk for our beloved annual Apple
                Butter Festival! Experience traditional apple butter making over an open fire, live
                mountain music, arts &amp; crafts vendors, delicious food, and the Chili &amp;
                Cornbread Cookoff.
              </p>
              <Link
                href="/apple-butter-festival"
                className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-paper transition hover:opacity-90"
              >
                Festival Details
              </Link>
            </div>
            <div className="mt-8 md:mt-0 md:w-1/2">
              <img
                src={assetPath('/Images/mchs-festival.webp')}
                alt="Apple Butter Festival along the Bakersville Creekwalk"
                className="h-64 w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter & Store */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-paper p-8 shadow-sm">
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
                href="/membership"
                className="mt-4 inline-block font-semibold text-accent hover:underline"
              >
                Become a Member for Early Access →
              </Link>
            </div>
            <div className="rounded-xl border border-gray-200 bg-paper p-8 shadow-sm">
              <h3 className="font-serif-display text-2xl font-bold text-primary">
                MCHS Online Store
              </h3>
              <div className="mt-3 h-1 w-16 rounded bg-accent" />
              <p className="mt-4 text-gray-700">
                Browse our collection of books, maps, prints, and other items celebrating Mitchell
                County heritage. All proceeds support the society&apos;s mission of preserving local
                history.
              </p>
              <a
                href="https://store.mitchellnchistory.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-semibold text-accent hover:underline"
              >
                Visit the Online Store →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
