import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Join the Mitchell County Historical Society and support the preservation of Mitchell County heritage.',
}

export default function MembershipPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark py-24 text-paper">
        <div className="ffc-container text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
            Become a Member
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Your membership supports the Mitchell County Historical Society&apos;s mission to
            preserve and share our county&apos;s rich heritage.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Member Benefits
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <ul className="mt-8 space-y-4 text-lg text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-accent">✦</span>
                <span>
                  Preview of each edition of the <em>Quarterly Review</em> newsletter
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-accent">✦</span>
                <span>Discounts at the MCHS Online Store</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-accent">✦</span>
                <span>Advance notice of special presentations and events</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-accent">✦</span>
                <span>Volunteer opportunities at events and the McBee Museum</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-accent">✦</span>
                <span>Access to online research resources</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-accent">✦</span>
                <span>MCHS refrigerator magnet</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              How to Join
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              To become a member of the Mitchell County Historical Society, please contact us by
              email or phone. We&apos;ll be happy to provide you with membership information and get
              you started.
            </p>
            <div className="mt-8 space-y-4">
              <p className="text-lg">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:mitchellnchistory@gmail.com"
                  className="text-accent hover:underline"
                >
                  mitchellnchistory@gmail.com
                </a>
              </p>
              <p className="text-lg">
                <strong>Phone:</strong>{' '}
                <a href="tel:8286884371" className="text-accent hover:underline">
                  (828) 688-4371
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
