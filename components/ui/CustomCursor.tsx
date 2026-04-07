'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [cursorText, setCursorText] = useState('')
  const [cursorState, setCursorState] = useState<'default' | 'link' | 'drag' | 'view'>('default')
  const mousePos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  // Check if touch device
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchDevices > 0)

  useEffect(() => {
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      // Move dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check for links and buttons
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setCursorState('link')
        setCursorText('CLICK')
      }
      // Check for 3D canvas
      else if (target.tagName === 'CANVAS') {
        setCursorState('drag')
        setCursorText('DRAG')
      }
      // Check for product cards
      else if (target.closest('[data-product-card]')) {
        setCursorState('view')
        setCursorText('VIEW')
      } else {
        setCursorState('default')
        setCursorText('')
      }
    }

    const handleMouseDown = () => {
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          scale: 1.5,
          duration: 0.1,
          ease: 'power2.out',
        })
      }
    }

    const handleMouseUp = () => {
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          scale: 1,
          duration: 0.1,
          ease: 'power2.out',
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    // Animate ring with lag
    const animateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`
      }

      requestAnimationFrame(animateRing)
    }

    animateRing()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isTouchDevice])

  // Animate ring based on state
  useEffect(() => {
    if (!ringRef.current || isTouchDevice) return

    const ring = ringRef.current

    switch (cursorState) {
      case 'link':
        gsap.to(ring, {
          width: 48,
          height: 48,
          backgroundColor: 'rgba(0, 229, 255, 0.2)',
          duration: 0.3,
          ease: 'power2.out',
        })
        break
      case 'drag':
        gsap.to(ring, {
          width: 48,
          height: 48,
          backgroundColor: 'rgba(0, 229, 255, 0.15)',
          duration: 0.3,
          ease: 'power2.out',
        })
        break
      case 'view':
        gsap.to(ring, {
          width: 64,
          height: 64,
          backgroundColor: 'rgba(0, 229, 255, 0.15)',
          duration: 0.3,
          ease: 'power2.out',
        })
        break
      default:
        gsap.to(ring, {
          width: 32,
          height: 32,
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: 'power2.out',
        })
    }
  }, [cursorState, isTouchDevice])

  if (isTouchDevice) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
          opacity: cursorState === 'link' ? 0 : 1,
          transition: 'opacity 0.3s',
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border-2 border-white rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        {cursorText && (
          <span className="font-mono text-[10px] text-white tracking-widest">{cursorText}</span>
        )}
        {cursorState === 'drag' && !cursorText && (
          <span className="text-white text-sm">↻</span>
        )}
      </div>
    </>
  )
}
