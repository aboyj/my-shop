'use client'

import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import { Button } from '@/components/common/Button'

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-secondary border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <nav className="container-max py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-orange-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="hidden sm:inline font-bold text-lg">{SITE_NAME}</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Portfolio
          </Link>
          <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/wishlist"
            className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            title="Wishlist"
          >
            ♡
          </Link>
          <Link
            href="/cart"
            className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors text-xl"
            title="Shopping Cart"
          >
            🛒
          </Link>
          <Link href="/login">
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
