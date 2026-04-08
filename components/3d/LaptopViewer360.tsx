"use client"

import { useRef, Suspense, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import {
  useGLTF,
  Environment,
  ContactShadows,
  OrbitControls,
  Html,
} from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"
import { ModelErrorBoundary } from "./ModelErrorBoundary"
import { ModelLoadingSkeleton } from "./ModelLoadingSkeleton"

if (typeof window !== 'undefined') {
  useGLTF.setDecoderPath("/node_modules/three/examples/jsm/libs/draco/")
}

function ProductModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(), [scene])
  return <primitive object={cloned} scale={1.1} position={[0, -0.3, 0]} />
}

interface Props {
  modelUrl: string
  fallbackImage?: string
}

export default function LaptopViewer360({ modelUrl, fallbackImage }: Props) {
  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      <ModelErrorBoundary fallbackImage={fallbackImage}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.5, 3.5], fov: 42 }}
          shadows
          performance={{ min: 0.5 }}
        >
          <Suspense
            fallback={
              <Html center fullscreen>
                <ModelLoadingSkeleton />
              </Html>
            }
          >
            <Environment files="/hdri/studio_kontrast_04_4k.hdr" />
            <ambientLight intensity={0.2} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={0.8}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight
              position={[-4, 2, -3]}
              intensity={0.4}
              color="#4466ff"
            />
            <ProductModel url={modelUrl} />
            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.35}
              scale={8}
              blur={2.5}
              far={4}
            />
            <OrbitControls
              enableZoom={true}
              minDistance={2}
              maxDistance={6}
              enablePan={false}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.8}
              autoRotate={true}
              autoRotateSpeed={1.2}
            />
            <EffectComposer>
              <Bloom luminanceThreshold={0.85} intensity={0.5} mipmapBlur />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </ModelErrorBoundary>
      
      {/* Drag hint overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "10px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: 16 }}>↻</span>
        Drag to rotate
      </div>
    </div>
  )
}
