'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete?: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const messages = [
    'Initialising 3D Engine...',
    'Loading Models...',
    'Almost Ready...',
  ]

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 30)

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setIsComplete(true)
        setTimeout(() => {
          onComplete?.()
        }, 500)
      }, 300)
    }
  }, [progress, onComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100vh', transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] bg-surface flex flex-col items-center justify-center"
        >
          {/* Logo Animation */}
          <div className="mb-12">
            <motion.div className="flex gap-1">
              {'VOLTEX'.split('').map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: 'easeOut',
                  }}
                  className="font-syne font-extrabold text-6xl md:text-8xl text-primary"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="w-80 max-w-[90vw]">
            <div className="h-1 bg-surface-container-low rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary-fixed-dim"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Loading Message */}
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-xs tracking-widest text-on-surface-variant text-center"
            >
              {messages[messageIndex]}
            </motion.p>
          </div>

          {/* Percentage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 font-bebas text-4xl text-primary"
          >
            {progress}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
