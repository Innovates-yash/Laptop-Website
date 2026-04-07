'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function EmployeeLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/employee/dashboard')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-syne font-extrabold text-4xl text-primary mb-2">
            VOLTEX
          </h1>
          <p className="font-mono text-xs tracking-widest text-on-surface-variant">
            EMPLOYEE PORTAL
          </p>
        </div>

        {/* Login Form */}
        <div className="glass-panel p-10">
          <h2 className="font-syne font-bold text-2xl mb-8">Sign In</h2>

          {error && (
            <div className="mb-6 p-4 bg-error-container/20 border border-error text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                EMAIL
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none transition-colors"
                placeholder="employee@voltex.com"
              />
              {errors.email && (
                <p className="text-error text-sm mt-2">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                PASSWORD
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body text-on-surface focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-error text-sm mt-2">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary px-8 py-4 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant/20 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              Need help? Contact IT support
            </p>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="mt-8 p-6 bg-surface-container-low border border-outline-variant/30">
          <p className="font-mono text-xs tracking-widest text-primary mb-3">
            TEST CREDENTIALS
          </p>
          <div className="space-y-2 font-body text-sm text-on-surface-variant">
            <p>Employee: john.doe@voltex.com / Employee@123</p>
            <p>Admin: admin@voltex.com / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
