'use client'

import { motion } from 'framer-motion'
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

// Testimonials are now loaded dynamically from the database

export default function Testimonials() {
  const { getContentValue, getMetadata, loading } = useWebsiteContent('testimonials')

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-b from-white to-secondary-50">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-gradient-to-b from-white to-secondary-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              {getContentValue('title')}
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              {getContentValue('subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(() => {
            // Dynamically generate testimonials from database content
            const dynamicTestimonials = []
            for (let i = 1; i <= 3; i++) {
              const content = getContentValue(`testimonial-${i}`)
              const metadata = getMetadata(`testimonial-${i}`)
              
              if (content && metadata) {
                dynamicTestimonials.push({
                  id: i,
                  content,
                  author: metadata.author || 'Guest',
                  role: metadata.role || 'Retreat Participant',
                  rating: 5
                })
              }
            }
            
            return dynamicTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="card h-full p-8 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-200" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-secondary-700 leading-relaxed mb-6 text-lg">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary-200 flex items-center justify-center">
                      <span className="text-2xl text-secondary-600 font-bold">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-900">{testimonial.author}</h4>
                      <p className="text-sm text-secondary-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          })()}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '98%', label: 'Guest Satisfaction' },
                { number: '500+', label: 'Happy Guests' },
                { number: '25+', label: 'Years of Service' },
                { number: '4.9/5', label: 'Average Rating' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-primary-100 text-sm uppercase tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-6">
              Ready to Create Your Own Story?
            </h3>
            <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
              Join the hundreds of guests who have experienced transformation at ClearView Retreat. 
              Your journey to spiritual renewal and community building starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/events"
                className="btn-primary text-lg px-8 py-4"
              >
                Book Your Retreat
              </a>
              <a
                href="/contact"
                className="btn-outline text-lg px-8 py-4"
              >
                Ask Questions
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
