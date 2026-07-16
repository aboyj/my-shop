'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import MetricCard from '@/components/admin/MetricCard';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchMetrics();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-10 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded bg-gray-200"
              ></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your admin dashboard. Here's what's happening with your store today.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={`$${metrics?.totalRevenue || 0}`}
            icon={<DollarSign size={32} />}
            trend={12}
            color="orange"
          />
          <MetricCard
            title="Total Orders"
            value={metrics?.totalOrders || 0}
            icon={<ShoppingCart size={32} />}
            trend={8}
            color="blue"
          />
          <MetricCard
            title="Total Products"
            value={metrics?.totalProducts || 0}
            icon={<Package size={32} />}
            trend={-2}
            color="green"
          />
          <MetricCard
            title="Total Users"
            value={metrics?.totalUsers || 0}
            icon={<Users size={32} />}
            trend={15}
            color="purple"
          />
        </div>

        {/* Recent Orders Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Recent Orders</h2>
          {metrics?.recentOrders && metrics.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.user?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ${order.totalAmount}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No orders yet</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
