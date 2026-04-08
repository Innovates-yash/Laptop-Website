"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const overlay = overlayRef.current
    const content = contentRef.current
    if (!overlay || !content) return

    // Check for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      overlay.style.scaleX = '0'
      content.style.opacity = '1'
      return
    }

    // Skip the very first render (loading screen handles that)
    if (isFirstRender.current) {
      isFirstRender.current = false
      content.style.opacity = '1'
      overlay.style.transform = 'scaleX(0)'
      return
    }

    // Page transition animation
    const animate = async () => {
      const { gsap } = await import('gsap')

      const tl = gsap.timeline()

      // Overlay sweeps in then out
      tl.set(overlay, { scaleX: 1, transformOrigin: "left center" })
      tl.to(overlay, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.6,
        ease: "power3.inOut",
      })
      tl.fromTo(
        content,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.3"
      )
    }

    animate()
  }, [pathname])

  return (
    <div style={{ position: "relative" }}>
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(90deg, var(--color-accent, #00e5ff), var(--color-primary-fixed-dim, #00daf3))",
          zIndex: 9990,
          transformOrigin: "right center",
          transform: "scaleX(0)",
          pointerEvents: "none",
        }}
      />
      <div ref={contentRef} style={{ opacity: 1 }}>
        {children}
      </div>
    </div>
  )
}
