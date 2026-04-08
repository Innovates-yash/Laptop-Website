"use client"

import { useEffect, useRef, memo } from "react"

interface ShaderTextProps {
  children: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  className?: string
  delay?: number
  trigger?: "load" | "scroll"
}

function ShaderTextComponent({ 
  children, 
  as: Tag = "h1", 
  className, 
  delay = 0, 
  trigger = "scroll"
}: ShaderTextProps) {
  const ref = useRef<HTMLElement>(null)
  const observerRef = useRef<IntersectionObserver>()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check for reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      el.style.opacity = "1"
      return
    }

    // Split text into characters manually
    const text = el.textContent || ""
    const chars = text.split("")
    
    el.innerHTML = chars.map(char => 
      char === " " 
        ? '<span style="display:inline-block;width:0.3em;"></span>' 
        : `<span style="display:inline-block;overflow:hidden;"><span style="display:inline-block;opacity:0;transform:translateY(110%) rotateX(-90deg);">${char}</span></span>`
    ).join("")

    const charElements = el.querySelectorAll("span > span") as NodeListOf<HTMLElement>

    const animateIn = async () => {
      // Lazy load GSAP only when animation is triggered
      const { gsap } = await import("gsap")

      gsap.to(charElements, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: {
          amount: 0.3,
          from: "start",
        },
        delay,
      })
    }

    if (trigger === "load") {
      animateIn()
    } else {
      // Use Intersection Observer instead of ScrollTrigger
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animateIn()
            observerRef.current?.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -15% 0px" }
      )

      observerRef.current.observe(el)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [delay, trigger])

  return (
    <Tag 
      ref={ref as any} 
      className={className}
      style={{ perspective: "600px" }}
    >
      {children}
    </Tag>
  )
}

export const ShaderText = memo(ShaderTextComponent)
