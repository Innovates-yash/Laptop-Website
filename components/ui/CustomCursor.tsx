'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const currentState = useRef<string>('default')

  useEffect(() => {
    // Skip on touch devices
    if (typeof window === 'undefined') return
    if (window.matchMedia("(pointer: coarse)").matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      // Dot follows instantly
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      let newState = 'default'
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        newState = 'link'
      } else if (target.tagName === 'CANVAS') {
        newState = 'drag'
      } else if (target.closest('[data-product-card]')) {
        newState = 'view'
      }

      if (newState !== currentState.current) {
        currentState.current = newState
        updateCursorState(ring, dot, newState)
      }
    }

    const handleMouseDown = () => {
      gsap.to(dot, { scale: 0.5, duration: 0.1, ease: 'power2.out' })
      gsap.to(ring, { scale: 0.8, duration: 0.1, ease: 'power2.out' })
    }

    const handleMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.5)' })
      gsap.to(ring, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.5)' })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    // Ring follows with smooth lag
    const animateRing = () => {
      const dx = mousePos.current.x - ringPos.current.x
      const dy = mousePos.current.y - ringPos.current.y

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        ringPos.current.x += dx * 0.12
        ringPos.current.y += dy * 0.12
        ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(animateRing)
    }

    rafRef.current = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-100px, -100px) translate(-50%, -50%)',
          willChange: 'transform',
          transition: 'width 0.3s, height 0.3s, opacity 0.3s',
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-100px, -100px) translate(-50%, -50%)',
          willChange: 'transform',
          transition: 'width 0.3s, height 0.3s, border-color 0.3s, background-color 0.3s',
        }}
      />
    </>
  )
}

function updateCursorState(ring: HTMLDivElement, dot: HTMLDivElement, state: string) {
  switch (state) {
    case 'link':
      gsap.to(ring, {
        width: 48,
        height: 48,
        borderColor: 'rgba(0, 229, 255, 0.5)',
        backgroundColor: 'rgba(0, 229, 255, 0.08)',
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(dot, { opacity: 0.3, duration: 0.2 })
      break
    case 'drag':
      gsap.to(ring, {
        width: 56,
        height: 56,
        borderColor: 'rgba(0, 229, 255, 0.4)',
        backgroundColor: 'rgba(0, 229, 255, 0.05)',
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(dot, { opacity: 0.5, duration: 0.2 })
      break
    case 'view':
      gsap.to(ring, {
        width: 64,
        height: 64,
        borderColor: 'rgba(0, 229, 255, 0.5)',
        backgroundColor: 'rgba(0, 229, 255, 0.06)',
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(dot, { opacity: 0.3, duration: 0.2 })
      break
    default:
      gsap.to(ring, {
        width: 32,
        height: 32,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(dot, { opacity: 1, duration: 0.2 })
  }
}
