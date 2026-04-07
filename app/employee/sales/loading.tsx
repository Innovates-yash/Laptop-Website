export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full py-32">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-mono text-sm text-on-surface-variant">Loading sales...</p>
      </div>
    </div>
  )
}
