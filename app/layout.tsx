import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { SessionProvider } from '@/components/SessionProvider'

// Client-only components
const SmoothScroll = dynamic(
  () => import('@/components/layout/SmoothScroll').then(m => ({ default: m.SmoothScroll })),
  { ssr: false }
)

const PageTransition = dynamic(
  () => import('@/components/layout/PageTransition'),
  { ssr: false }
)

const LoadingScreen = dynamic(
  () => import('@/components/ui/LoadingScreen'),
  { ssr: false }
)

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
})

export const metadata: Metadata = {
  title: {
    default: 'VOLTEX | High-End Engineering',
    template: '%s | VOLTEX',
  },
  description: 'Premium laptop e-commerce with cinematic 3D visualization. Experience the future of high-performance computing.',
  keywords: ['laptops', 'high-performance', 'gaming laptops', 'professional laptops', 'VOLTEX'],
  authors: [{ name: 'VOLTEX' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    siteName: 'VOLTEX',
    title: 'VOLTEX | High-End Engineering',
    description: 'Premium laptop e-commerce with cinematic visualization',
  },
  robots: { index: true, follow: true },
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${inter.variable} ${syne.variable}`} style={{
        fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        background: "#050508",
        color: "#fff",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}>
        <SessionProvider>
          <LoadingScreen />
          <Navbar />
          <SmoothScroll>
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
