'use client'

import { useRef } from 'react'
import { Group } from 'three'

/**
 * Procedural Laptop - A realistic geometric laptop
 * Used when no GLB model is available
 */
export default function ProceduralLaptop() {
  const groupRef = useRef<Group>(null)

  return (
    <group ref={groupRef} scale={0.8}>
      {/* Laptop Base - Bottom */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.15, 2]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Keyboard area with keys */}
      <mesh position={[0, 0.01, 0.15]} castShadow>
        <boxGeometry args={[2.7, 0.03, 1.6]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>

      {/* Individual key highlights */}
      {Array.from({ length: 60 }).map((_, i) => {
        const row = Math.floor(i / 12)
        const col = i % 12
        return (
          <mesh
            key={i}
            position={[
              -1.2 + col * 0.22,
              0.03,
              0.6 - row * 0.22
            ]}
            castShadow
          >
            <boxGeometry args={[0.18, 0.02, 0.18]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        )
      })}

      {/* Trackpad */}
      <mesh position={[0, 0.03, -0.6]} castShadow>
        <boxGeometry args={[0.9, 0.02, 0.6]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Screen Back */}
      <mesh position={[0, 1, -0.95]} rotation={[-0.15, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.8, 0.08]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Screen Bezel */}
      <mesh position={[0, 1, -0.91]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[2.9, 1.7, 0.02]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Screen Display - Glowing */}
      <mesh position={[0, 1, -0.90]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[2.7, 1.5, 0.01]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={0.5}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Webcam */}
      <mesh position={[0, 1.85, -0.91]} rotation={[-0.15, 0, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Logo on screen bezel */}
      <mesh position={[0, 1.75, -0.91]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.01]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Hinge */}
      <mesh position={[0, 0.08, -0.95]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 32]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}
