'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function AdminHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <header className="border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          {session?.user && (
            <div className="flex items-center gap-3">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {session.user.name}
                </span>
                <span className="text-xs text-gray-500">
                  {session.user.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
