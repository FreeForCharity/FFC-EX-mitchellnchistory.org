import React from 'react'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Six Women, Six Voices',
  description:
    'Celebrate the lives, contributions, and enduring legacies of six remarkable women who shaped the culture, education, healthcare, and heritage of Mitchell County, North Carolina.',
  alternates: { canonical: '/six-women-six-voices/' },
}

export default function SixWomenSixVoicesPage() {
  const women = [
    {
      name: 'Lucy Calista Morgan',
      lifespan: '1889 – 1981',
      role: 'Founder of Penland School of Crafts',
      image: '/Images/mchs-hero.webp', // Fallback or general image since no specific image exists
      summary:
        'Lucy Morgan was a visionary educator and craft preservationist who founded the world-renowned Penland School of Crafts in the 1920s. Distressed by the economic hardships of local families, she sought to revive the traditional Appalachian handweaving craft to provide mountain women with a source of income and economic independence.',
      achievements: [
        'Revived traditional handweaving, providing economic opportunities to dozens of local families during the Great Depression.',
        'Established the Penland School of Crafts, growing it from a small local weaving institute into an internationally celebrated center for craft education.',
        'Championed the values of community, collaboration, and preserving historic regional techniques.',
      ],
      quote:
        '“We wanted to help them earn some extra money and to revive the dying art of handweaving, and we found that both of these desires were met with enthusiastic response.”',
    },
    {
      name: 'Ella Clapp Thompson',
      lifespan: '1870 – 1944',
      role: 'Pioneering Suffragist & Organizer',
      image: '/Images/mchs-hero.webp',
      summary:
        'Born and raised in Bakersville, Ella Clapp Thompson was a leading voice for women’s suffrage in Western North Carolina and beyond. She dedicated her life to civil rights and political reform, playing a central role in organizing the North Carolina Chapter of the Congressional Union for Woman Suffrage.',
      achievements: [
        'Represented North Carolina at national suffrage conventions and historic marches in Washington, D.C.',
        'Spearheaded the formation of the Bakersville Equal Suffrage Club, rallying mountain women to the cause of voting rights.',
        'Worked tirelessly to lobby local and state politicians for the ratification of the 19th Amendment.',
      ],
      quote:
        '“Justice is not complete until every citizen, regardless of gender, has a voice in the laws that govern them.”',
    },
    {
      name: 'Roxanna “Roxaner” Bowman Putman',
      lifespan: '1862 – 1936',
      role: 'Traditional Mountain Herb Doctor',
      image: '/Images/mchs-hero.webp',
      summary:
        'Hailing from the remote Buladean community, Roxanna Putman was a highly respected “wise woman” and herb doctor. In a time when professional medical care was scarce and inaccessible in the rugged Blue Ridge Mountains, she served as the primary caregiver for hundreds of families, using traditional Appalachian botanical medicine.',
      achievements: [
        'Amassed deep knowledge of local Appalachian plants, roots, and barks to formulate natural remedies and cures.',
        'Traveled miles on horseback and foot through difficult terrain to deliver babies, treat illnesses, and heal injuries.',
        'Passed down essential oral traditions and wisdom of natural medicine that remain key to local folklore today.',
      ],
      quote:
        '“The mountains provide everything we need to heal, if we only listen, learn, and respect the soil.”',
    },
    {
      name: 'Inez Blevins McRae',
      lifespan: '1922 – 2019',
      role: 'Educator & MCHS Founding Anchor',
      image: '/Images/mchs-hero.webp',
      summary:
        'Inez McRae was a cornerstone of the Mitchell County community. A dedicated schoolteacher for decades, she instilled a deep appreciation of history and heritage in thousands of local children. Later in life, she became a founding member and the guiding force behind the Mitchell County Historical Society, preserving the history she loved.',
      achievements: [
        'Educated multiple generations of Mitchell County students, emphasizing local history and Appalachian culture.',
        'Co-founded the Mitchell County Historical Society and served as its steadfast anchor and advisor for many years.',
        'Honored posthumously by the Inez McRae Memorial Scholarship, which helps local students pursue higher education in Appalachian studies.',
      ],
      quote:
        '“A community that forgets its past has no foundation on which to build its future. We must preserve our stories for the children.”',
    },
    {
      name: 'Rhonda Gouge',
      lifespan: 'Living Legend',
      role: 'Traditional Musician & Heritage Bearer',
      image: '/Images/mchs-hero.webp',
      summary:
        'A lifelong resident of Ledger, Rhonda Gouge has spent over 50 years teaching and preserving the unique mountain music traditions of Western North Carolina. As a groundbreaking female instrumentalist, she mastered the banjo, guitar, and fiddle, becoming a crucial tradition-bearer of secular and sacred Appalachian music.',
      achievements: [
        'Taught hundreds of young musicians the traditional instrumental techniques of the Blue Ridge Mountains.',
        'Received the prestigious 2023 North Carolina Heritage Award for her lifetime contribution to traditional arts.',
        'Collaborated extensively with legendary fiddler Red Wilson, maintaining the rich musical heritage of the Toe River Valley.',
      ],
      quote:
        '“Music is the heartbeat of these mountains. It has gotten our people through hard times, and it is our duty to pass it on.”',
    },
    {
      name: 'Lt. Nina Silver Turbyfill',
      lifespan: '1920 – 2009',
      role: 'WWII Army Nurse Corps Veteran',
      image: '/Images/mchs-hero.webp',
      summary:
        'Born in the Bandana community of Mitchell County, Nina Silver Turbyfill represented the extraordinary spirit of service and courage shown by mountain women during World War II. Serving on the front lines as a Lieutenant in the Army Nursing Corps, she provided lifesaving care to wounded soldiers under grueling conditions.',
      achievements: [
        'Volunteered for the Army Nursing Corps during WWII, serving with distinction in European theaters.',
        'Administered critical care near active combat zones, saving countless lives and comforting wounded servicemen.',
        'Returned home to Mitchell County as a highly respected leader, embodying patriotism, sacrifice, and the professional advancement of women.',
      ],
      quote:
        '“We did what had to be done. The courage of the boys on the line gave us all the strength we needed to keep going.”',
    },
  ]

  return (
    <div className="bg-paper min-h-screen text-dark">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-dark text-paper">
        <img
          src={assetPath('/Images/mchs-hero.webp')}
          alt="Historic Mitchell County landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
            MCHS Special Program
          </p>
          <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-6xl text-paper">
            Six Women, Six Voices
          </h1>
          <div className="mx-auto mt-6 h-1 w-24 rounded bg-accent" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200 md:text-xl">
            Celebrating the extraordinary lives, contributions, and enduring legacies of six
            remarkable women who shaped the culture, education, healthcare, and heritage of Mitchell
            County, North Carolina.
          </p>
        </div>
      </section>

      {/* Program Introduction */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              About the Program
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              Women have always been the bedrock of Appalachian communities, yet their voices and
              accomplishments have often been underrepresented in mainstream historical records. The
              Mitchell County Historical Society’s <strong>Six Women, Six Voices</strong> initiative
              shines a light on six visionary leaders, activists, healers, and educators who left an
              indelible mark on Mitchell County.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Through their dedication to community economic advancement, civil rights, traditional
              arts, mountain healthcare, and youth education, these women forged a path of
              resilience and inspiration that continues to guide Western North Carolina today.
            </p>
          </div>
        </div>
      </section>

      {/* The Six Women Showcase */}
      <section className="bg-gray-50 py-20">
        <div className="ffc-container">
          <div className="mb-16 text-center">
            <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
              Honoring Our Pioneers
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Explore the stories and wisdom of the women who helped build Mitchell County.
            </p>
            <div className="mx-auto mt-4 h-1 w-20 rounded bg-accent" />
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {women.map((woman, idx) => (
              <div
                key={woman.name}
                className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-paper p-8 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="font-serif-display text-2xl font-bold text-primary">
                        {woman.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-accent">
                        {woman.role}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {woman.lifespan}
                    </span>
                  </div>

                  <p className="mt-6 text-gray-700 leading-relaxed">{woman.summary}</p>

                  <div className="mt-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
                      Key Contributions &amp; Legacy:
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {woman.achievements.map((ach, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                          <span className="mr-2 text-accent font-bold">•</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-100 pt-6">
                  <blockquote className="italic text-gray-500 border-l-4 border-accent pl-4">
                    {woman.quote}
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy and Educational Impact */}
      <section className="bg-paper py-20">
        <div className="ffc-container">
          <div className="items-center gap-12 lg:flex">
            <div className="lg:w-1/2">
              <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                Preserving Their Voices
              </h2>
              <div className="mt-4 h-1 w-20 rounded bg-accent" />
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                The <strong>Six Women, Six Voices</strong> project is more than a historical record;
                it is an ongoing educational initiative. The Mitchell County Historical Society uses
                these stories to inspire local students through school presentations, museum
                displays, and historical essays.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-700">
                By understanding the trials, resourcefulness, and achievements of these remarkable
                figures, we empower future generations to contribute to their communities with the
                same strength and vision.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/membership/"
                  className="rounded-lg bg-primary px-6 py-3 font-semibold text-paper transition hover:opacity-90"
                >
                  Support This Initiative
                </Link>
                <Link
                  href="/contact/"
                  className="rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-paper"
                >
                  Request a School Presentation
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/2">
              <div className="rounded-2xl bg-gray-50 p-8 border border-gray-200">
                <h3 className="font-serif-display text-xl font-bold text-primary">
                  How You Can Get Involved:
                </h3>
                <ul className="mt-6 space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-paper">
                      1
                    </span>
                    <div>
                      <strong>Visit the McBee Museum:</strong> Check out our seasonal exhibits
                      featuring archival items, photographs, and documents related to these
                      pioneers.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-paper">
                      2
                    </span>
                    <div>
                      <strong>Share Your Family Stories:</strong> Do you have historical records or
                      stories of other remarkable Mitchell County women? We want to hear from you!
                      Contact us or join us on Scan Days.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-paper">
                      3
                    </span>
                    <div>
                      <strong>Donate to the Scholarship Fund:</strong> Support the Inez McRae
                      Memorial Scholarship to help Mitchell County high school graduates pursue
                      Appalachian studies.
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
