import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { assetPath } from '@/lib/assetPath'

export const metadata: Metadata = {
  title: 'Six Women, Six Voices',
  description:
    'An emerging Mitchell County Historical Society program that will celebrate the lives, contributions, and enduring legacies of six remarkable women who shaped Mitchell County, North Carolina.',
  alternates: { canonical: '/six-women-six-voices/' },
}

export default function SixWomenSixVoicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-dark text-paper">
        <img
          src={assetPath('/Images/mchs-hero.webp')}
          alt="Historic Mitchell County landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            MCHS Program · In Development
          </p>
          <h1 className="font-serif-display text-4xl font-bold tracking-tight text-paper md:text-6xl">
            Six Women, Six Voices
          </h1>
          <div className="mx-auto mt-6 h-1 w-24 rounded bg-accent" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200 md:text-xl">
            A forthcoming program celebrating women who shaped the culture, education, healthcare,
            and heritage of Mitchell County.
          </p>
        </div>
      </section>

      {/* About this program */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              About This Program
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              Women have always been the bedrock of Appalachian communities, but their voices and
              accomplishments are often underrepresented in the historical record.{' '}
              <strong>Six Women, Six Voices</strong> is an emerging Mitchell County Historical
              Society program that will spotlight six women — educators, healers, organizers,
              artists, and others — whose work helped shape Mitchell County.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              We&apos;re researching, gathering sources, and reaching out to families now. As the
              program develops, full biographies, photographs, and archival materials will be added
              to this page.
            </p>
            <p className="mt-6 inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
              Page updates as the program develops — check back, or help us build it (below).
            </p>
          </div>
        </div>
      </section>

      {/* Help build this */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="items-start gap-12 lg:flex">
            <div className="lg:w-1/2">
              <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                Help Us Build This
              </h2>
              <div className="mt-4 h-1 w-20 rounded bg-accent" />
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                If you have records, photographs, family stories, or sources documenting the work of
                a Mitchell County woman whose contributions deserve to be remembered, we&apos;d love
                to hear from you. Community contributions are how the Mitchell County Historical
                Society does its best work.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact/"
                  className="rounded-lg bg-primary px-6 py-3 font-semibold text-paper transition hover:opacity-90"
                >
                  Contact Us
                </Link>
                <Link
                  href="/scan-days/"
                  className="rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-paper"
                >
                  Bring Records to Scan Days
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/2">
              <div className="rounded-2xl border border-gray-200 bg-paper p-8">
                <h3 className="font-serif-display text-xl font-bold text-primary">
                  Ways You Can Contribute
                </h3>
                <ul className="mt-6 space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-paper">
                      1
                    </span>
                    <div>
                      <strong>Share family records:</strong> letters, diaries, photographs,
                      newspaper clippings, or oral-history recordings naming or describing the
                      person.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-paper">
                      2
                    </span>
                    <div>
                      <strong>Suggest a name:</strong> tell us who you think belongs in this program
                      and why. Sourced suggestions (with even one citation) help most.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-paper">
                      3
                    </span>
                    <div>
                      <strong>Support MCHS:</strong> become a{' '}
                      <Link href="/membership/" className="text-accent hover:underline">
                        member
                      </Link>{' '}
                      or contribute to the research effort — it&apos;s what makes programs like this
                      possible.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
