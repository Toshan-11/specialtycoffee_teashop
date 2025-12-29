import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mountain, Heart, Globe, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1920&q=80"
            alt="Coffee farm"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/40 to-brand-black" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl text-brand-cream mb-6">
            From Seed to Cup
          </h1>
          <p className="text-brand-light text-lg">
            A passion project born from a simple belief: everyone deserves
            access to extraordinary coffee and tea.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-3">Founded 2024</p>
            <h2 className="font-display text-3xl text-brand-cream mb-6">
              Crafted with Intention
            </h2>
            <p className="text-brand-light leading-relaxed mb-4">
              Brew & Leaf started in a small kitchen with a pour-over kettle and
              an obsession with flavor. We traveled to origin countries, met the
              farmers, tasted hundreds of lots, and curated only the beans and
              leaves that moved us.
            </p>
            <p className="text-brand-light leading-relaxed">
              Today, we work directly with smallholder farmers across Ethiopia,
              Colombia, Japan, India, and beyond — ensuring fair prices, sustainable
              practices, and extraordinary quality in every bag we sell.
            </p>
          </div>
          <div className="relative aspect-[4/5] bg-brand-charcoal overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
              alt="Brewing coffee"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-dark py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-3">What Drives Us</p>
            <h2 className="section-title">Our Values</h2>
            <div className="divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Mountain,
                title: 'Origin First',
                desc: 'We trace every product to its source, visiting farms and building long-term relationships with growers.',
              },
              {
                icon: Heart,
                title: 'Fair Trade',
                desc: 'Farmers receive above-market prices. When they thrive, the quality of what they grow does too.',
              },
              {
                icon: Globe,
                title: 'Sustainability',
                desc: 'Carbon-neutral shipping, compostable packaging, and support for reforestation projects.',
              },
              {
                icon: Sparkles,
                title: 'Quality Obsessed',
                desc: 'Every lot is cup-scored by our team. If it doesn\'t make us stop and pay attention, we don\'t sell it.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border border-brand-gold/30 flex items-center justify-center">
                  <Icon size={20} className="text-brand-gold" />
                </div>
                <h3 className="font-display text-lg text-brand-cream mb-2">{title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="font-display text-3xl text-brand-cream mb-4">
          Ready to Discover Your Perfect Brew?
        </h2>
        <p className="text-brand-light mb-8">
          Take our flavor quiz or browse our curated collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/quiz" className="btn-primary">
            Take the Quiz <ArrowRight size={16} className="ml-2" />
          </Link>
          <Link href="/products" className="btn-secondary">
            Shop All
          </Link>
        </div>
      </section>
    </div>
  );
}
