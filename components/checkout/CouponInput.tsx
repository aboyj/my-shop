'use client';

import { useState } from 'react';
import { Gift, Check, X } from 'lucide-react';

interface CouponInputProps {
  onApply: (code: string) => Promise<{ discount: number; message: string }>;
  onRemove?: () => void;
}

export default function CouponInput({ onApply, onRemove }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [discount, setDiscount] = useState(0);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await onApply(code.toUpperCase());
      setDiscount(result.discount);
      setSuccess(true);
      setCode('');
    } catch (err: any) {
      setError(err.message || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setDiscount(0);
    setSuccess(false);
    setCode('');
    setError('');
    if (onRemove) {
      onRemove();
    }
  };

  if (success && discount > 0) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="text-green-600" size={20} />
            <div>
              <p className="font-medium text-green-900">Coupon Applied</p>
              <p className="text-sm text-green-700">
                You saved ${discount.toFixed(2)}!
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-600 hover:text-green-800"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <Gift size={18} />
          Have a coupon code?
        </div>
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError('');
          }}
          placeholder="Enter coupon code"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
          maxLength={20}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!code.trim() || loading}
          className="rounded-lg bg-orange-500 px-6 py-2 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-center gap-2">
          <X className="text-red-600" size={18} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </form>
  );
}
