"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"

interface ProductCardProps {
  name: string
  price: number
  category: string
  slug: string
  image: string
}

export function ProductCard({ name, price, category, slug, image }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLSpanElement>(null)

  const onEnter = async () => {
    const { gsap } = await import("gsap")
    gsap.to(cardRef.current, {
      scale: 1.03,
      boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
      duration: 0.4,
      ease: "power2.out",
    })
    gsap.to(imageRef.current, { y: -8, duration: 0.4, ease: "power2.out" })
    gsap.to(viewRef.current, { opacity: 1, x: 0, duration: 0.3 })
  }

  const onMove = async (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const { gsap } = await import("gsap")
    const rect = card.getBoundingClientRect()
    const xRot = ((e.clientY - rect.top) / rect.height - 0.5) * 8
    const yRot = ((e.clientX - rect.left) / rect.width - 0.5) * -8
    gsap.to(card, {
      rotateX: xRot,
      rotateY: yRot,
      duration: 0.3,
      ease: "power1.out",
      transformPerspective: 800,
    })
  }

  const onLeave = async () => {
    const { gsap } = await import("gsap")
    gsap.to(cardRef.current, {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      duration: 0.5,
      ease: "power2.out",
    })
    gsap.to(imageRef.current, { y: 0, duration: 0.5, ease: "power2.out" })
    gsap.to(viewRef.current, { opacity: 0, x: -10, duration: 0.2 })
  }

  return (
    <Link href={`/products/${slug}`} style={{ textDecoration: "none" }}>
      <div
        ref={cardRef}
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="product-card"
        style={{
          background: "#0d0d14",
          borderRadius: 20,
          overflow: "hidden",
          cursor: "pointer",
          transformStyle: "preserve-3d",
          willChange: "transform",
          border: "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <div ref={imageRef} style={{ height: 260, overflow: "hidden", position: "relative", background: "#080810" }}>
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: "cover", opacity: 0.9 }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div style={{ padding: "24px 28px 28px" }}>
          <p style={{
            fontSize: 11,
            letterSpacing: "3px",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 8,
            fontFamily: "var(--font-inter), system-ui",
          }}>
            {category}
          </p>
          <h3 style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#fff",
            marginBottom: 12,
            fontFamily: "var(--font-inter), system-ui",
          }}>
            {name}
          </h3>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{
              fontSize: 20,
              fontWeight: 500,
              color: "#fff",
              fontFamily: "var(--font-inter), system-ui",
            }}>
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span
              ref={viewRef}
              style={{
                fontSize: 13,
                color: "#00e5ff",
                opacity: 0,
                transform: "translateX(-10px)",
                display: "inline-block",
                fontFamily: "var(--font-inter), system-ui",
              }}
            >
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
