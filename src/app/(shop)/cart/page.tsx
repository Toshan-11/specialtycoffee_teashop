'use client';

import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="text-brand-gray mx-auto mb-4" />
        <h1 className="font-display text-3xl text-brand-cream mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-brand-muted mb-8">
          Browse our collection and discover your next favorite brew.
        </p>
        <Link href="/products" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  const subtotal = totalPrice();
  const shipping = subtotal >= 50 ? 0 : 5.99;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-gold transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Continue Shopping
      </Link>

      <h1 className="font-display text-3xl text-brand-cream mb-8">
        Shopping Cart ({items.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border border-brand-gray/30 bg-brand-dark"
            >
              <div className="w-24 h-24 bg-brand-charcoal flex-shrink-0 flex items-center justify-center">
                <ShoppingBag size={24} className="text-brand-muted" />
              </div>
              <div className="flex-1">
                <h3 className="text-brand-cream font-medium">{item.name}</h3>
                <p className="text-xs text-brand-muted capitalize mt-1">
                  {item.grind.replace('-', ' ')}
                </p>
                <p className="text-brand-gold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.productId, item.grind, item.quantity - 1)}
                    className="w-8 h-8 border border-brand-gray flex items-center justify-center text-brand-light hover:border-brand-gold transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm text-brand-cream w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.grind, item.quantity + 1)}
                    className="w-8 h-8 border border-brand-gray flex items-center justify-center text-brand-light hover:border-brand-gold transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => removeItem(item.productId, item.grind)}
                    className="ml-auto text-brand-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-brand-cream font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-6 border border-brand-gray/30 bg-brand-dark h-fit sticky top-32">
          <h2 className="font-display text-xl text-brand-cream mb-6">
            Order Summary
          </h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Subtotal</span>
              <span className="text-brand-cream">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Shipping</span>
              <span className="text-brand-cream">
                {shipping === 0 ? (
                  <span className="text-green-500">FREE</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-brand-muted">
                Add {formatPrice(50 - subtotal)} more for free shipping
              </p>
            )}
          </div>
          <div className="border-t border-brand-gray/30 pt-4 mb-6">
            <div className="flex justify-between">
              <span className="text-brand-cream font-medium">Estimated Total</span>
              <span className="text-xl font-display text-brand-gold">
                {formatPrice(subtotal + shipping)}
              </span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary w-full text-center">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
