import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentSuccess(paymentIntent)
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent
      await handlePaymentFailure(failedPayment)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const metadata = paymentIntent.metadata
    const userId = metadata.userId
    const items = JSON.parse(metadata.items || '[]')
    const total = paymentIntent.amount / 100

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PAID',
        total,
        paymentId: paymentIntent.id,
        paymentMethod: 'STRIPE',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'Voltex <orders@voltex.com>',
        to: order.user.email,
        subject: `Order Confirmation - #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #00e5ff;">Order Confirmed!</h1>
            <p>Thank you for your purchase, ${order.user.name}!</p>
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            <h3>Items:</h3>
            <ul>
              ${order.items.map((item: any) => `
                <li>${item.product.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
              `).join('')}
            </ul>
            <p>Your order will be shipped within 2-3 business days.</p>
            <p style="color: #666;">Thank you for choosing Voltex!</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
    }

    console.log('Order created successfully:', order.id)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  // TODO: Handle failed payment (notify user, log, etc.)
}
