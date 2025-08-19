'use client'

import { motion } from 'framer-motion'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export interface Subpage {
  title: string
  href: string
  description?: string
}

interface SubpageNavigationProps {
  title: string
  subtitle?: string
  subpages: Subpage[]
  className?: string
}

export default function SubpageNavigation({ 
  title, 
  subtitle, 
  subpages, 
  className = "" 
}: SubpageNavigationProps) {
  return (
    <section className={`py-16 bg-gradient-to-br from-primary-50 to-accent-50 ${className}`}>
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subpages.map((subpage, index) => (
            <motion.div
              key={subpage.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={subpage.href}
                className="group block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-display font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-200">
                    {subpage.title}
                  </h3>
                  <ChevronRightIcon className="h-5 w-5 text-primary-600 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
                {subpage.description && (
                  <p className="text-secondary-600 leading-relaxed">
                    {subpage.description}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
