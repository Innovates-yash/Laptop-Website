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

    const userId = session.user.id

    // Get current month start and end
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Get employee record
    const employee = await prisma.employee.findFirst({
      where: { userId },
    })

    // Get sales count this month
    const totalSales = await prisma.salesRecord.count({
      where: {
        employeeId: employee?.id,
        saleDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })

    // Get purchases count this month
    const totalPurchases = await prisma.purchaseRecord.count({
      where: {
        employeeId: employee?.id,
        purchaseDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })

    // Get open enquiries count
    const openEnquiries = await prisma.customerEnquiry.count({
      where: {
        status: {
          in: ['NEW', 'READ'],
        },
      },
    })

    // Get revenue this month
    const salesRecords = await prisma.salesRecord.findMany({
      where: {
        employeeId: employee?.id,
        saleDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })

    const revenue = salesRecords.reduce(
      (sum, record) => sum + record.salePrice * record.quantity,
      0
    )

    // Get sales data for last 6 months
    const salesData = []
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEndDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthSales = await prisma.salesRecord.count({
        where: {
          employeeId: employee?.id,
          saleDate: {
            gte: monthDate,
            lte: monthEndDate,
          },
        },
      })

      const monthPurchases = await prisma.purchaseRecord.count({
        where: {
          employeeId: employee?.id,
          purchaseDate: {
            gte: monthDate,
            lte: monthEndDate,
          },
        },
      })

      salesData.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        sales: monthSales,
        purchases: monthPurchases,
      })
    }

    // Get recent activity
    const recentSales = await prisma.salesRecord.findMany({
      where: { employeeId: employee?.id },
      include: { product: true },
      orderBy: { saleDate: 'desc' },
      take: 3,
    })

    const recentPurchases = await prisma.purchaseRecord.findMany({
      where: { employeeId: employee?.id },
      include: { product: true },
      orderBy: { purchaseDate: 'desc' },
      take: 3,
    })

    const recentActivity = [
      ...recentSales.map((sale) => ({
        id: sale.id,
        type: 'sale',
        description: `Sold ${sale.quantity}x ${sale.product.name}`,
        date: sale.saleDate.toISOString(),
      })),
      ...recentPurchases.map((purchase) => ({
        id: purchase.id,
        type: 'purchase',
        description: `Purchased ${purchase.quantity}x ${purchase.product.name}`,
        date: purchase.purchaseDate.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    return NextResponse.json({
      totalSales,
      totalPurchases,
      openEnquiries,
      revenue,
      target: employee?.target || 50000,
      salesData,
      recentActivity,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
