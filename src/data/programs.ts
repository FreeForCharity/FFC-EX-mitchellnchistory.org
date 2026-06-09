export type Program = {
  title: string
  presenter?: string
  month?: string
  dateLabel?: string
  location?: string
  description: string
  videoUrl?: string
}

export type ProgramYear = {
  year: number
  summary: string
  programs: Program[]
}

export const youtubeChannelUrl = 'https://www.youtube.com/channel/UCkPa8X-B3R34PpFvVTlWCSw'

export const programYears: ProgramYear[] = [
  {
    year: 2020,
    summary:
      'Video programs and online presentations produced while public programs were disrupted by the COVID-19 pandemic.',
    programs: [
      {
        title: '2020 Overmountain Men Celebration in Spruce Pine',
        presenter: 'Overmountain Victory Trail Association',
        month: 'September',
        dateLabel: 'September 27, 2020',
        location: 'Riverside Park, Spruce Pine',
        description:
          'Re-enactors shared the story of the Battle of Kings Mountain and the men who marched through the Toe River Valley.',
        videoUrl: 'https://www.youtube.com/watch?v=bqJ5djZxQEE',
      },
      {
        title: "Daniel Boone's Tree at Dellinger Mill",
        presenter: 'Bruce Koran and Jack Dellinger',
        location: 'Dellinger Mill, Bakersville',
        description:
          'A local story connected to the historic Dellinger Mill property and the legend of Daniel Boone.',
      },
      {
        title: "Dellinger's Mill in Bakersville, North Carolina",
        presenter: 'Bruce Koran and Jack Dellinger',
        location: 'Dellinger Mill, Bakersville',
        description:
          "A look at the history of the famous Dellinger's Mill along Cane Creek near Bakersville.",
      },
    ],
  },
  {
    year: 2019,
    summary:
      'The 2019 program season included presentations on geology, migration, and Civil War history.',
    programs: [
      {
        title: 'Scotland: Where WE Came From...Or Did WE Really Ever Leave?',
        presenter: 'Alex Glover',
        month: 'April',
        dateLabel: 'April 15, 2019',
        location: 'Historic Mitchell County Courthouse, Bakersville',
        description:
          'A geologic and cultural tour of Scotland with connections to the Appalachian Mountains.',
      },
      {
        title: 'The Red & White Strings: Isaac English & The Civil War',
        presenter: 'Jonathan Bennett and David Biddix',
        month: 'May',
        dateLabel: 'May 20, 2019',
        location: 'English Inn, Spruce Pine',
        description:
          'The story of Isaac and Alice English and the Union officers who escaped through Mitchell County during the Civil War.',
      },
    ],
  },
  {
    year: 2017,
    summary:
      'The 2017 season featured Mitchell County music, early cultural history, the Frankie and Charlie Silver story, and Toe River history.',
    programs: [
      {
        title: 'Mitchell County: Early Crossroads of Culture',
        presenter: 'Dr. Dan Barron',
        month: 'April',
        dateLabel: 'April 17, 2017',
        location: 'Historic Mitchell County Courthouse, Bakersville',
        description:
          "A presentation on the early cultural crossroads that shaped Mitchell County's history.",
      },
      {
        title: 'The Frankie & Charlie Silver Story',
        presenter: 'John Silver',
        month: 'June',
        dateLabel: 'June 19, 2017',
        location: 'Old Kona Baptist Church, Kona',
        description:
          'A special presentation on Frankie and Charlie Silver, with additional related videos and stories.',
      },
      {
        title: 'Rhonda Gouge Plays Music of Mitchell County, NC',
        presenter: 'Rhonda Gouge',
        month: 'August',
        dateLabel: 'August 21, 2017',
        location: 'Historic Mitchell County Courthouse, Bakersville',
        description:
          'Local music history with songs and stories connected to Mitchell County musicians.',
      },
      {
        title: "The Toe River: The Valley's Highway",
        presenter: 'David Biddix',
        month: 'September',
        dateLabel: 'September 16, 2017',
        location: 'Toe River Arts Council Gallery, Spruce Pine',
        description: 'A human history of the Toe River and its role in the life of the valley.',
      },
      {
        title: 'The Geology of the Toe River',
        presenter: 'Alex Glover',
        month: 'September',
        dateLabel: 'September 16, 2017',
        location: 'Toe River Arts Council Gallery, Spruce Pine',
        description:
          'A geologic look at the Toe River and the landscape it cuts through Mitchell County.',
      },
    ],
  },
  {
    year: 2016,
    summary: 'The 2016 program archive preserves titles and presenters from that season.',
    programs: [
      {
        title: 'World War I & the Soldiers of the Toe River Valley',
        presenter: 'Dr. Lloyd Bailey',
        description:
          'A presentation on World War I and soldiers connected to the Toe River Valley.',
      },
      {
        title: 'The Railroads of the Toe River Valley',
        presenter: 'Warren Harding',
        description: 'A program on the railroads that served the Toe River Valley.',
      },
      {
        title: 'Mountain Church Music in the Toe River Valley',
        presenter: 'Rhonda Gouge',
        description:
          'A program exploring mountain church music traditions in the Toe River Valley.',
      },
      {
        title: 'The Penland Post Office',
        presenter: 'Alicia Swaringen',
        description: 'A local history program about the Penland Post Office.',
      },
    ],
  },
]

export function getProgramYears(): ProgramYear[] {
  return [...programYears].sort((a, b) => b.year - a.year)
}
