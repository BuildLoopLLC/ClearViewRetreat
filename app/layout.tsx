import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import CacheWarmer from '@/components/providers/CacheWarmer'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClearView Retreat - A Place of Peace & Renewal',
  description: 'Discover ClearView Retreat, a Christian retreat center offering spiritual renewal, outdoor activities, and peaceful accommodations in the heart of nature.',
  authors: [{ name: 'ClearView Retreat' }],
  keywords: 'Christian retreat, spiritual renewal, outdoor activities, nature retreat, church camp, spiritual growth',
  creator: 'ClearView Retreat',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'ClearView Retreat - A Place of Peace & Renewal',
    description: 'Discover ClearView Retreat, a Christian retreat center offering spiritual renewal, outdoor activities, and peaceful accommodations in the heart of nature.',
    url: 'https://clearviewretreat.org',
    siteName: 'ClearView Retreat',
    locale: 'en_US',
    images: [
      {
        url: 'http://localhost:3000/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ClearView Retreat',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClearView Retreat - A Place of Peace & Renewal',
    description: 'Discover ClearView Retreat, a Christian retreat center offering spiritual renewal, outdoor activities, and peaceful accommodations in the heart of nature.',
    images: ['http://localhost:3000/images/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          <CacheWarmer />
          {/* Skip link for accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-grow" role="main">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
