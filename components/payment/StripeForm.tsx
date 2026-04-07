'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

interface StripeFormProps {
  amount: number
  onSuccess?: (orderId: string) => void
  onError?: (error: any) => void
}

export default function StripeForm({
  amount,
  onSuccess,
  onError,
}: StripeFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !session?.user) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        setMessage(error.message || 'Payment failed')
        if (onError) {
          onError(error)
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        // Note: Order creation is handled by webhook
        clearCart()
        
        if (onSuccess) {
          onSuccess(paymentIntent.id)
        } else {
          router.push(`/order-success?paymentId=${paymentIntent.id}`)
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      setMessage('An unexpected error occurred')
      if (onError) {
        onError(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && (
        <div className="p-4 border border-error bg-error/10 text-error text-sm">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
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
            PAY WITH STRIPE
          </>
        )}
      </button>
    </form>
  )
}
