'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayButtonProps {
  amount: number
  onSuccess?: (orderId: string) => void
  onError?: (error: any) => void
}

export default function RazorpayButton({
  amount,
  onSuccess,
  onError,
}: RazorpayButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!session?.user) {
      router.push('/api/auth/signin')
      return
    }

    if (!scriptLoaded) {
      alert('Payment system is loading. Please try again.')
      return
    }

    setLoading(true)

    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          productIds: items.map((item) => item.productId),
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Voltex',
        description: 'Premium Laptop Purchase',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch(
              '/api/payment/razorpay/verify',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  userId: session.user.id,
                  items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                  })),
                  total: amount,
                }),
              }
            )

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              // Clear cart
              clearCart()
              
              // Redirect to success page
              if (onSuccess) {
                onSuccess(verifyData.orderId)
              } else {
                router.push(`/order-success?orderId=${verifyData.orderId}`)
              }
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Verification error:', error)
            if (onError) {
              onError(error)
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          }
        },
        prefill: {
          name: session.user.name || '',
          email: session.user.email || '',
        },
        theme: {
          color: '#00e5ff',
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      if (onError) {
        onError(error)
      } else {
        alert('Failed to initiate payment. Please try again.')
      }
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !scriptLoaded}
      className="w-full bg-primary-container text-on-primary px-8 py-5 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
          PROCESSING...
        </>
      ) : (
        <>
          <span className="material-symbols-outlined">lock</span>
          PAY WITH RAZORPAY
        </>
      )}
    </button>
  )
}
