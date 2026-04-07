import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, productId, message } = body

    // Create enquiry in database
    const enquiry = await prisma.customerEnquiry.create({
      data: {
        name,
        email,
        phone,
        productId: productId || null,
        message,
        status: 'NEW',
      },
    })

    // TODO: Send confirmation email via Resend
    // await resend.emails.send({
    //   from: 'Voltex <noreply@voltex.com>',
    //   to: email,
    //   subject: 'We received your enquiry',
    //   html: `<p>Thank you for contacting Voltex. We'll get back to you soon.</p>`,
    // })

    return NextResponse.json({ success: true, enquiry })
  } catch (error) {
    console.error('Error creating enquiry:', error)
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    )
  }
}
