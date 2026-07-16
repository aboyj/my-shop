'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Percent,
  BarChart3,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Discounts', href: '/admin/discounts', icon: Percent },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-md bg-white p-2 md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`w-64 transform bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-transform duration-300 ${
          !isOpen ? '-translate-x-full md:translate-x-0' : ''
        } md:translate-x-0`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold">MyShop Admin</h1>
        </div>

        <nav className="space-y-2 px-4">
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 border-t border-slate-700 pt-6">
          <p className="text-xs text-gray-400">Phase 2 Admin System</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
