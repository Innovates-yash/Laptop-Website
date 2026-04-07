'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      // Redirect to login page
      router.push('/login?registered=true')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-surface flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="font-mono text-primary tracking-wide-tech text-xs mb-4">
              // JOIN VOLTEX
            </div>
            <h1 className="font-syne font-extrabold text-5xl mb-4">
              CREATE ACCOUNT
            </h1>
            <p className="font-body text-on-surface-variant">
              Start your journey with high-performance computing
            </p>
          </div>

          {/* Registration Form */}
          <div className="glass-panel p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-error/10 border border-error text-error px-4 py-3 font-mono text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="font-mono text-xs tracking-widest text-on-surface mb-2 block">
                  FULL NAME
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="font-mono text-xs tracking-widest text-on-surface mb-2 block">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <p className="font-mono text-[10px] text-on-surface-variant mt-1">
                  Minimum 8 characters
                </p>
              </div>

              <div>
                <label className="font-mono text-xs tracking-widest text-on-surface mb-2 block">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant/20 text-center">
              <p className="font-body text-sm text-on-surface-variant mb-4">
                Already have an account?
              </p>
              <Link href="/login">
                <button className="border border-outline-variant text-on-surface px-8 py-3 font-mono tracking-widest text-xs hover:border-primary hover:text-primary transition-all">
                  LOGIN
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
