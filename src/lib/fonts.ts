import { Open_Sans, Lato, Faustina } from 'next/font/google'

// Configure fonts with proper subsets and display strategy.
//
// Only families actually rendered by the site are loaded — a July 2026
// audit (issue #145) removed Raleway, Cantata One, Fauna One, Montserrat,
// and Cinzel, whose CSS hooks no live component referenced, halving the
// number of preloaded font files on every page.

export const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  // 800 dropped: no font-extrabold usage anywhere in live components
  weight: ['400', '500', '600', '700'],
})

export const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
  weight: ['400', '700'],
})

export const faustina = Faustina({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-faustina',
  weight: ['400', '500', '600', '700'],
})
