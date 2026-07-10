'use client';

import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

interface CheckoutSummaryProps {
  items: any[];
  total: number;
}

export function CheckoutSummary({ items, total }: CheckoutSummaryProps) {
  const TAX_RATE = 0.08;
  const subtotal = total;
  const tax = Math.round(subtotal * TAX_RATE);
  const finalTotal = subtotal + tax;

  return (
    <div className="card sticky top-24 space-y-6">
      <h3 className="heading-3 text-gray-900 dark:text-white flex items-center gap-2">
        <ShoppingCart size={24} />
        Order Summary
      </h3>

      {/* Items List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            {/* Product Image */}
            {item.product.images?.[0] && (
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Product Info */}
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {item.product.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Qty: {item.quantity}
              </p>
              <p className="text-sm font-semibold text-primary">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Tax (8%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Shipping</span>
          <span className="text-green-600 font-semibold">FREE</span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex justify-between items-center">
        <span className="heading-3 text-gray-900 dark:text-white">Total</span>
        <span className="heading-2 text-primary">
          {formatPrice(finalTotal)}
        </span>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <p>✓ Instant delivery</p>
        <p>✓ Secure checkout</p>
        <p>✓ No additional fees</p>
      </div>
    </div>
  );
}
