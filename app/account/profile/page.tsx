'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  profile: {
    phoneNumber: string | null;
    dateOfBirth: string | null;
    profilePhoto: string | null;
    newsletterSubscribed: boolean;
  } | null;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    bio: '',
    newsletterSubscribed: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/users/me');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setFormData({
            name: data.name || '',
            phoneNumber: data.profile?.phoneNumber || '',
            bio: data.bio || '',
            newsletterSubscribed: data.profile?.newsletterSubscribed || false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updated = await response.json();
        setProfile(updated);
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
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

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {profile.image && (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="h-16 w-16 rounded-full"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.name || 'User Profile'}
                  </h1>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white font-medium hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="space-y-6">
              {editing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.newsletterSubscribed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newsletterSubscribed: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Subscribe to newsletter
                    </span>
                  </label>

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      className="rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="text-lg text-gray-900">{profile.name || 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-lg text-gray-900">{profile.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-lg text-gray-900">
                          {profile.profile?.phoneNumber || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-500">Bio</p>
                    <p className="mt-1 text-gray-900">{profile.bio || 'No bio added'}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={profile.profile?.newsletterSubscribed || false}
                        disabled
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Subscribed to newsletter
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="mt-6 rounded-lg bg-orange-500 px-4 py-2 text-white font-medium hover:bg-orange-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="/account/orders"
            className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">My Orders</h3>
            <p className="mt-1 text-sm text-gray-600">View your purchase history</p>
          </a>

          <a
            href="/account/addresses"
            className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Addresses</h3>
            <p className="mt-1 text-sm text-gray-600">Manage shipping addresses</p>
          </a>
        </div>
      </div>
    </div>
  );
}
