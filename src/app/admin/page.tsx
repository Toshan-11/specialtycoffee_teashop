import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAdminStats } from '@/actions';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Settings,
  ArrowRight,
} from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  const stats = await getAdminStats();
  if ('error' in stats) redirect('/');

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-400',
    },
    {
      label: 'Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-purple-400',
    },
    {
      label: 'Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-brand-gold',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Admin nav */}
      <div className="flex items-center gap-6 mb-8 text-sm border-b border-brand-gray/30 pb-4">
        <Link
          href="/admin"
          className="text-brand-gold uppercase tracking-wider"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/products"
          className="text-brand-muted hover:text-brand-cream uppercase tracking-wider"
        >
          Products
        </Link>
        <Link
          href="/admin/orders"
          className="text-brand-muted hover:text-brand-cream uppercase tracking-wider"
        >
          Orders
        </Link>
      </div>

      <h1 className="font-display text-3xl text-brand-cream mb-8">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="p-6 border border-brand-gray/30 bg-brand-dark"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-brand-muted uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-display text-brand-cream">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="border border-brand-gray/30 bg-brand-dark">
        <div className="flex items-center justify-between p-6 border-b border-brand-gray/30">
          <h2 className="font-display text-xl text-brand-cream">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm text-brand-gold hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-gray/30">
                  <th className="text-left text-xs text-brand-muted uppercase tracking-wider px-6 py-3">
                    Order
                  </th>
                  <th className="text-left text-xs text-brand-muted uppercase tracking-wider px-6 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs text-brand-muted uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs text-brand-muted uppercase tracking-wider px-6 py-3">
                    Total
                  </th>
                  <th className="text-right text-xs text-brand-muted uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-brand-gray/20 hover:bg-brand-charcoal/50"
                  >
                    <td className="px-6 py-4 text-sm text-brand-cream">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-light">
                      {order.user.name || order.user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-brand-charcoal text-brand-light">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-gold text-right">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-muted text-right">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-6 text-center text-brand-muted">No orders yet</p>
        )}
      </div>
    </div>
  );
}
