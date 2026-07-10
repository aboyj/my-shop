'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';

interface ProductGridProps {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
}

export function ProductGrid({
  category = '',
  search = '',
  sort = 'newest',
  page = 1,
}: ProductGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        if (sort) params.append('sort', sort);
        params.append('page', page.toString());

        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search, sort, page]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card h-80 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
        <p className="text-red-700 dark:text-red-200">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card bg-gray-50 dark:bg-gray-800 text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-400">No products found</p>
        <Link href="/shop" className="btn-primary mt-4 inline-block">
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {products.length} of {pagination.total} products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          basePath="/shop"
        />
      )}
    </div>
  );
}
