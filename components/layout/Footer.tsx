import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 py-24 px-12 md:px-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="font-syne font-extrabold tracking-tighter text-3xl text-primary mb-6">
            VOLTEX
          </div>
          <p className="font-body text-on-surface-variant max-w-md leading-relaxed mb-8">
            Engineering excellence meets uncompromising performance. Built for creators, gamers, and professionals who demand the impossible.
          </p>
          <div className="flex gap-6">
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

        {/* Products */}
        <div>
          <h4 className="font-mono text-xs tracking-widest text-primary mb-6">PRODUCTS</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/products?category=gaming" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
                Gaming Laptops
              </Link>
            </li>
            <li>
              <Link href="/products?category=creator" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
                Creator Studio
              </Link>
            </li>
            <li>
              <Link href="/products?category=ultrabook" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
                Ultrabooks
              </Link>
            </li>
            <li>
              <Link href="/products" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
                All Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-mono text-xs tracking-widest text-primary mb-6">SUPPORT</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/contact" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <a href="#" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
                Warranty
              </a>
            </li>
            <li>
              <a href="#" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
                Returns
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-12 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-mono text-[10px] tracking-widest text-outline">
          © 2026 VOLTEX. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-8 font-mono text-[10px] tracking-widest">
          <a href="#" className="text-outline hover:text-primary transition-colors">PRIVACY</a>
          <a href="#" className="text-outline hover:text-primary transition-colors">TERMS</a>
          <a href="#" className="text-outline hover:text-primary transition-colors">COOKIES</a>
        </div>
      </div>
    </footer>
  )
}
