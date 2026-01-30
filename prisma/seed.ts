import { PrismaClient, RoastLevel, CaffeineLevel } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.quizResult.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@brewandleaf.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create test customer
  const customerPassword = await hash('customer123', 12);
  const customer = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  // Create categories
  const coffee = await prisma.category.create({
    data: {
      name: 'Coffee',
      slug: 'coffee',
      description: 'Premium single-origin and blended coffees from the world\'s finest growing regions.',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
    },
  });

  const tea = await prisma.category.create({
    data: {
      name: 'Tea',
      slug: 'tea',
      description: 'Handpicked loose-leaf teas sourced directly from master growers.',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
    },
  });

  const accessories = await prisma.category.create({
    data: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Curated brewing equipment to elevate your daily ritual.',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    },
  });

  // Create products - Coffee
  const coffeeProducts = [
    {
      name: 'Ethiopian Yirgacheffe',
      slug: 'ethiopian-yirgacheffe',
      description: 'A legendary single-origin from the birthplace of coffee. This washed Ethiopian delivers an extraordinarily complex cup with bright citrus acidity, delicate jasmine florals, and a sweet bergamot finish. Grown at elevations above 1,800 meters by smallholder farmers in the Gedeo Zone, each bean carries centuries of coffee heritage.',
      shortDesc: 'Bright citrus, jasmine florals, bergamot finish',
      price: 24.99,
      compareAtPrice: 29.99,
      images: [
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=800',
      ],
      categoryId: coffee.id,
      origin: 'Yirgacheffe, Ethiopia',
      roastLevel: RoastLevel.LIGHT,
      flavorNotes: ['Citrus', 'Jasmine', 'Bergamot', 'Honey'],
      caffeineLevel: CaffeineLevel.HIGH,
      weight: '340g',
      featured: true,
      bestSeller: true,
      rating: 4.8,
      reviewCount: 124,
    },
    {
      name: 'Colombian Supremo',
      slug: 'colombian-supremo',
      description: 'Sourced from the lush highlands of Huila, Colombia, this supremo-grade coffee offers the perfect balance of sweetness and body. Expect rich caramel notes layered with ripe stone fruit and a smooth chocolate finish that lingers beautifully. A crowd-pleaser that performs brilliantly in any brew method.',
      shortDesc: 'Caramel, stone fruit, smooth chocolate',
      price: 22.99,
      images: [
        'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800',
        'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800',
      ],
      categoryId: coffee.id,
      origin: 'Huila, Colombia',
      roastLevel: RoastLevel.MEDIUM,
      flavorNotes: ['Caramel', 'Stone Fruit', 'Chocolate'],
      caffeineLevel: CaffeineLevel.HIGH,
      weight: '340g',
      featured: true,
      rating: 4.6,
      reviewCount: 89,
    },
    {
      name: 'Sumatra Mandheling',
      slug: 'sumatra-mandheling',
      description: 'A bold and earthy offering from the volcanic soils of North Sumatra. Wet-hulled in the traditional Giling Basah method, this coffee boasts an incredibly full body with deep notes of dark chocolate, cedar, and exotic spice. A perfect evening coffee for those who crave intensity.',
      shortDesc: 'Dark chocolate, cedar, exotic spice',
      price: 25.99,
      images: [
        'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800',
      ],
      categoryId: coffee.id,
      origin: 'North Sumatra, Indonesia',
      roastLevel: RoastLevel.DARK,
      flavorNotes: ['Dark Chocolate', 'Cedar', 'Spice', 'Earthy'],
      caffeineLevel: CaffeineLevel.HIGH,
      weight: '340g',
      bestSeller: true,
      rating: 4.7,
      reviewCount: 67,
    },
    {
      name: 'Guatemala Antigua',
      slug: 'guatemala-antigua',
      description: 'From the shadow of three volcanoes in the Antigua Valley, this exceptional coffee offers a complex yet approachable cup. Rich cocoa and brown sugar sweetness with a subtle smoky undertone from the volcanic soil. Medium body with a clean, lingering finish.',
      shortDesc: 'Cocoa, brown sugar, subtle smoke',
      price: 23.99,
      images: [
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
      ],
      categoryId: coffee.id,
      origin: 'Antigua Valley, Guatemala',
      roastLevel: RoastLevel.MEDIUM_DARK,
      flavorNotes: ['Cocoa', 'Brown Sugar', 'Smoke'],
      caffeineLevel: CaffeineLevel.HIGH,
      weight: '340g',
      rating: 4.5,
      reviewCount: 45,
    },
    {
      name: 'Costa Rica Tarrazú',
      slug: 'costa-rica-tarrazu',
      description: 'High-grown in the renowned Tarrazú region at over 1,500 meters, this honey-processed coffee delivers exceptional sweetness and clarity. Bright tropical fruit notes meet a buttery body with hints of brown sugar and a tangerine-like acidity that makes each sip vibrant.',
      shortDesc: 'Tropical fruit, buttery body, tangerine acidity',
      price: 26.99,
      images: [
        'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800',
      ],
      categoryId: coffee.id,
      origin: 'Tarrazú, Costa Rica',
      roastLevel: RoastLevel.LIGHT,
      flavorNotes: ['Tropical Fruit', 'Butter', 'Brown Sugar', 'Tangerine'],
      caffeineLevel: CaffeineLevel.HIGH,
      weight: '340g',
      featured: true,
      rating: 4.9,
      reviewCount: 38,
    },
    {
      name: 'Midnight Espresso Blend',
      slug: 'midnight-espresso-blend',
      description: 'Our signature espresso blend, crafted for those who appreciate depth and power. A carefully balanced combination of Brazilian, Colombian, and Indonesian beans creates a full-bodied shot with thick crema, bittersweet chocolate, toasted walnut, and a long molasses finish.',
      shortDesc: 'Bittersweet chocolate, walnut, molasses',
      price: 21.99,
      images: [
        'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800',
      ],
      categoryId: coffee.id,
      origin: 'House Blend',
      roastLevel: RoastLevel.DARK,
      flavorNotes: ['Chocolate', 'Walnut', 'Molasses'],
      caffeineLevel: CaffeineLevel.HIGH,
      weight: '340g',
      bestSeller: true,
      rating: 4.7,
      reviewCount: 203,
    },
  ];

  // Create products - Tea
  const teaProducts = [
    {
      name: 'Kyoto Gyokuro',
      slug: 'kyoto-gyokuro',
      description: 'Japan\'s most prestigious shade-grown green tea from the Uji region of Kyoto. Three weeks of shading before harvest concentrates the umami and sweetness, producing an intensely savory cup with notes of sweet seaweed, fresh cream, and a lingering marine finish. A meditative drinking experience.',
      shortDesc: 'Umami, sweet seaweed, creamy marine finish',
      price: 34.99,
      images: [
        'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
      ],
      categoryId: tea.id,
      origin: 'Uji, Kyoto, Japan',
      flavorNotes: ['Umami', 'Seaweed', 'Cream', 'Marine'],
      caffeineLevel: CaffeineLevel.MEDIUM,
      weight: '100g',
      featured: true,
      rating: 4.9,
      reviewCount: 56,
    },
    {
      name: 'Darjeeling First Flush',
      slug: 'darjeeling-first-flush',
      description: 'The "Champagne of teas" — this spring harvest from the Himalayan foothills delivers an exquisitely delicate cup. Light amber liquor with bright muscatel grape notes, floral hints of lily, and a crisp astringency that finishes clean and refreshing. Best enjoyed without milk.',
      shortDesc: 'Muscatel grape, lily, crisp finish',
      price: 28.99,
      images: [
        'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800',
      ],
      categoryId: tea.id,
      origin: 'Darjeeling, India',
      flavorNotes: ['Muscatel', 'Grape', 'Lily', 'Crisp'],
      caffeineLevel: CaffeineLevel.MEDIUM,
      weight: '100g',
      bestSeller: true,
      rating: 4.7,
      reviewCount: 78,
    },
    {
      name: 'Aged Pu-erh Reserve',
      slug: 'aged-puerh-reserve',
      description: 'A 10-year aged shou pu-erh from ancient tea trees in Yunnan province. Years of careful fermentation and aging have produced a remarkably smooth, full-bodied brew with notes of damp earth, aged leather, dried fig, and a sweet woodsy finish that deepens with each infusion.',
      shortDesc: 'Earth, leather, dried fig, woodsy sweetness',
      price: 42.99,
      images: [
        'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=800',
      ],
      categoryId: tea.id,
      origin: 'Yunnan, China',
      flavorNotes: ['Earth', 'Leather', 'Fig', 'Wood'],
      caffeineLevel: CaffeineLevel.MEDIUM,
      weight: '200g',
      featured: true,
      rating: 4.8,
      reviewCount: 34,
    },
    {
      name: 'Moroccan Mint',
      slug: 'moroccan-mint',
      description: 'A vibrant blend of Chinese gunpowder green tea and fresh spearmint, inspired by the traditional Moroccan tea ceremony. Bright, cooling, and invigorating with a natural sweetness that makes it perfect hot or iced. A daily ritual that refreshes the mind.',
      shortDesc: 'Cooling spearmint, bright green tea',
      price: 16.99,
      images: [
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800',
      ],
      categoryId: tea.id,
      origin: 'Blend',
      flavorNotes: ['Mint', 'Green Tea', 'Sweet', 'Cooling'],
      caffeineLevel: CaffeineLevel.LOW,
      weight: '100g',
      bestSeller: true,
      rating: 4.6,
      reviewCount: 112,
    },
    {
      name: 'Golden Chamomile Dream',
      slug: 'golden-chamomile-dream',
      description: 'A calming caffeine-free blend of whole Egyptian chamomile flowers, lavender buds, and a whisper of raw honey flavor. Golden in the cup with an intoxicating floral aroma that soothes and relaxes. The perfect companion for winding down after a long day.',
      shortDesc: 'Chamomile, lavender, honey',
      price: 14.99,
      images: [
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
      ],
      categoryId: tea.id,
      origin: 'Blend',
      flavorNotes: ['Chamomile', 'Lavender', 'Honey'],
      caffeineLevel: CaffeineLevel.NONE,
      weight: '80g',
      rating: 4.5,
      reviewCount: 67,
    },
  ];

  // Create products - Accessories
  const accessoryProducts = [
    {
      name: 'Hario V60 Dripper',
      slug: 'hario-v60-dripper',
      description: 'The industry-standard pour-over dripper in elegant ceramic. The iconic 60-degree angle and spiral ribs allow for maximum extraction control, letting you craft a perfectly clean, nuanced cup every time. Includes 40 paper filters.',
      shortDesc: 'Ceramic pour-over dripper with filters',
      price: 29.99,
      images: [
        'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=800',
      ],
      categoryId: accessories.id,
      flavorNotes: [],
      weight: '450g',
      rating: 4.8,
      reviewCount: 89,
    },
    {
      name: 'Cast Iron Teapot',
      slug: 'cast-iron-teapot',
      description: 'A traditional Japanese tetsubin-style cast iron teapot with a beautiful hobnail pattern. Retains heat exceptionally well and evenly distributes warmth throughout the brewing process. Comes with a stainless steel infuser basket. 800ml capacity.',
      shortDesc: 'Japanese-style tetsubin, 800ml',
      price: 64.99,
      images: [
        'https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=800',
      ],
      categoryId: accessories.id,
      flavorNotes: [],
      weight: '1.5kg',
      featured: true,
      rating: 4.9,
      reviewCount: 45,
    },
    {
      name: 'Brew & Leaf Ceramic Mug',
      slug: 'brew-leaf-ceramic-mug',
      description: 'Our signature 350ml ceramic mug, handcrafted with a matte black exterior and gold accent rim. The perfect vessel for your morning ritual. Microwave and dishwasher safe.',
      shortDesc: 'Signature matte black with gold rim, 350ml',
      price: 18.99,
      images: [
        'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
      ],
      categoryId: accessories.id,
      flavorNotes: [],
      weight: '320g',
      bestSeller: true,
      rating: 4.7,
      reviewCount: 156,
    },
    {
      name: 'Precision Coffee Scale',
      slug: 'precision-coffee-scale',
      description: 'A sleek digital scale with built-in timer, designed specifically for coffee and tea brewing. 0.1g accuracy up to 2kg, auto-off timer, USB-C rechargeable, and a responsive touch interface. Essential for repeatable, perfect brews.',
      shortDesc: 'Digital scale with timer, 0.1g accuracy',
      price: 44.99,
      images: [
        'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
      ],
      categoryId: accessories.id,
      flavorNotes: [],
      weight: '380g',
      rating: 4.6,
      reviewCount: 72,
    },
  ];

  for (const product of [...coffeeProducts, ...teaProducts, ...accessoryProducts]) {
    await prisma.product.create({ data: product });
  }

  // Create some reviews
  const products = await prisma.product.findMany({ take: 3 });
  for (const product of products) {
    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: product.id,
        rating: 5,
        title: 'Absolutely exceptional',
        comment: 'This has become my go-to. The flavor profile is exactly as described and the quality is consistently outstanding. Will be reordering.',
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📧 Admin login: admin@brewandleaf.com / admin123');
  console.log('📧 Customer login: jane@example.com / customer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
