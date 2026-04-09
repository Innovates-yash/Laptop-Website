"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable on mobile for better native scroll
    if (window.innerWidth < 768) return

    let lenis: any
    let rafId: number

    const init = async () => {
      const Lenis = (await import("lenis")).default

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
      })

      lenis.on("scroll", ScrollTrigger.update)

      gsap.ticker.add((time) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)
    }

    init()

    return () => {
      if (lenis) lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
