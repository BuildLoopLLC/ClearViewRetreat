'use client'

import { motion } from 'framer-motion'
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'

// Mock testimonials data - in real app this would come from the database
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Youth Group Leader',
    content: 'ClearView Retreat provided the perfect setting for our youth group to grow spiritually and build deeper relationships. The natural beauty and peaceful atmosphere created an environment where God\'s presence was truly felt.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Retreat Participant',
    content: 'I came to ClearView feeling spiritually drained and left completely renewed. The combination of outdoor activities, meaningful worship, and authentic community helped me reconnect with God in a profound way.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Family Camp Attendee',
    content: 'Our family has been coming to ClearView for three years now, and it\'s become our favorite tradition. The kids love the outdoor activities, and we appreciate the spiritual focus that makes it more than just a vacation.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Church Elder',
    content: 'As a church leader, I\'ve organized many retreats, but ClearView stands out for their attention to detail and genuine care for guests. They truly understand how to create an environment conducive to spiritual growth.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Solo Retreat Guest',
    content: 'I was nervous about attending a retreat alone, but the staff and other guests made me feel so welcome. The solitude I found in nature combined with the warm community was exactly what my soul needed.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: 6,
    name: 'Robert Martinez',
    role: 'Men\'s Group Leader',
    content: 'The wilderness challenge retreat was exactly what our men\'s group needed. It pushed us physically while deepening our spiritual bonds. The staff went above and beyond to make it a meaningful experience.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
]

export default function Testimonials() {
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
              What Our{' '}
              <span className="text-primary-600">Guests Say</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Hear from the many guests who have experienced 
              transformation and renewal at ClearView Retreat.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
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
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <div 
                      className="w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url('${testimonial.image}')` }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">{testimonial.name}</h4>
                    <p className="text-sm text-secondary-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
