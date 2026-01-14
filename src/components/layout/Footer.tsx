import Link from 'next/link';
import { Leaf, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-brand-gray/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-brand-gold" />
              <span className="font-display text-xl text-brand-cream">
                Brew <span className="text-brand-gold">&</span> Leaf
              </span>
            </Link>
            <p className="text-sm text-brand-muted leading-relaxed">
              Curating the world&apos;s finest coffees and teas. Every cup tells a story
              of craftsmanship, origin, and passion.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-brand-muted hover:text-brand-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-brand-muted hover:text-brand-gold transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-brand-muted hover:text-brand-gold transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-brand-gold mb-6">Shop</h3>
            <ul className="space-y-3">
              {['All Products', 'Coffee', 'Tea', 'Accessories', 'Best Sellers', 'Subscriptions'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/products"
                      className="text-sm text-brand-muted hover:text-brand-cream transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-brand-gold mb-6">Company</h3>
            <ul className="space-y-3">
              {['Our Story', 'Sourcing', 'Sustainability', 'Careers', 'Press'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/about"
                      className="text-sm text-brand-muted hover:text-brand-cream transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-brand-gold mb-6">Support</h3>
            <ul className="space-y-3">
              {['Contact Us', 'Shipping & Returns', 'FAQ', 'Brewing Guides', 'Privacy Policy'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/about"
                      className="text-sm text-brand-muted hover:text-brand-cream transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-gray/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-muted">
            &copy; {new Date().getFullYear()} Brew & Leaf. All rights reserved.
          </p>
          <p className="text-xs text-brand-muted">
            Crafted with care. Shipped with love.
          </p>
        </div>
      </div>
    </footer>
  );
}
