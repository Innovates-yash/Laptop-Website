'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DashboardStats {
  totalSales: number
  totalPurchases: number
  openEnquiries: number
  revenue: number
  target: number
  salesData: Array<{ month: string; sales: number; purchases: number }>
  recentActivity: Array<{
    id: string
    type: string
    description: string
    date: string
  }>
}

export default function EmployeeDashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/employee/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-sm text-on-surface-variant">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const targetProgress = stats ? (stats.revenue / stats.target) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-syne font-bold text-3xl mb-2">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="font-body text-on-surface-variant">
          Here's what's happening with your sales today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">
              trending_up
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              THIS MONTH
            </span>
          </div>
          <p className="font-bebas text-4xl text-primary mb-1">
            {stats?.totalSales || 0}
          </p>
          <p className="font-mono text-xs tracking-widest text-on-surface-variant">
            TOTAL SALES
          </p>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-3xl text-secondary">
              shopping_bag
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              THIS MONTH
            </span>
          </div>
          <p className="font-bebas text-4xl text-secondary mb-1">
            {stats?.totalPurchases || 0}
          </p>
          <p className="font-mono text-xs tracking-widest text-on-surface-variant">
            TOTAL PURCHASES
          </p>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-3xl text-tertiary">
              mail
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              PENDING
            </span>
          </div>
          <p className="font-bebas text-4xl text-tertiary mb-1">
            {stats?.openEnquiries || 0}
          </p>
          <p className="font-mono text-xs tracking-widest text-on-surface-variant">
            OPEN ENQUIRIES
          </p>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">
              payments
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              THIS MONTH
            </span>
          </div>
          <p className="font-bebas text-4xl text-primary mb-1">
            ${stats?.revenue.toLocaleString() || 0}
          </p>
          <p className="font-mono text-xs tracking-widest text-on-surface-variant">
            REVENUE GENERATED
          </p>
        </div>
      </div>

      {/* Target Progress */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-syne font-bold text-xl mb-1">Monthly Target</h3>
            <p className="font-body text-sm text-on-surface-variant">
              ${stats?.revenue.toLocaleString() || 0} / ${stats?.target.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bebas text-3xl text-primary">
              {targetProgress.toFixed(0)}%
            </p>
            <p className="font-mono text-xs text-on-surface-variant">
              COMPLETE
            </p>
          </div>
        </div>
        <div className="w-full h-4 bg-surface-container-low rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-fixed-dim transition-all duration-500"
            style={{ width: `${Math.min(targetProgress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales vs Purchases Chart */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="font-syne font-bold text-xl mb-6">Sales vs Purchases</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.salesData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3b494c" />
              <XAxis dataKey="month" stroke="#bac9cc" />
              <YAxis stroke="#bac9cc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1d1f28',
                  border: '1px solid #3b494c',
                  borderRadius: '0',
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#00e5ff" name="Sales" />
              <Bar dataKey="purchases" fill="#b3c5ff" name="Purchases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-6">
          <h3 className="font-syne font-bold text-xl mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.recentActivity && (stats.recentActivity ?? []).length > 0 ? (
              (stats.recentActivity ?? []).map((activity) => (
                <div
                  key={activity.id}
                  className="pb-4 border-b border-outline-variant/20 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-container/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-sm text-primary">
                        {activity.type === 'sale' ? 'trending_up' : 'shopping_bag'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-on-surface mb-1">
                        {activity.description}
                      </p>
                      <p className="font-mono text-[10px] text-on-surface-variant">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-on-surface-variant font-body text-sm py-8">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
