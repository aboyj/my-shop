'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/common/Button';

interface ProductDetailViewProps {
  product: any;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (response.ok) {
        // TODO: Show success toast
        setQuantity(1);
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

  const images = product.images || [];
  const currentImage = images[selectedImage] || { url: '/placeholder.png' };

  return (
    <section className="py-12">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative h-96 w-full bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 overflow-hidden">
              <Image
                src={currentImage.url}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-4">
                {images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.category?.name || 'Uncategorized'}
              </p>
            </div>

            {/* Title */}
            <h1 className="heading-1 text-gray-900 dark:text-white">{product.title}</h1>

            {/* Rating */}
            {product.avgRating > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < Math.floor(product.avgRating)
                          ? 'fill-accent text-accent'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {product.avgRating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="text-4xl font-bold text-primary">{formatPrice(product.price)}</div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="badge bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-l border-r border-gray-300 dark:border-gray-600 bg-transparent py-2"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleToggleWishlist}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? 'bg-red-50 dark:bg-red-900 border-red-500 text-red-600'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                  }`}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart size={24} />
                {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="card bg-gray-50 dark:bg-gray-900 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Digital Product</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Instant Download
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Seller</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Premium Designer
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">License</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Personal & Commercial
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-8">Customer Reviews</h2>
            <div className="space-y-6">
              {product.reviews.map((review: any) => (
                <div key={review.id} className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                      {review.user?.name?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {review.user?.name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'fill-accent text-accent' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
