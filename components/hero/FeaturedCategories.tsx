'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CATEGORIES } from '@/lib/constants'
import { Button } from '@/components/common/Button'

export const FeaturedCategories = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container-max">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-2 mb-4">Featured Categories</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse our carefully curated collection of premium digital products
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {CATEGORIES.slice(0, 8).map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link href={`/shop/category/${category.slug}`}>
                <div className="group card cursor-pointer hover:border-primary hover:border">
                  <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-4xl">{['🎨', '🎯', '📊', '📝', '🎭', '🖼️', '🎪', '📱'][Math.floor(Math.random() * 8)]}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.floor(Math.random() * 100 + 20)} products
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Explore All Categories
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
