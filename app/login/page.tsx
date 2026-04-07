'use client'

import { useState } from 'react'
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
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
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
          <div className="glass-panel p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-error/10 border border-error text-error px-4 py-3 font-mono text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="font-mono text-xs tracking-widest text-on-surface mb-2 block">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="font-mono text-xs tracking-widest text-on-surface mb-2 block">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-on-primary px-8 py-4 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant/20 text-center">
              <p className="font-body text-sm text-on-surface-variant mb-4">
                Don't have an account?
              </p>
              <Link href="/register">
                <button className="border border-outline-variant text-on-surface px-8 py-3 font-mono tracking-widest text-xs hover:border-primary hover:text-primary transition-all">
                  CREATE ACCOUNT
                </button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/employee/login"
                className="font-mono text-xs text-primary hover:text-primary-fixed-dim transition-colors"
              >
                Employee Login →
              </Link>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 glass-panel p-6">
            <p className="font-mono text-xs tracking-widest text-primary mb-3">
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
