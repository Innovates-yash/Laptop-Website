"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

const HeroLaptop = dynamic(() => import('@/components/3d/HeroLaptop'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "2px solid rgba(0,229,255,0.3)",
        borderTopColor: "#00e5ff",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
    </div>
  ),
})

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Mock products
const mockProducts = [
  {
    id: '1',
    name: 'VOLTEX NEXUS-16',
    category: 'Gaming',
    price: 349900,
    images: ['/images/products/ionela-mat-2WxnKStKQTs-unsplash.jpg'],
    slug: 'voltex-nexus-16',
  },
  {
    id: '2',
    name: 'VOLTEX AER-14',
    category: 'Ultrabook',
    price: 219900,
    images: ['/images/products/kyle-sung-oQuP_XBjOMY-unsplash.jpg'],
    slug: 'voltex-aer-14',
  },
  {
    id: '3',
    name: 'VOLTEX STUDIO PRO',
    category: 'Creator',
    price: 389900,
    images: ['/images/products/leap-design-rXGzpEeYAS0-unsplash.jpg'],
    slug: 'voltex-studio-pro',
  },
  {
    id: '4',
    name: 'VOLTEX CORE M1',
    category: 'Ultrabook',
    price: 159900,
    images: ['/images/products/muneeb-ali-arshad-_FpedyKWiHY-unsplash.jpg'],
    slug: 'voltex-core-m1',
  },
]

// Stats data
const stats = [
  { value: 99, suffix: '%', label: 'Customer Satisfaction' },
  { value: 50, suffix: 'K+', label: 'Units Sold' },
  { value: 24, suffix: '/7', label: 'Expert Support' },
  { value: 4, suffix: '+', label: 'Years of Innovation' },
]

// Ticker items
const tickerItems = [
  'RTX 4090', 'DDR5 RAM', '4K OLED', 'THUNDERBOLT 4', 'WIFI 7', 'GEN5 SSD',
  'LIQUID METAL', '240Hz DISPLAY', 'AI PROCESSING', 'CARBON FIBER',
]

