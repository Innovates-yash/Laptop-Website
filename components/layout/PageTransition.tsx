"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isFirst = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip first render — loading screen handles intro
    if (isFirst.current) {
      isFirst.current = false
      el.style.opacity = "1"
      el.style.transform = "translateY(0)"
      return
    }

    const animate = async () => {
      const { gsap } = await import("gsap")
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", delay: 0.05 }
      )
    }

    animate()
  }, [pathname])

  return (
    <div ref={ref} style={{ opacity: 1 }}>
      {children}
    </div>
  )
}
