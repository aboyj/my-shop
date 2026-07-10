'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, Eye, AlertCircle } from 'lucide-react';

export function OrdersHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to load orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container-max">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container-max">
          <div className="card bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="py-12">
        <div className="container-max">
          <div className="card bg-gray-50 dark:bg-gray-800 text-center py-16">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="heading-2 text-gray-900 dark:text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't placed any orders. Start shopping to get your first order!
            </p>
            <Link href="/shop" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container-max">
        <h1 className="heading-1 text-gray-900 dark:text-white mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Order Info */}
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Order ID</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white truncate">
                    {order.id}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Order Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Items Count */}
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Items</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.items.length} product{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Total */}
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total</p>
                  <p className="heading-3 text-primary">{formatPrice(order.total)}</p>
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          order.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : order.paymentStatus === 'failed'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {order.paymentStatus === 'completed' ? '✓ Paid' : 'Pending'}
                      </span>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {order.status === 'confirmed' ? '✓ Confirmed' : 'Processing'}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Eye size={20} />
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Items:</p>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item: any) => (
                    <span
                      key={item.id}
                      className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {item.product.title} (x{item.quantity})
                    </span>
                  ))}
                </div>
              </div>

              {/* Payment Failed Warning */}
              {order.paymentStatus === 'failed' && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg flex gap-2 text-red-700 dark:text-red-200 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>Payment failed. Please try again or contact support.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
