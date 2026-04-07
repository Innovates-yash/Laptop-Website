'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/employee/dashboard', icon: 'dashboard' },
  { name: 'Sales', href: '/employee/sales', icon: 'trending_up' },
  { name: 'Purchases', href: '/employee/purchases', icon: 'shopping_bag' },
  { name: 'Enquiries', href: '/employee/enquiries', icon: 'mail' },
  { name: 'Products', href: '/employee/products', icon: 'inventory_2' },
  { name: 'Profile', href: '/employee/profile', icon: 'person' },
]

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/employee/login') {
      router.push('/employee/login')
    } else if (
      status === 'authenticated' &&
      session?.user?.role !== 'EMPLOYEE' &&
      session?.user?.role !== 'ADMIN'
    ) {
      router.push('/')
    }
  }, [status, session, router, pathname])

  if (pathname === '/employee/login') {
    return <>{children}</>
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-sm text-on-surface-variant">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant/30 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-outline-variant/30">
          <Link href="/employee/dashboard">
            <h1 className="font-syne font-extrabold text-2xl text-primary">
              VOLTEX
            </h1>
            <p className="font-mono text-[10px] tracking-widest text-on-surface-variant mt-1">
              EMPLOYEE PORTAL
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-xs tracking-widest transition-all ${
                  isActive
                    ? 'bg-primary-container/20 text-primary border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {item.icon}
                </span>
                {item.name.toUpperCase()}
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-outline-variant/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">
                person
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-on-surface truncate">
                {session.user?.name}
              </p>
              <p className="font-mono text-[10px] tracking-widest text-primary">
                {session.user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/employee/login' })}
            className="w-full px-4 py-2 border border-outline-variant text-on-surface-variant hover:border-error hover:text-error font-mono text-xs tracking-widest transition-all"
          >
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between px-8">
          <div>
            <h2 className="font-syne font-bold text-xl text-on-surface">
              {navigation.find((item) => item.href === pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-primary-container/20 border border-primary/30">
              <span className="font-mono text-[10px] tracking-widest text-primary">
                {session.user?.role}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
