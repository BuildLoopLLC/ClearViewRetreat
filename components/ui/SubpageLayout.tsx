'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface SubpageLayoutProps {
  title: string
  subtitle?: string
  breadcrumbs: Array<{ name: string; href: string }>
  children: React.ReactNode
  className?: string
}

export default function SubpageLayout({ 
  title, 
  subtitle, 
  breadcrumbs, 
  children, 
  className = "" 
}: SubpageLayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {/* Breadcrumb Navigation */}
      <nav className="bg-secondary-50 border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm text-secondary-600">
            <li>
              <Link 
                href="/" 
                className="flex items-center hover:text-primary-600 transition-colors duration-200"
              >
                <HomeIcon className="h-4 w-4 mr-1" />
                Home
              </Link>
            </li>
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.href} className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 mx-2 text-secondary-400" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-secondary-900 font-medium">
                    {breadcrumb.name}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="hover:text-primary-600 transition-colors duration-200"
                  >
                    {breadcrumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-primary-50 to-accent-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </motion.div>

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
