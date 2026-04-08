"use client"

import { useEffect, useRef } from "react"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    // Disable smooth scroll on mobile/touch devices for better performance
    if (window.matchMedia("(pointer: coarse)").matches) {
      return
    }

    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    // Lazy load Lenis only when needed
    let cleanup: (() => void) | undefined

    const initLenis = async () => {
      const Lenis = (await import("lenis")).default
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      })

      lenisRef.current = lenis

      // Connect Lenis to GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update)

      // Use RAF instead of GSAP ticker for better performance
      const raf = (time: number) => {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)

      cleanup = () => {
        lenis.destroy()
      }
    }

    initLenis()

    return () => {
      cleanup?.()
    }
  }, [])

  return <>{children}</>
}
