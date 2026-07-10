import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CheckoutView } from '@/components/checkout/CheckoutView';

export const metadata: Metadata = {
  title: 'Checkout - My Shop',
  description: 'Complete your purchase securely',
};

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/checkout');
  }

  return (
    <div className="min-h-screen bg-light dark:bg-secondary flex flex-col">
      <Header />
      <main className="flex-1 pt-24">
        <CheckoutView userEmail={session.user?.email || ''} />
      </main>
      <Footer />
    </div>
  );
}
