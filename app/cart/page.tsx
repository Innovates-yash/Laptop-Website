'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const items = useCartStore(s => s.items)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQuantity = useCartStore(s => s.updateQuantity)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap')
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      gsap.fromTo('.cart-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1 })
      gsap.fromTo('.cart-content', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.3 })
    }
    init()
  }, [])

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div style={{ minHeight: "100vh", background: "#050508", paddingTop: 120 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 40px 120px" }}>
        <h1 className="cart-title" style={{
          fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 600, color: "#fff",
          marginBottom: 48, opacity: 0, fontFamily: "var(--font-inter), system-ui",
        }}>
          Your Cart
        </h1>

        <div className="cart-content" style={{ opacity: 0 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <span className="material-symbols-outlined" style={{
                fontSize: 64, color: "rgba(255,255,255,0.15)", marginBottom: 20, display: "block",
              }}>
                shopping_cart
              </span>
              <h2 style={{ fontSize: 28, fontWeight: 600, color: "#fff", marginBottom: 12 }}>
                Your Cart is Empty
              </h2>
              <p style={{
                fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px",
              }}>
                Looks like you haven&apos;t added any products yet.
              </p>
              <Link href="/products" style={{
                display: "inline-block", padding: "14px 32px",
                background: "#00e5ff", color: "#000", fontSize: 15,
                fontWeight: 600, borderRadius: 28, textDecoration: "none",
                transition: "background 0.2s",
              }}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {/* Items */}
              <div style={{ flex: "1 1 500px" }}>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 20, padding: "24px 0",
                    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                    alignItems: "center",
                  }}>
                    <div style={{
                      width: 80, height: 80, borderRadius: 12, overflow: "hidden",
                      position: "relative", background: "#0d0d14", flexShrink: 0,
                    }}>
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="80px" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 500, color: "#fff", marginBottom: 4 }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        style={{
                          width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                          background: "transparent", color: "#fff", cursor: "pointer", fontSize: 16,
                        }}
                      >−</button>
                      <span style={{ fontSize: 15, color: "#fff", minWidth: 20, textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                          background: "transparent", color: "#fff", cursor: "pointer", fontSize: 16,
                        }}
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "none", border: "none", color: "rgba(255,255,255,0.3)",
                        cursor: "pointer", fontSize: 13, transition: "color 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "#ff4444"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{
                flex: "0 0 320px",
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 20, padding: 32, alignSelf: "flex-start",
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 24 }}>
                  Order Summary
                </h3>
                <div style={{
                  display: "flex", justifyContent: "space-between", marginBottom: 12,
                  fontSize: 15, color: "rgba(255,255,255,0.5)",
                }}>
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between", marginBottom: 24,
                  fontSize: 15, color: "rgba(255,255,255,0.5)",
                }}>
                  <span>Shipping</span>
                  <span style={{ color: "#00e5ff" }}>Free</span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  paddingTop: 16, borderTop: "0.5px solid rgba(255,255,255,0.1)",
                  fontSize: 18, fontWeight: 600, color: "#fff",
                }}>
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <button style={{
                  width: "100%", padding: "14px", marginTop: 24,
                  background: "#00e5ff", color: "#000", fontSize: 15,
                  fontWeight: 600, borderRadius: 12, border: "none",
                  cursor: "pointer", transition: "background 0.2s",
                }}>
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
