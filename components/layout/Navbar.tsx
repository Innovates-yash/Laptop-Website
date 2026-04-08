'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const cartItems = useCartStore((state) => state.items)
  const cartCount = (cartItems ?? []).reduce((sum, item) => sum + item.quantity, 0)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP entrance animation
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const init = async () => {
      const { gsap } = await import('gsap')
      gsap.from(nav, {
        y: -80,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.2,
      })
      gsap.from('.nav-link', {
        opacity: 0,
        y: -10,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 1.6,
      })
    }

    init()
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => pathname === path

  // Check if user is employee or admin
  const isEmployeeOrAdmin = session?.user?.role === 'EMPLOYEE' || session?.user?.role === 'ADMIN'

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/products', label: 'PRODUCTS' },
    { href: '/contact', label: 'CONTACT US' },
  ]

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-surface/80 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,229,255,0.08)]'
            : 'bg-transparent backdrop-blur-sm'
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-12 py-5 w-full">
          {/* Logo */}
          <Link
            href="/"
            className="nav-link font-syne font-extrabold tracking-tighter text-2xl text-primary hover:text-primary-fixed-dim transition-colors relative group"
          >
            VOLTEX
            <span
              className="absolute -bottom-1 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link relative font-mono uppercase tracking-wide-tech text-xs transition-colors duration-300 group ${
                  isActive(link.href) ? 'text-primary' : 'text-on-surface hover:text-primary'
                }`}
              >
                {link.label}
                {/* Animated underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-primary transition-all duration-300 ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
            {isEmployeeOrAdmin && (
              <Link
                href={(session?.user as any)?.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'}
                className={`nav-link relative font-mono uppercase tracking-wide-tech text-xs transition-colors duration-300 group ${
                  pathname?.startsWith('/employee') || pathname?.startsWith('/admin') ? 'text-primary' : 'text-on-surface hover:text-primary'
                }`}
              >
                DASHBOARD
                <span className="absolute -bottom-1 left-0 h-[1px] bg-primary w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {session ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="nav-link font-mono text-xs text-on-surface-variant">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="nav-link font-mono text-xs text-primary hover:text-primary-fixed-dim transition-colors"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="nav-link hidden md:block bg-primary-container text-on-primary px-6 py-2 font-mono text-xs tracking-widest magnetic-btn transition-all"
              >
                LOGIN
              </Link>
            )}

            <Link href="/cart" className="nav-link relative group">
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform inline-block">
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-container text-on-primary text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center animate-[scaleIn_0.3s_ease]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
        mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div
          className="absolute inset-0 bg-surface/95 backdrop-blur-2xl"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="relative h-full flex flex-col justify-center items-center gap-8 p-12">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-mono uppercase tracking-wide-tech text-xl transition-colors ${
                isActive(link.href) ? 'text-primary' : 'text-on-surface hover:text-primary'
              }`}
              style={{
                animation: mobileMenuOpen ? `fadeInUp 0.4s ${i * 0.08}s both` : 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
          {isEmployeeOrAdmin && (
            <Link
              href={(session?.user as any)?.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono uppercase tracking-wide-tech text-xl text-primary hover:text-primary-fixed-dim transition-colors"
            >
              DASHBOARD
            </Link>
          )}

          <div className="accent-line w-16 my-4" />

          {session ? (
            <>
              <span className="font-mono text-sm text-on-surface-variant">
                {session.user?.name}
              </span>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' })
                  setMobileMenuOpen(false)
                }}
                className="font-mono text-xl text-primary hover:text-primary-fixed-dim transition-colors"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-primary-container text-on-primary px-8 py-3 font-mono uppercase tracking-wide-tech text-xl magnetic-btn transition-all"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
