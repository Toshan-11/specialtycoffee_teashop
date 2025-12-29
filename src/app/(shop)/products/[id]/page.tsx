import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowLeft, MapPin, Droplets, Flame } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/actions';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/shop/AddToCartButton';
import ProductCard from '@/components/shop/ProductCard';

interface Props {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.id);

  if (!product) {
    notFound();
  }

  // Get related products
  const related = await getProducts({ category: product.category.slug });
  const relatedProducts = related
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const roastLabels: Record<string, string> = {
    LIGHT: 'Light Roast',
    MEDIUM: 'Medium Roast',
    MEDIUM_DARK: 'Medium-Dark Roast',
    DARK: 'Dark Roast',
  };

  const caffeineLabels: Record<string, string> = {
    NONE: 'Caffeine Free',
    LOW: 'Low Caffeine',
    MEDIUM: 'Medium Caffeine',
    HIGH: 'High Caffeine',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-gold transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-brand-charcoal overflow-hidden">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
            {product.bestSeller && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-wider">
                Best Seller
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-brand-charcoal overflow-hidden border border-brand-gray/30 hover:border-brand-gold transition-colors cursor-pointer"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-2">
            {product.category.name}
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-brand-cream mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={
                    star <= Math.round(product.rating)
                      ? 'fill-brand-gold text-brand-gold'
                      : 'text-brand-gray'
                  }
                />
              ))}
            </div>
            <span className="text-sm text-brand-muted">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-display text-brand-cream">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-brand-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-8 py-6 border-y border-brand-gray/30">
            {product.origin && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-gold" />
                <div>
                  <p className="text-xs text-brand-muted uppercase">Origin</p>
                  <p className="text-sm text-brand-cream">{product.origin}</p>
                </div>
              </div>
            )}
            {product.roastLevel && (
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-brand-gold" />
                <div>
                  <p className="text-xs text-brand-muted uppercase">Roast</p>
                  <p className="text-sm text-brand-cream">
                    {roastLabels[product.roastLevel] || product.roastLevel}
                  </p>
                </div>
              </div>
            )}
            {product.caffeineLevel && (
              <div className="flex items-center gap-2">
                <Droplets size={16} className="text-brand-gold" />
                <div>
                  <p className="text-xs text-brand-muted uppercase">Caffeine</p>
                  <p className="text-sm text-brand-cream">
                    {caffeineLabels[product.caffeineLevel] || product.caffeineLevel}
                  </p>
                </div>
              </div>
            )}
            {product.weight && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-brand-gold text-xs font-bold">g</span>
                <div>
                  <p className="text-xs text-brand-muted uppercase">Weight</p>
                  <p className="text-sm text-brand-cream">{product.weight}</p>
                </div>
              </div>
            )}
          </div>

          {/* Flavor Notes */}
          {product.flavorNotes.length > 0 && (
            <div className="mb-8">
              <p className="text-xs text-brand-muted uppercase tracking-wider mb-3">
                Flavor Notes
              </p>
              <div className="flex flex-wrap gap-2">
                {product.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 border border-brand-gold/30 text-brand-gold text-xs tracking-wide"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-brand-light leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Subscribe option */}
          <div className="mt-6 p-4 border border-brand-gray/30 bg-brand-charcoal/50">
            <p className="text-sm text-brand-cream font-medium mb-1">
              Subscribe & Save 10%
            </p>
            <p className="text-xs text-brand-muted mb-3">
              Get this delivered on your schedule. Pause or cancel anytime.
            </p>
            <Link
              href={`/account/subscriptions`}
              className="text-brand-gold text-sm hover:underline"
            >
              Set up a subscription &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-20">
        <h2 className="font-display text-2xl text-brand-cream mb-8">
          Customer Reviews ({product.reviewCount})
        </h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="p-6 border border-brand-gray/30 bg-brand-dark"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-xs text-brand-gold font-bold">
                      {review.user.name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-brand-cream">{review.user.name}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={
                            star <= review.rating
                              ? 'fill-brand-gold text-brand-gold'
                              : 'text-brand-gray'
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {review.title && (
                  <p className="text-sm font-medium text-brand-cream mb-1">
                    {review.title}
                  </p>
                )}
                {review.comment && (
                  <p className="text-sm text-brand-light">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-muted">No reviews yet. Be the first to review this product!</p>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl text-brand-cream mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
