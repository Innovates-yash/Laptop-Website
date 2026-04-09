"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { SpecReveal } from "@/components/ui/SpecReveal"
import { MarqueeTicker } from "@/components/ui/MarqueeTicker"
import { ProductCard } from "@/components/ui/ProductCard"

import { StickyProductSection } from "@/components/sections/StickyProductSection"
import { FeatureScroll } from "@/components/sections/FeatureScroll"

// Product data
const products = [
  { id: "1", name: "VOLTEX NEXUS-16", category: "Gaming", price: 349900, slug: "voltex-nexus-16", image: "/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg" },
  { id: "2", name: "VOLTEX AER-14", category: "Ultrabook", price: 219900, slug: "voltex-aer-14", image: "/images/products/kyle-sung-oQuP_XBjOMY-unsplash.jpg" },
  { id: "3", name: "VOLTEX STUDIO PRO", category: "Creator", price: 389900, slug: "voltex-studio-pro", image: "/images/products/leap-design-rXGzpEeYAS0-unsplash.jpg" },
  { id: "4", name: "VOLTEX CORE M1", category: "Ultrabook", price: 159900, slug: "voltex-core-m1", image: "/images/products/muneeb-ali-arshad-_FpedyKWiHY-unsplash.jpg" },
]

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Show everything immediately
        gsap.set(".hero-wordmark, .hero-line, .hero-sub, .hero-cta, .hero-laptop, .scroll-ind", {
          opacity: 1, y: 0, x: 0, scale: 1,
        })
        return
      }

      let ctx: any;
      if (typeof window !== "undefined" && heroRef.current) {
        ctx = gsap.context(() => {
          // ── HERO ENTRY SEQUENCE ──
          gsap.fromTo(".hero-wordmark",
            { opacity: 0, y: -10 },
            { opacity: 0.5, y: 0, duration: 0.6, delay: 0.1 }
          )

          gsap.fromTo(".hero-laptop",
            { opacity: 0, y: 60, scale: 0.85 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", delay: 0.4 }
          )

          gsap.fromTo(".hero-line",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.8 }
          )

          gsap.fromTo(".hero-sub",
            { opacity: 0, y: 20 },
            { opacity: 0.5, y: 0, duration: 0.5, delay: 1.4 }
          )

          gsap.fromTo(".hero-cta",
            { opacity: 0, y: 15, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.4)", delay: 1.7 }
          )

          gsap.fromTo(".scroll-ind",
            { opacity: 0 },
            { opacity: 0.3, duration: 0.5, delay: 2.0 }
          )
          gsap.to(".scroll-line", {
            scaleY: 0.3, duration: 1.2, ease: "power1.inOut", repeat: -1, yoyo: true,
          })

          // ── HERO SCROLL EXIT ──
          gsap.to(".hero-laptop", {
            scale: 1.12, y: -50,
            scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
          })
          gsap.to(".hero-text-wrap", {
            opacity: 0, x: -80,
            scrollTrigger: { trigger: heroRef.current, start: "20% top", end: "80% top", scrub: 1 },
          })

          // ── PRODUCTS SECTION ──
          gsap.fromTo(".products-title",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: ".products-grid-section", start: "top 80%" } }
          )
          gsap.fromTo(".product-card",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, scrollTrigger: { trigger: ".products-grid-section", start: "top 70%" } }
          )

          // ── CTA SECTION ──
          gsap.fromTo(".final-cta-title",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, scrollTrigger: { trigger: ".final-cta", start: "top 80%" } }
          )
          gsap.fromTo(".final-cta-btn",
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)", scrollTrigger: { trigger: ".final-cta", start: "top 75%" } }
          )
          
          // Refresh all triggers to ensure pristine measurements
          setTimeout(() => ScrollTrigger.refresh(), 100)
        })
      }
      return ctx
    }

    let ctxToRevert: any
    init().then(ctx => { ctxToRevert = ctx })
    
    // Auto-refresh when window resizes
    const handleResize = () => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.refresh())
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (ctxToRevert) ctxToRevert.revert()
    }
  }, [])

  return (
    <div style={{ background: "#050508" }}>

      {/* ═══════ HERO — 100vh ═══════ */}
      <section
        ref={heroRef}
        style={{
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          background: "radial-gradient(ellipse at 65% 45%, #0a0a1a 0%, #050508 60%)",
        }}
      >
        {/* Wordmark */}
        <p className="hero-wordmark" style={{
          position: "absolute", top: 100, left: "6vw",
          fontSize: 13, fontWeight: 400, letterSpacing: "6px",
          textTransform: "uppercase" as const,
          color: "rgba(255,255,255,0.4)",
          opacity: 0,
          fontFamily: "var(--font-inter), system-ui",
        }}>
          VOLTEX
        </p>

        {/* Laptop visual — center/right */}
        <div className="hero-laptop" style={{
          position: "absolute",
          right: "4vw",
          top: "50%",
          transform: "translateY(-50%)",
          width: "min(52vw, 700px)",
          height: "min(38vw, 500px)",
          opacity: 0,
        }}>
          <div style={{
            width: "100%", height: "100%",
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
          }}>
            <Image
              src="/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg"
              alt="VOLTEX Laptop"
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="52vw"
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 40%, rgba(0,229,255,0.04) 0%, transparent 70%)",
            }} />
          </div>
        </div>

        {/* Hero text — left */}
        <div className="hero-text-wrap" style={{
          position: "relative",
          zIndex: 2,
          padding: "0 6vw",
          maxWidth: 650,
        }}>
          <h1 style={{ margin: 0 }}>
            {["Engineered", "Without", "Compromise."].map((line, i) => (
              <span
                key={i}
                className="hero-line"
                style={{
                  display: "block",
                  fontSize: "clamp(48px, 7vw, 88px)",
                  fontWeight: 600,
                  lineHeight: 1.0,
                  color: "#fff",
                  opacity: 0,
                  fontFamily: "var(--font-inter), system-ui",
                }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p className="hero-sub" style={{
            fontSize: "clamp(15px, 1.2vw, 18px)",
            color: "rgba(255,255,255,0.5)",
            marginTop: 28,
            opacity: 0,
            fontFamily: "var(--font-inter), system-ui",
          }}>
            Starting at ₹79,999
          </p>

          <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
            <Link href="/products" className="hero-cta" style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "#00e5ff",
              color: "#000",
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 28,
              textDecoration: "none",
              opacity: 0,
              transition: "background 0.2s, transform 0.2s",
              fontFamily: "var(--font-inter), system-ui",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#33ecff"; e.currentTarget.style.transform = "scale(1.05)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#00e5ff"; e.currentTarget.style.transform = "scale(1)" }}
            >
              Shop Now
            </Link>
            <Link href="/products" className="hero-cta" style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "transparent",
              color: "#fff",
              fontSize: 15,
              fontWeight: 500,
              borderRadius: 28,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              opacity: 0,
              transition: "border-color 0.2s",
              fontFamily: "var(--font-inter), system-ui",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-ind" style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: 0,
        }}>
          <span style={{
            fontSize: 11, letterSpacing: "3px",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "var(--font-inter), system-ui",
          }}>
            Scroll
          </span>
          <div className="scroll-line" style={{
            width: 1, height: 40,
            background: "rgba(255,255,255,0.3)",
            transformOrigin: "top",
          }} />
        </div>
      </section>

      {/* ═══════ MARQUEE TICKER ═══════ */}
      <MarqueeTicker />

      {/* ═══════ STICKY LAPTOP + SCROLL PANELS ═══════ */}
      <StickyProductSection />

      {/* ═══════ HORIZONTAL FEATURE SCROLL ═══════ */}
      <FeatureScroll />

      {/* ═══════ SPEC NUMBERS ═══════ */}
      <section style={{
        background: "#08080f",
        padding: "140px 0",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 60,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 40px",
        }}>
          <SpecReveal value={120} unit="Hz" label="ProMotion Display" />
          <SpecReveal value={18} unit="hr" label="Battery Life" />
          <SpecReveal value={32} unit="GB" label="Max Memory" />
          <SpecReveal value={4} unit="K" label="Display Resolution" />
        </div>
      </section>

      {/* ═══════ PRODUCT GRID ═══════ */}
      <section className="products-grid-section" style={{
        background: "#050508",
        padding: "120px 0",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 60,
          }}>
            <div>
              <p style={{
                fontSize: 12, letterSpacing: "4px",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 12,
                fontFamily: "var(--font-inter), system-ui",
              }}>
                Curated Performance
              </p>
              <h2 className="products-title" style={{
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 600,
                color: "#fff",
                opacity: 0,
                fontFamily: "var(--font-inter), system-ui",
              }}>
                Featured Models
              </h2>
            </div>
            <Link href="/products" style={{
              fontSize: 14, color: "#00e5ff", textDecoration: "none",
              fontFamily: "var(--font-inter), system-ui",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              View All →
            </Link>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}>
            {products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="final-cta" style={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 50%, #0a0a1a 0%, #050508 70%)",
        textAlign: "center",
        padding: "0 40px",
      }}>
        <h2 className="final-cta-title" style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 600,
          color: "#fff",
          lineHeight: 1.1,
          maxWidth: 700,
          marginBottom: 32,
          opacity: 0,
          fontFamily: "var(--font-inter), system-ui",
        }}>
          Ready to experience the future?
        </h2>
        <Link href="/products" className="final-cta-btn" style={{
          display: "inline-block",
          padding: "16px 40px",
          background: "#00e5ff",
          color: "#000",
          fontSize: 16,
          fontWeight: 600,
          borderRadius: 28,
          textDecoration: "none",
          opacity: 0,
          transition: "background 0.2s, transform 0.2s",
          fontFamily: "var(--font-inter), system-ui",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#33ecff"; e.currentTarget.style.transform = "scale(1.05)" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#00e5ff"; e.currentTarget.style.transform = "scale(1)" }}
        >
          Explore All Models
        </Link>
      </section>
    </div>
  )
}
