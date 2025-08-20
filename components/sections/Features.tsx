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

const features = [
  {
    name: 'Spiritual Growth',
    description: 'Deepen your faith through guided Bible studies, prayer sessions, and worship experiences in nature.',
    icon: HeartIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    name: 'Nature Connection',
    description: 'Immerse yourself in God\'s creation with hiking trails, outdoor activities, and peaceful natural settings.',
    icon: MapPinIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    name: 'Community Building',
    description: 'Build meaningful relationships and strengthen bonds through shared experiences and group activities.',
    icon: UsersIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    name: 'Learning & Growth',
    description: 'Expand your knowledge through workshops, seminars, and hands-on learning experiences.',
    icon: BookOpenIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    name: 'Creative Expression',
    description: 'Express your creativity through art, music, photography, and other artistic activities.',
    icon: CameraIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    name: 'Personal Renewal',
    description: 'Find rest, refreshment, and renewal for your mind, body, and spirit in our peaceful environment.',
    icon: StarIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
]

export default function Features() {
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
            Why Choose{' '}
            <span className="text-primary-600">ClearView</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-secondary-700 max-w-3xl mx-auto leading-relaxed"
          >
            Our retreat center offers a unique combination of spiritual growth, natural beauty, and community building that creates transformative experiences.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
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
                  {feature.name}
                </h3>
                <p className="text-secondary-700 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="mt-auto">
                  <a
                    href="/about"
                    className={`inline-flex items-center text-sm font-semibold ${feature.color} hover:${feature.color.replace('600', '700')} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 rounded-md`}
                    aria-label={`Learn more about ${feature.name}`}
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
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
                View Events
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
