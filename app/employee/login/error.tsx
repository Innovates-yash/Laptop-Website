'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="font-syne font-bold text-3xl mb-4">Something went wrong</h2>
        <p className="text-on-surface-variant mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="bg-primary-container text-on-primary px-8 py-3 font-mono text-xs tracking-widest hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  )
}
