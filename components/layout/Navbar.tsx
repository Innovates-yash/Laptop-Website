'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const cartCount = useCartStore((s) => s.items.length)
  const navRef = useRef<HTMLNavigationElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    let lastY = 0
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(async () => {
        const y = window.scrollY
        const down = y > lastY
        const pastHero = y > window.innerHeight * 0.8

        const { gsap } = await import("gsap")

        // Hide / show
        if (down && pastHero) {
          gsap.to(nav, { y: -80, duration: 0.3, ease: "power2.in" })
        } else {
          gsap.to(nav, { y: 0, duration: 0.4, ease: "power2.out" })
        }

        // Background transition
        if (y > 80) {
          nav.style.background = "rgba(5,5,8,0.85)"
          nav.style.backdropFilter = "blur(20px) saturate(180%)"
          nav.style.borderBottom = "0.5px solid rgba(255,255,255,0.08)"
        } else {
          nav.style.background = "rgba(0,0,0,0)"
          nav.style.backdropFilter = "blur(0px)"
          nav.style.borderBottom = "0.5px solid transparent"
        }

        lastY = y
        ticking = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    // Initial entrance
    const initAnim = async () => {
      const { gsap } = await import("gsap")
      gsap.fromTo(nav,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.3 }
      )
    }
    initAnim()

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => pathname === path
  const isEmployeeOrAdmin = session?.user?.role === 'EMPLOYEE' || session?.user?.role === 'ADMIN'

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/products', label: 'PRODUCTS' },
    { href: '/contact', label: 'CONTACT US' },
  ]

  return (
    <>
      <nav
        ref={navRef as any}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
          borderBottom: "0.5px solid transparent",
          willChange: "transform",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
        }}>
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fff",
              textDecoration: "none",
              fontFamily: "var(--font-inter), system-ui",
            }}
          >
            VOLTEX
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ gap: 32, alignItems: "center" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 14,
                  fontWeight: isActive(link.href) ? 500 : 400,
                  letterSpacing: "0.02em",
                  color: isActive(link.href)
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  fontFamily: "var(--font-inter), system-ui",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive(link.href) ? "#fff" : "rgba(255,255,255,0.85)")}
              >
                {link.label}
              </Link>
            ))}
            {isEmployeeOrAdmin && (
              <Link
                href={(session?.user as any)?.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'}
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  color: "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                DASHBOARD
              </Link>
            )}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {session ? (
              <div className="hidden md:flex" style={{ alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{
                    fontSize: 13,
                    color: "#00e5ff",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:block"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#fff",
                  background: "rgba(255,255,255,0.1)",
                  padding: "8px 20px",
                  borderRadius: 20,
                  textDecoration: "none",
                  transition: "background 0.2s",
                  fontFamily: "var(--font-inter)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              >
                LOGIN
              </Link>
            )}

            <Link href="/cart" style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span className="material-symbols-outlined" style={{ color: "rgba(255,255,255,0.85)", fontSize: 22 }}>
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: -6,
                  right: -8,
                  background: "#00e5ff",
                  color: "#000",
                  fontSize: 10,
                  fontWeight: 700,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
              style={{
                width: 32,
                height: 32,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Toggle menu"
            >
              <span style={{
                width: 20, height: 1, background: "#fff",
                transition: "all 0.3s",
                transform: mobileMenuOpen ? "rotate(45deg) translateY(3px)" : "none",
              }} />
              <span style={{
                width: 20, height: 1, background: "#fff",
                transition: "all 0.3s",
                opacity: mobileMenuOpen ? 0 : 1,
              }} />
              <span style={{
                width: 20, height: 1, background: "#fff",
                transition: "all 0.3s",
                transform: mobileMenuOpen ? "rotate(-45deg) translateY(-3px)" : "none",
              }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 8999,
        opacity: mobileMenuOpen ? 1 : 0,
        pointerEvents: mobileMenuOpen ? "auto" : "none",
        transition: "opacity 0.4s",
        background: "rgba(5,5,8,0.97)",
        backdropFilter: "blur(30px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
      }}
        className="md:hidden"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: 24,
              fontWeight: 300,
              letterSpacing: "0.15em",
              color: isActive(link.href) ? "#fff" : "rgba(255,255,255,0.7)",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            {link.label}
          </Link>
        ))}
        <div style={{ width: 40, height: 0.5, background: "rgba(255,255,255,0.15)", margin: "8px 0" }} />
        {session ? (
          <button
            onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false) }}
            style={{
              fontSize: 18, fontWeight: 300, letterSpacing: "0.1em",
              color: "#00e5ff", background: "none", border: "none", cursor: "pointer",
            }}
          >
            LOGOUT
          </button>
        ) : (
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: 18, fontWeight: 300, letterSpacing: "0.1em",
              color: "#00e5ff", textDecoration: "none",
            }}
          >
            LOGIN
          </Link>
        )}
      </div>
    </>
  )
}
