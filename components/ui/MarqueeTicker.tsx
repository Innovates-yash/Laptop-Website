"use client"

import { useEffect, useRef } from "react"

const items = [
  "MacBook Pro M3", "Dell XPS 15", "ASUS ROG Zephyrus",
  "Free Delivery Across India", "EMI Starting ₹2,999/mo",
  "Certified Warranty", "Lenovo ThinkPad X1",
  "HP Spectre x360", "Acer Swift 5", "Surface Laptop Studio",
]

export function MarqueeTicker() {
  const track1 = useRef<HTMLDivElement>(null)
  const track2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap")

      if (track1.current) {
        gsap.to(track1.current, {
          x: "-50%", duration: 40, ease: "none", repeat: -1,
        })
      }
      if (track2.current) {
        gsap.fromTo(track2.current,
          { x: "-50%" },
          { x: "0%", duration: 40, ease: "none", repeat: -1 }
        )
      }
    }
    init()
  }, [])

  const row = items.map((t, i) => (
    <span key={i} style={{
      whiteSpace: "nowrap",
      padding: "0 32px",
      fontSize: 11,
      letterSpacing: "4px",
      textTransform: "uppercase" as const,
      color: "rgba(255,255,255,0.25)",
      fontWeight: 500,
      fontFamily: "var(--font-inter), system-ui",
    }}>
      {t}
      <span style={{ opacity: 0.3, margin: "0 16px" }}>◆</span>
    </span>
  ))

  return (
    <section style={{
      borderTop: "0.5px solid rgba(255,255,255,0.06)",
      borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.015)",
      padding: "20px 0",
      overflow: "hidden",
    }}>
      <div ref={track1} style={{ display: "flex", width: "max-content", marginBottom: 12 }}>
        {row}{row}
      </div>
      <div ref={track2} style={{ display: "flex", width: "max-content" }}>
        {row}{row}
      </div>
    </section>
  )
}
