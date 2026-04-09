"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const panels = [
  {
    title: "Thinness Redefined",
    body: "At just 14.9mm, it disappears in your bag.\nThe machined aluminium chassis weighs under 1.5kg.",
    spec: "14.9mm · 1.46kg",
  },
  {
    title: "The Display You Dream About",
    body: "4K OLED. 120Hz ProMotion.\n1,000,000:1 contrast ratio.\nEvery pixel engineered for perfection.",
    spec: "4K · 120Hz · OLED",
  },
  {
    title: "Intelligence at the Core",
    body: "Latest generation processor.\nNever throttles. Never hesitates.\nBuilt for creators, traders, and builders.",
    spec: "Latest Gen Processor",
  },
  {
    title: "All Day. Every Day.",
    body: "18 hours of battery life.\nMagSafe charges to 80% in 30 minutes.\nAlways ready when you are.",
    spec: "18hr Battery",
  },
  {
    title: "Yours from ₹79,999",
    body: "Six configurations.\nOne for every version of you.\nFree delivery across India.",
    spec: null,
    cta: "Choose Your Model →",
  },
]

export function StickyProductSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const laptopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      const laptop = laptopRef.current
      if (!section || !laptop) return

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      // Laptop rotation/transform based on scroll progress through section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress
          // Rotate laptop as user scrolls
          const angle = p * 270 // 0° → 270°
          const scale = 1 + Math.sin(p * Math.PI) * 0.08
          gsap.set(laptop, {
            rotateY: angle,
            scale: scale,
          })
        },
      })

      // Panel text animations
      const panelEls = section.querySelectorAll(".sticky-panel")
      panelEls.forEach((panel) => {
        const title = panel.querySelector(".panel-title")
        const body = panel.querySelector(".panel-body")
        const spec = panel.querySelector(".panel-spec")
        const cta = panel.querySelector(".panel-cta")

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play reverse play reverse",
          },
        })
        if (title) tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 })
        if (body) tl.fromTo(body, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
        if (spec) tl.fromTo(spec, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4 }, "-=0.2")
        if (cta) tl.fromTo(cta, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
      })
    }

    init()

    return () => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.vars.trigger === sectionRef.current) t.kill()
        })
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        height: `${panels.length * 100}vh`,
        position: "relative",
        background: "#050508",
      }}
    >
      {/* Sticky laptop */}
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}>
        <div
          ref={laptopRef}
          style={{
            width: "min(55vw, 600px)",
            height: "min(40vw, 420px)",
            position: "relative",
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Laptop body — CSS 3D */}
          <div style={{
            width: "100%",
            height: "100%",
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            background: "linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 100%)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(0,229,255,0.05)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <Image
              src="/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg"
              alt="VOLTEX Laptop"
              fill
              style={{ objectFit: "cover", opacity: 0.85 }}
              priority
              sizes="55vw"
            />
            {/* Screen glow */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 30%, rgba(0,229,255,0.06) 0%, transparent 70%)",
            }} />
          </div>
          {/* Base reflection */}
          <div style={{
            position: "absolute",
            bottom: -8,
            left: "10%",
            right: "10%",
            height: 16,
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent)",
            borderRadius: "50%",
            filter: "blur(4px)",
          }} />
        </div>
      </div>

      {/* Text panels — scroll past the laptop */}
      <div style={{
        position: "absolute",
        top: 0,
        right: "6vw",
        width: "clamp(280px, 35vw, 450px)",
      }}>
        {panels.map((panel, i) => (
          <div
            key={i}
            className="sticky-panel"
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingRight: 20,
            }}
          >
            <h2
              className="panel-title"
              style={{
                fontSize: "clamp(32px, 3.5vw, 52px)",
                fontWeight: 600,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 20,
                fontFamily: "var(--font-inter), system-ui",
                opacity: 0,
              }}
            >
              {panel.title}
            </h2>
            <p
              className="panel-body"
              style={{
                fontSize: "clamp(15px, 1.2vw, 18px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.55)",
                whiteSpace: "pre-line",
                marginBottom: 24,
                fontFamily: "var(--font-inter), system-ui",
                opacity: 0,
              }}
            >
              {panel.body}
            </p>
            {panel.spec && (
              <p
                className="panel-spec"
                style={{
                  fontSize: "clamp(28px, 3vw, 44px)",
                  fontWeight: 700,
                  color: "#00e5ff",
                  letterSpacing: "-1px",
                  fontFamily: "var(--font-inter), system-ui",
                  opacity: 0,
                }}
              >
                {panel.spec}
              </p>
            )}
            {panel.cta && (
              <a
                href="/products"
                className="panel-cta"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  background: "#00e5ff",
                  color: "#000",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 28,
                  textDecoration: "none",
                  marginTop: 8,
                  fontFamily: "var(--font-inter), system-ui",
                  opacity: 0,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#33ecff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#00e5ff")}
              >
                {panel.cta}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
