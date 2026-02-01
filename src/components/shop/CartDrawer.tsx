'use client';

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-dark border-l border-brand-gray/30 z-50 flex flex-col animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-gray/30">
          <h2 className="font-display text-xl text-brand-cream">Your Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 text-brand-muted hover:text-brand-cream transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-brand-gray mb-4" />
              <p className="text-brand-muted mb-2">Your cart is empty</p>
              <p className="text-sm text-brand-muted mb-6">
                Discover our collection and find your perfect brew
              </p>
              <Link
                href="/products"
                onClick={closeCart}
                className="btn-secondary text-sm"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-brand-gray/20"
                >
                  {/* Image placeholder */}
                  <div className="w-20 h-20 bg-brand-charcoal flex-shrink-0 flex items-center justify-center">
                    <ShoppingBag size={24} className="text-brand-muted" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-brand-cream truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1 capitalize">
                      {item.grind.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-brand-gold mt-1">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.grind,
                            item.quantity - 1
                          )
                        }
                        className="w-7 h-7 border border-brand-gray flex items-center justify-center text-brand-light hover:border-brand-gold transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm text-brand-cream w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.grind,
                            item.quantity + 1
                          )
                        }
                        className="w-7 h-7 border border-brand-gray flex items-center justify-center text-brand-light hover:border-brand-gold transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId, item.grind)}
                        className="ml-auto text-xs text-brand-muted hover:text-red-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-brand-gray/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-muted uppercase tracking-wide">
                Subtotal
              </span>
              <span className="text-lg font-display text-brand-gold">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <p className="text-xs text-brand-muted">
              Shipping and taxes calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center"
            >
              Checkout
            </Link>
            <button
              onClick={closeCart}
              className="btn-ghost w-full text-center text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
