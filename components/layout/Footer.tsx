'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          const { gsap } = await import('gsap')

          gsap.from('.footer-brand', {
            opacity: 0,
            x: -30,
            duration: 0.6,
            ease: 'power2.out',
          })

          gsap.from('.footer-col', {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.2,
          })

          gsap.from('.footer-bottom', {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power2.out',
            delay: 0.5,
          })

          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={footerRef} className="bg-surface-container-lowest border-t border-outline-variant/20 py-24 px-12 md:px-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
        {/* Brand */}
        <div className="footer-brand col-span-1 md:col-span-2">
          <div className="font-syne font-extrabold tracking-tighter text-3xl text-primary mb-6">
            VOLTEX
          </div>
          <p className="font-body text-on-surface-variant max-w-md leading-relaxed mb-8">
            Engineering excellence meets uncompromising performance. Built for creators, gamers, and professionals who demand the impossible.
          </p>
          <div className="flex gap-4">
            {['X', 'IN', 'GH'].map((label, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center font-mono text-[10px] tracking-widest text-on-surface-variant hover:text-primary"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="footer-col">
          <h4 className="font-mono text-xs tracking-widest text-primary mb-6">PRODUCTS</h4>
          <ul className="space-y-4">
            {[
              { href: '/products?category=gaming', label: 'Gaming Laptops' },
              { href: '/products?category=creator', label: 'Creator Studio' },
              { href: '/products?category=ultrabook', label: 'Ultrabooks' },
              { href: '/products', label: 'All Products' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-[1px] bg-primary/50 w-0 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h4 className="font-mono text-xs tracking-widest text-primary mb-6">SUPPORT</h4>
          <ul className="space-y-4">
            {[
              { href: '/contact', label: 'Contact Us' },
              { href: '#', label: 'Warranty' },
              { href: '#', label: 'Shipping' },
              { href: '#', label: 'Returns' },
            ].map((link, i) => (
              <li key={i}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-[1px] bg-primary/50 w-0 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom pt-12 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-mono text-[10px] tracking-widest text-outline">
          © 2026 VOLTEX. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-8 font-mono text-[10px] tracking-widest">
          {['PRIVACY', 'TERMS', 'COOKIES'].map((text) => (
            <a
              key={text}
              href="#"
              className="text-outline hover:text-primary transition-colors duration-300"
            >
              {text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
