import dynamic from 'next/dynamic'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { ModelSkeleton, ProductCardSkeleton } from '@/components/ui/Skeletons'

const HeroLaptop = dynamic(() => import('@/components/3d/HeroLaptop'), {
  ssr: false,
  loading: () => <div className="absolute right-0 top-0 w-full md:w-1/2 h-full"><ModelSkeleton /></div>
})

const ProductCard3D = dynamic(() => import('@/components/3d/ProductCard3D'), {
  ssr: false,
  loading: () => <ProductCardSkeleton />
})

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    })
    return products ?? []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function Home() {
  const products = await getFeaturedProducts()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section h-screen w-full relative overflow-hidden flex items-center">
        {/* 3D Hero Laptop */}
        <HeroLaptop />
        
        {/* Hero Content */}
        <div className="relative z-10 w-full md:w-1/2 px-12 md:px-24">
          <div className="font-mono text-primary tracking-wide-tech text-sm mb-6 flex items-center">
            // NEXT GENERATION PERFORMANCE
            <span className="ml-2 w-2 h-5 bg-primary animate-pulse"></span>
          </div>
          
          <h1 className="font-syne font-extrabold text-6xl md:text-8xl leading-none tracking-tightest mb-10">
            POWER BEYOND<br/>LIMITS
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <div className="px-4 py-2 border border-primary/30 bg-surface-container-low font-mono text-[10px] tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-primary animate-ping"></span> M4 PRO CHIP
            </div>
            <div className="px-4 py-2 border border-primary/30 bg-surface-container-low font-mono text-[10px] tracking-widest">
              32GB RAM
            </div>
            <div className="px-4 py-2 border border-primary/30 bg-surface-container-low font-mono text-[10px] tracking-widest">
              22HR BATTERY
            </div>
          </div>
          
          <div className="flex gap-8 items-center">
            <Link href="/products">
              <button className="bg-primary-container text-on-primary px-10 py-5 font-mono font-bold tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all">
                EXPLORE NOW
              </button>
            </Link>
            <button className="flex items-center gap-4 text-on-background font-mono tracking-widest text-xs group">
              <div className="w-12 h-12 rounded-full border border-on-background flex items-center justify-center group-hover:bg-on-background group-hover:text-surface transition-all">
                <span className="material-symbols-outlined">play_arrow</span>
              </div>
              WATCH FILM
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-10">
          <span className="material-symbols-outlined animate-bounce">expand_more</span>
          <span className="font-mono text-[9px] tracking-ultra-wide">SCROLL TO EXPLORE</span>
        </div>
      </section>

      {/* Engineering Section */}
      <section className="min-h-screen bg-surface-container-lowest relative py-32">
        <div className="container mx-auto px-12 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="font-syne font-extrabold text-5xl mb-8 leading-tight">
              ENGINEERED TO<br/>PERFECTION
            </h2>
            <p className="font-body text-lg text-on-surface-variant max-w-md leading-relaxed mb-12">
              Every curve, every micro-chip, and every pixel is meticulously calibrated for those who demand the impossible.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-6 group">
                <span className="font-mono text-primary">01</span>
                <div className="h-[1px] w-12 bg-outline-variant group-hover:w-24 group-hover:bg-primary transition-all duration-500"></div>
                <span className="font-mono text-sm tracking-widest">AEROSPACE ALUMINUM</span>
              </div>
              <div className="flex items-center gap-6 group">
                <span className="font-mono text-primary">02</span>
                <div className="h-[1px] w-12 bg-outline-variant group-hover:w-24 group-hover:bg-primary transition-all duration-500"></div>
                <span className="font-mono text-sm tracking-widest">THERMAL DYNAMICS</span>
              </div>
              <div className="flex items-center gap-6 group">
                <span className="font-mono text-primary">03</span>
                <div className="h-[1px] w-12 bg-outline-variant group-hover:w-24 group-hover:bg-primary transition-all duration-500"></div>
                <span className="font-mono text-sm tracking-widest">PRECISION ENGINEERING</span>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="aspect-square bg-surface-container-low border border-outline-variant/30 flex items-center justify-center">
              <span className="text-6xl">🔧</span>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-32 px-12 md:px-24 bg-surface">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="font-mono text-primary tracking-wide-tech text-xs mb-4">
              // CURATED PERFORMANCE
            </div>
            <h2 className="font-syne font-extrabold text-6xl">BEST SELLERS</h2>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

        <div className="text-center mt-16">
          <Link href="/products">
            <button className="border border-primary text-primary px-10 py-5 font-mono font-bold tracking-widest text-xs hover:bg-primary-container hover:text-on-primary transition-all">
              VIEW ALL PRODUCTS
            </button>
          </Link>
        </div>
      </section>

      {/* Why Voltex Section */}
      <section className="py-32 px-12 md:px-24 bg-surface-container-lowest">
        <div className="text-center mb-20">
          <div className="font-mono text-primary tracking-wide-tech text-xs mb-4">
            // UNMATCHED EXCELLENCE
          </div>
          <h2 className="font-syne font-extrabold text-6xl">WHY VOLTEX</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="glass-panel p-12 hover:border-primary transition-all group">
            <div className="w-16 h-16 border border-primary/30 flex items-center justify-center mb-8 group-hover:bg-primary-container/10 transition-all">
              <span className="material-symbols-outlined text-3xl text-primary">speed</span>
            </div>
            <h3 className="font-syne font-bold text-2xl mb-4">EXTREME PERFORMANCE</h3>
            <p className="font-body text-on-surface-variant leading-relaxed">
              Powered by the latest processors and GPUs, delivering uncompromising speed for any task.
            </p>
          </div>

          <div className="glass-panel p-12 hover:border-primary transition-all group">
            <div className="w-16 h-16 border border-primary/30 flex items-center justify-center mb-8 group-hover:bg-primary-container/10 transition-all">
              <span className="material-symbols-outlined text-3xl text-primary">verified</span>
            </div>
            <h3 className="font-syne font-bold text-2xl mb-4">PREMIUM BUILD</h3>
            <p className="font-body text-on-surface-variant leading-relaxed">
              Aerospace-grade aluminum chassis with precision engineering for durability and elegance.
            </p>
          </div>

          <div className="glass-panel p-12 hover:border-primary transition-all group">
            <div className="w-16 h-16 border border-primary/30 flex items-center justify-center mb-8 group-hover:bg-primary-container/10 transition-all">
              <span className="material-symbols-outlined text-3xl text-primary">support_agent</span>
            </div>
            <h3 className="font-syne font-bold text-2xl mb-4">24/7 SUPPORT</h3>
            <p className="font-body text-on-surface-variant leading-relaxed">
              Expert technical support available around the clock to keep you running at peak performance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-32 px-12 md:px-24 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        <div className="relative z-10 max-w-4xl">
          <h2 className="font-syne font-extrabold text-5xl md:text-7xl mb-8 leading-tight">
            READY TO EXPERIENCE<br/>THE FUTURE?
          </h2>
          <p className="font-body text-xl text-on-surface-variant mb-12 max-w-2xl">
            Get in touch with our team to find the perfect laptop for your needs. Custom configurations available.
          </p>
          <Link href="/contact">
            <button className="bg-primary-container text-on-primary px-12 py-6 font-mono font-bold tracking-widest text-sm hover:shadow-[0_0_40px_rgba(0,229,255,0.5)] transition-all">
              CONTACT US NOW
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}
