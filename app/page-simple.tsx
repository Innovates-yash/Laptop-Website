import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        
        <div className="relative z-10 text-center px-8 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            VOLTEX
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-300">
            High-Performance Laptops
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Experience the future of computing with our premium laptop collection.
            Engineered for performance, designed for excellence.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/products" 
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition-all transform hover:scale-105"
            >
              Explore Products
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-4 border-2 border-cyan-500 hover:bg-cyan-500/10 text-white font-bold rounded-lg transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs tracking-widest">SCROLL</span>
          <div className="w-px h-16 bg-white animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-8 md:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose VOLTEX
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-4">Extreme Performance</h3>
              <p className="text-gray-400">
                Powered by the latest processors and GPUs for uncompromising speed.
              </p>
            </div>

            <div className="p-8 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-2xl font-bold mb-4">Premium Build</h3>
              <p className="text-gray-400">
                Aerospace-grade aluminum with precision engineering.
              </p>
            </div>

            <div className="p-8 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold mb-4">24/7 Support</h3>
              <p className="text-gray-400">
                Expert technical support available around the clock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 md:px-24 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Get in touch with our team to find the perfect laptop for your needs.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-12 py-6 bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-lg rounded-lg transition-all transform hover:scale-105"
          >
            Contact Us Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p className="mb-4">© 2026 VOLTEX. All rights reserved.</p>
          <p className="text-sm">
            Note: This is a simplified version running without database connection.
          </p>
        </div>
      </footer>
    </main>
  )
}
