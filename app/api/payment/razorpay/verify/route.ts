import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      items,
      total,
    } = body

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PAID',
        total,
        paymentId: razorpay_payment_id,
        paymentMethod: 'RAZORPAY',
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
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
              ${order.orderItems.map(item => `
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
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
