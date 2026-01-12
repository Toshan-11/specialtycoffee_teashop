import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDesc?: string | null;
    price: number;
    compareAtPrice?: number | null;
    images: string[];
    rating: number;
    reviewCount: number;
    roastLevel?: string | null;
    category: { name: string; slug: string };
    bestSeller?: boolean;
    featured?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="card">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-brand-charcoal">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestSeller && (
              <span className="px-3 py-1 bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-wider">
                Best Seller
              </span>
            )}
            {discount > 0 && (
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold">
                -{discount}%
              </span>
            )}
          </div>
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center pb-4">
            <span className="btn-primary text-xs opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              View Details
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-brand-gold uppercase tracking-wider mb-1">
            {product.category.name}
            {product.roastLevel && (
              <span className="text-brand-muted">
                {' '}&bull; {product.roastLevel.replace('_', ' ')}
              </span>
            )}
          </p>
          <h3 className="font-display text-lg text-brand-cream group-hover:text-brand-gold transition-colors duration-200">
            {product.name}
          </h3>
          {product.shortDesc && (
            <p className="text-sm text-brand-muted mt-1 line-clamp-1">
              {product.shortDesc}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={
                    star <= Math.round(product.rating)
                      ? 'fill-brand-gold text-brand-gold'
                      : 'text-brand-gray'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-brand-muted">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-semibold text-brand-cream">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-brand-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
