"use client"

import { useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"

export function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number>()
  const mousePos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    // Hide cursor on mobile/touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      dot.style.display = "none"
      ring.style.display = "none"
      return
    }

    // Throttled mouse move handler
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
      // Dot follows exactly (no RAF needed for instant feedback)
      gsap.set(dot, { x: e.clientX, y: e.clientY })
    }

    // Use passive listener for better scroll performance
    window.addEventListener("mousemove", onMouseMove, { passive: true })

    // Ring follows with lerp (optimized RAF loop)
    const tick = () => {
      const dx = mousePos.current.x - ringPos.current.x
      const dy = mousePos.current.y - ringPos.current.y
      
      // Only update if movement is significant (avoid unnecessary renders)
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        ringPos.current.x += dx * 0.15
        ringPos.current.y += dy * 0.15
        gsap.set(ring, { x: ringPos.current.x, y: ringPos.current.y })
      }
      
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    // Optimized hover states - use event delegation
    const onMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      const cursorLabel = target.getAttribute("data-cursor") || "CLICK"
      
      gsap.to(ring, { scale: 1.8, duration: 0.3, ease: "power2.out" })
      gsap.to(dot, { scale: 0.5, duration: 0.3 })
      label.textContent = cursorLabel
      gsap.to(label, { opacity: 1, duration: 0.2 })
    }

    const onMouseLeave = () => {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "power2.out" })
      gsap.to(dot, { scale: 1, duration: 0.3 })
      gsap.to(label, { opacity: 0, duration: 0.2 })
    }

    // Use event delegation instead of adding listeners to each element
    document.addEventListener("mouseover", (e) => {
      const target = e.target as HTMLElement
      if (target.matches("a, button, [data-cursor]")) {
        onMouseEnter(e)
      }
    })

    document.addEventListener("mouseout", (e) => {
      const target = e.target as HTMLElement
      if (target.matches("a, button, [data-cursor]")) {
        onMouseLeave()
      }
    })

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[var(--color-accent)] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: "translate(-50%, -50%)", willChange: "transform" }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border border-[var(--color-accent)]/50 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        style={{ transform: "translate(-50%, -50%)", willChange: "transform" }}
      >
        <span
          ref={labelRef}
          className="text-[8px] font-bold tracking-wider opacity-0"
          style={{ color: "var(--color-accent)" }}
        />
      </div>
    </>
  )
}
