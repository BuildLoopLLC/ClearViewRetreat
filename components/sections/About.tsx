'use client'

import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

const stats = [
  { number: '25+', label: 'Years of Ministry' },
  { number: '1000+', label: 'Lives Transformed' },
  { number: '50+', label: 'Acres of Natural Beauty' },
  { number: '100%', label: 'Christ-Centered' },
]

interface AboutProps {
  showCTA?: boolean
}

export default function About({ showCTA = true }: AboutProps) {
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
                Our{' '}
                <span className="text-primary-600">Mission</span>
              </h2>
              <p className="text-lg text-secondary-600 leading-relaxed mb-6">
                Intentional Intimacy International, a nonprofit organization, uses biblical teaching to draw people to Christ and promotes intentional intimacy within and among families through seminars, workshops, and retreats.
              </p>
            </div>

            {/* Vision */}
            <div>
              <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
                Our Vision
              </h3>
              <p className="text-lg text-secondary-600 leading-relaxed mb-6">
                To build intimacy and accountability in groups of families by providing skills and encouragement in order to revolutionize the way families and communities relate to one another.
              </p>
            </div>

            {/* Passion */}
            <div>
              <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
                Our Passion
              </h3>
              <p className="text-lg text-secondary-600 leading-relaxed mb-6">
                Intentional intimacy — living life with passion.
              </p>
            </div>

            {/* Commission */}
            <div>
              <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
                Our Commission
              </h3>
              <p className="text-lg text-secondary-600 leading-relaxed mb-4">
                We are called by God…
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <span className="text-secondary-700">
                    …to demonstrate the love and hope of Christ through "one another" living
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <span className="text-secondary-700">
                    …to minister to others who are hurting and struggling to understand what God meant when He spoke of "living life abundantly"
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <span className="text-secondary-700">
                    …to encourage believers to trust God with their relationships and interactions
                  </span>
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
                  {stats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {stat.number}
                      </span>
                      <span className="text-sm text-secondary-600 text-right">
                        {stat.label}
                      </span>
                    </div>
                  ))}
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
