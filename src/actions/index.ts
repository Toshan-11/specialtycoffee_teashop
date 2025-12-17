'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';

// ─── Auth Actions ────────────────────────────────────

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'All fields are required' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'Email already in use' };
  }

  const hashedPassword = await hash(password, 12);
  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { success: true };
}

// ─── Product Actions ─────────────────────────────────

export async function getProducts(params?: {
  category?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
}) {
  const where: any = { inStock: true };

  if (params?.category) {
    where.category = { slug: params.category };
  }
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ];
  }
  if (params?.featured) {
    where.featured = true;
  }

  let orderBy: any = { createdAt: 'desc' };
  if (params?.sort === 'price-asc') orderBy = { price: 'asc' };
  if (params?.sort === 'price-desc') orderBy = { price: 'desc' };
  if (params?.sort === 'rating') orderBy = { rating: 'desc' };
  if (params?.sort === 'name') orderBy = { name: 'asc' };

  return prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, inStock: true },
    include: { category: true },
    take: 6,
  });
}

export async function getBestSellers() {
  return prisma.product.findMany({
    where: { bestSeller: true, inStock: true },
    include: { category: true },
    take: 4,
  });
}

// ─── Review Actions ──────────────────────────────────

export async function createReview(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: 'Must be logged in' };

  const productId = formData.get('productId') as string;
  const rating = parseInt(formData.get('rating') as string);
  const title = formData.get('title') as string;
  const comment = formData.get('comment') as string;

  try {
    await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        title,
        comment,
      },
    });

    // Update product rating
    const reviews = await prisma.review.findMany({ where: { productId } });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await prisma.product.update({
      where: { id: productId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length },
    });

    revalidatePath(`/products`);
    return { success: true };
  } catch {
    return { error: 'You have already reviewed this product' };
  }
}

// ─── Order Actions ───────────────────────────────────

export async function createOrder(data: {
  items: { productId: string; quantity: number; price: number; grind: string }[];
  shippingAddress: any;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: 'Must be logged in' };

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      subtotal: data.subtotal,
      shipping: data.shipping,
      tax: data.tax,
      total: data.total,
      shippingAddress: data.shippingAddress,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          grind: item.grind,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  revalidatePath('/account/orders');
  return { success: true, order };
}

export async function getUserOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

// ─── Subscription Actions ────────────────────────────

export async function createSubscription(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: 'Must be logged in' };

  const productId = formData.get('productId') as string;
  const frequency = formData.get('frequency') as 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  const grind = formData.get('grind') as string;

  const nextDelivery = new Date();
  if (frequency === 'WEEKLY') nextDelivery.setDate(nextDelivery.getDate() + 7);
  if (frequency === 'BIWEEKLY') nextDelivery.setDate(nextDelivery.getDate() + 14);
  if (frequency === 'MONTHLY') nextDelivery.setMonth(nextDelivery.getMonth() + 1);

  await prisma.subscription.create({
    data: {
      userId: session.user.id,
      productId,
      frequency,
      grind,
      nextDeliveryDate: nextDelivery,
    },
  });

  revalidatePath('/account/subscriptions');
  return { success: true };
}

export async function getUserSubscriptions() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  return prisma.subscription.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateSubscriptionStatus(
  id: string,
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED'
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: 'Must be logged in' };

  await prisma.subscription.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/account/subscriptions');
  return { success: true };
}

// ─── Quiz Actions ────────────────────────────────────

export async function submitQuiz(answers: {
  prefersCoffee: boolean;
  flavorProfile: string[];
  strengthPref: string;
  adventureLevel: string;
}) {
  // Build recommendation logic
  const where: any = { inStock: true };

  if (answers.prefersCoffee) {
    where.category = { slug: 'coffee' };
  } else {
    where.category = { slug: 'tea' };
  }

  // Get products and score them
  const products = await prisma.product.findMany({
    where,
    include: { category: true },
  });

  const scored = products.map((product) => {
    let score = 0;

    // Flavor matching
    for (const note of product.flavorNotes) {
      if (answers.flavorProfile.some((f) => note.toLowerCase().includes(f.toLowerCase()))) {
        score += 3;
      }
    }

    // Strength preference
    if (answers.strengthPref === 'mild' && product.caffeineLevel === 'LOW') score += 2;
    if (answers.strengthPref === 'medium' && product.caffeineLevel === 'MEDIUM') score += 2;
    if (answers.strengthPref === 'strong' && product.caffeineLevel === 'HIGH') score += 2;

    // Roast level for coffee
    if (answers.prefersCoffee && product.roastLevel) {
      if (answers.strengthPref === 'mild' && product.roastLevel === 'LIGHT') score += 2;
      if (answers.strengthPref === 'strong' && product.roastLevel === 'DARK') score += 2;
    }

    // Adventure level
    if (answers.adventureLevel === 'classic' && product.bestSeller) score += 2;
    if (answers.adventureLevel === 'adventurous' && !product.bestSeller) score += 1;

    // Boost featured and highly rated
    if (product.featured) score += 1;
    score += product.rating;

    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const recommended = scored.slice(0, 3).map((s) => s.product);

  // Save quiz result if logged in
  const session = await getServerSession(authOptions);
  if (session?.user) {
    await prisma.quizResult.upsert({
      where: { userId: session.user.id },
      update: {
        ...answers,
        recommendedIds: recommended.map((p) => p.id),
      },
      create: {
        userId: session.user.id,
        ...answers,
        recommendedIds: recommended.map((p) => p.id),
      },
    });
  }

  return recommended;
}

// ─── Admin Actions ───────────────────────────────────

export async function getAdminStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const [totalOrders, totalRevenue, totalCustomers, totalProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count(),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } },
    },
  });

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalCustomers,
    totalProducts,
    recentOrders,
  };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
  });

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function adminCreateProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  const slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const categoryId = formData.get('categoryId') as string;
  const origin = formData.get('origin') as string;
  const weight = formData.get('weight') as string;
  const flavorNotesRaw = formData.get('flavorNotes') as string;
  const flavorNotes = flavorNotesRaw ? flavorNotesRaw.split(',').map((n) => n.trim()) : [];

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      categoryId,
      origin,
      weight,
      flavorNotes,
      images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'],
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

export async function adminDeleteProduct(productId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}
