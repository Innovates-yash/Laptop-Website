'use client'

export default function ModelSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface-container-low rounded">
      <div className="relative w-32 h-32">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent shimmer rounded" />
        
        {/* Laptop icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-outline animate-pulse">
            laptop
          </span>
        </div>
      </div>
    </div>
  )
}
