import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify ownership
    const sale = await prisma.salesRecord.findUnique({
      where: { id: params.id },
    })

    if (!sale || sale.employeeId !== employee.id) {
      return NextResponse.json({ error: 'Sale not found or unauthorized' }, { status: 404 })
    }

    await prisma.salesRecord.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sale:', error)
    return NextResponse.json(
      { error: 'Failed to delete sale' },
      { status: 500 }
    )
  }
}
