import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';

interface OrderConfirmationPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'Order Confirmed - My Shop',
  description: 'Your order has been confirmed',
};

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-light dark:bg-secondary flex flex-col">
      <Header />
      <main className="flex-1 pt-24">
        <OrderConfirmation order={order} />
      </main>
      <Footer />
    </div>
  );
}
