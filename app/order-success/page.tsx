'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PageWrapper from '@/components/layout/PageWrapper'
import Link from 'next/link'
import gsap from 'gsap'

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      name: string
      category: string
    }
  }>
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
    } else {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    // Animate success elements
    gsap.from('.success-icon', {
      scale: 0,
      rotation: -180,
      duration: 0.8,
      ease: 'back.out',
      delay: 0.2,
    })

    gsap.from('.success-content', {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.5,
    })

    // Confetti effect (simple version)
    createConfetti()
  }, [])

  const fetchOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  const createConfetti = () => {
    const colors = ['#00e5ff', '#b3c5ff', '#aeffbf']
    const confettiCount = 50

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        opacity: 0.8;
        z-index: 9999;
      `
      document.body.appendChild(confetti)

      gsap.to(confetti, {
        y: window.innerHeight + 100,
        x: `+=${Math.random() * 200 - 100}`,
        rotation: Math.random() * 360,
        duration: 2 + Math.random() * 2,
        ease: 'power1.in',
        onComplete: () => confetti.remove(),
      })
    }
  }

  const getDeliveryEstimate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 3) // 3 days from now
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-mono text-sm text-on-surface-variant">Loading order details...</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!orderId || !order) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
            <h2 className="font-syne font-bold text-3xl mb-4">Order Not Found</h2>
            <p className="font-body text-on-surface-variant mb-8">
              We couldn't find your order. Please check your email for confirmation.
            </p>
            <Link href="/products">
              <button className="bg-primary-container text-on-primary px-10 py-5 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all">
                CONTINUE SHOPPING
              </button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-surface py-32 px-12 md:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-16">
            <div className="success-icon w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-tertiary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-on-tertiary-container">
                  check_circle
                </span>
              </div>
              <div className="absolute inset-0 border-4 border-tertiary-container rounded-full animate-ping opacity-20"></div>
            </div>

            <h1 className="success-content font-syne font-extrabold text-5xl md:text-7xl mb-6">
              ORDER CONFIRMED!
            </h1>
            <p className="success-content font-body text-xl text-on-surface-variant mb-4">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <p className="success-content font-mono text-sm text-primary">
              Order ID: #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Order Details */}
          <div className="success-content glass-panel p-12 mb-8">
            <h2 className="font-mono text-xs tracking-widest text-primary mb-8">
              ORDER DETAILS
            </h2>

            <div className="space-y-6 mb-8 pb-8 border-b border-outline-variant/20">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-syne font-bold text-xl mb-1">
                      {item.product.name}
                    </h3>
                    <p className="font-mono text-xs text-on-surface-variant">
                      {item.product.category} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bebas text-3xl text-primary">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-mono text-sm tracking-widest">TOTAL PAID</span>
              <span className="font-bebas text-5xl text-primary">
                ${order.total.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-surface-container-low border border-outline-variant/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <h4 className="font-mono text-xs tracking-widest">DELIVERY ESTIMATE</h4>
                </div>
                <p className="font-body text-on-surface">
                  Expected by {getDeliveryEstimate()}
                </p>
              </div>

              <div className="p-6 bg-surface-container-low border border-outline-variant/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <h4 className="font-mono text-xs tracking-widest">CONFIRMATION EMAIL</h4>
                </div>
                <p className="font-body text-on-surface">
                  Sent to your registered email
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="success-content flex flex-col md:flex-row gap-6 justify-center">
            <Link href="/products">
              <button className="bg-primary-container text-on-primary px-10 py-5 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all">
                CONTINUE SHOPPING
              </button>
            </Link>
            <button
              onClick={() => window.print()}
              className="border border-outline-variant text-on-surface px-10 py-5 font-mono tracking-widest text-xs hover:border-primary hover:text-primary transition-all"
            >
              PRINT RECEIPT
            </button>
          </div>

          {/* Support Info */}
          <div className="success-content text-center mt-16 pt-16 border-t border-outline-variant/20">
            <p className="font-body text-on-surface-variant mb-4">
              Need help with your order?
            </p>
            <Link href="/contact">
              <button className="text-primary hover:text-primary-fixed-dim transition-colors font-mono text-sm tracking-widest">
                CONTACT SUPPORT →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
