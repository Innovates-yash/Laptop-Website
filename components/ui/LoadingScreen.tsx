"use client"

import { useEffect, useRef, useState } from "react"

export default function LoadingScreen() {
  const screenRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem("v_loaded")) {
      setVisible(false)
      return
    }

    const init = async () => {
      const { gsap } = await import("gsap")

      const letters = document.querySelectorAll(".load-letter")
      const line = document.querySelector(".load-line")
      const tag = document.querySelector(".load-tag")
      const screen = screenRef.current
      if (!screen) return

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("v_loaded", "1")
          gsap.to(screen, {
            yPercent: -100,
            duration: 0.65,
            ease: "power3.inOut",
            onComplete: () => setVisible(false),
          })
        },
      })

      tl.from(letters, {
        opacity: 0,
        y: 20,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
      })
      tl.to(
        line,
        { width: 120, duration: 0.6, ease: "power2.inOut" },
        "-=0.1"
      )
      tl.to(tag, { opacity: 0.4, duration: 0.4 }, "-=0.3")
      tl.to({}, { duration: 0.5 })
    }

    init()
  }, [])

  if (!visible) return null

  return (
    <div
      ref={screenRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div style={{ display: "flex", gap: 2 }}>
        {"VOLTEX".split("").map((l, i) => (
          <span
            key={i}
            className="load-letter"
            style={{
              fontSize: "clamp(52px, 9vw, 96px)",
              fontWeight: 300,
              letterSpacing: "0.15em",
              color: "#fff",
              display: "inline-block",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            {l}
          </span>
        ))}
      </div>
      <div
        className="load-line"
        style={{
          width: 0,
          height: "0.5px",
          background: "rgba(255,255,255,0.5)",
        }}
      />
      <span
        className="load-tag"
        style={{
          fontSize: 11,
          letterSpacing: "4px",
          textTransform: "uppercase" as const,
          color: "#fff",
          opacity: 0,
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        }}
      >
        The ultimate machine. Reengineered.
      </span>
    </div>
  )
}
