export default function Loading() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="py-20 px-12 md:px-24 border-b border-outline-variant/20">
        <div className="h-4 w-48 bg-surface-container animate-pulse mb-4"></div>
        <div className="h-16 w-96 bg-surface-container animate-pulse mb-6"></div>
        <div className="h-6 w-full max-w-2xl bg-surface-container animate-pulse"></div>
      </div>
      
      <div className="py-16 px-12 md:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-container-low border border-outline-variant/30">
              <div className="aspect-square bg-surface-container animate-pulse"></div>
              <div className="p-8 space-y-4">
                <div className="h-3 w-24 bg-surface-container animate-pulse"></div>
                <div className="h-6 w-full bg-surface-container animate-pulse"></div>
                <div className="h-8 w-32 bg-surface-container animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
