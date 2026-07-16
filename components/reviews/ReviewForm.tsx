'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  onSubmit: (review: { rating: number; title: string; content: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function ReviewForm({ productId, onSubmit, isLoading }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await onSubmit({ rating, title, content });
      setTitle('');
      setContent('');
      setRating(5);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-xl font-semibold text-gray-900">Write a Review</h3>

      {submitted && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
          Thank you! Your review has been submitted and will be displayed after moderation.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your review a title"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
            maxLength={100}
          />
        </div>

        {/* Content */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your honest thoughts about this product..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
            maxLength={1000}
          />
          <p className="mt-1 text-xs text-gray-500">
            {content.length}/1000 characters
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
