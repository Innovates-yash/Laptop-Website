"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)

      const footer = footerRef.current
      if (!footer) return

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      // Footer content reveal when scrolled into view
      gsap.fromTo(".footer-brand",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: footer, start: "top 90%" } }
      )
      gsap.fromTo(".footer-col",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: footer, start: "top 85%" } }
      )
      gsap.fromTo(".footer-bottom",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 0.3,
          scrollTrigger: { trigger: footer, start: "top 85%" } }
      )
    }

    init()
  }, [])

  const columns = [
    {
      title: "Products",
      links: [
        { label: "Gaming", href: "/products" },
        { label: "Ultrabook", href: "/products" },
        { label: "Creator", href: "/products" },
        { label: "Compare", href: "/products" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Warranty", href: "/contact" },
        { label: "Returns", href: "/contact" },
        { label: "FAQ", href: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/" },
        { label: "Careers", href: "/" },
        { label: "Press", href: "/" },
        { label: "Blog", href: "/" },
      ],
    },
  ]

  return (
    <footer
      ref={footerRef}
      style={{
        background: "#000",
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
        padding: "80px 0 40px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 40px",
        display: "grid",
        gridTemplateColumns: "1.5fr repeat(3, 1fr)",
        gap: 60,
      }}
        className="footer-grid"
      >
        {/* Brand */}
        <div className="footer-brand">
          <h3 style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#fff",
            marginBottom: 12,
            fontFamily: "var(--font-inter), system-ui",
          }}>
            VOLTEX
          </h3>
          <p style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.4)",
            maxWidth: 280,
            fontFamily: "var(--font-inter), system-ui",
          }}>
            The ultimate machine. Reengineered for those who demand more.
          </p>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title} className="footer-col" style={{ opacity: 0 }}>
            <h4 style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 20,
              fontFamily: "var(--font-inter), system-ui",
            }}>
              {col.title}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {col.links.map((link) => (
                <li key={link.label} style={{ marginBottom: 12 }}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.4)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      fontFamily: "var(--font-inter), system-ui",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div
        className="footer-bottom"
        style={{
          maxWidth: 1200,
          margin: "60px auto 0",
          padding: "20px 40px 0",
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          opacity: 0,
        }}
      >
        <p style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--font-inter), system-ui",
        }}>
          © {new Date().getFullYear()} VOLTEX. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Sitemap"].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                cursor: "pointer",
                transition: "color 0.2s",
                fontFamily: "var(--font-inter), system-ui",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
