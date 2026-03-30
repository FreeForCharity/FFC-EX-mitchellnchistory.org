import type { Metadata } from 'next'
import './globals.css'
import Header from './../components/header'
import Footer from './../components/footer'
import CookieConsent from './../components/cookie-consent'
import GoogleTagManager, { GoogleTagManagerNoScript } from './../components/google-tag-manager'
import {
  openSans,
  lato,
  raleway,
  faustina,
  cantataOne,
  faunaOne,
  montserrat,
  cinzel,
} from '@/lib/fonts'
import { siteUrl } from '@/lib/siteConfig'

// Get basePath for GitHub Pages deployment
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mitchell County Historical Society | Preserving Our Heritage',
    template: '%s | Mitchell County Historical Society',
  },
  description:
    'The Mitchell County Historical Society is dedicated to preserving, protecting, and sharing the rich history and cultural heritage of Mitchell County, North Carolina.',
  keywords: [
    'Mitchell County',
    'historical society',
    'North Carolina history',
    'Bakersville',
    'McBee Museum',
    'heritage preservation',
    'Blue Ridge Mountains',
    'genealogy',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/`,
    siteName: 'Mitchell County Historical Society',
    title: 'Mitchell County Historical Society | Preserving Our Heritage',
    description:
      'Preserving, protecting, and sharing the rich history and cultural heritage of Mitchell County, North Carolina.',
    images: [
      {
        url: '/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Mitchell County Historical Society',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mitchell County Historical Society | Preserving Our Heritage',
    description:
      'Preserving, protecting, and sharing the rich history and cultural heritage of Mitchell County, North Carolina.',
    images: ['/web-app-manifest-512x512.png'],
  },
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: '32x32' },
      { url: `${basePath}/icon.png`, type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: `${basePath}/apple-icon.png`, sizes: '180x180', type: 'image/png' }],
  },
  manifest: `${basePath}/site.webmanifest`,
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preload critical LCP image */}
        <link
          rel="preload"
          as="image"
          href={`${basePath}/Images/mchs-hero.webp`}
          fetchPriority="high"
        />

        <GoogleTagManager />
      </head>
      <body
        className={[
          'antialiased',
          openSans.variable,
          lato.variable,
          raleway.variable,
          faustina.variable,
          cantataOne.variable,
          faunaOne.variable,
          montserrat.variable,
          cinzel.variable,
        ].join(' ')}
        suppressHydrationWarning={true}
      >
        <GoogleTagManagerNoScript />
        <Header />
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  )
}
