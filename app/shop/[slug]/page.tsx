import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ProductDetailView } from '@/components/shop/ProductDetailView';

interface ProductPageProps {
  params: { slug: string };
}

export const metadata: Metadata = {
  title: 'Product - My Shop',
  description: 'Product details',
};

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${params.slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      notFound();
    }

    const product = await response.json();

    return (
      <div className="min-h-screen bg-light dark:bg-secondary flex flex-col">
        <Header />
        <main className="flex-1 pt-24">
          <ProductDetailView product={product} />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
