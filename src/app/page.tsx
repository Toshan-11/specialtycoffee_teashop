import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Leaf, Award, RefreshCw } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { getFeaturedProducts, getBestSellers, getCategories } from '@/actions';

export default async function HomePage() {
  const [featured, bestSellers, categories] = await Promise.all([
    getFeaturedProducts(),
    getBestSellers(),
    getCategories(),
  ]);

  return (
    <div>
      {/* ─── Hero Section ──────────────────────────────── */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80"
            alt="Premium coffee beans"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/70 via-brand-black/50 to-brand-black" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <p className="text-brand-gold text-sm tracking-[0.3em] uppercase mb-6 animate-fade-in">
            Est. 2024 &mdash; Specialty Coffee & Tea
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-brand-cream leading-tight mb-6 animate-slide-up">
            Every Cup Tells <br />
            <span className="text-brand-gold italic">a Story</span>
          </h1>
          <p className="text-brand-light text-lg md:text-xl mb-10 max-w-xl mx-auto animate-slide-up animate-delay-200">
            From remote highland farms to your morning ritual. Discover
            single-origin coffees and rare teas, curated for the connoisseur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-delay-300">
            <Link href="/products" className="btn-primary">
              Explore Collection
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link href="/quiz" className="btn-secondary">
              Take the Flavor Quiz
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in">
          <span className="text-xs text-brand-muted uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-brand-gold to-transparent" />
        </div>
      </section>

      {/* ─── Trust Bar ─────────────────────────────────── */}
      <section className="border-y border-brand-gray/30 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, text: 'Free Shipping Over $50' },
            { icon: Leaf, text: 'Ethically Sourced' },
            { icon: Award, text: 'Award-Winning Roasts' },
            { icon: RefreshCw, text: 'Subscription & Save' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center justify-center gap-3">
              <Icon size={20} className="text-brand-gold flex-shrink-0" />
              <span className="text-sm text-brand-light">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Categories ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-3">Explore</p>
          <h2 className="section-title">Our Collections</h2>
          <div className="divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative h-80 overflow-hidden"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl text-brand-cream mb-1">
                  {cat.name}
                </h3>
                <p className="text-sm text-brand-light/80 mb-3">{cat.description}</p>
                <span className="text-brand-gold text-sm uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                  Shop {cat.name} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────── */}
      <section className="bg-brand-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-3">
              Curated Selection
            </p>
            <h2 className="section-title">Featured This Season</h2>
            <div className="divider" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="btn-secondary">
              View All Products
              <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Quiz CTA ──────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80"
            alt="Coffee brewing"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-black/80" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-3">
            Personalized
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-brand-cream mb-6">
            Not Sure Where to Start?
          </h2>
          <p className="text-brand-light text-lg mb-10">
            Take our 60-second flavor quiz and we&apos;ll match you with your
            perfect brew based on your taste preferences.
          </p>
          <Link href="/quiz" className="btn-primary">
            Take the Flavor Quiz
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* ─── Best Sellers ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-3">
            Most Loved
          </p>
          <h2 className="section-title">Best Sellers</h2>
          <div className="divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── Newsletter ────────────────────────────────── */}
      <section className="border-t border-brand-gray/30 bg-brand-dark py-16">
        <div className="max-w-xl mx-auto text-center px-4">
          <h2 className="font-display text-2xl text-brand-cream mb-3">
            Join the Inner Circle
          </h2>
          <p className="text-sm text-brand-muted mb-6">
            Be the first to know about new arrivals, exclusive blends, and
            brewing tips. No spam, just great coffee talk.
          </p>
          <form className="flex gap-0">
            <input
              type="email"
              placeholder="Your email address"
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary px-8">
              Join
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
