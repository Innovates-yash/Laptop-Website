"use client"

import { useEffect, useState } from 'react'
import HeroLaptop from './HeroLaptop'

export default function Hero3DWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: "rgba(255,255,255,0.5)",
        fontSize: "14px"
      }}>
        Loading 3D Model...
      </div>
    )
  }

  return <HeroLaptop />
}
