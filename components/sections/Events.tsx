'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

// Mock data - in real app this would come from the database
const upcomingEvents = [
  {
    id: 1,
    title: 'Spring Renewal Retreat',
    date: 'March 15-17, 2024',
    location: 'Main Lodge',
    participants: '25/30',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'A weekend of spiritual renewal, prayer, and community building in the beauty of spring.',
    featured: true,
  },
  {
    id: 2,
    title: 'Family Adventure Camp',
    date: 'April 5-7, 2024',
    location: 'Outdoor Pavilion',
    participants: '40/50',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    description: 'Fun-filled activities for the whole family, including hiking, crafts, and worship.',
    featured: false,
  },
  {
    id: 3,
    title: 'Men\'s Wilderness Challenge',
    date: 'April 19-21, 2024',
    location: 'Wilderness Area',
    participants: '15/20',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'An outdoor adventure designed to challenge men physically and spiritually.',
    featured: false,
  },
]

export default function Events() {
  return (
    <section className="section-padding bg-gradient-to-b from-secondary-50 to-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              Upcoming{' '}
              <span className="text-primary-600">Events</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Join us for transformative experiences that will renew your spirit, 
              strengthen your faith, and connect you with like-minded believers.
            </p>
          </motion.div>
        </div>

        {/* Featured Event */}
        {upcomingEvents.filter(event => event.featured).map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${event.image}')` }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      Featured Event
                    </span>
                  </div>
                </div>
                
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                    {event.title}
                  </h3>
                  <p className="text-lg text-secondary-600 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-primary-600" />
                      <span className="text-secondary-700">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-5 w-5 text-primary-600" />
                      <span className="text-secondary-700">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <UsersIcon className="h-5 w-5 text-primary-600" />
                      <span className="text-secondary-700">{event.participants} participants</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/events/${event.id}`}
                      className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group"
                    >
                      Learn More
                      <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                    <Link
                      href={`/events/${event.id}/register`}
                      className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
                    >
                      Register Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Other Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.filter(event => !event.featured).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="card h-full overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="aspect-[4/3] overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url('${event.image}')` }}
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {event.title}
                  </h3>
                  
                  <p className="text-secondary-600 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-6 text-sm text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-primary-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-4 w-4 text-primary-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-4 w-4 text-primary-600" />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link
                      href={`/events/${event.id}`}
                      className="btn-primary flex-1 text-center py-3"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/events/${event.id}/register`}
                      className="btn-outline flex-1 text-center py-3"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 text-white/80">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              We offer custom retreats and events for groups of all sizes. 
              Contact us to discuss your specific needs and how we can serve you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="btn bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-4"
              >
                View All Events
              </Link>
              <Link
                href="/contact"
                className="btn-outline border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
