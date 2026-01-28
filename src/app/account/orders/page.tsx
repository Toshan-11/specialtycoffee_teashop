import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserOrders } from '@/actions';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const orders = await getUserOrders();

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    PROCESSING: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    SHIPPED: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    DELIVERED: 'text-green-400 bg-green-400/10 border-green-400/30',
    CANCELLED: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Account nav */}
      <div className="flex items-center gap-4 mb-8 text-sm">
        <Link
          href="/account/orders"
          className="text-brand-gold uppercase tracking-wider"
        >
          Orders
        </Link>
        <Link
          href="/account/subscriptions"
          className="text-brand-muted hover:text-brand-cream uppercase tracking-wider"
        >
          Subscriptions
        </Link>
      </div>

      <h1 className="font-display text-3xl text-brand-cream mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="text-brand-gray mx-auto mb-4" />
          <p className="text-brand-muted mb-4">No orders yet</p>
          <Link href="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 border border-brand-gray/30 bg-brand-dark"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-brand-muted">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-brand-muted mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium border ${
                      statusColors[order.status] || 'text-brand-muted'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-lg font-display text-brand-gold">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-brand-light">
                      {item.product.name}{' '}
                      <span className="text-brand-muted">
                        &times; {item.quantity}
                      </span>
                    </span>
                    <span className="text-brand-cream">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
