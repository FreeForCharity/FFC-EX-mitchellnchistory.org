import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Join the Mitchell County Historical Society and support preservation, programs, research assistance, and shared community history.',
  alternates: { canonical: '/membership/' },
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
            Your membership helps MCHS light the past, enlighten the present, and illuminate the
            future through preservation, programs, research assistance, and shared community
            history.
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

      {/* Join Online (PayPal) */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Join Online
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              Pay your annual membership securely through PayPal — no PayPal account required (you
              can pay as a guest with any credit or debit card).
            </p>

            <form
              action="https://www.paypal.com/cgi-bin/webscr"
              method="post"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex flex-col items-center gap-4"
            >
              <input type="hidden" name="cmd" value="_s-xclick" />
              <input type="hidden" name="hosted_button_id" value="3EYWFFVQH3VRU" />
              <input type="hidden" name="on0" value="Membership Level" />
              <input type="hidden" name="currency_code" value="USD" />

              <div className="flex flex-col items-start gap-2 text-left">
                <label htmlFor="membership-level" className="text-sm font-semibold text-gray-700">
                  Membership Level
                </label>
                <select
                  id="membership-level"
                  name="os0"
                  defaultValue="Individual"
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="Individual">Individual — $25.00 USD</option>
                  <option value="Family">Family — $30.00 USD</option>
                </select>
              </div>

              <input
                type="image"
                src="https://www.paypalobjects.com/en_US/i/btn/btn_cart_LG.gif"
                name="submit"
                title="PayPal - The safer, easier way to pay online!"
                alt="Add membership to PayPal cart"
                className="mt-2"
              />
            </form>

            <p className="mt-6 text-sm text-gray-500">
              You&apos;ll be taken to PayPal&apos;s secure checkout in a new tab.
            </p>
          </div>
        </div>
      </section>

      {/* Other Ways to Join */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Prefer to Join by Phone or Mail?
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              We&apos;re happy to take your membership by phone or to mail you a paper form. Get in
              touch and we&apos;ll walk you through it.
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
