'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => pathname === path

  // Check if user is employee or admin
  const isEmployeeOrAdmin = session?.user?.role === 'EMPLOYEE' || session?.user?.role === 'ADMIN'

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-950/80 backdrop-blur-xl shadow-[0_0_20px_rgba(0,229,255,0.08)]' 
          : 'bg-slate-950/60 backdrop-blur-xl'
      }`}>
        <div className="flex justify-between items-center px-6 md:px-12 py-6 w-full">
          {/* Logo */}
          <Link href="/" className="font-syne font-extrabold tracking-tighter text-2xl text-primary hover:text-primary-fixed-dim transition-colors">
            VOLTEX
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-10">
            <Link 
              href="/" 
              className={`font-mono uppercase tracking-wide-tech text-xs transition-colors duration-300 ${
                isActive('/') ? 'text-primary' : 'text-on-surface hover:text-primary'
              }`}
            >
              HOME
            </Link>
            <Link 
              href="/products" 
              className={`font-mono uppercase tracking-wide-tech text-xs transition-colors duration-300 ${
                isActive('/products') ? 'text-primary' : 'text-on-surface hover:text-primary'
              }`}
            >
              PRODUCTS
            </Link>
            <Link 
              href="/contact" 
              className={`font-mono uppercase tracking-wide-tech text-xs transition-colors duration-300 ${
                isActive('/contact') ? 'text-primary' : 'text-on-surface hover:text-primary'
              }`}
            >
              CONTACT US
            </Link>
            {isEmployeeOrAdmin && (
              <Link 
                href={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'}
                className={`font-mono uppercase tracking-wide-tech text-xs transition-colors duration-300 ${
                  pathname?.startsWith('/employee') || pathname?.startsWith('/admin') ? 'text-primary' : 'text-on-surface hover:text-primary'
                }`}
              >
                DASHBOARD
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {session ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="font-mono text-xs text-on-surface">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="font-mono text-xs text-primary hover:text-primary-fixed-dim transition-colors"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden md:block bg-primary-container text-on-primary px-6 py-2 font-mono text-xs tracking-widest hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all"
              >
                LOGIN
              </Link>
            )}
            
            <Link href="/cart" className="relative">
              <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform">
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-container text-on-primary text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center">
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
              <span className={`w-6 h-0.5 bg-primary transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-primary transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-primary transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div 
          className="absolute inset-0 bg-surface/95 backdrop-blur-xl"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div className="relative h-full flex flex-col justify-center items-center gap-8 p-12">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={`font-mono uppercase tracking-wide-tech text-xl transition-colors ${
              isActive('/') ? 'text-primary' : 'text-on-surface hover:text-primary'
            }`}
          >
            HOME
          </Link>
          <Link 
            href="/products" 
            onClick={() => setMobileMenuOpen(false)}
            className={`font-mono uppercase tracking-wide-tech text-xl transition-colors ${
              isActive('/products') ? 'text-primary' : 'text-on-surface hover:text-primary'
            }`}
          >
            PRODUCTS
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className={`font-mono uppercase tracking-wide-tech text-xl transition-colors ${
              isActive('/contact') ? 'text-primary' : 'text-on-surface hover:text-primary'
            }`}
          >
            CONTACT US
          </Link>
          {isEmployeeOrAdmin && (
            <Link 
              href={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono uppercase tracking-wide-tech text-xl text-primary hover:text-primary-fixed-dim transition-colors"
            >
              DASHBOARD
            </Link>
          )}
          
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
              className="bg-primary-container text-on-primary px-8 py-3 font-mono uppercase tracking-wide-tech text-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
