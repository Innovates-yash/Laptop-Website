/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  transpilePackages: ['three'],
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei', 'gsap'],
  },
  // Enable static optimization
  output: 'standalone',
  // Reduce bundle size
  modularizeImports: {
    'gsap': {
      transform: 'gsap/{{member}}',
    },
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Headers for caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
