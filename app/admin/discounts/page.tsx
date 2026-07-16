'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import BreadcrumbNav from '@/components/admin/BreadcrumbNav';
import { Plus, Edit2, Trash2, Copy } from 'lucide-react';

interface Discount {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUses: number | null;
  usedCount: number;
  minOrderAmount: number;
  expiresAt: string | null;
  createdAt: string;
}

export default function AdminDiscounts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    maxUses: null as number | null,
    minOrderAmount: 0,
    expiresAt: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch('/api/admin/discounts');
        if (response.ok) {
          const data = await response.json();
          setDiscounts(data);
        }
      } catch (error) {
        console.error('Failed to fetch discounts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchDiscounts();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      alert('Coupon code is required');
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/discounts/${editingId}`
        : '/api/admin/discounts';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        if (editingId) {
          setDiscounts(discounts.map((d) => (d.id === editingId ? data : d)));
        } else {
          setDiscounts([...discounts, data]);
        }

        setFormData({
          code: '',
          type: 'percentage',
          value: 10,
          maxUses: null,
          minOrderAmount: 0,
          expiresAt: '',
        });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save discount:', error);
    }
  };

  const handleEdit = (discount: Discount) => {
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      maxUses: discount.maxUses,
      minOrderAmount: discount.minOrderAmount,
      expiresAt: discount.expiresAt ? discount.expiresAt.split('T')[0] : '',
    });
    setEditingId(discount.id);
    setShowForm(true);
  };

  const handleDelete = async (discountId: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/discounts/${discountId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDiscounts(discounts.filter((d) => d.id !== discountId));
      }
    } catch (error) {
      console.error('Failed to delete discount:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      code: '',
      type: 'percentage',
      value: 10,
      maxUses: null,
      minOrderAmount: 0,
      expiresAt: '',
    });
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
        <BreadcrumbNav items={[{ name: 'Discounts' }]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discount Codes</h1>
            <p className="mt-2 text-gray-600">
              Create and manage promotional coupon codes
            </p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                code: '',
                type: 'percentage',
                value: 10,
                maxUses: null,
                minOrderAmount: 0,
                expiresAt: '',
              });
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            New Discount
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none uppercase"
                    placeholder="SUMMER20"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: parseFloat(e.target.value) })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder={formData.type === 'percentage' ? '20' : '10.00'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Order Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderAmount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Uses (Leave empty for unlimited)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxUses || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxUses: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date (Leave empty for no expiration)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 border-t border-gray-200 pt-4">
                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors"
                >
                  {editingId ? 'Update' : 'Create'} Discount
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

        {/* Discounts Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Expires
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {discounts.length > 0 ? (
                discounts.map((discount) => (
                  <tr
                    key={discount.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                      {discount.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {discount.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {discount.type === 'percentage'
                        ? `${discount.value}%`
                        : `$${discount.value}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {discount.usedCount}
                      {discount.maxUses && `/${discount.maxUses}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {discount.expiresAt
                        ? new Date(discount.expiresAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(discount)}
                          className="rounded-lg p-2 hover:bg-gray-100"
                        >
                          <Edit2 size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(discount.id)}
                          className="rounded-lg p-2 hover:bg-red-100"
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
                    No discounts yet. Create one to get started.
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
