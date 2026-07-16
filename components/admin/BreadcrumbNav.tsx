'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <div className="mb-6 flex items-center gap-2 text-sm">
      <Link href="/admin" className="text-gray-600 hover:text-gray-900">
        Dashboard
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={16} className="text-gray-400" />
          {item.href ? (
            <Link href={item.href} className="text-gray-600 hover:text-gray-900">
              {item.name}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}
