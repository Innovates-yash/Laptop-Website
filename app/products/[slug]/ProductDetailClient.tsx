'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number | null
  category: string
  brand: string
  images: string[]
  stock: number
  specs?: any
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap')
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      const tl = gsap.timeline()
      tl.fromTo('.pd-image', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' })
      tl.fromTo('.pd-category', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.4')
      tl.fromTo('.pd-name', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      tl.fromTo('.pd-price', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
      tl.fromTo('.pd-desc', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.1')
      tl.fromTo('.pd-spec', { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.06 }, '-=0.1')
      tl.fromTo('.pd-cta', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.4)' }, '-=0.1')
    }
    init()
  }, [])

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || '',
    })
  }

  const specs = product.specs
    ? (typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs)
    : null

  const mainImage = product.images?.[0] || '/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg'

  return (
    <div style={{ minHeight: "100vh", background: "#050508", paddingTop: 100 }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "40px 40px 120px",
        display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "start",
      }}>
        {/* Image */}
        <div className="pd-image" style={{
          position: "relative", height: 500, borderRadius: 20,
          overflow: "hidden", background: "#0a0a14", opacity: 0,
        }}>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="55vw"
          />
        </div>

        {/* Info */}
        <div style={{ paddingTop: 20 }}>
          <p className="pd-category" style={{
            fontSize: 12, letterSpacing: "3px",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.4)", marginBottom: 8, opacity: 0,
            fontFamily: "var(--font-inter), system-ui",
          }}>
            {product.category} · {product.brand}
          </p>

          <h1 className="pd-name" style={{
            fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600,
            color: "#fff", lineHeight: 1.1, marginBottom: 20, opacity: 0,
            fontFamily: "var(--font-inter), system-ui",
          }}>
            {product.name}
          </h1>

          <div className="pd-price" style={{
            display: "flex", alignItems: "baseline", gap: 14, marginBottom: 24, opacity: 0,
          }}>
            <span style={{
              fontSize: 32, fontWeight: 600, color: "#fff",
              fontFamily: "var(--font-inter), system-ui",
            }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span style={{
                fontSize: 18, color: "rgba(255,255,255,0.35)",
                textDecoration: "line-through",
              }}>
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="pd-desc" style={{
            fontSize: 16, lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)", marginBottom: 32, opacity: 0,
            fontFamily: "var(--font-inter), system-ui",
          }}>
            {product.description}
          </p>

          {/* Specs */}
          {specs && typeof specs === 'object' && (
            <div style={{ marginBottom: 32 }}>
              <h3 style={{
                fontSize: 14, fontWeight: 600, letterSpacing: "2px",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.5)", marginBottom: 16,
              }}>
                Key Specs
              </h3>
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="pd-spec" style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                  opacity: 0,
                }}>
                  <span style={{
                    fontSize: 14, color: "rgba(255,255,255,0.45)",
                    textTransform: "capitalize" as const,
                  }}>
                    {key}
                  </span>
                  <span style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16 }}>
            <button
              onClick={handleAddToCart}
              className="pd-cta"
              style={{
                flex: 1, padding: "16px 28px", borderRadius: 14,
                background: "#00e5ff", color: "#000", fontSize: 16,
                fontWeight: 600, border: "none", cursor: "pointer",
                transition: "background 0.2s, transform 0.2s", opacity: 0,
                fontFamily: "var(--font-inter), system-ui",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#33ecff"; e.currentTarget.style.transform = "scale(1.02)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "#00e5ff"; e.currentTarget.style.transform = "scale(1)" }}
            >
              Add to Cart
            </button>
            <Link
              href="/cart"
              className="pd-cta"
              style={{
                flex: 1, padding: "16px 28px", borderRadius: 14,
                background: "transparent", color: "#fff", fontSize: 16,
                fontWeight: 500, border: "1px solid rgba(255,255,255,0.15)",
                textDecoration: "none", textAlign: "center",
                transition: "border-color 0.2s", opacity: 0,
                fontFamily: "var(--font-inter), system-ui",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
            >
              Buy Now
            </Link>
          </div>

          {/* Stock */}
          <p style={{
            fontSize: 13, color: product.stock > 0 ? "rgba(0,229,255,0.6)" : "#ff4444",
            marginTop: 16,
          }}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
      </div>
    </div>
  )
}
