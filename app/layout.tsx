import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono, Syne, Bebas_Neue } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { SessionProvider } from '@/components/SessionProvider'
import CustomCursor from '@/components/ui/CustomCursor'
import PageTransition from '@/components/layout/PageTransition'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const syne = Syne({ 
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-syne',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
  display: 'swap',
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body 
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${syne.variable} ${bebasNeue.variable} font-body`}
      >
        <div className="orb-blue" />
        <div className="orb-purple" />
        <SessionProvider>
          <CustomCursor />
          <Navbar />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
