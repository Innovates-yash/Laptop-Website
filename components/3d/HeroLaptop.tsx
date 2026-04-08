"use client"

import { useEffect, useRef } from "react"

export default function HeroLaptop() {
  const containerRef = useRef<HTMLDivElement>(null)
  const laptopRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const laptop = laptopRef.current
    const glow = glowRef.current
    if (!container || !laptop || !glow) return

    // Check for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const tick = () => {
      currentX += (mouseX - currentX) * 0.06
      currentY += (mouseY - currentY) * 0.06

      const rotateY = currentX * 12
      const rotateX = -currentY * 8
      const translateX = currentX * 15
      const translateY = currentY * 10

      laptop.style.transform = `
        perspective(1200px) 
        rotateY(${-8 + rotateY}deg) 
        rotateX(${2 + rotateX}deg) 
        translateX(${translateX}px) 
        translateY(${translateY}px)
        scale(1.05)
      `

      glow.style.transform = `translate(${currentX * 30}px, ${currentY * 20}px)`

      rafId = requestAnimationFrame(tick)
    }

    container.addEventListener("mousemove", onMouseMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      container.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow behind laptop */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          width: "70%",
          height: "70%",
          background: "radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, rgba(0, 229, 255, 0.05) 40%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Secondary glow - purple */}
      <div
        style={{
          position: "absolute",
          width: "50%",
          height: "50%",
          bottom: "10%",
          right: "10%",
          background: "radial-gradient(circle, rgba(120, 50, 255, 0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: i % 3 === 0 ? "rgba(0, 229, 255, 0.6)" : "rgba(255, 255, 255, 0.3)",
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particleFloat ${6 + Math.random() * 8}s linear infinite`,
            animationDelay: `${Math.random() * 6}s`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {/* Laptop image with 3D CSS transform */}
      <div
        ref={laptopRef}
        style={{
          position: "relative",
          zIndex: 2,
          width: "85%",
          maxWidth: "600px",
          animation: "heroFloat 5s ease-in-out infinite",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Screen glow effect */}
        <div
          style={{
            position: "absolute",
            inset: "5% 10% 30% 10%",
            background: "linear-gradient(180deg, rgba(0, 229, 255, 0.08) 0%, rgba(0, 229, 255, 0.03) 100%)",
            filter: "blur(20px)",
            borderRadius: "8px",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* Laptop image */}
        <img
          src="/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg"
          alt="VOLTEX High-Performance Laptop"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "4px",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 229, 255, 0.1)",
          }}
        />

        {/* Reflection/shine sweep */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.03) 45%, rgba(255, 255, 255, 0.06) 50%, transparent 55%)",
            pointerEvents: "none",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Decorative grid lines */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%) perspective(600px) rotateX(60deg)",
          width: "120%",
          height: "300px",
          backgroundImage: `
            linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.5,
          pointerEvents: "none",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 80%)",
          zIndex: 0,
        }}
      />
    </div>
  )
}
