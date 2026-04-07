'use client'

import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import StripeForm from './StripeForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeWrapperProps {
  amount: number
  onSuccess?: (orderId: string) => void
  onError?: (error: any) => void
}

export default function StripeWrapper({
  amount,
  onSuccess,
  onError,
}: StripeWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create payment intent
    async function createPaymentIntent() {
      try {
        const response = await fetch('/api/payment/stripe/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            currency: 'usd',
            metadata: {
              // Add metadata as needed
            },
          }),
        })

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error('Failed to create payment intent:', error)
        if (onError) {
          onError(error)
        }
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [amount, onError])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-mono text-sm text-on-surface-variant">Loading payment form...</p>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-8 text-error">
        Failed to initialize payment. Please try again.
      </div>
    )
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#00e5ff',
        colorBackground: '#1d1f28',
        colorText: '#e1e1ee',
        colorDanger: '#ffb4ab',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '0px',
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}
