import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { SessionProvider } from '@/components/SessionProvider'
import dynamic from 'next/dynamic'

// Lazy load heavy client components
const SmoothScroll = dynamic(() => import('@/components/layout/SmoothScroll').then(mod => ({ default: mod.SmoothScroll })), {
  ssr: false,
})

const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), {
  ssr: false,
})

const PageTransition = dynamic(() => import('@/components/layout/PageTransition'), {
  ssr: false,
})

const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen'), {
  ssr: false,
})

// Fonts
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const syne = Syne({ 
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-syne',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'VOLTEX | High-End Engineering',
    template: '%s | VOLTEX',
  },
  description: 'Premium laptop e-commerce with 3D visualization. Experience the future of high-performance computing.',
  keywords: ['laptops', 'high-performance', '3D visualization', 'gaming laptops', 'professional laptops'],
  authors: [{ name: 'VOLTEX' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    siteName: 'VOLTEX',
    title: 'VOLTEX | High-End Engineering',
    description: 'Premium laptop e-commerce with 3D visualization',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VOLTEX - High-End Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VOLTEX | High-End Engineering',
    description: 'Premium laptop e-commerce with 3D visualization',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Material Symbols for icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${inter.variable} ${syne.variable} font-body`}>
        <SessionProvider>
          <SmoothScroll>
            <CustomCursor />
            <LoadingScreen />
            <Navbar />
            <PageTransition>
              <main id="main-content">
                {children}
              </main>
            </PageTransition>
            <Footer />
          </SmoothScroll>
        </SessionProvider>
      </body>
    </html>
  )
}
