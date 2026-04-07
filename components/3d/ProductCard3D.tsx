'use client'

import { useRef, useState, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCanvasStore } from '@/store/canvasStore'
import ModelSkeleton from '@/components/ui/ModelSkeleton'

// Mini Laptop Model
function MiniLaptop({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const haloRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // Auto-rotate
    const speed = hovered ? 0.03 : 0.005
    groupRef.current.rotation.y += speed

    // Halo pulse
    if (haloRef.current) {
      haloRef.current.material.opacity = hovered ? 0.6 : 0
    }
  })

  useEffect(() => {
    if (!groupRef.current) return

    // Scale animation on hover
    gsap.to(groupRef.current.scale, {
      x: hovered ? 1.08 : 1,
      y: hovered ? 1.08 : 1,
      z: hovered ? 1.08 : 1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [hovered])

  // Geometries
  const baseGeometry = useMemo(() => new THREE.BoxGeometry(0.8, 0.04, 0.6), [])
  const screenGeometry = useMemo(() => new THREE.BoxGeometry(0.8, 0.55, 0.02), [])
  const displayGeometry = useMemo(() => new THREE.PlaneGeometry(0.72, 0.48), [])

  // Materials
  const baseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1d28',
        metalness: 0.9,
        roughness: 0.15,
      }),
    []
  )

  const screenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0c14',
        metalness: 0.8,
        roughness: 0.2,
      }),
    []
  )

  const displayMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00e5ff',
        emissive: '#00e5ff',
        emissiveIntensity: 0.4,
      }),
    []
  )

  useEffect(() => {
    return () => {
      baseGeometry.dispose()
      screenGeometry.dispose()
      displayGeometry.dispose()
      baseMaterial.dispose()
      screenMaterial.dispose()
      displayMaterial.dispose()
    }
  }, [baseGeometry, screenGeometry, displayGeometry, baseMaterial, screenMaterial, displayMaterial])

  return (
    <>
      <group ref={groupRef} rotation={[0, Math.PI / 4, 0]}>
        {/* Base */}
        <mesh geometry={baseGeometry} material={baseMaterial} position={[0, 0, 0]} />

        {/* Screen */}
        <group position={[0, 0.3, -0.28]} rotation={[-Math.PI / 12, 0, 0]}>
          <mesh geometry={screenGeometry} material={screenMaterial} />
          <mesh geometry={displayGeometry} material={displayMaterial} position={[0, 0, 0.011]} />
        </group>
      </group>

      {/* Halo ring */}
      <mesh ref={haloRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

interface ProductCard3DProps {
  modelUrl?: string
  name: string
  price: number
  category: string
  badge?: string
  onClick?: () => void
}

export default function ProductCard3D({
  modelUrl = '/models/laptop-default.glb',
  name,
  price,
  category,
  badge,
  onClick,
}: ProductCard3DProps) {
  const [hovered, setHovered] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { incrementCanvas, decrementCanvas, canRenderCanvas } = useCanvasStore()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Intersection Observer
  useEffect(() => {
    if (!cardRef.current || isMobile) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(cardRef.current)

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [isMobile])

  // Canvas rendering control
  useEffect(() => {
    if (isInView && canRenderCanvas && canRenderCanvas() && !isMobile) {
      setShouldRender(true)
      incrementCanvas()
      return () => {
        decrementCanvas()
      }
    } else {
      setShouldRender(false)
    }
  }, [isInView, isMobile, canRenderCanvas, incrementCanvas, decrementCanvas])

  return (
    <div
      ref={cardRef}
      data-product-card
      className={`group bg-surface-container-low border border-outline-variant/30 transition-all duration-500 cursor-pointer ${
        hovered ? 'border-primary/50 shadow-[0_0_20px_rgba(0,229,255,0.2)]' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* 3D Canvas or Static Image */}
      <div className="relative overflow-hidden aspect-square bg-surface-container flex items-center justify-center">
        {badge && (
          <div className="absolute top-4 left-4 bg-primary-container text-on-primary px-3 py-1 font-mono text-[9px] tracking-widest z-10">
            {badge}
          </div>
        )}

        {isMobile || !shouldRender ? (
          // Mobile: Static image
          <div className="text-6xl">💻</div>
        ) : (
          // Desktop: 3D Canvas
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.3, 1.5], fov: 50 }}
            style={{ width: '100%', height: '220px' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 2, 2]} intensity={1} />
              <MiniLaptop hovered={hovered} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Product Info */}
      <div className="p-8 space-y-4 border-t border-outline-variant/20">
        <div className="font-mono text-[10px] tracking-widest text-primary uppercase">
          {category}
        </div>
        <h4 className="font-syne font-bold text-xl">{name}</h4>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-bebas text-3xl tracking-wider text-primary">
              ${price.toLocaleString()}
            </span>
          </div>
          <button className="w-10 h-10 border border-outline-variant hover:bg-primary-container hover:text-on-primary hover:border-primary-container transition-all flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  )
}
