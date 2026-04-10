"use client"

import { useEffect, useRef, memo } from "react"
import Link from "next/link"
import Image from "next/image"

interface EnhancedProductCardProps {
  id: string
  name: string
  category: string
  price: number
  image?: string
  slug?: string
  index?: number
}

function EnhancedProductCardComponent({
  id,
  name,
  category,
  price,
  image,
  slug,
  index = 0
}: EnhancedProductCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const viewTextRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>()
  const scrollTriggerRef = useRef<any>()

  useEffect(() => {
    const card = cardRef.current
    const imageEl = imageRef.current
    const overlay = overlayRef.current
    const viewText = viewTextRef.current
    if (!card || !imageEl || !overlay || !viewText) return

    // Check for reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      card.style.opacity = "1"
      return
    }

    // Lazy load GSAP only when card is in viewport
    observerRef.current = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          const { gsap } = await import("gsap")
          const { ScrollTrigger } = await import("gsap/ScrollTrigger")
          
          gsap.registerPlugin(ScrollTrigger)

          // Scroll reveal animation
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              delay: index * 0.08,
            }
          )

          observerRef.current?.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    observerRef.current.observe(card)

    // Optimized hover with CSS transforms
    const onMouseEnter = () => {
      imageEl.style.transform = "scale(1.05)"
      imageEl.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
      overlay.style.opacity = "0.3"
      overlay.style.transition = "opacity 0.3s"
      viewText.style.opacity = "1"
      viewText.style.transform = "translateY(0)"
      viewText.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }

    const onMouseLeave = () => {
      imageEl.style.transform = "scale(1)"
      overlay.style.opacity = "0"
      viewText.style.opacity = "0"
      viewText.style.transform = "translateY(20px)"
    }

    card.addEventListener("mouseenter", onMouseEnter, { passive: true })
    card.addEventListener("mouseleave", onMouseLeave, { passive: true })

    return () => {
      card.removeEventListener("mouseenter", onMouseEnter)
      card.removeEventListener("mouseleave", onMouseLeave)
      observerRef.current?.disconnect()
      scrollTriggerRef.current?.kill()
    }
  }, [index])

  return (
    <Link
      href={`/products/${slug || id}`}
      ref={cardRef}
      data-cursor="VIEW"
      className="product-card block relative overflow-hidden group"
    >
      {/* Image Container */}
      <div 
        ref={imageRef}
        className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-low"
        style={{ willChange: "transform" }}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
            loading="lazy"
            quality={85}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">💻</span>
          </div>
        )}

        {/* Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{ background: "var(--color-accent)", willChange: "opacity" }}
        />

        {/* VIEW Text */}
        <div
          ref={viewTextRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          style={{ transform: "translateY(20px)", willChange: "transform, opacity" }}
        >
          <span className="text-white text-2xl font-bold tracking-[4px]">
            VIEW
          </span>
        </div>
      </div>

      {/* Text Content */}
      <div className="p-6 bg-[var(--color-surface)]">
        <p className="text-[10px] tracking-[3px] uppercase opacity-50 mb-2">
          {category}
        </p>
        <h3 className="text-lg font-medium mb-2">{name}</h3>
        <p className="text-[var(--color-accent)] font-semibold">
          ₹{price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  )
}

// Memoize to prevent unnecessary re-renders
export const EnhancedProductCard = memo(EnhancedProductCardComponent)
