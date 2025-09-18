'use client'

import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

interface AboutProps {
  showCTA?: boolean
}

export default function About({ showCTA = true }: AboutProps) {
  const { content: aboutContent, loading } = useWebsiteContent('about')
  const { getContentValue: getStatsValue, loading: statsLoading } = useWebsiteContent('statistics')

  // Helper function to get content by metadata name
  const getContentByMetadataName = (name: string): string => {
    if (!aboutContent) return ''
    const item = aboutContent.find(item => item.metadata?.name === name)
    return item?.content || ''
  }

  if (loading || statsLoading) {
    return (
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Mission */}
            <div>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6"
                dangerouslySetInnerHTML={{ __html: getContentByMetadataName('Main About Title') || 'About Clear View Retreat' }}
              />
              <div className="text-lg text-secondary-600 leading-relaxed mb-6">
                {getContentByMetadataName('Main About Content') ? (
                  <div dangerouslySetInnerHTML={{ __html: getContentByMetadataName('Main About Content') }} />
                ) : (
                  <p>Clear View Retreat is a Christ-centered ministry dedicated to strengthening families through intentional intimacy and meaningful relationships. Our beautiful retreat center in Tennessee provides the perfect setting for families to step away from the distractions of daily life and focus on what truly matters.</p>
                )}
              </div>
            </div>

            {/* Values */}
            <div>
              <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
                {getContentByMetadataName('Values Section Title')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary-900">{getContentByMetadataName('Value 1 Title')}</h4>
                    <p className="text-secondary-700">{getContentByMetadataName('Value 1 Description')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary-900">{getContentByMetadataName('Value 2 Title')}</h4>
                    <p className="text-secondary-700">{getContentByMetadataName('Value 2 Description')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary-900">{getContentByMetadataName('Value 3 Title')}</h4>
                    <p className="text-secondary-700">{getContentByMetadataName('Value 3 Description')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA - Only show when showCTA is true */}
            {showCTA && (
              <div className="pt-4">
                <a
                  href="/about"
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center group"
                >
                  Learn More About Us
                  <svg
                    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            )}
          </motion.div>

          {/* Image and Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')"
                  }}
                />
              </div>
              
              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 max-w-xs"
              >
                <h4 className="text-lg font-semibold text-secondary-900 mb-4">
                  Our Impact
                </h4>
                <div className="space-y-3">
                  {(() => {
                    // Dynamically generate statistics from database content
                    const dynamicStats = []
                    for (let i = 1; i <= 4; i++) {
                      const number = getStatsValue(`about-stat-${i}-number`)
                      const label = getStatsValue(`about-stat-${i}-label`)
                      
                      if (number && label) {
                        dynamicStats.push({
                          number,
                          label
                        })
                      }
                    }
                    
                    // Fallback to default stats if no database content
                    if (dynamicStats.length === 0) {
                      return [
                        { number: '25+', label: 'Years of Ministry' },
                        { number: '1000+', label: 'Lives Transformed' },
                        { number: '50+', label: 'Acres of Natural Beauty' },
                        { number: '100%', label: 'Christ-Centered' },
                      ].map((stat, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-primary-600">
                            {stat.number}
                          </span>
                          <span className="text-sm text-secondary-600 text-right">
                            {stat.label}
                          </span>
                        </div>
                      ))
                    }
                    
                    return dynamicStats.map((stat, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary-600">
                          {stat.number}
                        </span>
                        <span className="text-sm text-secondary-600 text-right">
                          {stat.label}
                        </span>
                      </div>
                    ))
                  })()}
                </div>
              </motion.div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8">
              <h3 className="text-xl font-display font-semibold text-secondary-900 mb-4">
                A Place of Transformation
              </h3>
              <p className="text-secondary-700 leading-relaxed">
                Every year, hundreds of guests leave ClearView Retreat with renewed faith, 
                deeper relationships, and a clearer vision for their spiritual journey. 
                Join the countless lives that have been changed through our ministry.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
