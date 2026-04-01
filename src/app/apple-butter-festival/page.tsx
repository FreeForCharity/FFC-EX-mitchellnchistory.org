import React from 'react'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apple Butter Festival',
  description:
    'Join us each October along the Bakersville Creekwalk for the annual Apple Butter Festival — live music, crafts, food, and more.',
  alternates: { canonical: '/apple-butter-festival/' },
}

export default function AppleButterFestivalPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-dark text-paper">
        <img
          src={assetPath('/Images/mchs-festival.webp')}
          alt="Apple Butter Festival along the Bakersville Creekwalk"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
            Apple Butter Festival
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
            A beloved annual tradition along the Bakersville Creekwalk each October.
          </p>
        </div>
      </section>

      {/* About the Festival */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              About the Festival
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              Join us each October along the Bakersville Creekwalk for our beloved annual Apple
              Butter Festival! This family-friendly event celebrates the traditions and heritage of
              Mitchell County with something for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="mb-12 text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Festival Features
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Apple Butter Making',
                description:
                  'Watch traditional apple butter being made over an open fire — a time-honored Appalachian tradition.',
              },
              {
                title: 'Live Mountain Music',
                description:
                  'Enjoy live performances featuring traditional mountain and bluegrass music throughout the day.',
              },
              {
                title: 'Arts & Crafts Vendors',
                description:
                  'Browse handmade crafts, artwork, and unique items from local and regional artisans.',
              },
              {
                title: 'Delicious Food',
                description:
                  'Savor a wide variety of food from local vendors, featuring Appalachian favorites and festival treats.',
              },
              {
                title: 'Chili & Cornbread Cookoff',
                description:
                  'Sample entries in our popular Chili & Cornbread Cookoff and vote for your favorite!',
              },
              {
                title: 'Family-Friendly Fun',
                description:
                  'Activities and entertainment for all ages make this a perfect outing for the whole family.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-paper p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-dark">{feature.title}</h3>
                <p className="mt-3 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              A Tradition Over 300 Years Old
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              Apple butter making is a tradition with roots stretching back more than 300 years in
              the Appalachian Mountains. Early settlers brought the craft to the Blue Ridge
              Mountains, where it became an essential part of fall harvest celebrations. The
              Mitchell County Historical Society is proud to keep this tradition alive through our
              annual festival.
            </p>
          </div>
        </div>
      </section>

      {/* Vendor Info */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Vendor Information
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              Interested in being a vendor at the Apple Butter Festival? We welcome arts &amp;
              crafts vendors, food vendors, and community organizations. Contact us for vendor
              application details and booth information.
            </p>
            <Link
              href="/contact/"
              className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-paper transition hover:opacity-90"
            >
              Contact Us for Details
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
