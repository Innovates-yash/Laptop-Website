"use client"

import { useEffect, useRef } from "react"

const features = [
  {
    icon: "⚡",
    title: "Thunderbolt 4",
    body: "Three Thunderbolt 4 ports, HDMI 2.1, SD card slot, and MagSafe charging. No dongle life.",
    gradient: "linear-gradient(135deg, rgba(0,229,255,0.08), rgba(0,229,255,0.02))",
    borderColor: "rgba(0,229,255,0.15)",
  },
  {
    icon: "⌨️",
    title: "Magic Keyboard",
    body: "Full-height function row with backlit keys. 1mm travel that feels like 1.5mm. Ambient light sensor.",
    gradient: "linear-gradient(135deg, rgba(179,197,255,0.08), rgba(179,197,255,0.02))",
    borderColor: "rgba(179,197,255,0.15)",
  },
  {
    icon: "🔊",
    title: "Spatial Audio",
    body: "Six-speaker system with force-cancelling woofers. Dolby Atmos. Sound that fills the room.",
    gradient: "linear-gradient(135deg, rgba(174,255,191,0.08), rgba(174,255,191,0.02))",
    borderColor: "rgba(174,255,191,0.15)",
  },
  {
    icon: "🔒",
    title: "Hardware Security",
    body: "Touch ID with secure enclave. Hardware-verified boot. Your data stays yours, always.",
    gradient: "linear-gradient(135deg, rgba(255,200,120,0.08), rgba(255,200,120,0.02))",
    borderColor: "rgba(255,200,120,0.15)",
  },
]

export function FeatureCards() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".feat-card, .feat-header", { opacity: 1, y: 0 })
        return
      }

      const ctx = gsap.context(() => {
        // Header animation
        gsap.fromTo(".feat-header",
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.7,
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
          }
        )

        // Cards stagger animation
        gsap.fromTo(".feat-card",
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7, stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".feat-card-grid", start: "top 80%" },
          }
        )
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
      style={{
        background: "linear-gradient(180deg, #050508 0%, #08080f 50%, #050508 100%)",
        padding: "120px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        {/* Header */}
        <div className="feat-header" style={{
          textAlign: "center",
          marginBottom: 60,
          opacity: 0,
        }}>
          <p style={{
            fontSize: 12, letterSpacing: "5px",
            textTransform: "uppercase" as const,
            color: "#00e5ff", marginBottom: 16,
            fontFamily: "var(--font-inter), system-ui",
          }}>
            Built Different
          </p>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 600,
            color: "#fff",
            fontFamily: "var(--font-inter), system-ui",
          }}>
            Details that matter
          </h2>
        </div>

        {/* Cards grid */}
        <div className="feat-card-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="feat-card"
              style={{
                padding: 36,
                background: f.gradient,
                border: `1px solid ${f.borderColor}`,
                borderRadius: 16,
                opacity: 0,
                transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)"
                e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${f.borderColor}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <div style={{
                fontSize: 36,
                marginBottom: 20,
                filter: "grayscale(0.3)",
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#fff",
                marginBottom: 12,
                fontFamily: "var(--font-inter), system-ui",
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-inter), system-ui",
              }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
