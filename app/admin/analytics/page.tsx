'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import BreadcrumbNav from '@/components/admin/BreadcrumbNav';
import MetricCard from '@/components/admin/MetricCard';
import { BarChart3, TrendingUp, Users, ShoppingCart, Download } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  avgOrderValue: number;
  topProducts: Array<{ title: string; sales: number }>;
  eventCounts: Record<string, number>;
  dailyRevenue: Array<{ date: string; revenue: number }>;
}

export default function AnalyticsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `/api/admin/analytics/overview?dateRange=${dateRange}`
        );
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [session, dateRange]);

  const handleExportData = async () => {
    try {
      const response = await fetch(
        `/api/admin/analytics/export?dateRange=${dateRange}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export analytics:', error);
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
        <BreadcrumbNav items={[{ name: 'Analytics' }]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-2 text-gray-600">Track sales, traffic, and user behavior</p>
          </div>

          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Revenue"
                value={`$${analytics.totalRevenue}`}
                icon={<TrendingUp size={32} />}
                trend={15}
                color="orange"
              />
              <MetricCard
                title="Total Orders"
                value={analytics.totalOrders}
                icon={<ShoppingCart size={32} />}
                trend={8}
                color="blue"
              />
              <MetricCard
                title="Conversion Rate"
                value={`${analytics.conversionRate.toFixed(1)}%`}
                icon={<BarChart3 size={32} />}
                trend={3}
                color="green"
              />
              <MetricCard
                title="Avg Order Value"
                value={`$${analytics.avgOrderValue.toFixed(2)}`}
                icon={<Users size={32} />}
                trend={5}
                color="purple"
              />
            </div>

            {/* Top Products */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Top Selling Products</h2>
              <div className="space-y-3">
                {analytics.topProducts.length > 0 ? (
                  analytics.topProducts.slice(0, 5).map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-orange-500"
                            style={{
                              width: `${
                                (product.sales /
                                  Math.max(
                                    ...analytics.topProducts.map((p) => p.sales)
                                  )) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="ml-4 text-sm font-semibold text-gray-900">
                        {product.sales} sales
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No sales data available</p>
                )}
              </div>
            </div>

            {/* Event Analytics */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">User Events</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {Object.entries(analytics.eventCounts).map(([event, count]) => (
                  <div
                    key={event}
                    className="rounded-lg border border-gray-200 p-4 text-center"
                  >
                    <p className="text-sm font-medium text-gray-600">
                      {event.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
