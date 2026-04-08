import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  priority = false,
  className,
  quality = 85,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-surface-container-low animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        loading={priority ? 'eager' : 'lazy'}
        onLoadingComplete={() => setIsLoading(false)}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className || ''}`}
      />
    </div>
  )
}
