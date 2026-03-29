import React from 'react'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'McBee Museum',
  description:
    'Visit the McBee Museum in Bakersville, NC — housed in a historic 1890s building with exhibits on Mitchell County history.',
}

export default function MuseumPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-dark text-paper">
        <img
          src={assetPath('/Images/mchs-museum.webp')}
          alt="The McBee Museum in Bakersville, North Carolina"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
            The McBee Museum
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
            Step back in time and explore the rich history of Mitchell County, North Carolina.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Museum History
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                The McBee Museum is housed in a historic building dating to the 1890s in downtown
                Bakersville. The building was originally used as a doctor&apos;s office by Dr.
                Prestwood, serving the local community for many years.
              </p>
              <p>
                In 1919, Walter Berry and John C. McBee Sr. purchased the building. It continued to
                serve as a community landmark for decades, passing through the McBee family.
              </p>
              <p>
                In 1995, Martha McBee Summerour generously donated the building to the Mitchell
                County Historical Society, allowing it to be transformed into a museum dedicated to
                preserving and sharing Mitchell County&apos;s history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Renovation */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Museum Renovation
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              The McBee Museum has undergone significant renovations to preserve the historic
              building and improve the visitor experience.
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-paper p-8 shadow-sm">
                <h3 className="text-xl font-bold text-dark">Phase I — $15,000</h3>
                <p className="mt-3 text-gray-600">
                  The first phase of renovations focused on structural repairs, roof restoration,
                  and weatherproofing to protect the historic building and its contents from the
                  elements.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-paper p-8 shadow-sm">
                <h3 className="text-xl font-bold text-dark">Phase II — $10,000</h3>
                <p className="mt-3 text-gray-600">
                  The second phase addressed interior improvements including new exhibit displays,
                  lighting upgrades, and climate control to better preserve artifacts and enhance
                  the visitor experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="bg-dark py-20 text-paper">
        <div className="ffc-container text-center">
          <h2 className="font-serif-display text-3xl font-bold md:text-4xl">
            Support the McBee Museum
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Your support helps us maintain and improve the McBee Museum so that future generations
            can learn about and appreciate Mitchell County&apos;s rich heritage.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 font-semibold text-paper transition hover:opacity-90"
          >
            Contact Us to Support the Museum
          </Link>
        </div>
      </section>
    </div>
  )
}
