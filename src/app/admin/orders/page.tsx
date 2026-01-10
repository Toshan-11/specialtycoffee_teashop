import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import OrderStatusUpdate from './OrderStatusUpdate';

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Admin nav */}
      <div className="flex items-center gap-6 mb-8 text-sm border-b border-brand-gray/30 pb-4">
        <Link href="/admin" className="text-brand-muted hover:text-brand-cream uppercase tracking-wider">
          Dashboard
        </Link>
        <Link href="/admin/products" className="text-brand-muted hover:text-brand-cream uppercase tracking-wider">
          Products
        </Link>
        <Link href="/admin/orders" className="text-brand-gold uppercase tracking-wider">
          Orders
        </Link>
      </div>

      <h1 className="font-display text-3xl text-brand-cream mb-8">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-brand-muted py-20">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-6 border border-brand-gray/30 bg-brand-dark">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-brand-cream font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-brand-muted">
                    {order.user.name || order.user.email} &bull;{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
                  <span className="text-lg font-display text-brand-gold">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                {order.items.map((item) => (
                  <p key={item.id} className="text-sm text-brand-light">
                    {item.product.name} &times; {item.quantity}{' '}
                    <span className="text-brand-muted">({formatPrice(item.price)})</span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
