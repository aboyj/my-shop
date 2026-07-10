import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { OrdersHistory } from '@/components/checkout/OrdersHistory';

export const metadata: Metadata = {
  title: 'My Orders - My Shop',
  description: 'View your order history',
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/orders');
  }

  return (
    <div className="min-h-screen bg-light dark:bg-secondary flex flex-col">
      <Header />
      <main className="flex-1 pt-24">
        <OrdersHistory />
      </main>
      <Footer />
    </div>
  );
}
