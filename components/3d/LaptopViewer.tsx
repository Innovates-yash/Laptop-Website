'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { Group } from 'three'
import gsap from 'gsap'
import ProceduralLaptop from './ProceduralLaptop'

interface LaptopModelProps {
  modelUrl: string
  onHover: (hovered: boolean) => void
  onClick: () => void
  autoRotate: boolean
}

function LaptopModel({ modelUrl, onHover, onClick, autoRotate }: LaptopModelProps) {
  const groupRef = useRef<Group>(null)
  
  // Try to load GLB, fallback to procedural
  let scene
  try {
    const gltf = useGLTF(modelUrl)
    scene = gltf.scene
  } catch (error) {
    scene = null
  }

  // Auto-rotate when not hovered
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  const handleClick = () => {
    if (groupRef.current) {
      // Expand animation - laptop lid opens
      gsap.timeline()
        .to(groupRef.current.rotation, {
          x: -0.3,
          duration: 0.8,
          ease: 'power2.out',
        })
        .to(groupRef.current.scale, {
          x: 1.1,
          y: 1.1,
          z: 1.1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        }, '<')
    }
    onClick()
  }

  return (
    <group
      ref={groupRef}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
      onClick={handleClick}
    >
      {scene ? (
        <primitive object={scene} scale={1.5} />
      ) : (
        <ProceduralLaptop />
      )}
    </group>
  )
}

interface LaptopViewerProps {
  modelUrl?: string
  onClick?: () => void
}

export default function LaptopViewer({ 
  modelUrl = '/models/laptop-default.glb',
  onClick = () => {}
}: LaptopViewerProps) {
  const [hovered, setHovered] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered)
    setAutoRotate(!isHovered)
  }

  return (
    <div className="w-full h-full" style={{ cursor: hovered ? 'pointer' : 'grab' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <spotLight
          position={[-10, -10, -10]}
          angle={0.15}
          penumbra={1}
          intensity={0.5}
        />

        {/* Environment */}
        <Environment preset="studio" />

        {/* Laptop Model */}
        <LaptopModel
          modelUrl={modelUrl}
          onHover={handleHover}
          onClick={onClick}
          autoRotate={autoRotate}
        />

        {/* Ground reflection */}
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.4}
          scale={10}
          blur={2.5}
          far={4}
        />

        {/* Orbit Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}
