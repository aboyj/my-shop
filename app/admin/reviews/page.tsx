'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import BreadcrumbNav from '@/components/admin/BreadcrumbNav';
import { Check, X, Star, Eye } from 'lucide-react';

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: string;
  user: { name: string; email: string };
  product: { title: string };
  createdAt: string;
}

export default function AdminReviews() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/admin/reviews?status=${statusFilter}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchReviews();
    }
  }, [session, statusFilter]);

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/approve`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
        setSelectedReview(null);
      }
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/reject`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
        setSelectedReview(null);
      }
    } catch (error) {
      console.error('Failed to reject review:', error);
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
        <BreadcrumbNav items={[{ name: 'Reviews' }]} />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Moderation</h1>
          <p className="mt-2 text-gray-600">Approve or reject customer reviews</p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  onClick={() => setSelectedReview(review)}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    selectedReview?.id === review.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <h4 className="mt-1 font-semibold text-gray-900">
                        {review.title}
                      </h4>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        review.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : review.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>

                  <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                    {review.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div>
                      <p>
                        <strong>{review.user.name}</strong> on{' '}
                        {review.product.title}
                      </p>
                      <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
                No {statusFilter} reviews
              </div>
            )}
          </div>

          {/* Review Detail */}
          {selectedReview && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Review Details
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Product
                  </p>
                  <p className="text-gray-900">{selectedReview.product.title}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Reviewer
                  </p>
                  <p className="text-gray-900">{selectedReview.user.name}</p>
                  <p className="text-sm text-gray-600">{selectedReview.user.email}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Rating
                  </p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < selectedReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Title
                  </p>
                  <p className="text-gray-900">{selectedReview.title}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Review
                  </p>
                  <p className="text-gray-700">{selectedReview.content}</p>
                </div>

                {/* Actions */}
                {selectedReview.status === 'pending' && (
                  <div className="space-y-2 border-t border-gray-200 pt-4">
                    <button
                      onClick={() => handleApprove(selectedReview.id)}
                      className="w-full rounded-lg bg-green-500 px-4 py-2 text-white font-medium hover:bg-green-600 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Check size={18} />
                      Approve Review
                    </button>
                    <button
                      onClick={() => handleReject(selectedReview.id)}
                      className="w-full rounded-lg bg-red-500 px-4 py-2 text-white font-medium hover:bg-red-600 flex items-center justify-center gap-2 transition-colors"
                    >
                      <X size={18} />
                      Reject Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
