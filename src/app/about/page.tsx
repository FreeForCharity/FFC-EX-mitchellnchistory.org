import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

const purposeStatements = [
  "To gather, preserve, and share documents, artifacts, and stories of Mitchell County's past.",
  'To encourage individuals and families to become engaged in this process for themselves and the community.',
  'To encourage residents of all ages to understand and appreciate how this process can benefit them culturally, economically, socially, and academically.',
  'To provide personal assistance to individuals and/or groups with questions related to local genealogy and history.',
  'To provide opportunities for residents to gather, discuss, and enjoy communally stories related to Mitchell County history.',
  'To develop and maintain a sustainable, responsive, collaborative, innovative, and inclusive nonprofit organization serving present and future residents and others interested in Mitchell County history.',
]

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about the Mitchell County Historical Society vision, mission, and purpose for preserving and sharing Mitchell County history.',
  alternates: { canonical: '/about/' },
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
            County Historical Society gathers, preserves, and shares the documents, artifacts, and
            stories of Mitchell County&apos;s past.
          </p>
        </div>
      </section>

      {/* Vision, Mission, and Purpose */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-4xl space-y-16">
            <div className="text-center">
              <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                Vision
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
              <p className="mt-8 text-lg leading-relaxed text-gray-700">
                We envision a community that is well informed about events from our past, is engaged
                in discovering family histories and stories, is willing to share those findings with
                others, appreciates the challenge to understand how those events and stories relate
                to the present community, enjoys opportunities that bring residents together for
                further discovery and understanding, and finds ways to weave these processes into
                the lives of future generations.
              </p>
            </div>

            <div className="text-center">
              <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                Mission
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
              <p className="mt-8 font-serif-display text-2xl leading-relaxed text-gray-700 md:text-3xl">
                To light the past, enlighten the present, and illuminate the future.
              </p>
            </div>

            <div>
              <div className="text-center">
                <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                  Purpose
                </h2>
                <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
              </div>
              <ul className="mt-8 space-y-4 text-lg leading-relaxed text-gray-700">
                {purposeStatements.map((statement) => (
                  <li key={statement} className="flex items-start gap-3">
                    <span className="mt-1 text-accent">✦</span>
                    <span>{statement}</span>
                  </li>
                ))}
              </ul>
            </div>
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
