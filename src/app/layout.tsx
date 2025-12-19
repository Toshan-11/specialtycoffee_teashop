import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/shop/CartDrawer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Brew & Leaf — Premium Coffee & Tea',
  description:
    'Curating the world\'s finest coffees and teas. Discover single-origin beans, rare loose-leaf teas, and premium brewing accessories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <CartDrawer />
          <main className="flex-1 pt-20 md:pt-28">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1E1E1E',
                color: '#F5F0EB',
                border: '1px solid #2A2A2A',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
