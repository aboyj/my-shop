'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/common/Button'

export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-light to-white dark:from-secondary dark:via-gray-800 dark:to-secondary flex items-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-primary/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-accent/10 to-transparent rounded-full blur-3xl"></div>

      <div className="container-max relative z-10">
        <motion.div
          className="max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main heading */}
          <motion.h1
            className="heading-1 text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-gray-900 dark:text-white leading-tight"
            variants={itemVariants}
          >
            Design Smarter. <br />
            <span className="gradient-text">Create Faster.</span> <br />
            Sell Better.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed"
            variants={itemVariants}
          >
            Discover premium digital products designed for creators, designers, freelancers, startups, and businesses. From Canva templates to UI kits, presentations, branding assets, mockups, and creative resources—everything is crafted to save time and elevate your work.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            variants={itemVariants}
          >
            <Link href="/shop">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Explore Products
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Portfolio
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Products Sold</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">2000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">5+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
