import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CartView } from '@/components/checkout/CartView';

export const metadata: Metadata = {
  title: 'Shopping Cart - My Shop',
  description: 'View your shopping cart',
};

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-light dark:bg-secondary flex flex-col">
      <Header />
      <main className="flex-1 pt-24">
        <CartView requireAuth={true} />
      </main>
      <Footer />
    </div>
  );
}
