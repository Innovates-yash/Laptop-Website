"use client"

import { useEffect, useRef, useCallback } from "react"
import { ShaderText } from "@/components/ui/ShaderText"
import dynamic from "next/dynamic"

const HeroLaptop = dynamic(() => import("@/components/3d/HeroLaptop"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface-container-low animate-pulse" />
})

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const laptopRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    const hero = heroRef.current
    const laptop = laptopRef.current
    const text = textRef.current
    if (!hero || !laptop || !text) return

    // Check for reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    // Simple mouse parallax with RAF (no scroll fade-out)
    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    // Use passive listener
    hero.addEventListener("mousemove", onMouseMove, { passive: true })

    // Optimized RAF loop with lerp
    const tick = () => {
      currentX += (mouseX - currentX) * 0.1
      currentY += (mouseY - currentY) * 0.1

      // Use transform for GPU acceleration
      laptop.style.transform = `translate3d(${currentX * 20}px, ${currentY * 10}px, 0) rotateY(${currentX * 8}deg) rotateX(${-currentY * 5}deg)`
      text.style.transform = `translate3d(${-currentX * 10}px, ${-currentY * 6}px, 0)`

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      hero.removeEventListener("mousemove", onMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center overflow-hidden"
      style={{ background: "var(--color-background)" }}
    >
      {/* Optimized film grain - use CSS instead of SVG */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* TEXT - left side */}
      <div
        ref={textRef}
        className="relative z-[3] w-full md:w-1/2 px-8 md:px-[8vw]"
        style={{ willChange: "transform, opacity" }}
      >
        <p className="text-[11px] tracking-[4px] uppercase opacity-50 mb-6">
          Next Generation Computing
        </p>

        <ShaderText 
          as="h1" 
          trigger="load" 
          delay={0.2}
          className="font-syne font-extrabold text-5xl md:text-7xl leading-none mb-4"
        >
          POWER HAS NO
        </ShaderText>

        <ShaderText 
          as="h1" 
          trigger="load" 
          delay={0.4}
          className="font-syne font-extrabold text-5xl md:text-7xl leading-none mb-8"
        >
          LIMITS
        </ShaderText>

        <p className="mt-8 opacity-60 max-w-[400px] leading-[1.7] text-base">
          Machines built for those who refuse to be ordinary.
          Every component engineered to the edge.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <a 
            href="/products" 
            data-cursor="EXPLORE"
            className="px-10 py-4 bg-[var(--color-accent)] text-black font-semibold tracking-[2px] uppercase text-xs inline-block transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]"
          >
            Explore Machines
          </a>

          <a 
            href="/contact"
            data-cursor="TALK"
            className="px-10 py-4 border border-white/30 text-white font-medium tracking-[2px] uppercase text-xs inline-block transition-all hover:bg-white/5"
          >
            Talk to Us
          </a>
        </div>
      </div>

      {/* 3D LAPTOP - right side */}
      <div
        ref={laptopRef}
        className="absolute right-0 w-full md:w-[55%] h-full z-[2]"
        style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
      >
        <HeroLaptop />
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-[3]">
        <span className="text-[10px] tracking-[3px] uppercase">Scroll</span>
        <div 
          className="w-[1px] h-[60px] bg-white origin-top"
          style={{ animation: "scrollLine 2s ease-in-out infinite" }}
        />
      </div>
    </section>
  )
}