function ProductCard({ product, index }: { product: typeof mockProducts[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const img = imgRef.current
    if (!card || !img) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) translateY(-6px)`
      card.style.transition = 'none'
      img.style.transform = `scale(1.1) translateX(${x * -10}px) translateY(${y * -10}px)`
      img.style.transition = 'none'
    }

    const onMouseLeave = () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)'
      card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      img.style.transform = 'scale(1)'
      img.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    }

    card.addEventListener('mousemove', onMouseMove, { passive: true })
    card.addEventListener('mouseleave', onMouseLeave, { passive: true })

    return () => {
      card.removeEventListener('mousemove', onMouseMove)
      card.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        ref={cardRef}
        className="product-card group relative overflow-hidden"
        data-product-card
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <div className="relative overflow-hidden bg-surface-container-low" style={{ height: '280px' }}>
          <div
            ref={imgRef}
            style={{ width: '100%', height: '100%', transition: 'transform 0.6s ease' }}
          >
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

          {/* Category badge */}
          <div className="absolute top-4 left-4 bg-surface/60 backdrop-blur-sm px-3 py-1">
            <span className="font-mono text-[10px] tracking-[3px] uppercase text-primary">
              {product.category}
            </span>
          </div>

          {/* View on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="px-6 py-3 border border-white/30 backdrop-blur-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="font-mono text-xs tracking-[3px] text-white">VIEW</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="p-6 bg-surface border-t border-outline-variant/10">
          <h3 className="font-syne font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-primary font-semibold text-xl">
            ₹{(product.price / 100).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary-container to-transparent w-0 group-hover:w-full transition-all duration-500" />
      </div>
    </Link>
  )
}

function StatCounter({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 2000
          const startTime = Date.now()

          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic
            setCount(Math.round(value * eased))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          setTimeout(() => requestAnimationFrame(animate), index * 200)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, index, hasAnimated])

  return (
    <div ref={ref} className="stat-item text-center">
      <div className="font-syne font-extrabold text-5xl md:text-6xl text-primary mb-2">
        {count}{suffix}
      </div>
      <p className="font-mono text-xs tracking-[3px] uppercase text-on-surface-variant">
        {label}
      </p>
    </div>
  )
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation — character split
      const titleChars = document.querySelectorAll('.hero-char')
      gsap.from(titleChars, {
        opacity: 0,
        y: 80,
        rotateX: -90,
        duration: 0.8,
        stagger: 0.03,
        ease: 'back.out(1.4)',
        delay: 1.8,
      })

      // Subtitle
      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power2.out',
        delay: 2.4,
      })

      // Tag line
      gsap.from('.hero-tag', {
        opacity: 0,
        x: -20,
        duration: 0.5,
        ease: 'power2.out',
        delay: 1.6,
      })

      // CTA buttons bounce in
      gsap.from('.hero-cta', {
        opacity: 0,
        y: 20,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.12,
        ease: 'back.out(1.7)',
        delay: 2.6,
      })

      // Hero laptop fade in
      gsap.from('.hero-laptop-container', {
        opacity: 0,
        x: 80,
        duration: 1.2,
        ease: 'power3.out',
        delay: 1.5,
      })

      // Scroll indicator
      gsap.from('.scroll-indicator', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        delay: 3,
      })

      // ── SCROLL TRIGGERED ──

      // Products section
      gsap.from('.section-mono-tag', {
        opacity: 0,
        x: -30,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.products-section', start: 'top 80%' },
      })

      gsap.from('.section-title', {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.products-section', start: 'top 80%' },
      })

      gsap.from('.product-card', {
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.products-section', start: 'top 70%' },
      })

      // Stats section
      gsap.from('.stat-item', {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.stats-section', start: 'top 80%' },
      })

      // Features section
      gsap.from('.feature-item', {
        opacity: 0,
        x: -40,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.features-section', start: 'top 75%' },
      })

      // CTA section
      gsap.from('.cta-title', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-section', start: 'top 80%' },
      })

      gsap.from('.cta-button', {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: 'back.out(1.7)',
        delay: 0.3,
        scrollTrigger: { trigger: '.cta-section', start: 'top 75%' },
      })
    })

    return () => ctx.revert()
  }, [])

  // Split title text into characters for animation
  const title1 = "POWER HAS NO"
  const title2 = "LIMITS"

  return (
    <div className="min-h-screen">
      {/* ══════════ HERO SECTION ══════════ */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, #0a0a1a 0%, #050508 60%)' }}
      >
        {/* Left: Text Content */}
        <div className="relative z-10 w-full md:w-[45%] px-8 md:px-[8vw]">
          <p className="hero-tag text-[11px] tracking-[4px] uppercase opacity-50 mb-6 font-mono">
            Next Generation Computing
          </p>

          <h1 className="font-syne font-extrabold text-5xl md:text-7xl leading-none mb-2" style={{ perspective: '600px' }}>
            {title1.split('').map((char, i) => (
              <span
                key={i}
                className="hero-char inline-block"
                style={{ transformOrigin: 'bottom' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <h1 className="font-syne font-extrabold text-5xl md:text-7xl leading-none mb-8" style={{ perspective: '600px' }}>
            {title2.split('').map((char, i) => (
              <span
                key={i}
                className="hero-char inline-block text-primary"
                style={{
                  transformOrigin: 'bottom',
                  textShadow: '0 0 40px rgba(0, 229, 255, 0.3)',
                }}
              >
                {char}
              </span>
            ))}
          </h1>

          <p className="hero-subtitle mt-8 opacity-60 max-w-[400px] leading-[1.7] text-base">
            Machines built for those who refuse to be ordinary. Every component engineered to
            the edge.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="hero-cta magnetic-btn px-10 py-4 bg-[var(--color-accent)] text-black font-semibold tracking-[2px] uppercase text-xs inline-block"
            >
              Explore Machines
            </Link>

            <Link
              href="/contact"
              className="hero-cta magnetic-btn px-10 py-4 border border-white/30 text-white font-medium tracking-[2px] uppercase text-xs inline-block transition-all hover:bg-white/5 hover:border-white/60"
            >
              Talk to Us
            </Link>
          </div>
        </div>

        {/* Right: Animated Laptop */}
        <div className="hero-laptop-container absolute right-0 w-full md:w-[55%] h-full z-[2]">
          <HeroLaptop />
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-[3]">
          <span className="text-[10px] tracking-[3px] uppercase font-mono">Scroll</span>
          <div
            className="w-[1px] h-[60px] bg-white origin-top"
            style={{ animation: 'scrollLine 2s ease-in-out infinite' }}
          />
        </div>
      </section>

      {/* ══════════ STATS SECTION ══════════ */}
      <section className="stats-section py-16 px-8 md:px-24 bg-surface-container-lowest border-y border-outline-variant/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <StatCounter key={i} {...stat} index={i} />
          ))}
        </div>
      </section>

      {/* ══════════ TICKER SECTION ══════════ */}
      <section className="py-6 bg-surface border-b border-outline-variant/10 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-move">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                className="inline-block mx-8 font-mono text-xs tracking-[4px] uppercase"
                style={{ color: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }}
              >
                {item}
                <span className="mx-8 text-outline-variant">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED PRODUCTS ══════════ */}
      <section className="products-section py-32 px-8 md:px-24 bg-surface">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="section-mono-tag font-mono text-primary tracking-wide text-xs mb-4">
              // CURATED PERFORMANCE
            </div>
            <h2 className="section-title font-syne font-extrabold text-5xl md:text-6xl">FEATURED MODELS</h2>
          </div>
          <Link href="/products">
            <span className="font-mono text-xs tracking-[3px] uppercase text-primary hover:text-primary-fixed-dim transition-colors">
              View All →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      {/* ══════════ WHY VOLTEX ══════════ */}
      <section className="features-section py-32 px-8 md:px-24 bg-surface-container-lowest">
        <div className="text-center mb-20">
          <div className="section-mono-tag font-mono text-primary tracking-wide text-xs mb-4">
            // UNMATCHED EXCELLENCE
          </div>
          <h2 className="section-title font-syne font-extrabold text-5xl md:text-6xl">WHY VOLTEX</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: 'EXTREME PERFORMANCE', desc: 'Powered by the latest processors and GPUs, delivering uncompromising speed for any task.' },
            { icon: '💎', title: 'PREMIUM BUILD', desc: 'Aerospace-grade aluminum chassis with precision engineering for durability and elegance.' },
            { icon: '🛡️', title: '24/7 SUPPORT', desc: 'Expert technical support available around the clock to keep you running at peak performance.' },
          ].map((feature, i) => (
            <div
              key={i}
              className="feature-item glass-panel p-12 hover:border-primary/30 transition-all duration-500 group"
            >
              <div className="w-16 h-16 border border-primary/20 flex items-center justify-center mb-8 group-hover:bg-primary/5 group-hover:border-primary/40 transition-all duration-500">
                <span className="text-4xl">{feature.icon}</span>
              </div>
              <h3 className="font-syne font-bold text-2xl mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-on-surface-variant leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      <section className="cta-section py-32 px-8 md:px-24 bg-surface relative overflow-hidden">
        {/* Gradient orb */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="accent-line w-24 mb-8" />
          <h2 className="cta-title font-syne font-extrabold text-5xl md:text-7xl mb-8 leading-tight">
            READY TO EXPERIENCE<br />
            <span className="text-primary" style={{ textShadow: '0 0 40px rgba(0, 229, 255, 0.2)' }}>
              THE FUTURE?
            </span>
          </h2>
          <p className="text-xl text-on-surface-variant mb-12 max-w-2xl">
            Get in touch with our team to find the perfect laptop for your needs. Custom
            configurations available.
          </p>
          <Link href="/contact">
            <button className="cta-button magnetic-btn bg-primary-container text-on-primary px-12 py-6 font-mono font-bold tracking-widest text-sm transition-all">
              CONTACT US NOW
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
