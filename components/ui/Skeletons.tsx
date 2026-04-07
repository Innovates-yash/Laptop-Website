export function ProductCardSkeleton() {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded overflow-hidden">
      <div className="aspect-square bg-surface-container shimmer" />
      <div className="p-8 space-y-4">
        <div className="h-3 w-20 bg-surface-container shimmer rounded" />
        <div className="h-6 w-3/4 bg-surface-container shimmer rounded" />
        <div className="h-8 w-1/2 bg-surface-container shimmer rounded" />
      </div>
    </div>
  )
}

export function ModelSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface-container-low rounded">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-xs text-on-surface-variant">Loading 3D...</p>
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen p-12 space-y-8">
      <div className="h-12 w-64 bg-surface-container shimmer rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </div>
  )
}

export function ProductImageFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
      <span className="text-6xl">💻</span>
    </div>
  )
}
