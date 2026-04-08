"use client"

import { useEffect, useState } from 'react'
import ProductCard3D from './ProductCard3D'

interface Props {
  isHovered: boolean
  fallbackImage: string
}

export default function ProductCard3DWrapper({ isHovered, fallbackImage }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ 
        width: "100%", 
        height: "220px",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.3)"
      }}>
        Loading...
      </div>
    )
  }

  return <ProductCard3D isHovered={isHovered} fallbackImage={fallbackImage} />
}
