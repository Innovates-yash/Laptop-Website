'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <span className="material-symbols-outlined text-6xl text-error">error</span>
          <h2 className="font-syne font-bold text-4xl">Something Went Wrong</h2>
          <p className="font-body text-on-surface-variant">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>
        <button
          onClick={reset}
          className="bg-primary-container text-on-primary px-8 py-4 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  )
}
