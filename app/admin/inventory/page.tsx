'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import BreadcrumbNav from '@/components/admin/BreadcrumbNav';
import { AlertCircle, Plus, Minus, Search } from 'lucide-react';

interface InventoryItem {
  id: string;
  productId: string;
  product: { title: string };
  quantity: number;
  reservedCount: number;
  lowStockThreshold: number;
}

export default function AdminInventory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          `/api/admin/inventory?search=${encodeURIComponent(searchQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setInventory(data);
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      const timer = setTimeout(fetchInventory, 300);
      return () => clearTimeout(timer);
    }
  }, [session, searchQuery]);

  const handleAdjustInventory = async (inventoryId: string) => {
    if (adjustAmount === 0) {
      setAdjustingId(null);
      return;
    }

    try {
      const response = await fetch(`/api/admin/inventory/${inventoryId}/adjust`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: adjustAmount, reason: 'Manual adjustment' }),
      });

      if (response.ok) {
        const updated = await response.json();
        setInventory(
          inventory.map((item) =>
            item.id === inventoryId ? updated : item
          )
        );
        setAdjustingId(null);
        setAdjustAmount(0);
      }
    } catch (error) {
      console.error('Failed to adjust inventory:', error);
    }
  };

  const lowStockItems = inventory.filter(
    (item) => item.quantity - item.reservedCount <= item.lowStockThreshold
  );

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
        <BreadcrumbNav items={[{ name: 'Inventory' }]} />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-gray-600">Track and manage product stock levels</p>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-yellow-900">
                  {lowStockItems.length} product(s) running low on stock
                </h3>
                <p className="text-sm text-yellow-800">
                  Review and reorder these items to avoid stockouts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
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

        {/* Inventory Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Stock Level
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Reserved
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Available
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Low Stock
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((item) => {
                  const available = item.quantity - item.reservedCount;
                  const isLow = available <= item.lowStockThreshold;

                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.product.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.quantity} units
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.reservedCount} units
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            isLow
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {available} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.lowStockThreshold} units
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {adjustingId === item.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  setAdjustAmount(Math.max(adjustAmount - 1, -item.quantity))
                                }
                                className="rounded-lg p-1 hover:bg-gray-100"
                              >
                                <Minus size={18} className="text-gray-600" />
                              </button>
                              <input
                                type="number"
                                value={adjustAmount}
                                onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                                className="w-16 rounded px-2 py-1 border border-gray-300 text-center text-sm"
                              />
                              <button
                                onClick={() => setAdjustAmount(adjustAmount + 1)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                              >
                                <Plus size={18} className="text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleAdjustInventory(item.id)}
                                className="rounded-lg bg-orange-500 px-3 py-1 text-white text-sm font-medium hover:bg-orange-600"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setAdjustingId(item.id);
                                setAdjustAmount(0);
                              }}
                              className="rounded-lg px-3 py-1 text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors"
                            >
                              Adjust
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No inventory records found
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
