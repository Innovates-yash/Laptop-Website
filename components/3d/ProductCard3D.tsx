"use client"

import { useRef, useState, useEffect, memo } from "react"
import Link from "next/link"

interface ProductCard3DProps {
  name: string
  price: number
  category: string
  modelUrl?: string
  slug?: string
  image?: string
}

function ProductCard3DComponent({
  name,
  price,
  category,
  slug,
  image,
}: ProductCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Resolve fallback image based on category
  const resolvedImage = image || (() => {
    const images = [
      '/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg',
      '/images/products/kyle-sung-oQuP_XBjOMY-unsplash.jpg',
      '/images/products/leap-design-rXGzpEeYAS0-unsplash.jpg',
      '/images/products/muneeb-ali-arshad-_FpedyKWiHY-unsplash.jpg',
    ]
    const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return images[hash % images.length]
  })()

  const resolvedSlug = slug || name.toLowerCase().replace(/\s+/g, '-')

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Mouse tilt effect
  useEffect(() => {
    const card = cardRef.current
    const img = imageRef.current
    if (!card || !img) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`
      img.style.transform = `scale(1.08) translateX(${x * -8}px) translateY(${y * -8}px)`
    }

    const onMouseLeave = () => {
      card.style.transform = "perspective(800px) rotateY(0) rotateX(0) translateY(0)"
      card.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
      img.style.transform = "scale(1)"
      img.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
    }

    const onMouseEnter = () => {
      card.style.transition = "none"
      img.style.transition = "none"
    }

    card.addEventListener("mouseenter", onMouseEnter, { passive: true })
    card.addEventListener("mousemove", onMouseMove, { passive: true })
    card.addEventListener("mouseleave", onMouseLeave, { passive: true })

    return () => {
      card.removeEventListener("mouseenter", onMouseEnter)
      card.removeEventListener("mousemove", onMouseMove)
      card.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [isVisible])

  return (
    <Link href={`/products/${resolvedSlug}`}>
      <div
        ref={cardRef}
        data-product-card
        className="group relative overflow-hidden"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Image */}
        <div 
          className="relative w-full overflow-hidden bg-surface-container-low"
          style={{ height: "280px" }}
        >
          <div
            ref={imageRef}
            style={{
              width: "100%",
              height: "100%",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <img
              src={resolvedImage}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              loading="lazy"
            />
          </div>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
                       opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          />

          {/* Category badge */}
          <div className="absolute top-4 left-4 bg-surface/70 backdrop-blur-sm px-3 py-1">
            <span className="font-mono text-[10px] tracking-[3px] uppercase text-primary">
              {category}
            </span>
          </div>

          {/* View button on hover */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
                       transition-all duration-300 pointer-events-none"
          >
            <div
              className="px-6 py-3 border border-white/40 backdrop-blur-sm
                         translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
            >
              <span className="font-mono text-xs tracking-[3px] text-white">VIEW</span>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="p-6 bg-surface border-t border-outline-variant/10">
          <h3 className="font-syne font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <p className="text-primary font-semibold text-xl">
            ₹{price.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary-container to-transparent
                     w-0 group-hover:w-full transition-all duration-500"
        />
      </div>
    </Link>
  )
}

export default memo(ProductCard3DComponent)
