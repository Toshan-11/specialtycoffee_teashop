import { Suspense } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import { getProducts, getCategories } from '@/actions';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';

interface Props {
  searchParams: { category?: string; sort?: string; search?: string };
}

export default async function ProductsPage({ searchParams }: Props) {
  const [products, categories] = await Promise.all([
    getProducts({
      category: searchParams.category,
      sort: searchParams.sort,
      search: searchParams.search,
    }),
    getCategories(),
  ]);

  const sortOptions = [
    { value: '', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name A-Z' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-3">
          Our Collection
        </p>
        <h1 className="section-title">
          {searchParams.category
            ? categories.find((c) => c.slug === searchParams.category)?.name || 'Products'
            : searchParams.search
            ? `Results for "${searchParams.search}"`
            : 'All Products'}
        </h1>
        <div className="divider" />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-brand-gray/30">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/products"
            className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
              !searchParams.category
                ? 'border-brand-gold text-brand-gold bg-brand-gold/10'
                : 'border-brand-gray text-brand-muted hover:text-brand-cream hover:border-brand-light'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
                searchParams.category === cat.slug
                  ? 'border-brand-gold text-brand-gold bg-brand-gold/10'
                  : 'border-brand-gray text-brand-muted hover:text-brand-cream hover:border-brand-light'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-brand-muted" />
          <select
            defaultValue={searchParams.sort || ''}
            className="bg-brand-charcoal border border-brand-gray text-brand-light text-sm px-3 py-2 focus:border-brand-gold focus:outline-none"
            onChange={(e) => {
              const url = new URL(window.location.href);
              if (e.target.value) {
                url.searchParams.set('sort', e.target.value);
              } else {
                url.searchParams.delete('sort');
              }
              window.location.href = url.toString();
            }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-brand-muted mb-6">
        {products.length} product{products.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <Suspense fallback={<ProductGridSkeleton />}>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-brand-muted text-lg mb-4">No products found</p>
            <Link href="/products" className="btn-secondary">
              View All Products
            </Link>
          </div>
        )}
      </Suspense>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="aspect-square bg-brand-charcoal" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-brand-charcoal rounded w-1/3" />
            <div className="h-5 bg-brand-charcoal rounded w-2/3" />
            <div className="h-3 bg-brand-charcoal rounded w-full" />
            <div className="h-6 bg-brand-charcoal rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
