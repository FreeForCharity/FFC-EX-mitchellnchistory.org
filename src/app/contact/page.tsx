'use client'

import React from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark py-24 text-paper">
        <div className="ffc-container text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            We&apos;d love to hear from you. Reach out to the Mitchell County Historical Society
            with questions, membership inquiries, or to learn more about our programs.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Phone */}
            <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <Phone className="h-8 w-8 flex-shrink-0 text-accent" />
              <div>
                <h3 className="text-xl font-bold text-dark">Phone</h3>
                <a
                  href="tel:8286884371"
                  className="mt-1 inline-block text-lg text-accent hover:underline"
                >
                  (828) 688-4371
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <Mail className="h-8 w-8 flex-shrink-0 text-accent" />
              <div>
                <h3 className="text-xl font-bold text-dark">Email</h3>
                <a
                  href="mailto:mitchellnchistory@gmail.com"
                  className="mt-1 inline-block text-lg text-accent hover:underline"
                >
                  mitchellnchistory@gmail.com
                </a>
              </div>
            </div>

            {/* Physical Address */}
            <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <MapPin className="h-8 w-8 flex-shrink-0 text-accent" />
              <div>
                <h3 className="text-xl font-bold text-dark">Physical Address</h3>
                <p className="mt-1 text-gray-700">
                  11 N Mitchell Ave, Room 101
                  <br />
                  Historic Mitchell County Courthouse
                  <br />
                  Bakersville, NC 28705
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=11+N+Mitchell+Ave+Bakersville+NC+28705"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-accent hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Mailing Address */}
            <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <MapPin className="h-8 w-8 flex-shrink-0 text-accent" />
              <div>
                <h3 className="text-xl font-bold text-dark">Mailing Address</h3>
                <p className="mt-1 text-gray-700">
                  P.O. Box 651
                  <br />
                  Bakersville, NC 28705
                </p>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="mx-auto mt-8 max-w-lg">
            <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <Clock className="h-8 w-8 flex-shrink-0 text-accent" />
              <div>
                <h3 className="text-xl font-bold text-dark">Office Hours</h3>
                <p className="mt-1 text-gray-700">Tuesday – Friday, 10:00 AM – 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Send Us a Message
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-4 text-gray-600">
              This is a static website, so this form is for reference. Please email us directly at{' '}
              <a href="mailto:mitchellnchistory@gmail.com" className="text-accent hover:underline">
                mitchellnchistory@gmail.com
              </a>{' '}
              with your message.
            </p>
            <div className="mt-8 space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary focus:ring-primary"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary focus:ring-primary"
                  placeholder="Your message"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
