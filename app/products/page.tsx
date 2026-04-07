import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import PageWrapper from '@/components/layout/PageWrapper'
import prisma from '@/lib/prisma'
import ProductFilters from '@/components/products/ProductFilters'
import { ProductCardSkeleton } from '@/components/ui/Skeletons'

const ProductCard3D = dynamic(() => import('@/components/3d/ProductCard3D'), {
  ssr: false,
  loading: () => <ProductCardSkeleton />
})

export const metadata: Metadata = {
  title: 'All Products | VOLTEX',
  description: 'Discover our complete range of high-performance laptops engineered for creators, gamers, and professionals.',
  openGraph: {
    title: 'All Products | VOLTEX',
    description: 'Discover our complete range of high-performance laptops engineered for creators, gamers, and professionals.',
    type: 'website',
  },
}

interface SearchParams {
  category?: string
  minPrice?: string
  maxPrice?: string
  search?: string
}

async function getProducts(searchParams: SearchParams) {
  try {
    const where: any = { isActive: true }

    if (searchParams.category) {
      where.category = searchParams.category
    }

    if (searchParams.minPrice || searchParams.maxPrice) {
      where.price = {}
      if (searchParams.minPrice) {
        where.price.gte = parseFloat(searchParams.minPrice)
      }
      if (searchParams.maxPrice) {
        where.price.lte = parseFloat(searchParams.maxPrice)
      }
    }

    if (searchParams.search) {
      where.OR = [
        { name: { contains: searchParams.search, mode: 'insensitive' } },
        { description: { contains: searchParams.search, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return products ?? []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const products = await getProducts(searchParams)

  return (
    <PageWrapper>
      <div className="min-h-screen bg-surface">
        {/* Header */}
        <section className="py-20 px-12 md:px-24 border-b border-outline-variant/20">
          <div className="font-mono text-primary tracking-wide-tech text-xs mb-4">
            // EXPLORE OUR COLLECTION
          </div>
          <h1 className="font-syne font-extrabold text-6xl md:text-8xl mb-6">
            ALL PRODUCTS
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl">
            Discover our complete range of high-performance laptops engineered for creators, gamers, and professionals.
          </p>
        </section>

        {/* Products Grid with Filters */}
        <section className="py-16 px-12 md:px-24">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filters Sidebar */}
            <ProductFilters />

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <p className="font-mono text-sm text-on-surface-variant">
                  {(products ?? []).length} PRODUCTS FOUND
                </p>
              </div>

              {(products ?? []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(products ?? []).map((product) => (
                    <ProductCard3D
                      key={product.id}
                      name={product.name}
                      price={product.price}
                      category={product.category}
                      modelUrl={product.modelUrl || undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32">
                  <span className="material-symbols-outlined text-6xl text-outline mb-4">
                    search_off
                  </span>
                  <h3 className="font-syne font-bold text-2xl mb-4">No Products Found</h3>
                  <p className="font-body text-on-surface-variant">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
