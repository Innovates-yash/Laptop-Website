'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/ui/ProductCard'

const mockProducts = [
  { id: '1', name: 'VOLTEX NEXUS-16', category: 'Gaming', price: 349900, slug: 'voltex-nexus-16', image: '/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg' },
  { id: '2', name: 'VOLTEX AER-14', category: 'Ultrabook', price: 219900, slug: 'voltex-aer-14', image: '/images/products/kyle-sung-oQuP_XBjOMY-unsplash.jpg' },
  { id: '3', name: 'VOLTEX STUDIO PRO', category: 'Creator', price: 389900, slug: 'voltex-studio-pro', image: '/images/products/leap-design-rXGzpEeYAS0-unsplash.jpg' },
  { id: '4', name: 'VOLTEX CORE M1', category: 'Ultrabook', price: 159900, slug: 'voltex-core-m1', image: '/images/products/muneeb-ali-arshad-_FpedyKWiHY-unsplash.jpg' },
  { id: '5', name: 'VOLTEX TITAN X', category: 'Gaming', price: 449900, slug: 'voltex-titan-x', image: '/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg' },
  { id: '6', name: 'VOLTEX EDGE 15', category: 'Creator', price: 299900, slug: 'voltex-edge-15', image: '/images/products/kyle-sung-oQuP_XBjOMY-unsplash.jpg' },
]

const categories = ['All', 'Gaming', 'Ultrabook', 'Creator']

export default function ProductsPage() {
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap')
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      gsap.fromTo('.pg-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.1 })
      gsap.fromTo('.pg-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.3 })
      gsap.fromTo('.filter-pill', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 0.4 })
    }
    init()
  }, [])

  const filtered = mockProducts.filter(p => {
    const matchCat = cat === 'All' || p.category === cat
    const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <div style={{ minHeight: "100vh", background: "#050508", paddingTop: 120 }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 60px" }}>
        <h1 className="pg-title" style={{
          fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, color: "#fff",
          marginBottom: 12, opacity: 0, fontFamily: "var(--font-inter), system-ui",
        }}>
          All Products
        </h1>
        <p className="pg-sub" style={{
          fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 500,
          opacity: 0, fontFamily: "var(--font-inter), system-ui", lineHeight: 1.6,
        }}>
          Discover our complete range of high-performance laptops.
        </p>
      </div>

      {/* Filters */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16, marginBottom: 48,
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="filter-pill"
              style={{
                padding: "10px 24px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: cat === c ? "rgba(0,229,255,0.5)" : "rgba(255,255,255,0.1)",
                background: cat === c ? "rgba(0,229,255,0.1)" : "transparent",
                color: cat === c ? "#00e5ff" : "rgba(255,255,255,0.6)",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                transition: "all 0.2s", opacity: 0,
                fontFamily: "var(--font-inter), system-ui",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search..."
          style={{
            padding: "10px 20px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 14,
            outline: "none", minWidth: 200, fontFamily: "var(--font-inter), system-ui",
          }}
        />
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 120px" }}>
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 24,
          fontFamily: "var(--font-inter), system-ui",
        }}>
          {filtered.length} products
        </p>
        {filtered.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {filtered.map(p => <ProductCard key={p.id} {...p} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "120px 0" }}>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
