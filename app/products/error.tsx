'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="text-center space-y-8">
        <span className="material-symbols-outlined text-6xl text-error">error</span>
        <h2 className="font-syne font-bold text-4xl">Failed to Load Products</h2>
        <p className="font-body text-on-surface-variant max-w-md">
          {error.message || 'Unable to fetch products at this time'}
        </p>
        <button
          onClick={reset}
          className="bg-primary-container text-on-primary px-8 py-4 font-mono font-bold tracking-widest text-xs"
        >
          RETRY
        </button>
      </div>
    </div>
  )
}
