import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { assetPath } from '@/lib/assetPath'

export const metadata: Metadata = {
  title: 'McBee Museum',
  description:
    'Explore the McBee Museum of Mitchell County History in Bakersville, its historic building, and the generosity that preserved it. Plan a guided visit.',
  alternates: { canonical: '/museum/' },
}

export default function MuseumPage() {
  return (
    <div>
      <section className="bg-dark py-24 text-paper">
        <div className="ffc-container text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
            The McBee Museum
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            A building with a story. A community with a history to share.
          </p>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <div className="ffc-container">
          <figure className="mx-auto max-w-5xl">
            <img
              src={assetPath('/Images/mcbee-museum-restored.webp')}
              alt="The restored McBee Museum, with white clapboard siding, green trim, a pink door, and a colorful quilt block on its gable."
              width={1448}
              height={1086}
              className="h-auto w-full rounded-xl"
              fetchPriority="high"
            />
            <figcaption className="mt-3 text-sm text-gray-600">
              The McBee Museum of Mitchell County History in Bakersville today.
            </figcaption>
          </figure>
          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              More Than a Museum
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              Before it became the McBee Museum of Mitchell County History, this small building
              served generations of residents as a doctor&apos;s office, drug store, law office, and
              place of business. Today, it preserves the stories of the community it has long been
              part of.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-paper p-6 md:p-10">
            <h2 className="font-serif-display text-3xl font-bold text-primary">Plan Your Visit</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
              <p>
                Visitors receive a guided tour and access to the museum during Society office hours.
                Weekend visits are available by appointment.
              </p>
              <p>
                Begin at the Society office on the first floor of the Historic Mitchell County
                Courthouse, 11 N. Mitchell Avenue, Room 101, in Bakersville. While you are there,
                explore the Society&apos;s courthouse exhibits as well.
              </p>
              <p>Contact us to arrange a weekend tour or ask about your visit.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-semibold text-accent">
              <a href="tel:8286884371" className="hover:underline">
                (828) 688-4371
              </a>
              <a href="mailto:mitchellnchistory@gmail.com" className="break-all hover:underline">
                mitchellnchistory@gmail.com
              </a>
            </div>
            <Link
              href="/contact/"
              className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-paper transition hover:opacity-90"
            >
              Office Hours &amp; Directions
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              A Building Woven into Local History
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                The museum stands on land once owned by Sydney Prestwood. The building is believed
                to have been constructed by the Bailey family as a store. In 1888, Sydney&apos;s
                son, Dr. Robert Luther Prestwood, returned from medical school in Nashville and
                began practicing here in Mitchell County&apos;s first standalone doctor&apos;s
                office. The building also housed the county&apos;s first drug store.
              </p>
              <p>
                After Dr. Prestwood&apos;s death in 1899, owners included his former wife, Birdie
                Young Prestwood, and Sheriff George Pritchard. Pritchard rented the building to
                physicians, including Dr. V. R. Butt, who purchased it in 1907. Dr. C. E. Smith and
                Dr. R. S. Upton also treated patients here. At other times, the building served as a
                general merchandise storehouse and a barber shop.
              </p>
              <p>
                In 1919, Dr. Butt sold the property to attorneys Walter Berry and John C. McBee Sr.
                Berry sold his share to McBee in 1928. Two years later, McBee sold the building to
                his son, John C. McBee Jr., who later passed it to his daughter, Martha McBee
                Summerour.
              </p>
              <p>
                Originally two stories tall, the building was damaged in the devastating fire of
                1923 and repaired as the one-story structure visitors see today.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl items-start gap-8 md:grid-cols-2">
            <figure>
              <img
                src={assetPath('/Images/mcbee-building-historic.webp')}
                alt="A horse-drawn carriage carrying three people beside the historic two-story building."
                width={1536}
                height={1024}
                loading="lazy"
                className="h-auto w-full rounded-lg"
              />
              <figcaption className="mt-3 text-sm leading-relaxed text-gray-600">
                A view from an earlier era, showing the building in its original two-story form.
              </figcaption>
            </figure>
            <figure>
              <img
                src={assetPath('/Images/bakersville-after-fire.webp')}
                alt="Bakersville after a major fire, with rubble in the foreground and surviving buildings across the street."
                width={1800}
                height={1147}
                loading="lazy"
                className="h-auto w-full rounded-lg"
              />
              <figcaption className="mt-3 text-sm leading-relaxed text-gray-600">
                The aftermath of Bakersville&apos;s devastating fire—a reminder of the losses and
                rebuilding that shaped the town.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-dark py-16 text-paper md:py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif-display text-3xl font-bold md:text-4xl">
              A Legacy of Generosity
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-300">
              <p>
                In 1994, Martha McBee Summerour generously donated the building to the Mitchell
                County Historical Society. Her gift, and the McBee family&apos;s long stewardship,
                gave the community a lasting home for its history.
              </p>
              <p>
                A generous grant from the Samuel L. Phillips Family Foundation in 2024 made a
                complete restoration possible, preserving the historic structure so that it can
                serve generations to come.
              </p>
              <p>
                The Society gratefully honors the McBee family and the Samuel L. Phillips Family
                Foundation for helping ensure that this building—and the stories it holds—remain
                part of Mitchell County&apos;s future.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
