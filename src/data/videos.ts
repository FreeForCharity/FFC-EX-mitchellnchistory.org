import { programYears } from './programs'

export type Recording = {
  slug: string
  youtubeId: string
  topic: string
  title: string
  presenter?: string
  dateLabel?: string
  year?: number
  description: string
  related?: boolean
  featuredImage?: string
}
// Change this slug to rotate the featured recording without rearranging the collection.
export const featuredRecordingSlug = 'six-women-six-voices-stories-history-left-unfinished'

const recordingDetails: Record<
  string,
  { youtubeId: string; topic: string; featuredImage?: string }
> = {
  'six-women-six-voices-stories-history-left-unfinished': {
    youtubeId: 'S_RFod1HZs4',
    topic: 'People & Communities',
    featuredImage: '/Images/six-women-six-voices-flyer.jpg',
  },
  'the-penland-post-office': { youtubeId: 'SI4R1DQXsH4', topic: 'Historic Places' },
  'mountain-church-music-in-the-toe-river-valley': {
    youtubeId: 'y_jBqfMbfEw',
    topic: 'Music & Traditions',
  },
  'the-railroads-of-the-toe-river-valley': { youtubeId: 'uNlqgdWH3KA', topic: 'Historic Places' },
  'world-war-i-the-soldiers-of-the-toe-river-valley': {
    youtubeId: 'IexUuWMJ21I',
    topic: 'Military History',
  },
  'the-geology-of-the-toe-river': { youtubeId: 'K3dZlakA5so', topic: 'Geology & Mining' },
  'the-toe-river-the-valley-s-highway': { youtubeId: 'zqt_CeaOSCg', topic: 'Historic Places' },
  'rhonda-gouge-plays-music-of-mitchell-county-nc': {
    youtubeId: 'uutvst5eZjQ',
    topic: 'Music & Traditions',
  },
  'the-frankie-charlie-silver-story': { youtubeId: 'Jv4MqdfofYc', topic: 'People & Communities' },
  'mitchell-county-early-crossroads-of-culture': {
    youtubeId: 'G4rpYqUjLQk',
    topic: 'People & Communities',
  },
  'the-red-white-strings-isaac-english-the-civil-war': {
    youtubeId: '0V10tE0BfdQ',
    topic: 'Military History',
  },
  'scotland-where-we-came-from-or-did-we-really-ever-leave': {
    youtubeId: '_Q315dW8S9A',
    topic: 'Geology & Mining',
  },
  'dellinger-s-mill-in-bakersville-north-carolina': {
    youtubeId: 'ulfk3uN2k58',
    topic: 'Historic Places',
  },
  'daniel-boone-s-tree-at-dellinger-mill': { youtubeId: 'j1LByGmMwgw', topic: 'Historic Places' },
  '2020-overmountain-men-celebration-in-spruce-pine': {
    youtubeId: 'bqJ5djZxQEE',
    topic: 'Military History',
  },
  'lost-cove-portrait-of-a-vanished-appalachian-community': {
    youtubeId: 'zLRIGxXyQYI',
    topic: 'People & Communities',
  },
}
export const recordings: Recording[] = programYears.flatMap((group) =>
  group.programs.flatMap((program) => {
    const slug = program.videoSlug
    if (!slug || !recordingDetails[slug]) return []
    return [{ ...program, slug, year: group.year, ...recordingDetails[slug] }]
  })
)

recordings.push(
  {
    slug: 'frankie-silver-film',
    youtubeId: 'ZQ6DViANMIc',
    topic: 'People & Communities',
    title: 'The Frankie Silver Story — Part 1',
    presenter: 'Theresa E. Phillips · Legacy Films Limited',
    description:
      'A film produced in 2000, including dramatic performances by Mars Hill College theater students.',
    related: true,
  },
  {
    slug: 'frankie-charlie-music',
    youtubeId: 'ICOA_6yqd2Q',
    topic: 'Music & Traditions',
    title: 'Frankie & Charlie: Put a Stop to It',
    presenter: 'Ali Randolph & Outta Luck Band',
    description:
      'A music video recorded at the Old Kona Baptist Church, offering a modern interpretation of the story.',
    related: true,
  },
  {
    slug: 'uncut-story-frankie-silver',
    youtubeId: 'qAFT4OwNhSg',
    topic: 'People & Communities',
    title: 'The Uncut Story of Frankie Silver',
    presenter: 'Bobby McMillon',
    description:
      'Storyteller Bobby McMillon shares his version of the Frankie and Charlie Silver story.',
    related: true,
  },
  {
    slug: 'fort-san-juan',
    youtubeId: '1CEMHj7f-i0',
    topic: 'Historic Places',
    title: 'Fort San Juan: Spain’s Failed Appalachian Outpost',
    presenter: 'Amanda Biddix',
    description:
      'A student video created for National History Day in 2013, exploring the Spanish presence in the Appalachian interior.',
    related: true,
  }
)
export function recordingPath(slug: string) {
  return `/videos/${slug}/`
}
