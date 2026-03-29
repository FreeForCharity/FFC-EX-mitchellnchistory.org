import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about the Mitchell County Historical Society, our mission, and how you can help preserve Mitchell County heritage.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark py-24 text-paper">
        <div className="ffc-container text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
            About The Mitchell County Historical Society
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Nestled in the beautiful Blue Ridge Mountains of western North Carolina, the Mitchell
            County Historical Society works to collect, preserve, and share the rich history of
            Mitchell County and its people.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-paper py-20">
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

      {/* How You Can Help */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="mb-12 text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              How You Can Help
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-paper p-8 shadow-sm">
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
            <div className="rounded-xl border border-gray-200 bg-paper p-8 shadow-sm">
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
            <div className="rounded-xl border border-gray-200 bg-paper p-8 shadow-sm">
              <h3 className="text-xl font-bold text-dark">Join The Board</h3>
              <p className="mt-3 text-gray-600">
                MCHS is seeking individuals interested in a greater role. Board members volunteer at
                events, work on projects, and help set priorities for the organization.
              </p>
              <Link
                href="/contact/"
                className="mt-4 inline-block font-semibold text-accent hover:underline"
              >
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Deduction */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-gray-50 p-8 text-center shadow-sm">
            <p className="text-lg leading-relaxed text-gray-700">
              The Mitchell County Historical Society is a 501(c)(3) non-profit organization, which
              means your donations are tax-deductible under the limitations of tax law.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/membership/"
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-paper transition hover:opacity-90"
              >
                Become a Member
              </Link>
              <Link
                href="/contact/"
                className="rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-paper"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
