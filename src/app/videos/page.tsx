import type { Metadata } from 'next'
import { getWpPages } from '@/data/articles'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { notFound } from 'next/navigation'

const videoSlugs = ['event-videos', '2020-videos', '2019-videos', '2017-videos', '2016-videos']
const videoHeadingPattern = /<h4(\s[^>]*)?>([\s\S]*?)<\/h4>/gi
const videoListTitlePattern = /(<li>[\s\S]*?<strong>)([\s\S]*?)(<\/strong>[\s\S]*?<\/li>)/gi
const videoUrlsByTitle: Record<string, string> = {
  '2020 overmountain men celebration spruce pine north carolina':
    'https://www.youtube.com/watch?v=bqJ5djZxQEE',
  "daniel boone's tree at dellinger mill": 'https://www.youtube.com/watch?v=j1LByGmMwgw',
  "dellinger's mill in bakersville north carolina": 'https://www.youtube.com/watch?v=ulfk3uN2k58',
  'scotland where we came from or did we really ever leave':
    'https://www.youtube.com/watch?v=_Q315dW8S9A',
  'the red white strings isaac english the civil war':
    'https://www.youtube.com/watch?v=0V10tE0BfdQ',
  'mitchell county early crossroads of culture': 'https://www.youtube.com/watch?v=G4rpYqUjLQk',
  'dr dan barron presentation': 'https://www.youtube.com/watch?v=G4rpYqUjLQk',
  'the frankie charlie silver story': 'https://www.youtube.com/watch?v=Jv4MqdfofYc',
  'the music of mitchell county': 'https://www.youtube.com/watch?v=uutvst5eZjQ',
  'rhonda gouge plays music of mitchell county nc': 'https://www.youtube.com/watch?v=uutvst5eZjQ',
  'the geology of the toe river': 'https://www.youtube.com/watch?v=K3dZlakA5so',
  'geology of the toe river': 'https://www.youtube.com/watch?v=K3dZlakA5so',
  "the toe river the valley's highway": 'https://www.youtube.com/watch?v=zqt_CeaOSCg',
  'world war i': 'https://www.youtube.com/watch?v=IexUuWMJ21I',
  'world war i the soldiers of the toe river valley': 'https://www.youtube.com/watch?v=IexUuWMJ21I',
  'the railroads of the toe river valley': 'https://www.youtube.com/watch?v=uNlqgdWH3KA',
  'mountain church music': 'https://www.youtube.com/watch?v=y_jBqfMbfEw',
  'mountain church music in the toe river valley': 'https://www.youtube.com/watch?v=y_jBqfMbfEw',
  'the penland post office': 'https://www.youtube.com/watch?v=SI4R1DQXsH4',
  'penland post office': 'https://www.youtube.com/watch?v=SI4R1DQXsH4',
  'the frankie silver story': 'https://www.youtube.com/watch?v=ZQ6DViANMIc',
  'frankie charlie put a stop to it': 'https://www.youtube.com/watch?v=ICOA_6yqd2Q',
  'the uncut story of frankie silver': 'https://www.youtube.com/watch?v=qAFT4OwNhSg',
  "fort san juan spain's failed appalachian outpost": 'https://www.youtube.com/watch?v=1CEMHj7f-i0',
  // Lost Cove program presentation
  'lost cove': 'https://youtu.be/zLRIGxXyQYI',
  'lost cove portrait of a vanished appalachian community': 'https://youtu.be/zLRIGxXyQYI',
  'lost cove north carolina': 'https://youtu.be/zLRIGxXyQYI',
  // variations including presenter name so WP content variations auto-link
  'lost cove christy a smith': 'https://youtu.be/zLRIGxXyQYI',
  'lost cove by christy a smith': 'https://youtu.be/zLRIGxXyQYI',
  'lost cove christy smith': 'https://youtu.be/zLRIGxXyQYI',
  'lost cove by christy smith': 'https://youtu.be/zLRIGxXyQYI',
}

function normalizeVideoTitle(innerHtml: string): string {
  return innerHtml
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, ' ')
    .replace(/&#x27;|&apos;|’/g, "'")
    .replace(/…/g, ' ')
    .replace(/[^a-z0-9']+/gi, ' ')
    .replace(/\bamp\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function linkTitleHtml(innerHtml: string): string | null {
  if (!innerHtml.trim() || /^<a\b/i.test(innerHtml.trim()) || /<\/a>/i.test(innerHtml)) {
    return null
  }

  const videoUrl = videoUrlsByTitle[normalizeVideoTitle(innerHtml)]

  if (!videoUrl) {
    return null
  }

  return `<a href="${videoUrl}" target="_blank" rel="noopener noreferrer">${innerHtml}</a>`
}

function linkVideoListingsToYoutubeVideos(content: string): string {
  return sanitizeHtml(content)
    .replace(videoHeadingPattern, (match, attributes = '', innerHtml) => {
      const linkedTitle = linkTitleHtml(innerHtml)
      return linkedTitle ? `<h4${attributes}>${linkedTitle}</h4>` : match
    })
    .replace(videoListTitlePattern, (match, openingHtml, innerHtml, closingHtml) => {
      const linkedTitle = linkTitleHtml(innerHtml)
      return linkedTitle ? `${openingHtml}${linkedTitle}${closingHtml}` : match
    })
}

export const metadata: Metadata = {
  title: 'Videos',
  description:
    'Watch videos from Mitchell County Historical Society events and programs.',
  alternates: { canonical: '/videos/' },
}

export default function VideosPage() {
  const videoPages = getWpPages(videoSlugs)

  if (videoPages.length === 0) {
    notFound()
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark py-20 text-paper">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
              Videos
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              Watch videos from Mitchell County Historical Society events and programs.
            </p>
          </div>
        </div>
      </section>

      {/* Video Sections */}
      {videoPages.map((page, i) => (
        <section key={page.slug} className={i % 2 === 0 ? 'bg-paper py-16' : 'bg-gray-50 py-16'}>
          <div className="ffc-container">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-serif-display text-3xl font-bold text-primary md:text-4xl">
                {page.title}
              </h2>
              <div className="mt-4 h-1 w-20 rounded bg-accent" />
              <div
                className="wp-content mt-8"
                dangerouslySetInnerHTML={{
                  __html: linkVideoListingsToYoutubeVideos(page.content),
                }}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
