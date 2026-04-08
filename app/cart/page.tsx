'use client'

import { useEffect, useRef, useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const RazorpayButton = dynamic(() => import('@/components/payment/RazorpayButton'), { ssr: false })
const StripeWrapper = dynamic(() => import('@/components/payment/StripeWrapper'), { ssr: false })

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe'>('razorpay')
  const containerRef = useRef<HTMLDivElement>(null)

  const safeItems = items ?? []

  // GSAP entrance animation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const init = async () => {
      const { gsap } = await import('gsap')

      gsap.from('.cart-header', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      })

      gsap.from('.cart-item', {
        opacity: 0,
        x: -40,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2,
      })

      gsap.from('.cart-summary', {
        opacity: 0,
        x: 40,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.3,
      })
    }

    init()
  }, [])

  if (safeItems.length === 0) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="text-center py-32">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 border-2 border-outline-variant/20 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-outline">
                  shopping_cart
                </span>
              </div>
            </div>
            <h2 className="font-syne font-bold text-4xl mb-4">Your Cart is Empty</h2>
            <p className="font-body text-on-surface-variant mb-8 max-w-md mx-auto">
              Looks like you haven't added any products yet. Explore our collection of high-performance laptops.
            </p>
            <Link href="/products">
              <button className="magnetic-btn bg-primary-container text-on-primary px-10 py-5 font-mono font-bold tracking-widest text-xs transition-all">
                BROWSE PRODUCTS
              </button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const totalAmount = getTotalPrice() * 1.1

  return (
    <PageWrapper>
      <div ref={containerRef} className="min-h-screen bg-surface">
        {/* Header */}
        <section className="cart-header py-20 px-12 md:px-24 border-b border-outline-variant/20">
          <div className="font-mono text-primary tracking-wide-tech text-xs mb-4">
            // YOUR SELECTION
          </div>
          <h1 className="font-syne font-extrabold text-6xl md:text-8xl mb-6">
            SHOPPING CART
          </h1>
          <p className="font-body text-lg text-on-surface-variant">
            {safeItems.length} {safeItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </section>

        {/* Cart Content */}
        <section className="py-16 px-12 md:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  className="cart-item glass-panel p-8 flex flex-col md:flex-row gap-8 group hover:border-primary/20 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="w-full md:w-48 h-48 bg-surface-container-low border border-outline-variant/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-outline">
                        laptop
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-syne font-bold text-2xl mb-2 group-hover:text-primary transition-colors duration-300">{item.name}</h3>
                    <p className="text-3xl text-primary font-semibold mb-6">
                      ${item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-outline-variant/30">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 hover:bg-surface-container-low transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="px-6 py-2 font-mono text-sm border-x border-outline-variant/30">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 hover:bg-surface-container-low transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-error hover:text-error/80 transition-colors flex items-center gap-2 font-mono text-xs"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        REMOVE
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-mono text-xs text-on-surface-variant mb-2">SUBTOTAL</p>
                    <p className="text-4xl text-primary font-semibold">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="border border-error/50 text-error px-6 py-3 font-mono tracking-widest text-xs hover:bg-error hover:text-white transition-all duration-300"
              >
                CLEAR CART
              </button>
            </div>

            {/* Order Summary & Payment */}
            <div className="lg:col-span-1">
              <div className="cart-summary glass-panel p-8 sticky top-32 space-y-8">
                <h3 className="font-mono text-xs tracking-widest text-primary">
                  ORDER SUMMARY
                </h3>

                <div className="space-y-4 pb-8 border-b border-outline-variant/20">
                  <div className="flex justify-between font-body">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span className="text-on-surface">${getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-body">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span className="text-primary font-mono text-sm">FREE</span>
                  </div>
                  <div className="flex justify-between font-body">
                    <span className="text-on-surface-variant">Tax (estimated)</span>
                    <span className="text-on-surface">${(getTotalPrice() * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between pb-8 border-b border-outline-variant/20">
                  <span className="font-mono text-sm tracking-widest">TOTAL</span>
                  <span className="text-4xl text-primary font-bold">
                    ${totalAmount.toLocaleString()}
                  </span>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <h4 className="font-mono text-xs tracking-widest text-on-surface mb-4">
                    PAYMENT METHOD
                  </h4>
                  <div className="space-y-3">
                    {(['razorpay', 'stripe'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`w-full p-4 border transition-all text-left ${
                          paymentMethod === method
                            ? 'border-primary bg-primary/5'
                            : 'border-outline-variant/30 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method ? 'border-primary' : 'border-outline-variant'
                          }`}>
                            {paymentMethod === method && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="font-mono text-xs tracking-widest">
                            {method.toUpperCase()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Button */}
                <div>
                  {paymentMethod === 'razorpay' ? (
                    <RazorpayButton amount={totalAmount} />
                  ) : (
                    <StripeWrapper amount={totalAmount} />
                  )}
                </div>

                <Link href="/products">
                  <button className="w-full border border-outline-variant/30 text-on-surface px-8 py-4 font-mono tracking-widest text-xs hover:border-primary hover:text-primary transition-all duration-300">
                    CONTINUE SHOPPING
                  </button>
                </Link>

                <div className="pt-8 border-t border-outline-variant/20 space-y-3">
                  <div className="flex items-center gap-3 text-on-surface-variant text-sm">
                    <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
                    <span className="font-body">Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant text-sm">
                    <span className="material-symbols-outlined text-sm text-primary">local_shipping</span>
                    <span className="font-body">Free shipping on all orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
