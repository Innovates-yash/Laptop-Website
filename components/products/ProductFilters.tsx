'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    router.push('/products')
  }

  return (
    <aside className="w-full lg:w-80 space-y-8">
      <div className="glass-panel p-8">
        <h3 className="font-mono text-xs tracking-widest text-primary mb-6">FILTERS</h3>

        {/* Category */}
        <div className="mb-8">
          <label className="font-mono text-xs tracking-widest text-on-surface mb-4 block">
            CATEGORY
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-mono text-sm text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Gaming">Gaming</option>
            <option value="Creator">Creator</option>
            <option value="Ultrabook">Ultrabook</option>
            <option value="Business">Business</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <label className="font-mono text-xs tracking-widest text-on-surface mb-4 block">
            PRICE RANGE
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-mono text-sm text-on-surface focus:border-primary focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-mono text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={applyFilters}
            className="w-full bg-primary-container text-on-primary px-6 py-3 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
          >
            APPLY FILTERS
          </button>
          <button
            onClick={clearFilters}
            className="w-full border border-outline-variant text-on-surface px-6 py-3 font-mono tracking-widest text-xs hover:border-primary hover:text-primary transition-all"
          >
            CLEAR ALL
          </button>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="glass-panel p-8">
        <h3 className="font-mono text-xs tracking-widest text-primary mb-6">QUICK ACCESS</h3>
        <div className="space-y-3">
          <button
            onClick={() => {
              setCategory('Gaming')
              router.push('/products?category=Gaming')
            }}
            className="w-full text-left px-4 py-3 border border-outline-variant/30 hover:border-primary hover:bg-primary-container/10 transition-all font-mono text-xs tracking-widest"
          >
            GAMING LAPTOPS
          </button>
          <button
            onClick={() => {
              setCategory('Creator')
              router.push('/products?category=Creator')
            }}
            className="w-full text-left px-4 py-3 border border-outline-variant/30 hover:border-primary hover:bg-primary-container/10 transition-all font-mono text-xs tracking-widest"
          >
            CREATOR STUDIO
          </button>
          <button
            onClick={() => {
              setCategory('Ultrabook')
              router.push('/products?category=Ultrabook')
            }}
            className="w-full text-left px-4 py-3 border border-outline-variant/30 hover:border-primary hover:bg-primary-container/10 transition-all font-mono text-xs tracking-widest"
          >
            ULTRABOOKS
          </button>
        </div>
      </div>
    </aside>
  )
}
