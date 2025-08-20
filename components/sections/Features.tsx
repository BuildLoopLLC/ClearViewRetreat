'use client'

import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  MapPinIcon, 
  UsersIcon, 
  BookOpenIcon,
  CameraIcon,
  StarIcon 
} from '@heroicons/react/24/outline'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

// Dynamic features will be loaded from DynamoDB
const iconMap: Record<string, any> = {
  HeartIcon,
  MapPinIcon,
  UsersIcon,
  BookOpenIcon,
  CameraIcon,
  StarIcon
}

const colorMap = [
  { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' }
]

export default function Features() {
  const { getContentValue, getMetadata, loading } = useWebsiteContent('features')

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-secondary-50" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            id="features-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6"
          >
            {getContentValue('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-secondary-700 max-w-3xl mx-auto leading-relaxed"
          >
            {getContentValue('subtitle')}
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(() => {
            // Dynamically generate features from database content
            const dynamicFeatures = []
            for (let i = 1; i <= 3; i++) {
              const title = getContentValue(`feature-${i}-title`)
              const description = getContentValue(`feature-${i}-description`)
              const iconName = getMetadata(`feature-${i}-description`)?.icon || 'StarIcon'
              const IconComponent = iconMap[iconName] || StarIcon
              const colorScheme = colorMap[i - 1] || colorMap[0]
              
              if (title && description) {
                dynamicFeatures.push({
                  title,
                  description,
                  icon: IconComponent,
                  ...colorScheme
                })
              }
            }
            
            return dynamicFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="h-full bg-white rounded-2xl p-8 shadow-lg border-2 border-secondary-200 hover:border-secondary-300 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 focus-within:ring-4 focus-within:ring-primary-600 focus-within:ring-offset-4 focus-within:outline-none">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${feature.bgColor} ${feature.borderColor} border-2 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-700 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="mt-auto">
                    <a
                      href="/about"
                      className={`inline-flex items-center text-sm font-semibold ${feature.color} hover:${feature.color.replace('600', '700')} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 rounded-md`}
                      aria-label={`Learn more about ${feature.title}`}
                    >
                      Learn More
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          })()}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-secondary-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-secondary-700 mb-6">
              Join us for your next retreat and discover the transformative power of ClearView.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/events"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-600 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-h-[48px]"
                aria-label="View upcoming events and retreats"
              >
                {getContentValue('cta')}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 bg-white text-secondary-700 border-2 border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400 focus:outline-none focus:ring-4 focus:ring-primary-600 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-h-[48px]"
                aria-label="Contact us for more information"
              >
                Contact Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
