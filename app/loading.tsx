export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-mono text-sm tracking-widest text-on-surface-variant">
          LOADING...
        </p>
      </div>
    </div>
  )
}
