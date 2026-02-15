import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getProducts, getCategories } from '@/actions';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import AdminProductActions from './AdminProductActions';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Admin nav */}
      <div className="flex items-center gap-6 mb-8 text-sm border-b border-brand-gray/30 pb-4">
        <Link href="/admin" className="text-brand-muted hover:text-brand-cream uppercase tracking-wider">
          Dashboard
        </Link>
        <Link href="/admin/products" className="text-brand-gold uppercase tracking-wider">
          Products
        </Link>
        <Link href="/admin/orders" className="text-brand-muted hover:text-brand-cream uppercase tracking-wider">
          Orders
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-brand-cream">Products</h1>
      </div>

      {/* Add Product Form */}
      <AdminProductActions categories={categories} />

      {/* Products Table */}
      <div className="border border-brand-gray/30 bg-brand-dark mt-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-gray/30">
                <th className="text-left text-xs text-brand-muted uppercase tracking-wider px-6 py-3">Product</th>
                <th className="text-left text-xs text-brand-muted uppercase tracking-wider px-6 py-3">Category</th>
                <th className="text-left text-xs text-brand-muted uppercase tracking-wider px-6 py-3">Price</th>
                <th className="text-left text-xs text-brand-muted uppercase tracking-wider px-6 py-3">Rating</th>
                <th className="text-left text-xs text-brand-muted uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs text-brand-muted uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-brand-gray/20 hover:bg-brand-charcoal/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-brand-cream font-medium">{product.name}</p>
                      <p className="text-xs text-brand-muted">{product.origin || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-light">{product.category.name}</td>
                  <td className="px-6 py-4 text-sm text-brand-gold">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 text-sm text-brand-light">{product.rating} ({product.reviewCount})</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 ${product.inStock ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
