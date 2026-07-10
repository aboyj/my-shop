'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface OrderConfirmationProps {
  order: any;
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;

  return (
    <section className="py-12">
      <div className="container-max max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="heading-1 text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Thank you for your purchase. Your order has been received and confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="card mb-8">
          <div className="grid grid-cols-2 gap-4 md:gap-8 mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Order Number</p>
              <p className="heading-3 text-gray-900 dark:text-white font-mono">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
              <p className="heading-3 text-gray-900 dark:text-white">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
              <p className="heading-3 text-green-600 font-semibold capitalize">{order.paymentStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Order Status</p>
              <p className="heading-3 text-blue-600 font-semibold capitalize">{order.status}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card mb-8">
          <h2 className="heading-2 text-gray-900 dark:text-white mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
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
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {item.product.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                {/* Download Button */}
                <div className="flex-shrink-0">
                  <button className="flex items-center gap-2 bg-primary hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="card mb-8 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span>{formatPrice(Math.round(order.total / 1.08))}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Tax (8%)</span>
              <span>{formatPrice(order.total - Math.round(order.total / 1.08))}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="pt-3 border-t border-gray-300 dark:border-gray-700 flex justify-between">
              <span className="heading-3 text-gray-900 dark:text-white">Total</span>
              <span className="heading-2 text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {shippingAddress && (
          <div className="card mb-8">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">Shipping Address</h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
              </p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="card bg-blue-50 dark:bg-blue-900 mb-8">
          <h3 className="heading-3 text-blue-900 dark:text-blue-100 mb-3">What's Next?</h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-2">
            <li>✓ Download your digital products immediately</li>
            <li>✓ A confirmation email has been sent to {order.userId}</li>
            <li>✓ You can access your purchases anytime from your account</li>
            <li>✓ Check your order status in your order history</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/orders" className="btn-secondary text-center py-3">
            View All Orders
          </Link>
          <Link href="/shop" className="btn-primary text-center py-3 flex items-center justify-center gap-2">
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
