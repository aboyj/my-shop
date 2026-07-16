'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Plus, MapPin, Check } from 'lucide-react';

interface Address {
  id: string;
  type: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'shipping',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    isDefault: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/users/me/addresses');
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchAddresses();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/users/me/addresses/${editingId}`
        : '/api/users/me/addresses';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        if (editingId) {
          setAddresses(addresses.map((a) => (a.id === editingId ? data : a)));
        } else {
          setAddresses([...addresses, data]);
        }

        resetForm();
      }
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await fetch(`/api/users/me/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAddresses(addresses.filter((a) => a.id !== addressId));
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'shipping',
      fullName: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="h-96 animate-pulse rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
            <p className="mt-2 text-gray-600">Manage your shipping and billing addresses</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Add Address
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-lg bg-white shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) =>
                      setFormData({ ...formData, zip: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Set as default address
                </span>
              </label>

              <div className="flex gap-2 border-t border-gray-200 pt-4">
                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors"
                >
                  {editingId ? 'Update' : 'Add'} Address
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-lg border border-gray-200 bg-white p-6 relative"
              >
                {address.isDefault && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    <Check size={14} />
                    Default
                  </div>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="text-orange-500 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{address.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                    </p>
                  </div>
                </div>

                <div className="mb-4 space-y-1 text-sm text-gray-600">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p>{address.country}</p>
                </div>

                <div className="flex gap-2 border-t border-gray-200 pt-4">
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <MapPin className="mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600">No addresses yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-orange-600 font-medium hover:text-orange-700"
              >
                Add your first address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
