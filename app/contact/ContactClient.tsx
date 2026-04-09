'use client'

import { useState, useEffect } from 'react'

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap')
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      gsap.fromTo('.ct-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1 })
      gsap.fromTo('.ct-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 })
      gsap.fromTo('.ct-form', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 })
      gsap.fromTo('.ct-info', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.4 })
    }
    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Simulate
    await new Promise(r => setTimeout(r, 1500))
    setStatus('sent')
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setStatus('idle'), 3000)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 18px", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
    color: "#fff", fontSize: 15, outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "var(--font-inter), system-ui",
    boxSizing: "border-box",
  }

  const infoCards = [
    { icon: "mail", title: "Email", value: "hello@voltex.in" },
    { icon: "call", title: "Phone", value: "+91 80-4567-8901" },
    { icon: "location_on", title: "Office", value: "Bengaluru, India" },
    { icon: "schedule", title: "Hours", value: "Mon-Fri 10am-6pm IST" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#050508", paddingTop: 120 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 120px" }}>
        {/* Header */}
        <h1 className="ct-title" style={{
          fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, color: "#fff",
          marginBottom: 12, opacity: 0, fontFamily: "var(--font-inter), system-ui",
        }}>
          Get in Touch
        </h1>
        <p className="ct-sub" style={{
          fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 500,
          marginBottom: 60, opacity: 0, fontFamily: "var(--font-inter), system-ui", lineHeight: 1.6,
        }}>
          Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll respond within 24 hours.
        </p>

        {/* Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 60 }}>
          {/* Form */}
          <div className="ct-form" style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: 40, opacity: 0,
          }}>
            {status === 'sent' ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#00e5ff", marginBottom: 16, display: "block" }}>
                  check_circle
                </span>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Message Sent</h3>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)" }}>
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "block" }}>Name</label>
                    <input
                      type="text" required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name" style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "block" }}>Email</label>
                    <input
                      type="email" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@email.com" style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "block" }}>Subject</label>
                  <input
                    type="text" required value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="What's this about?" style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "block" }}>Message</label>
                  <textarea
                    required value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us more..." rows={5}
                    style={{ ...inputStyle, resize: "vertical" as const }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
                <button
                  type="submit" disabled={status === 'sending'}
                  style={{
                    padding: "14px", borderRadius: 12, border: "none",
                    background: "#00e5ff", color: "#000", fontSize: 15,
                    fontWeight: 600, cursor: status === 'sending' ? "wait" : "pointer",
                    opacity: status === 'sending' ? 0.6 : 1, transition: "all 0.2s",
                    fontFamily: "var(--font-inter), system-ui",
                  }}
                >
                  {status === 'sending' ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {infoCards.map(c => (
              <div key={c.title} className="ct-info" style={{
                padding: "24px 28px", borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", gap: 16,
                opacity: 0,
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 24, color: "#00e5ff", opacity: 0.7,
                }}>
                  {c.icon}
                </span>
                <div>
                  <p style={{
                    fontSize: 12, letterSpacing: "2px",
                    textTransform: "uppercase" as const,
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: 4, fontFamily: "var(--font-inter), system-ui",
                  }}>
                    {c.title}
                  </p>
                  <p style={{
                    fontSize: 15, color: "#fff", fontWeight: 500,
                    fontFamily: "var(--font-inter), system-ui",
                  }}>
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
