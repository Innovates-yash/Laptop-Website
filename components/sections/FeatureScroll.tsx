"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const features = [
  {
    id: 1,
    title: "Ultra-thin aluminium chassis",
    body: "CNC-machined from a single block of recycled aluminium. Impossibly thin at 14.9mm. Impossibly strong at every angle.",
    image: "/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg",
  },
  {
    id: 2,
    title: "OLED display that never sleeps",
    body: "4K resolution. 120Hz ProMotion. 1,600 nits peak brightness. Colors so vivid, you'll forget it's a screen.",
    image: "/images/products/kyle-sung-oQuP_XBjOMY-unsplash.jpg",
  },
  {
    id: 3,
    title: "Ports. Finally enough of them.",
    body: "Three Thunderbolt 4 ports. HDMI 2.1. SD card slot. MagSafe charging. No dongle life.",
    image: "/images/products/leap-design-rXGzpEeYAS0-unsplash.jpg",
  },
  {
    id: 4,
    title: "The keyboard you've been waiting for",
    body: "Full-height function row. Backlit keys with ambient light sensor. 1mm travel that feels like 1.5mm.",
    image: "/images/products/muneeb-ali-arshad-_FpedyKWiHY-unsplash.jpg",
  },
  {
    id: 5,
    title: "Your next machine. Choose it.",
    body: "Six configurations tailored for creators, developers, traders, and dreamers. Starting at ₹79,999.",
    image: "/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg",
    cta: "Explore All Models",
  },
]

export function FeatureScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      // On mobile, skip horizontal scroll
      if (window.innerWidth < 768) return

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      let ctx: any;
      if (typeof window !== "undefined") {
        ctx = gsap.context(() => {
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              end: () => "+=" + (track.scrollWidth - window.innerWidth),
              invalidateOnRefresh: true,
            },
          })

          const panelTexts = track.querySelectorAll(".feat-text")
          panelTexts.forEach((t) => {
            gsap.fromTo(t,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                scrollTrigger: {
                  trigger: t,
                  start: "left 80%",
                  containerAnimation: gsap.getById?.("hScroll") || undefined,
                  toggleActions: "play none none reverse",
                },
              }
            )
          })
        }, sectionRef)
      }
      return ctx
    }

    let ctxToRevert: any
    init().then(ctx => { ctxToRevert = ctx })

    return () => {
      if (ctxToRevert) ctxToRevert.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ background: "#06060c", overflow: "hidden" }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          height: "100vh",
          width: `${features.length * 100}vw`,
        }}
      >
        {features.map((f) => (
          <div
            key={f.id}
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              padding: "0 8vw",
              gap: "6vw",
              flexShrink: 0,
            }}
          >
            {/* Image side */}
            <div style={{
              width: "50%",
              height: "65vh",
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
            }}>
              <Image
                src={f.image}
                alt={f.title}
                fill
                style={{ objectFit: "cover", opacity: 0.85 }}
                sizes="50vw"
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, transparent, rgba(6,6,12,0.4))",
              }} />
            </div>

            {/* Text side */}
            <div className="feat-text" style={{ width: "40%", maxWidth: 500 }}>
              <h3 style={{
                fontSize: "clamp(32px, 3vw, 48px)",
                fontWeight: 600,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 20,
                fontFamily: "var(--font-inter), system-ui",
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: "clamp(15px, 1.1vw, 18px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 28,
                fontFamily: "var(--font-inter), system-ui",
              }}>
                {f.body}
              </p>
              {f.cta && (
                <a
                  href="/products"
                  style={{
                    display: "inline-block",
                    padding: "14px 32px",
                    background: "#00e5ff",
                    color: "#000",
                    fontSize: 15,
                    fontWeight: 600,
                    borderRadius: 28,
                    textDecoration: "none",
                    transition: "background 0.2s, transform 0.2s",
                    fontFamily: "var(--font-inter), system-ui",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#33ecff"; e.currentTarget.style.transform = "scale(1.05)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#00e5ff"; e.currentTarget.style.transform = "scale(1)" }}
                >
                  {f.cta}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
