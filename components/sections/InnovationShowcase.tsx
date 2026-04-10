"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

const showcaseItems = [
  {
    title: "Thinness Redefined",
    body: "At just 14.9mm, it disappears in your bag. The machined aluminium chassis weighs under 1.5kg — engineered for those who move fast.",
    spec: "14.9mm",
    specLabel: "Ultra-Thin",
    image: "/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg",
  },
  {
    title: "The Display You Dream About",
    body: "4K OLED with 120Hz ProMotion and 1,000,000:1 contrast ratio. Every pixel is engineered for absolute perfection.",
    spec: "4K OLED",
    specLabel: "120Hz ProMotion",
    image: "/images/products/kyle-sung-oQuP_XBjOMY-unsplash.jpg",
  },
  {
    title: "Intelligence at the Core",
    body: "Latest generation processor that never throttles, never hesitates. Built for creators, traders, and builders who demand more.",
    spec: "Next Gen",
    specLabel: "Processor",
    image: "/images/products/leap-design-rXGzpEeYAS0-unsplash.jpg",
  },
  {
    title: "All Day. Every Day.",
    body: "18 hours of battery life. Fast-charge to 80% in just 30 minutes. Always ready when inspiration strikes.",
    spec: "18hr",
    specLabel: "Battery Life",
    image: "/images/products/muneeb-ali-arshad-_FpedyKWiHY-unsplash.jpg",
  },
]

export function InnovationShowcase() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Show everything
        gsap.set(".showcase-img, .showcase-text, .showcase-spec, .showcase-line", {
          opacity: 1, y: 0, x: 0, scale: 1, scaleX: 1,
        })
        return
      }

      const ctx = gsap.context(() => {
        const items = sectionRef.current?.querySelectorAll(".showcase-item")
        items?.forEach((item) => {
          const img = item.querySelector(".showcase-img")
          const text = item.querySelector(".showcase-text")
          const spec = item.querySelector(".showcase-spec")
          const line = item.querySelector(".showcase-line")

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "top 30%",
              toggleActions: "play none none none",
            },
          })

          if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.inOut" })
          if (img) tl.fromTo(img, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, "-=0.5")
          if (text) tl.fromTo(text, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.7")
          if (spec) tl.fromTo(spec, { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.4)" }, "-=0.4")
        })
      }, sectionRef)

      return ctx
    }

    let ctx: any
    init().then(c => { ctx = c })
    return () => { if (ctx) ctx.revert() }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ background: "#050508", padding: "100px 0 60px" }}
    >
      {/* Section header */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 80px", textAlign: "center" }}>
        <p style={{
          fontSize: 12, letterSpacing: "5px", textTransform: "uppercase" as const,
          color: "#00e5ff", marginBottom: 16,
          fontFamily: "var(--font-inter), system-ui",
        }}>
          Innovation
        </p>
        <h2 style={{
          fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600,
          color: "#fff", lineHeight: 1.1,
          fontFamily: "var(--font-inter), system-ui",
        }}>
          Every detail, perfected.
        </h2>
      </div>

      {/* Showcase items */}
      {showcaseItems.map((item, i) => {
        const isReversed = i % 2 === 1
        return (
          <div
            key={i}
            className="showcase-item"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 40px",
              marginBottom: i < showcaseItems.length - 1 ? 120 : 60,
            }}
          >
            {/* Accent line */}
            <div className="showcase-line" style={{
              width: "100%", height: 1,
              background: "linear-gradient(to right, transparent, rgba(0,229,255,0.15), transparent)",
              marginBottom: 60,
              transformOrigin: "left center",
              transform: "scaleX(0)",
            }} />

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(40px, 6vw, 80px)",
              alignItems: "center",
            }}>
              {/* Image */}
              <div
                className="showcase-img"
                style={{
                  position: "relative",
                  height: "clamp(300px, 40vw, 500px)",
                  borderRadius: 16,
                  overflow: "hidden",
                  opacity: 0,
                  order: isReversed ? 2 : 1,
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="50vw"
                />
                {/* Glow overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: `radial-gradient(ellipse at ${isReversed ? '30%' : '70%'} 50%, rgba(0,229,255,0.06) 0%, transparent 70%)`,
                }} />
                {/* Bottom gradient */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
                  background: "linear-gradient(to top, rgba(5,5,8,0.8), transparent)",
                }} />
              </div>

              {/* Text */}
              <div
                className="showcase-text"
                style={{
                  opacity: 0,
                  order: isReversed ? 1 : 2,
                }}
              >
                <h3 style={{
                  fontSize: "clamp(28px, 3vw, 44px)",
                  fontWeight: 600,
                  color: "#fff",
                  lineHeight: 1.15,
                  marginBottom: 20,
                  fontFamily: "var(--font-inter), system-ui",
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "clamp(15px, 1.1vw, 18px)",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 32,
                  fontFamily: "var(--font-inter), system-ui",
                }}>
                  {item.body}
                </p>

                {/* Spec badge */}
                <div
                  className="showcase-spec"
                  style={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 12,
                    padding: "16px 24px",
                    background: "rgba(0,229,255,0.04)",
                    border: "1px solid rgba(0,229,255,0.12)",
                    borderRadius: 12,
                    opacity: 0,
                  }}
                >
                  <span style={{
                    fontSize: "clamp(28px, 3vw, 42px)",
                    fontWeight: 700,
                    color: "#00e5ff",
                    fontFamily: "var(--font-inter), system-ui",
                  }}>
                    {item.spec}
                  </span>
                  <span style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "var(--font-inter), system-ui",
                  }}>
                    {item.specLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* CTA row */}
      <div style={{
        maxWidth: 1200, margin: "60px auto 0", padding: "0 40px",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: "clamp(20px, 2.5vw, 32px)",
          fontWeight: 600,
          color: "#fff",
          marginBottom: 8,
          fontFamily: "var(--font-inter), system-ui",
        }}>
          Yours from <span style={{ color: "#00e5ff" }}>₹79,999</span>
        </p>
        <p style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.4)",
          marginBottom: 28,
          fontFamily: "var(--font-inter), system-ui",
        }}>
          Six configurations. Free delivery across India.
        </p>
        <Link href="/products" style={{
          display: "inline-block",
          padding: "14px 36px",
          background: "#00e5ff",
          color: "#000",
          fontSize: 15, fontWeight: 600,
          borderRadius: 28,
          textDecoration: "none",
          transition: "background 0.2s, transform 0.2s",
          fontFamily: "var(--font-inter), system-ui",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#33ecff"; e.currentTarget.style.transform = "scale(1.05)" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#00e5ff"; e.currentTarget.style.transform = "scale(1)" }}
        >
          Choose Your Model →
        </Link>
      </div>
    </section>
  )
}
