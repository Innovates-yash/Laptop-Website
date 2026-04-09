'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap')
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      gsap.fromTo('.login-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1 })
      gsap.fromTo('.login-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 })
      gsap.fromTo('.login-box', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 })
    }
    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signIn('credentials', { email, password, redirect: false })
      if (res?.error) {
        setError('Invalid email or password')
        const { gsap } = await import('gsap')
        gsap.fromTo('.login-box', { x: -8 }, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" })
      } else {
        router.push('/')
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 18px", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
    color: "#fff", fontSize: 15, outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "var(--font-inter), system-ui",
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#050508",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "120px 24px 80px",
    }}>
      <h1 className="login-title" style={{
        fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 600, color: "#fff",
        marginBottom: 8, opacity: 0, fontFamily: "var(--font-inter), system-ui",
      }}>
        Sign in
      </h1>
      <p className="login-sub" style={{
        fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 40,
        opacity: 0, fontFamily: "var(--font-inter), system-ui",
      }}>
        Access your VOLTEX account
      </p>

      <div className="login-box" style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: 40,
        opacity: 0,
      }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {error && (
            <p style={{
              fontSize: 14, color: "#ff4444", textAlign: "center",
              padding: "10px", borderRadius: 8, background: "rgba(255,68,68,0.1)",
            }}>
              {error}
            </p>
          )}
          <div>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "block" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "block" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px", borderRadius: 12, border: "none",
              background: "#00e5ff", color: "#000", fontSize: 15,
              fontWeight: 600, cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.6 : 1, transition: "all 0.2s",
              marginTop: 8, fontFamily: "var(--font-inter), system-ui",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={{
          marginTop: 28, textAlign: "center",
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          paddingTop: 24,
        }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: "#00e5ff", textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
