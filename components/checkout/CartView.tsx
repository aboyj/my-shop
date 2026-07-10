'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CartViewProps {
  requireAuth?: boolean;
}

export function CartView({ requireAuth }: CartViewProps) {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [updatingQuantity, setUpdatingQuantity] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.status === 401 && requireAuth) {
          router.push('/login?callbackUrl=/cart');
          return;
        }
        if (!response.ok) throw new Error('Failed to load cart');
        const data = await response.json();
        setItems(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router, requireAuth]);

  const handleRemoveItem = async (id: string) => {
    try {
      setRemoving(id);
      const response = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove item');
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
      return;
    }

    try {
      setUpdatingQuantity(id);
      const response = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) throw new Error('Failed to update quantity');

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    } finally {
      setUpdatingQuantity(null);
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container-max">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
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

  if (items.length === 0) {
    return (
      <section className="py-12">
        <div className="container-max">
          <div className="card bg-gray-50 dark:bg-gray-800 text-center py-16">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="heading-2 text-gray-900 dark:text-white mb-2">Cart is Empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add some products to get started!
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
        <h1 className="heading-1 text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card flex gap-4"
              >
                {/* Product Image */}
                {item.product.images?.[0] && (
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Item Details */}
                <div className="flex-1">
                  <Link href={`/shop/${item.product.slug || item.productId}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors">
                      {item.product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {item.product.category?.name || 'Uncategorized'}
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                {/* Quantity & Remove */}
                <div className="flex flex-col gap-2 items-end">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={updatingQuantity === item.id}
                      className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      className="w-12 text-center border-l border-r border-gray-300 dark:border-gray-600 bg-transparent py-1"
                      min="1"
                    />
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={updatingQuantity === item.id}
                      className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removing === item.id}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="card sticky top-24 h-fit">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-6">Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Tax (8%)</span>
                <span>{formatPrice(Math.round(total * 0.08))}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6 flex justify-between">
              <span className="heading-3 text-gray-900 dark:text-white">Total</span>
              <span className="heading-2 text-primary">
                {formatPrice(Math.round(total * 1.08))}
              </span>
            </div>

            <Link
              href="/checkout"
              className="btn-primary w-full text-center py-3 mb-3"
            >
              Proceed to Checkout
            </Link>

            <Link href="/shop" className="btn-outline w-full text-center py-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
