'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { ShoppingBag, User, Menu, X, Search, Leaf } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const navLinks = [
    { label: 'Shop', href: '/products' },
    { label: 'Coffee', href: '/products?category=coffee' },
    { label: 'Tea', href: '/products?category=tea' },
    { label: 'Accessories', href: '/products?category=accessories' },
    { label: 'Quiz', href: '/quiz' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="hidden md:flex justify-center py-2 border-b border-brand-gray/30">
          <p className="text-xs tracking-[0.2em] uppercase text-brand-muted">
            Free shipping on orders over RS.7000 &mdash; Crafted with passion since 2026
          </p>
        </div>

        {/* Main nav */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-brand-cream p-2"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Leaf className="w-6 h-6 text-brand-gold group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-display text-xl md:text-2xl tracking-tight text-brand-cream">
              Brew <span className="text-brand-gold">&</span> Leaf
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-brand-light hover:text-brand-gold transition-colors duration-200 uppercase"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-brand-light hover:text-brand-gold transition-colors"
            >
              <Search size={20} />
            </button>

            {session ? (
              <div className="relative group">
                <Link
                  href={session.user.role === 'ADMIN' ? '/admin' : '/account/orders'}
                  className="p-2 text-brand-light hover:text-brand-gold transition-colors"
                >
                  <User size={20} />
                </Link>
                <div className="absolute right-0 top-full mt-2 w-48 py-2 glass rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <p className="px-4 py-2 text-xs text-brand-muted uppercase tracking-wider">
                    {session.user.name}
                  </p>
                  <div className="border-t border-brand-gray/30 my-1" />
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-brand-light hover:text-brand-gold hover:bg-brand-charcoal transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-sm text-brand-light hover:text-brand-gold hover:bg-brand-charcoal transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/account/subscriptions"
                    className="block px-4 py-2 text-sm text-brand-light hover:text-brand-gold hover:bg-brand-charcoal transition-colors"
                  >
                    Subscriptions
                  </Link>
                  <div className="border-t border-brand-gray/30 my-1" />
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-brand-light hover:text-red-400 hover:bg-brand-charcoal transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-brand-light hover:text-brand-gold transition-colors"
              >
                <User size={20} />
              </Link>
            )}

            <button
              onClick={toggleCart}
              className="p-2 text-brand-light hover:text-brand-gold transition-colors relative"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold text-brand-black text-xs font-bold flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="py-4 border-t border-brand-gray/30 animate-slide-down">
            <form action="/products" className="max-w-lg mx-auto">
              <input
                type="text"
                name="search"
                placeholder="Search our collection..."
                className="input-field text-center"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-brand-gray/30 animate-slide-down">
          <nav className="flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-6 py-3 text-sm tracking-wide uppercase text-brand-light hover:text-brand-gold hover:bg-brand-charcoal transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
