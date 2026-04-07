'use client'

import { Suspense, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Procedural Laptop Model
function ProceduralLaptop() {
  const groupRef = useRef<THREE.Group>(null)
  const screenRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (!groupRef.current) return

    // Check for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Idle floating animation
    gsap.to(groupRef.current.position, {
      y: 0.12,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })

    gsap.to(groupRef.current.rotation, {
      y: Math.PI / 22.5, // ~8 degrees
      duration: 5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  }, [])

  // Base (keyboard section)
  const baseGeometry = useMemo(() => new THREE.BoxGeometry(2, 0.08, 1.4), [])
  const baseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1d28',
        metalness: 0.9,
        roughness: 0.15,
      }),
    []
  )

  // Screen
  const screenGeometry = useMemo(() => new THREE.BoxGeometry(2, 1.3, 0.05), [])
  const screenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0c14',
        metalness: 0.8,
        roughness: 0.2,
      }),
    []
  )

  // Screen display (emissive)
  const displayGeometry = useMemo(() => new THREE.PlaneGeometry(1.85, 1.15), [])
  const displayMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00e5ff',
        emissive: '#00e5ff',
        emissiveIntensity: 0.6,
      }),
    []
  )

  useEffect(() => {
    return () => {
      baseGeometry.dispose()
      baseMaterial.dispose()
      screenGeometry.dispose()
      screenMaterial.dispose()
      displayGeometry.dispose()
      displayMaterial.dispose()
    }
  }, [baseGeometry, baseMaterial, screenGeometry, screenMaterial, displayGeometry, displayMaterial])

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 6, 0]}>
      {/* Base */}
      <mesh geometry={baseGeometry} material={baseMaterial} position={[0, 0, 0]} castShadow />

      {/* Screen */}
      <group ref={screenRef} position={[0, 0.7, -0.65]} rotation={[-Math.PI / 12, 0, 0]}>
        <mesh geometry={screenGeometry} material={screenMaterial} castShadow />
        {/* Display */}
        <mesh geometry={displayGeometry} material={displayMaterial} position={[0, 0, 0.026]} />
      </group>

      {/* Keyboard detail */}
      <mesh position={[0, 0.041, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 0.9]} />
        <meshStandardMaterial color="#0f1118" roughness={0.8} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.041, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color="#1a1d28" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  )
}

// Particle Field
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const particleCount = isMobile ? 300 : 1200
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [particleCount])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      // Drift upward
      positions[i * 3 + 1] += 0.0001

      // Wrap around
      if (positions[i * 3 + 1] > 10) {
        positions[i * 3 + 1] = -10
      }

      // Mouse repel effect
      const particleX = positions[i * 3]
      const particleY = positions[i * 3 + 1]
      const dx = particleX - mouseRef.current.x * 10
      const dy = particleY - mouseRef.current.y * 10
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 2) {
        const force = (2 - distance) / 2
        positions[i * 3] += (dx / distance) * force * 0.01
        positions[i * 3 + 1] += (dy / distance) * force * 0.01
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#00e5ff" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

// Scene Component
function Scene() {
  const { camera } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current || typeof window === 'undefined') return

    // Check for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Scroll animation
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (groupRef.current) {
            groupRef.current.position.x = self.progress * 3
            groupRef.current.scale.setScalar(1 - self.progress * 0.4)
            groupRef.current.rotation.y = -Math.PI / 6 + self.progress * Math.PI / 4
          }
        },
      })
    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <group ref={groupRef}>
      <ProceduralLaptop />
      <ContactShadows
        position={[0, -0.8, 0]}
        opacity={0.4}
        scale={3}
        blur={2.5}
        far={4}
        resolution={256}
      />
    </group>
  )
}

export default function HeroLaptop() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="absolute right-0 top-0 w-full md:w-1/2 h-full pointer-events-none">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        camera={{ position: [0, 0.5, 4], fov: 45 }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <Environment preset="studio" />
          <ambientLight intensity={0.3} />
          <spotLight
            position={[5, 5, 5]}
            angle={0.3}
            penumbra={0.5}
            intensity={2}
            castShadow
            color="#ffffff"
          />
          <spotLight
            position={[-3, 2, -3]}
            angle={0.4}
            penumbra={0.5}
            intensity={0.8}
            color="#00e5ff"
          />

          {/* Scene */}
          <Scene />

          {/* Particles */}
          {!prefersReduced && <ParticleField />}
        </Suspense>
      </Canvas>
    </div>
  )
}
