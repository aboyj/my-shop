'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import BreadcrumbNav from '@/components/admin/BreadcrumbNav';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: string;
  category: { name: string };
  createdAt: string;
}

export default function AdminProducts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (statusFilter !== 'all') queryParams.append('status', statusFilter);

        const response = await fetch(`/api/admin/products?${queryParams}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      const timer = setTimeout(fetchProducts, 300);
      return () => clearTimeout(timer);
    }
  }, [session, searchQuery, statusFilter]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-10 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-96 animate-pulse rounded bg-gray-200"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <BreadcrumbNav items={[{ name: 'Products' }]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="mt-2 text-gray-600">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Created
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-medium text-orange-600 hover:text-orange-700"
                      >
                        {product.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          product.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="rounded-lg p-2 hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 size={18} className="text-gray-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg p-2 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
