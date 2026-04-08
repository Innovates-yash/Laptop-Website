'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // GSAP entrance animation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const init = async () => {
      const { gsap } = await import('gsap')

      gsap.from('.login-header', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      })

      gsap.from('.login-form', {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.15,
      })

      gsap.from('.login-field', {
        opacity: 0,
        x: -20,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3,
      })

      gsap.from('.login-extras', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.6,
      })
    }

    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        // Shake animation on error
        const { gsap } = await import('gsap')
        gsap.to('.login-form', {
          x: [-10, 10, -8, 8, -4, 4, 0],
          duration: 0.4,
          ease: 'power2.out',
        })
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-surface flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="login-header text-center mb-12">
            <div className="font-mono text-primary tracking-wide-tech text-xs mb-4">
              // CUSTOMER ACCESS
            </div>
            <h1 className="font-syne font-extrabold text-5xl mb-4">
              LOGIN
            </h1>
            <p className="font-body text-on-surface-variant">
              Access your account to manage orders and preferences
            </p>
          </div>

          {/* Login Form */}
          <div className="login-form glass-panel p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-error/10 border border-error/40 text-error px-4 py-3 font-mono text-xs animate-[fadeInDown_0.3s_ease]">
                  {error}
                </div>
              )}

              <div className="login-field">
                <label className="font-mono text-xs tracking-widest text-on-surface mb-2 block">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-on-surface focus:border-primary focus:shadow-[0_0_0_1px_rgba(0,229,255,0.3)] focus:outline-none transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>

              <div className="login-field">
                <label className="font-mono text-xs tracking-widest text-on-surface mb-2 block">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body text-on-surface focus:border-primary focus:shadow-[0_0_0_1px_rgba(0,229,255,0.3)] focus:outline-none transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-field w-full magnetic-btn bg-primary-container text-on-primary px-8 py-4 font-mono font-bold tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    LOGGING IN...
                  </span>
                ) : 'LOGIN'}
              </button>
            </form>

            <div className="login-extras mt-8 pt-8 border-t border-outline-variant/20 text-center">
              <p className="font-body text-sm text-on-surface-variant mb-4">
                Don't have an account?
              </p>
              <Link href="/register">
                <button className="border border-outline-variant/30 text-on-surface px-8 py-3 font-mono tracking-widest text-xs hover:border-primary hover:text-primary transition-all duration-300">
                  CREATE ACCOUNT
                </button>
              </Link>
            </div>

            <div className="login-extras mt-6 text-center">
              <Link
                href="/employee/login"
                className="font-mono text-xs text-primary/70 hover:text-primary transition-colors"
              >
                Employee Login →
              </Link>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="login-extras mt-8 glass-panel p-6">
            <p className="font-mono text-xs tracking-widest text-primary/70 mb-3">
              DEMO CREDENTIALS
            </p>
            <div className="space-y-2 font-mono text-xs text-on-surface-variant">
              <p>Admin: admin@voltex.com / Admin@123</p>
              <p>Employee: john.doe@voltex.com / Employee@123</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
