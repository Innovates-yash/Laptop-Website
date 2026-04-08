'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import PageWrapper from '@/components/layout/PageWrapper'
import { useCartStore } from '@/store/cartStore'
import { gsap } from 'gsap'
import { ModelLoadingSkeleton } from '@/components/3d/ModelLoadingSkeleton'

const LaptopViewer360 = dynamic(() => import('@/components/3d/LaptopViewer360'), {
  ssr: false,
  loading: () => <ModelLoadingSkeleton />
})

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  category: string
  specs: any
  modelUrl: string | null
  images: string[]
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.product-viewer', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
      gsap.from('.product-name', {
        x: -40,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.3,
      })
      gsap.from('.product-price', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        delay: 0.5,
      })
      gsap.from('.spec-row', {
        opacity: 0,
        x: -20,
        duration: 0.4,
        stagger: 0.05,
        delay: 0.6,
        ease: 'power2.out',
      })
      gsap.from('.product-cta', {
        opacity: 0,
        scale: 0.85,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        delay: 0.8,
      })
    })

    return () => ctx.revert()
  }, [])

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      modelUrl: product.modelUrl || undefined,
    })

    gsap.to('.add-to-cart-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    })
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-surface">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: 3D Viewer */}
          <div className="product-viewer relative bg-surface-container-lowest flex items-center justify-center p-12">
            <LaptopViewer360 
              modelUrl={product.modelUrl || '/models/laptop-2.glb'}
              fallbackImage={product.images[0]}
            />
            <button
              onClick={() => setFullscreen(true)}
              className="absolute bottom-8 right-8 bg-primary-container text-on-primary px-6 py-3 font-mono text-xs tracking-widest hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">open_in_full</span>
              VIEW IN 360°
            </button>
          </div>

          {/* Right: Product Info */}
          <div className="product-info p-12 md:p-24 flex flex-col justify-center">
            <div className="font-mono text-primary tracking-wide-tech text-xs mb-4">
              // {product.category.toUpperCase()}
            </div>
            
            <h1 className="product-name font-syne font-extrabold text-5xl md:text-6xl mb-6">
              {product.name}
            </h1>

            <div className="product-price font-bebas text-5xl text-primary mb-8">
              ${product.price.toLocaleString()}
            </div>

            <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-12">
              {product.description}
            </p>

            {/* Specs Accordion */}
            <div className="mb-12 space-y-4">
              <details className="glass-panel p-6 group">
                <summary className="font-mono text-xs tracking-widest cursor-pointer flex justify-between items-center">
                  SPECIFICATIONS
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="mt-6 space-y-3 font-body text-sm">
                  {product.specs && Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="spec-row flex justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface-variant">{key}</span>
                      <span className="text-on-surface font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-6 items-center mb-8">
              <div className="product-cta flex items-center border border-outline-variant">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="px-6 py-3 font-mono text-sm border-x border-outline-variant">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="product-cta add-to-cart-btn flex-1 bg-primary-container text-on-primary px-8 py-4 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                ADD TO CART
              </button>
            </div>

            <p className="font-mono text-xs text-on-surface-variant">
              {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
            </p>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-surface/95 backdrop-blur-xl">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-8 right-8 z-10 w-12 h-12 border border-outline-variant hover:border-primary hover:bg-primary-container/10 transition-all flex items-center justify-center"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="w-full h-full p-12">
            <LaptopViewer360 
              modelUrl={product.modelUrl || '/models/laptop-2.glb'}
              fallbackImage={product.images[0]}
            />
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
