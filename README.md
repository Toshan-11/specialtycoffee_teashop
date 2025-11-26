# ☕ Brew & Leaf — Premium Coffee & Tea E-Commerce

A full-stack specialty coffee and tea e-commerce application built with **Next.js 14**, **React**, **Prisma**, **PostgreSQL**, **Tailwind CSS**, and **TypeScript**.

Dark & premium design with gold accents. Features product catalog, flavor quiz, subscriptions, cart, checkout, reviews, and admin dashboard.

![Stack](https://img.shields.io/badge/Next.js_14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## Features

### Customer-Facing
- **Product Catalog** — Browse by category (Coffee, Tea, Accessories), sort, search
- **Product Detail Pages** — Multiple images, origin info, roast level, flavor notes, reviews
- **Flavor Quiz** — 4-step interactive quiz that recommends products based on taste preferences
- **Shopping Cart** — Slide-out drawer + full page, grind selection, quantity management
- **Checkout** — Address form, order summary, tax/shipping calculation (Stripe-ready)
- **User Accounts** — Registration, login, order history, subscription management
- **Subscriptions** — Recurring delivery with pause/resume/cancel
- **Reviews & Ratings** — Leave reviews on purchased products

### Admin Dashboard
- **Analytics Overview** — Revenue, orders, customers, products at a glance
- **Order Management** — View all orders, update status (Pending → Delivered)
- **Product Management** — Add new products with the admin form

### Technical Highlights
- **Next.js 14 App Router** with Server Components and Server Actions
- **Prisma ORM** with comprehensive relational data model (12+ models)
- **NextAuth.js** with JWT strategy and role-based access (CUSTOMER / ADMIN)
- **Zustand** for client-side cart state management
- **Responsive design** — Mobile-first, works beautifully on all screen sizes
- **Dark premium UI** — Custom Tailwind theme with black/gold color palette

---

## Quick Start

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** (local or hosted, e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or Docker)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/brewandleaf"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-here"
```

### 3. Set Up Database

```bash
# Push schema to database & seed sample data
npm run db:setup
```

This creates all tables, inserts 15 products across 3 categories, and creates demo accounts.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## Demo Accounts

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@brewandleaf.com    | admin123    |
| Customer | jane@example.com         | customer123 |

---

## Project Structure

```
brew-and-leaf/
├── prisma/
│   ├── schema.prisma          # Data model (12+ models)
│   └── seed.ts                # Sample data seeder
├── src/
│   ├── actions/
│   │   └── index.ts           # Server Actions (products, orders, quiz, admin)
│   ├── app/
│   │   ├── (auth)/            # Login & Register pages
│   │   ├── (shop)/            # Products, Product Detail, Cart, Quiz, Checkout, About
│   │   ├── account/           # Orders & Subscriptions management
│   │   ├── admin/             # Dashboard, Products CRUD, Orders management
│   │   ├── api/               # NextAuth & Stripe webhook routes
│   │   ├── globals.css        # Tailwind + custom component styles
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   └── shop/              # ProductCard, CartDrawer, AddToCartButton
│   ├── hooks/
│   │   └── useCart.ts         # Zustand cart store
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # Helper functions
│   └── types/
│       └── next-auth.d.ts     # TypeScript augmentations
├── tailwind.config.ts         # Custom dark premium theme
├── package.json
└── README.md
```

---

## Database Schema Overview

The Prisma schema includes **12+ interconnected models**:

- **User** — Auth, roles (Customer/Admin), relationships to orders/reviews/subscriptions
- **Product** — Name, price, images, flavor notes, roast level, caffeine level, origin
- **Category** — Coffee, Tea, Accessories with slugs for URL routing
- **Cart / CartItem** — Per-user cart with grind options
- **Order / OrderItem** — Full order lifecycle with status tracking
- **Review** — 1-5 star ratings with comments (unique per user/product)
- **Subscription** — Weekly/biweekly/monthly with pause/resume/cancel
- **Address** — Multiple shipping addresses per user
- **QuizResult** — Persisted quiz answers and recommended product IDs
- **Account / Session** — NextAuth adapter tables

---

## Extending the Project

### Add Stripe Payments
1. Get API keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Add keys to `.env`
3. Implement `stripe.checkout.sessions.create()` in the checkout flow
4. Handle webhooks in `/api/stripe/webhook`

### Add Image Uploads
1. Set up [Cloudinary](https://cloudinary.com) account
2. Add credentials to `.env`
3. Create an upload API route
4. Replace static image URLs in the admin product form

### Add Email Notifications
1. Set up [Resend](https://resend.com) or SendGrid
2. Send order confirmation emails after checkout
3. Send subscription reminder emails

---

## Scripts

| Command            | Description                              |
|--------------------|------------------------------------------|
| `npm run dev`      | Start development server                 |
| `npm run build`    | Build for production                     |
| `npm run start`    | Start production server                  |
| `npm run db:setup` | Push schema + seed database              |
| `npm run db:push`  | Push schema changes (no migration)       |
| `npm run db:seed`  | Re-seed database with sample data        |
| `npm run db:studio`| Open Prisma Studio (visual DB browser)   |

---

## Tech Stack

| Technology   | Purpose                    |
|--------------|----------------------------|
| Next.js 14   | Full-stack React framework |
| TypeScript   | Type safety                |
| Prisma       | ORM & database toolkit     |
| PostgreSQL   | Relational database        |
| NextAuth.js  | Authentication             |
| Tailwind CSS | Utility-first styling      |
| Zustand      | Client state management    |
| Lucide React | Icon library               |
| React Hot Toast | Toast notifications     |

---

Built as a portfolio project demonstrating full-stack e-commerce architecture.
