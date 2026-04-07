'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const salesSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  salePrice: z.number().min(0, 'Price must be positive'),
  saleDate: z.string(),
  notes: z.string().optional(),
})

type SalesForm = z.infer<typeof salesSchema>

interface Product {
  id: string
  name: string
  price: number
}

interface SalesRecord {
  id: string
  quantity: number
  salePrice: number
  saleDate: string
  notes: string | null
  product: {
    name: string
  }
}

export default function EmployeeSalesPage() {
  const { data: session } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<SalesRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SalesForm>({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      saleDate: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    fetchProducts()
    fetchSales()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/employee/sales')
      if (response.ok) {
        const data = await response.json()
        setSales(data)
      }
    } catch (error) {
      console.error('Failed to fetch sales:', error)
    }
  }

  const onSubmit = async (data: SalesForm) => {
    setLoading(true)
    try {
      const response = await fetch('/api/employee/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        reset()
        setShowForm(false)
        fetchSales()
      }
    } catch (error) {
      console.error('Failed to create sale:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sale record?')) return

    try {
      const response = await fetch(`/api/employee/sales/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSales()
      }
    } catch (error) {
      console.error('Failed to delete sale:', error)
    }
  }

  const exportToCSV = () => {
    const headers = ['Date', 'Product', 'Quantity', 'Price', 'Total', 'Notes']
    const rows = sales.map((sale) => [
      new Date(sale.saleDate).toLocaleDateString(),
      sale.product.name,
      sale.quantity,
      sale.salePrice,
      sale.quantity * sale.salePrice,
      sale.notes || '',
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-syne font-bold text-3xl mb-2">Sales Records</h1>
          <p className="font-body text-on-surface-variant">
            Track and manage your sales
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={exportToCSV}
            className="px-6 py-3 border border-outline-variant text-on-surface hover:border-primary hover:text-primary font-mono text-xs tracking-widest transition-all"
          >
            EXPORT CSV
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-primary-container text-on-primary font-mono text-xs tracking-widest hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
          >
            {showForm ? 'CANCEL' : 'ADD SALE'}
          </button>
        </div>
      </div>

      {/* Add Sale Form */}
      {showForm && (
        <div className="glass-panel p-8">
          <h2 className="font-syne font-bold text-xl mb-6">Log New Sale</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                PRODUCT *
              </label>
              <select
                {...register('productId')}
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
              {errors.productId && (
                <p className="text-error text-sm mt-2">{errors.productId.message}</p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                QUANTITY *
              </label>
              <input
                {...register('quantity', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none"
              />
              {errors.quantity && (
                <p className="text-error text-sm mt-2">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                SALE PRICE *
              </label>
              <input
                {...register('salePrice', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none"
              />
              {errors.salePrice && (
                <p className="text-error text-sm mt-2">{errors.salePrice.message}</p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                DATE *
              </label>
              <input
                {...register('saleDate')}
                type="date"
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none"
              />
              {errors.saleDate && (
                <p className="text-error text-sm mt-2">{errors.saleDate.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                NOTES
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none resize-none"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-on-primary px-8 py-4 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
              >
                {loading ? 'SAVING...' : 'SAVE SALE'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sales Table */}
      <div className="glass-panel p-8">
        <h2 className="font-syne font-bold text-xl mb-6">Your Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="text-left py-4 px-4 font-mono text-xs tracking-widest text-on-surface-variant">
                  DATE
                </th>
                <th className="text-left py-4 px-4 font-mono text-xs tracking-widest text-on-surface-variant">
                  PRODUCT
                </th>
                <th className="text-right py-4 px-4 font-mono text-xs tracking-widest text-on-surface-variant">
                  QTY
                </th>
                <th className="text-right py-4 px-4 font-mono text-xs tracking-widest text-on-surface-variant">
                  PRICE
                </th>
                <th className="text-right py-4 px-4 font-mono text-xs tracking-widest text-on-surface-variant">
                  TOTAL
                </th>
                <th className="text-right py-4 px-4 font-mono text-xs tracking-widest text-on-surface-variant">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {(sales ?? []).length > 0 ? (
                (sales ?? []).map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors"
                  >
                    <td className="py-4 px-4 font-body text-sm">
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-body text-sm">
                      {sale.product.name}
                    </td>
                    <td className="py-4 px-4 font-body text-sm text-right">
                      {sale.quantity}
                    </td>
                    <td className="py-4 px-4 font-body text-sm text-right">
                      ${sale.salePrice.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-bebas text-lg text-primary text-right">
                      ${(sale.quantity * sale.salePrice).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="text-error hover:text-error/80 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <p className="font-body text-on-surface-variant">
                      No sales records yet. Add your first sale above.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
