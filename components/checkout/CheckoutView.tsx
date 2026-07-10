'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckoutSummary } from './CheckoutSummary';
import { CheckoutForm } from './CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutViewProps {
  userEmail: string;
}

export function CheckoutView({ userEmail }: CheckoutViewProps) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to load cart');
        const data = await response.json();
        setCartItems(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container-max">
          <div className="max-w-6xl mx-auto bg-gray-200 dark:bg-gray-700 h-96 rounded-lg animate-pulse" />
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

  if (cartItems.length === 0) {
    return (
      <section className="py-12">
        <div className="container-max">
          <div className="card bg-gray-50 dark:bg-gray-800 text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Your cart is empty</p>
            <a href="/shop" className="btn-primary inline-block">
              Continue Shopping
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container-max">
        <h1 className="heading-1 text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm userEmail={userEmail} total={total} cartItems={cartItems} />
            </Elements>
          </div>

          {/* Order Summary */}
          <div>
            <CheckoutSummary items={cartItems} total={total} />
          </div>
        </div>
      </div>
    </section>
  );
}
