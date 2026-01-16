import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserSubscriptions } from '@/actions';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { RefreshCw, Pause, Play, X } from 'lucide-react';
import SubscriptionActions from './SubscriptionActions';

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const subscriptions = await getUserSubscriptions();

  const statusColors: Record<string, string> = {
    ACTIVE: 'text-green-400 bg-green-400/10 border-green-400/30',
    PAUSED: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    CANCELLED: 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  const freqLabels: Record<string, string> = {
    WEEKLY: 'Every week',
    BIWEEKLY: 'Every 2 weeks',
    MONTHLY: 'Every month',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Account nav */}
      <div className="flex items-center gap-4 mb-8 text-sm">
        <Link
          href="/account/orders"
          className="text-brand-muted hover:text-brand-cream uppercase tracking-wider"
        >
          Orders
        </Link>
        <Link
          href="/account/subscriptions"
          className="text-brand-gold uppercase tracking-wider"
        >
          Subscriptions
        </Link>
      </div>

      <h1 className="font-display text-3xl text-brand-cream mb-8">
        My Subscriptions
      </h1>

      {subscriptions.length === 0 ? (
        <div className="text-center py-20">
          <RefreshCw size={48} className="text-brand-gray mx-auto mb-4" />
          <p className="text-brand-muted mb-2">No active subscriptions</p>
          <p className="text-sm text-brand-muted mb-6">
            Subscribe to your favorite products and save 10% on every delivery
          </p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="p-6 border border-brand-gray/30 bg-brand-dark"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg text-brand-cream">
                    {sub.product.name}
                  </h3>
                  <p className="text-sm text-brand-muted mt-1 capitalize">
                    {sub.grind.replace('-', ' ')} &bull;{' '}
                    {freqLabels[sub.frequency]}
                  </p>
                  <p className="text-brand-gold mt-2">
                    {formatPrice(sub.product.price * 0.9)}
                    <span className="text-xs text-brand-muted ml-1">
                      /delivery (10% off)
                    </span>
                  </p>
                  {sub.nextDeliveryDate && sub.status === 'ACTIVE' && (
                    <p className="text-xs text-brand-muted mt-2">
                      Next delivery:{' '}
                      {new Date(sub.nextDeliveryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium border ${
                      statusColors[sub.status]
                    }`}
                  >
                    {sub.status}
                  </span>
                  <SubscriptionActions id={sub.id} status={sub.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
