import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Enable caching for this route
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    // Get pagination params
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Parallel queries for better performance
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        orderBy: { name: 'asc' },
        take: limit,
        skip: skip,
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          price: true,
          images: true,
          isActive: true,
          createdAt: true,
        }
      }),
      prisma.product.count()
    ])

    const response = NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    })

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
