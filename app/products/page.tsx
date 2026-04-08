'use client'

import { useEffect, useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import dynamic from 'next/dynamic'

const ProductCard3D = dynamic(() => import('@/components/3d/ProductCard3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-surface-container-low animate-pulse" style={{ height: '360px' }} />
  ),
})

// Mock products for client-side rendering (when DB is unavailable)
const mockProducts = [
  {
    id: '1',
    name: 'VOLTEX NEXUS-16',
    category: 'Gaming',
    price: 349900,
    images: ['/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg'],
    slug: 'voltex-nexus-16',
    modelUrl: '/models/laptop-1.glb',
  },
  {
    id: '2',
    name: 'VOLTEX AER-14',
    category: 'Ultrabook',
    price: 219900,
    images: ['/images/products/kyle-sung-oQuP_XBjOMY-unsplash.jpg'],
    slug: 'voltex-aer-14',
    modelUrl: '/models/laptop-2.glb',
  },
  {
    id: '3',
    name: 'VOLTEX STUDIO PRO',
    category: 'Creator',
    price: 389900,
    images: ['/images/products/leap-design-rXGzpEeYAS0-unsplash.jpg'],
    slug: 'voltex-studio-pro',
    modelUrl: '/models/laptop-3.glb',
  },
  {
    id: '4',
    name: 'VOLTEX CORE M1',
    category: 'Ultrabook',
    price: 159900,
    images: ['/images/products/muneeb-ali-arshad-_FpedyKWiHY-unsplash.jpg'],
    slug: 'voltex-core-m1',
    modelUrl: '/models/laptop-4.glb',
  },
  {
    id: '5',
    name: 'VOLTEX TITAN X',
    category: 'Gaming',
    price: 449900,
    images: ['/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg'],
    slug: 'voltex-titan-x',
    modelUrl: '/models/laptop-1.glb',
  },
  {
    id: '6',
    name: 'VOLTEX EDGE 15',
    category: 'Creator',
    price: 299900,
    images: ['/images/products/kyle-sung-oQuP_XBjOMY-unsplash.jpg'],
    slug: 'voltex-edge-15',
    modelUrl: '/models/laptop-2.glb',
  },
]

const categories = ['All', 'Gaming', 'Ultrabook', 'Creator']

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const products = mockProducts

  // GSAP entrance animation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      gsap.from('.products-header', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      })

      gsap.from('.filter-btn', {
        opacity: 0,
        y: 15,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        delay: 0.3,
      })
    }

    init()
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <PageWrapper>
      <div className="min-h-screen bg-surface">
        {/* Header */}
        <section className="products-header py-20 px-8 md:px-24 border-b border-outline-variant/20">
          <div className="font-mono text-primary tracking-wide-tech text-xs mb-4">
            // EXPLORE OUR COLLECTION
          </div>
          <h1 className="font-syne font-extrabold text-6xl md:text-8xl mb-6">
            ALL PRODUCTS
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl">
            Discover our complete range of high-performance laptops engineered for creators, gamers, and professionals.
          </p>
        </section>

        {/* Filters & Products */}
        <section className="py-16 px-8 md:px-24">
          {/* Filter bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`filter-btn font-mono text-xs tracking-widest px-6 py-3 border transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-auto">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full md:w-64 bg-surface-container-low border border-outline-variant/30 pl-12 pr-4 py-3 font-mono text-xs text-on-surface focus:border-primary focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Product count */}
          <p className="font-mono text-sm text-on-surface-variant mb-8">
            {filteredProducts.length} PRODUCTS FOUND
          </p>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard3D
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  category={product.category}
                  modelUrl={product.modelUrl}
                  slug={product.slug}
                  image={product.images[0]}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
                search_off
              </span>
              <h3 className="font-syne font-bold text-2xl mb-4">No Products Found</h3>
              <p className="font-body text-on-surface-variant">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  )
}
