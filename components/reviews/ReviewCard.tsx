'use client';

import { Star, ThumbsUp, Flag } from 'lucide-react';
import { useState } from 'react';

interface ReviewCardProps {
  id: string;
  author: { name: string; image?: string };
  rating: number;
  title: string;
  content: string;
  helpfulCount: number;
  verifiedPurchase: boolean;
  createdAt: string;
  onMarkHelpful?: (reviewId: string) => Promise<void>;
}

export default function ReviewCard({
  id,
  author,
  rating,
  title,
  content,
  helpfulCount,
  verifiedPurchase,
  createdAt,
  onMarkHelpful,
}: ReviewCardProps) {
  const [isMarked, setIsMarked] = useState(false);
  const [helpful, setHelpful] = useState(helpfulCount);

  const handleMarkHelpful = async () => {
    if (isMarked) return;

    try {
      if (onMarkHelpful) {
        await onMarkHelpful(id);
      }
      setIsMarked(true);
      setHelpful(helpful + 1);
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {author.image && (
            <img
              src={author.image}
              alt={author.name}
              className="h-10 w-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">{author.name}</p>
            <p className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {verifiedPurchase && (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            ✓ Verified Purchase
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="mb-2 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </div>

      {/* Title & Content */}
      <h4 className="mb-2 font-semibold text-gray-900">{title}</h4>
      <p className="mb-4 text-gray-600">{content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
        <button
          onClick={handleMarkHelpful}
          disabled={isMarked}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 disabled:opacity-50 transition-colors"
        >
          <ThumbsUp size={16} />
          Helpful ({helpful})
        </button>

        <button className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
          <Flag size={16} />
          Report
        </button>
      </div>
    </div>
  );
}
