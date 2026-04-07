import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== 'EMPLOYEE' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee record not found' }, { status: 404 })
    }

    const sales = await prisma.salesRecord.findMany({
      where: { employeeId: employee.id },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== 'EMPLOYEE' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee record not found' }, { status: 404 })
    }

    const body = await request.json()
    const { productId, quantity, salePrice, saleDate, notes } = body

    const sale = await prisma.salesRecord.create({
      data: {
        employeeId: employee.id,
        productId,
        quantity,
        salePrice,
        saleDate: new Date(saleDate),
        notes: notes || null,
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    )
  }
}
