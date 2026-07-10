import { Metadata } from 'next';
import { CATEGORIES } from '@/lib/constants';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ShopFilters } from '@/components/shop/ShopFilters';
import { ProductGrid } from '@/components/shop/ProductGrid';

export const metadata: Metadata = {
  title: 'Shop - My Shop',
  description: 'Browse our premium digital products for designers',
};

interface ShopPageProps {
  searchParams: { category?: string; search?: string; sort?: string; page?: string };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const category = searchParams.category || '';
  const search = searchParams.search || '';
  const sort = searchParams.sort || 'newest';
  const page = parseInt(searchParams.page || '1');

  return (
    <div className="min-h-screen bg-light dark:bg-secondary flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Page Header */}
        <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container-max py-8">
            <h1 className="heading-1 text-gray-900 dark:text-white mb-2">Shop Products</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover {search ? `products matching "${search}"` : 'premium digital products for designers'}
            </p>
          </div>
        </section>

        {/* Shop Content */}
        <section className="py-12">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:col-span-1">
                <ShopFilters
                  categories={CATEGORIES}
                  selectedCategory={category}
                  selectedSort={sort}
                />
              </aside>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                <ProductGrid
                  category={category}
                  search={search}
                  sort={sort}
                  page={page}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
