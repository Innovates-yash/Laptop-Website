"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { gsap } from "gsap"

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const FRAGMENT_SHADER = `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseVelocity;
uniform float uScrollVelocity;
varying vec2 vUv;

// Simplex noise for organic distortion
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // SCROLL VELOCITY DISTORTION
  float scrollWarp = uScrollVelocity * 0.003;
  uv.y += scrollWarp * snoise(vec2(uv.x * 3.0, uTime * 0.5));
  
  // MOUSE PROXIMITY DISTORTION
  float dist = distance(uv, uMouse);
  float mouseInfluence = smoothstep(0.3, 0.0, dist);
  float noiseVal = snoise(uv * 4.0 + uTime * 0.3);
  uv += mouseInfluence * noiseVal * 0.008 * uMouseVelocity;
  
  // CHROMATIC ABERRATION
  float aberration = 0.002 + uMouseVelocity * 0.003 + abs(scrollWarp) * 0.5;
  vec2 rOffset = vec2(aberration, 0.0);
  vec2 bOffset = vec2(-aberration, 0.0);
  
  float r = texture2D(uTexture, uv + rOffset).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv + bOffset).b;
  float a = texture2D(uTexture, uv).a;
  
  // VIGNETTE
  vec2 vigUv = uv * 2.0 - 1.0;
  float vignette = 1.0 - dot(vigUv * 0.6, vigUv * 0.6);
  vignette = clamp(vignette, 0.0, 1.0);
  vignette = pow(vignette, 0.8);
  
  vec4 color = vec4(r, g, b, a);
  color.rgb *= (0.85 + vignette * 0.15);
  
  gl_FragColor = color;
}`

export function WebGLOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Disable on mobile - too expensive
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    if (isMobile) {
      canvas.style.display = "none"
      // Apply CSS filter instead on mobile
      document.body.style.filter = "contrast(1.02) saturate(1.05)"
      return () => {
        document.body.style.filter = ""
      }
    }

    // Renderer - overlaid on top of page, pointer-events: none
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: false 
    })
    
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5)
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    // Scene and camera for full-screen quad
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // Render target captures the full page as a texture
    const renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }
    )

    // Full-screen plane with our shader
    const geometry = new THREE.PlaneGeometry(2, 2)
    const uniforms = {
      uTexture: { value: renderTarget.texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVelocity: { value: 0 },
      uScrollVelocity: { value: 0 },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
    })

    scene.add(new THREE.Mesh(geometry, material))

    // Track mouse position and velocity
    let lastMouse = { x: 0.5, y: 0.5 }
    let targetMouse = { x: 0.5, y: 0.5 }
    let mouseVelocity = 0

    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / window.innerWidth
      targetMouse.y = 1 - e.clientY / window.innerHeight
      
      const dx = targetMouse.x - lastMouse.x
      const dy = targetMouse.y - lastMouse.y
      mouseVelocity = Math.sqrt(dx * dx + dy * dy) * 30
      lastMouse = { ...targetMouse }
    }

    // Track scroll velocity
    let scrollVelocity = 0
    let lastScrollY = 0

    const onScroll = () => {
      scrollVelocity = window.scrollY - lastScrollY
      lastScrollY = window.scrollY
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("scroll", onScroll)

    // Animation loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Lerp mouse (smooth trailing)
      uniforms.uMouse.value.x += (targetMouse.x - uniforms.uMouse.value.x) * 0.08
      uniforms.uMouse.value.y += (targetMouse.y - uniforms.uMouse.value.y) * 0.08

      // Decay velocity
      mouseVelocity *= 0.9
      scrollVelocity *= 0.85

      uniforms.uTime.value = elapsed
      uniforms.uMouseVelocity.value = mouseVelocity
      uniforms.uScrollVelocity.value = scrollVelocity

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderTarget.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      renderTarget.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9998,
        mixBlendMode: "normal",
        opacity: 0.92,
      }}
    />
  )
}
