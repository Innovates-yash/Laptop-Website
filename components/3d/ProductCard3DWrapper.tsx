"use client"

import { useEffect, useState } from 'react'
import ProductCard3D from './ProductCard3D'

interface Props {
  name: string
  price: number
  category: string
  modelUrl?: string
  slug?: string
  image?: string
}

export default function ProductCard3DWrapper(props: Props) {
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

  return <ProductCard3D {...props} />
}
