'use client'

import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import gsap from 'gsap'

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  productId: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type EnquiryForm = z.infer<typeof enquirySchema>

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnquiryForm>({
    resolver: zodResolver(enquirySchema),
  })

  const onSubmit = async (data: EnquiryForm) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitted(true)
        reset()
        
        gsap.from('.success-message', {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out',
        })
      }
    } catch (error) {
      console.error('Failed to submit enquiry:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-surface">
        <section className="py-20 px-12 md:px-24 border-b border-outline-variant/20">
          <div className="font-mono text-primary tracking-wide-tech text-xs mb-4">
            // GET IN TOUCH
          </div>
          <h1 className="font-syne font-extrabold text-6xl md:text-8xl mb-6">
            CONTACT US
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl">
            Have questions about our products? Need a custom configuration? Our team is here to help you find the perfect laptop.
          </p>
        </section>

        <section className="py-16 px-12 md:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              {!submitted ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div>
                    <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                      FULL NAME *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full bg-surface-container-low border border-outline-variant px-6 py-4 font-body text-on-surface focus:border-primary focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-error text-sm mt-2">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full bg-surface-container-low border border-outline-variant px-6 py-4 font-body text-on-surface focus:border-primary focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-error text-sm mt-2">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                      PHONE NUMBER *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full bg-surface-container-low border border-outline-variant px-6 py-4 font-body text-on-surface focus:border-primary focus:outline-none transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && (
                      <p className="text-error text-sm mt-2">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                      INTERESTED IN (OPTIONAL)
                    </label>
                    <select
                      {...register('productId')}
                      className="w-full bg-surface-container-low border border-outline-variant px-6 py-4 font-body text-on-surface focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select a product</option>
                      <option value="nexus-16">VOLTEX NEXUS-16</option>
                      <option value="aer-14">VOLTEX AER-14</option>
                      <option value="studio-pro">VOLTEX STUDIO PRO</option>
                      <option value="core-m1">VOLTEX CORE M1</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-xs tracking-widest text-on-surface mb-3 block">
                      MESSAGE *
                    </label>
                    <textarea
                      {...register('message')}
                      rows={6}
                      className="w-full bg-surface-container-low border border-outline-variant px-6 py-4 font-body text-on-surface focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                    {errors.message && (
                      <p className="text-error text-sm mt-2">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-container text-on-primary px-8 py-5 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                        SENDING...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">send</span>
                        SEND MESSAGE
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="success-message glass-panel p-12 text-center">
                  <div className="w-20 h-20 bg-tertiary-container rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-on-tertiary-container">
                      check_circle
                    </span>
                  </div>
                  <h3 className="font-syne font-bold text-3xl mb-4">Message Sent!</h3>
                  <p className="font-body text-on-surface-variant mb-8">
                    Thank you for contacting us. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="border border-primary text-primary px-8 py-3 font-mono tracking-widest text-xs hover:bg-primary-container hover:text-on-primary transition-all"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="glass-panel p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs tracking-widest text-primary mb-2">HEADQUARTERS</h4>
                    <p className="font-body text-on-surface">
                      123 Tech Boulevard<br />
                      Silicon Valley, CA 94025<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">mail</span>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs tracking-widest text-primary mb-2">EMAIL</h4>
                    <p className="font-body text-on-surface">
                      support@voltex.com<br />
                      sales@voltex.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">phone</span>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs tracking-widest text-primary mb-2">PHONE</h4>
                    <p className="font-body text-on-surface">
                      +1 (800) VOLTEX-1<br />
                      Mon-Fri: 9AM - 6PM PST
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8">
                <h4 className="font-mono text-xs tracking-widest text-primary mb-4">FOLLOW US</h4>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 border border-outline-variant hover:border-primary hover:bg-primary-container/10 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">link</span>
                  </a>
                  <a href="#" className="w-10 h-10 border border-outline-variant hover:border-primary hover:bg-primary-container/10 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">link</span>
                  </a>
                  <a href="#" className="w-10 h-10 border border-outline-variant hover:border-primary hover:bg-primary-container/10 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">link</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
