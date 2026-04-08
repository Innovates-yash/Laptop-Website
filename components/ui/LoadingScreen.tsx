'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Only show on first visit per session
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem('voltex-loading-shown')
      if (shown) {
        setHasShown(true)
        setIsComplete(true)
        return
      }
    }

    // Simulate loading
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        // Accelerating progress
        const increment = prev < 30 ? 3 : prev < 70 ? 4 : prev < 90 ? 2 : 1
        return Math.min(prev + increment, 100)
      })
    }, 25)

    return () => clearInterval(progressInterval)
  }, [])

  useEffect(() => {
    if (progress === 100 && !hasShown) {
      setTimeout(() => {
        setIsComplete(true)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('voltex-loading-shown', 'true')
          // Add custom cursor class after loading
          document.body.classList.add('custom-cursor-active')
        }
      }, 400)
    }
  }, [progress, hasShown])

  // Add custom cursor class if already loaded
  useEffect(() => {
    if (hasShown && typeof window !== 'undefined') {
      document.body.classList.add('custom-cursor-active')
    }
  }, [hasShown])

  if (hasShown) return null

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] bg-surface flex flex-col items-center justify-center"
        >
          {/* Logo Animation */}
          <div className="mb-12">
            <motion.div className="flex gap-1">
              {'VOLTEX'.split('').map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-syne font-extrabold text-6xl md:text-8xl text-primary inline-block"
                  style={{ textShadow: '0 0 40px rgba(0, 229, 255, 0.3)' }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="w-80 max-w-[90vw]">
            <div className="h-[2px] bg-surface-container-high overflow-hidden mb-6">
              <motion.div
                className="h-full"
                style={{
                  background: 'linear-gradient(90deg, var(--color-primary-container), var(--color-primary-fixed-dim))',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Progress text */}
            <div className="flex justify-between items-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.5 }}
                className="font-mono text-[10px] tracking-[4px] uppercase text-on-surface-variant"
              >
                {progress < 30 ? 'INITIALISING...' : progress < 70 ? 'LOADING ASSETS...' : progress < 100 ? 'ALMOST READY...' : 'READY'}
              </motion.p>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="font-mono text-xs text-primary"
              >
                {progress}%
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
