import React from 'react'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'

export default function HomePage() {
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

      {/* Mission */}
      <section id="mission" className="border-t border-accent/20 bg-[#faf6ed] py-10 md:py-12">
        <div className="ffc-container text-center">
          <h2 className="font-serif-display text-2xl font-bold text-dark md:text-3xl">
            Our Mission
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-serif-display text-xl leading-relaxed text-dark md:text-2xl">
            To light the past, enlighten the present, and illuminate the future.
          </p>
          <Link
            href="/about/"
            className="mt-4 inline-block font-semibold text-accent hover:underline"
          >
            Read Our Vision &amp; Purpose →
          </Link>
        </div>
      </section>

      {/* A compact invitation to participate */}
      <section aria-labelledby="get-involved-heading" className="bg-paper py-10 md:py-12">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="get-involved-heading"
              className="font-serif-display text-2xl font-bold text-dark md:text-3xl"
            >
              Get Involved
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Help keep Mitchell County&apos;s history alive. Become a member, volunteer your time,
              or share a photograph, document, or family story. There is a place for you in this
              work.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/membership/"
                className="rounded-lg bg-dark px-6 py-3 font-semibold text-paper transition hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark"
              >
                Become a Member
              </Link>
              <Link
                href="/contact/"
                className="rounded-lg border-2 border-accent px-6 py-3 font-semibold text-dark transition hover:bg-dark hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark"
              >
                Volunteer or Share a Story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
