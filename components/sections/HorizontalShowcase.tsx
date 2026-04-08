"use client"

import { memo } from "react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  category: string
  price: number
  images?: string[]
  slug?: string
}

function HorizontalShowcaseComponent({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null

  return (
    <section
      className="py-[10vh] px-[5vw] overflow-x-auto"
      style={{ background: "var(--color-background)" }}
    >
      <div className="flex gap-[2vw] w-max items-center">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug || product.id}`}
            data-cursor="VIEW"
            className="flex-shrink-0 w-[35vw] h-[60vh] relative overflow-hidden group"
          >
            <div className="relative w-full h-full">
              {product.images && product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="35vw"
                  className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
                  loading="lazy"
                  quality={85}
                />
              ) : (
                <div className="w-full h-full bg-[var(--color-surface)] flex items-center justify-center">
                  <span className="text-6xl">💻</span>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[11px] tracking-[3px] uppercase opacity-50">
                {product.category}
              </p>
              <h3 className="text-2xl font-medium mt-2">{product.name}</h3>
              <p className="mt-2 opacity-70">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export const HorizontalShowcase = memo(HorizontalShowcaseComponent)
