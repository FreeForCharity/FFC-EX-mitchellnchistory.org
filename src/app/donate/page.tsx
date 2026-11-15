import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support Our History',
  description:
    'Help the Mitchell County Historical Society preserve local history through gifts supporting our museum, research, exhibits, publications, and educational programs.',
  alternates: { canonical: '/donate/' },
}

export default function DonatePage() {
  return (
    <div>
      <section className="bg-dark py-24 text-paper">
        <div className="ffc-container text-center">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight text-balance md:text-5xl">
            Support Our History
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-balance text-gray-300">
            Your gift helps preserve Mitchell County&apos;s heritage and share it with generations
            to come.
          </p>
        </div>
      </section>
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Help Keep Mitchell County&apos;s History Alive
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                Every photograph, family story, historic place, and treasured object holds a piece
                of Mitchell County&apos;s past. Your gift helps the Mitchell County Historical
                Society preserve that heritage and share it with generations to come.
              </p>
              <p>
                Donations support our museum, historical research, publications, exhibits, and
                educational programs. They help us care for the materials entrusted to us and bring
                local history to life for students, residents, and visitors.
              </p>
              <p className="font-semibold">
                Whether your roots here reach back generations or you have just discovered our
                mountain communities, you can help keep their stories alive. Every gift is
                appreciated.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Make a Gift by Check
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              Please make your check payable to <strong>Mitchell County Historical Society</strong>{' '}
              and mail it to:
            </p>
            <address className="mt-6 text-lg leading-relaxed not-italic text-gray-700">
              Mitchell County Historical Society
              <br />
              P.O. Box 651
              <br />
              Bakersville, NC 28705
            </address>
          </div>
        </div>
      </section>
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Give in Honor or Memory
            </h2>
            <div className="mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              A donation is a meaningful way to honor someone special or remember a loved one.
              Please include a note with their name and indicate whether your gift is in honor or in
              memory.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              For questions about making a gift, contact us at{' '}
              <a
                href="mailto:mitchellnchistory@gmail.com"
                className="text-primary underline underline-offset-4"
              >
                mitchellnchistory@gmail.com
              </a>{' '}
              or{' '}
              <a href="tel:8286884371" className="text-primary underline underline-offset-4">
                (828) 688-4371
              </a>
              .
            </p>
            <p className="mt-10 text-lg leading-relaxed font-semibold text-primary">
              Thank you for helping us preserve the stories, places, and people that make Mitchell
              County home.
            </p>
            <p className="mt-6 font-serif-display text-xl italic text-primary">
              Lighting the Past. Enlightening the Present. Illuminating the Future.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
