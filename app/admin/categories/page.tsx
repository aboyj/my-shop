'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import BreadcrumbNav from '@/components/admin/BreadcrumbNav';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  featured: boolean;
  order: number;
  _count: { products: number };
  createdAt: string;
}

export default function AdminCategories() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', icon: '', featured: false });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchCategories();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        if (editingId) {
          setCategories(categories.map((c) => (c.id === editingId ? data : c)));
        } else {
          setCategories([...categories, data]);
        }

        setFormData({ name: '', icon: '', featured: false });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      icon: category.icon || '',
      featured: category.featured,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(categories.filter((c) => c.id !== categoryId));
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', icon: '', featured: false });
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
        <BreadcrumbNav items={[{ name: 'Categories' }]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="mt-2 text-gray-600">Manage your product categories</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', icon: '', featured: false });
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            New Category
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="e.g., Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none text-2xl"
                    placeholder="📱"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured Category
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors"
                >
                  {editingId ? 'Update' : 'Create'} Category
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  {category.icon && (
                    <span className="text-3xl">{category.icon}</span>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category._count?.products || 0} products
                    </p>
                    {category.featured && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-yellow-600">
                        <Star size={14} />
                        Featured
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded p-2 hover:bg-gray-100"
                  >
                    <Edit2 size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="rounded p-2 hover:bg-red-100"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No categories yet. Create one to get started.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
