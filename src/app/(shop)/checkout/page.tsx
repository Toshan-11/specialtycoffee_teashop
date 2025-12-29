'use client';

import { useState } from 'react';
import { useCartStore } from '@/hooks/useCart';
import { createOrder } from '@/actions';
import { formatPrice } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Truck, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [address, setAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const subtotal = totalPrice();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (orderComplete) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="font-display text-3xl text-brand-cream mb-4">
          Order Confirmed!
        </h1>
        <p className="text-brand-light mb-8">
          Thank you for your order. We&apos;ll send you a confirmation email
          with tracking details shortly.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/account/orders" className="btn-primary">
            View Orders
          </Link>
          <Link href="/products" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-brand-cream mb-4">
          Your cart is empty
        </h1>
        <Link href="/products" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-brand-cream mb-4">
          Sign in to Checkout
        </h1>
        <p className="text-brand-muted mb-8">
          You need an account to place an order.
        </p>
        <Link href="/login" className="btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          grind: item.grind,
        })),
        shippingAddress: address,
        subtotal,
        shipping,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
      });

      if (result.success) {
        clearCart();
        setOrderComplete(true);
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-gold transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Continue Shopping
      </Link>

      <h1 className="font-display text-3xl text-brand-cream mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 border border-brand-gray/30 bg-brand-dark">
              <h2 className="font-display text-xl text-brand-cream mb-6">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={address.line1}
                  onChange={(e) =>
                    setAddress({ ...address, line1: e.target.value })
                  }
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (optional)"
                  value={address.line2}
                  onChange={(e) =>
                    setAddress({ ...address, line2: e.target.value })
                  }
                  className="input-field"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={address.postalCode}
                    onChange={(e) =>
                      setAddress({ ...address, postalCode: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                  <select
                    value={address.country}
                    onChange={(e) =>
                      setAddress({ ...address, country: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment placeholder */}
            <div className="p-6 border border-brand-gray/30 bg-brand-dark">
              <h2 className="font-display text-xl text-brand-cream mb-4">
                Payment
              </h2>
              <div className="p-4 border border-brand-gold/30 bg-brand-gold/5 text-center">
                <ShieldCheck className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                <p className="text-sm text-brand-light">
                  In production, Stripe&apos;s secure payment form would appear
                  here.
                </p>
                <p className="text-xs text-brand-muted mt-1">
                  For demo purposes, clicking &quot;Place Order&quot; will create the
                  order directly.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="p-6 border border-brand-gray/30 bg-brand-dark sticky top-32">
              <h2 className="font-display text-xl text-brand-cream mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <div>
                      <p className="text-brand-cream">{item.name}</p>
                      <p className="text-xs text-brand-muted capitalize">
                        {item.grind.replace('-', ' ')} &times; {item.quantity}
                      </p>
                    </div>
                    <span className="text-brand-cream">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-gray/30 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="text-brand-cream">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">
                    Shipping
                    {shipping === 0 && (
                      <span className="text-green-500 ml-1">FREE</span>
                    )}
                  </span>
                  <span className="text-brand-cream">
                    {shipping === 0 ? '$0.00' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Tax</span>
                  <span className="text-brand-cream">
                    {formatPrice(tax)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-brand-gray/30">
                  <span className="text-brand-cream font-medium">Total</span>
                  <span className="text-xl font-display text-brand-gold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <Truck size={14} className="text-brand-muted" />
                <span className="text-xs text-brand-muted">
                  {subtotal >= 50
                    ? 'Free shipping applied!'
                    : `${formatPrice(50 - subtotal)} more for free shipping`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
