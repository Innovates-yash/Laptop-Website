"use client"

import { useEffect, useRef } from "react"

interface Props {
  value: number
  unit: string
  label: string
  prefix?: string
  decimals?: number
}

export function SpecReveal({ value, unit, label, prefix = "", decimals = 0 }: Props) {
  const numRef = useRef<HTMLSpanElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const obj = useRef({ n: 0 })

  useEffect(() => {
    const el = numRef.current
    const wrap = wrapRef.current
    if (!el || !wrap) return

    const init = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = prefix + value.toFixed(decimals)
        return
      }

      gsap.fromTo(wrap,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: wrap, start: "top 85%" },
        }
      )

      gsap.to(obj.current, {
        n: value,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: wrap, start: "top 85%" },
        onUpdate: () => {
          el.textContent = prefix + obj.current.n.toFixed(decimals)
        },
      })
    }

    init()
  }, [value, prefix, decimals])

  return (
    <div ref={wrapRef} style={{ textAlign: "center", opacity: 0 }}>
      <div style={{
        fontSize: "clamp(56px, 10vw, 110px)",
        fontWeight: 700,
        lineHeight: 1,
        color: "#fff",
        letterSpacing: "-2px",
        fontFamily: "var(--font-inter), system-ui",
      }}>
        <span ref={numRef}>{prefix}0</span>
        <span style={{
          fontSize: "0.35em",
          fontWeight: 300,
          opacity: 0.5,
          marginLeft: 4,
        }}>
          {unit}
        </span>
      </div>
      <p style={{
        fontSize: 12,
        letterSpacing: "3px",
        textTransform: "uppercase" as const,
        color: "rgba(255,255,255,0.4)",
        marginTop: 14,
        fontFamily: "var(--font-inter), system-ui",
      }}>
        {label}
      </p>
    </div>
  )
}
