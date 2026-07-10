'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (response.ok) {
        // TODO: Show toast notification
        console.log('Added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted) {
        // TODO: Implement remove from wishlist
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });

        if (response.ok) {
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const firstImage = product.images?.[0]?.url || '/placeholder.png';

  return (
    <Link href={`/shop/${product.slug || product.id}`}>
      <div className="card group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Product Image */}
        <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-lg mb-4">
          <Image
            src={firstImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.status === 'limited' && (
            <div className="absolute top-3 right-3 badge bg-red-500">Limited</div>
          )}
        </div>

        {/* Product Info */}
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
          {product.title}
        </h3>

        {/* Category */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {product.category?.name || 'Uncategorized'}
        </p>

        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(product.avgRating)
                      ? 'fill-accent text-accent'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="heading-3 text-primary">{formatPrice(product.price)}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleToggleWishlist();
            }}
            className={`p-2 rounded-lg transition-colors ${
              isWishlisted
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          disabled={isAddingToCart}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
