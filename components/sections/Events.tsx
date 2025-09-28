'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'
interface Event {
  id: string
  title: string
  date: string
  endDate: string
  location: string
  participants: string
  image: string
  description: string
  featured: boolean
  price?: string
  category?: string
}

interface EventsProps {
  showCTA?: boolean
}

export default function Events({ showCTA = true }: EventsProps) {
  const { content: eventsContent, getContentByMetadataName, loading } = useWebsiteContent('events')
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  // Helper function to format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate) return 'Date TBD'
    
    const start = formatDate(startDate)
    if (!endDate || startDate === endDate) return start
    
    try {
      const end = new Date(endDate)
      if (isNaN(end.getTime())) return start
      
      const endFormatted = end.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      return `${start} - ${endFormatted}`
    } catch {
      return start
    }
  }
  
  // Helper function to check if an event is upcoming
  const isUpcomingEvent = (startDate: string, endDate: string) => {
    if (!endDate) {
      // If no end date, check start date
      return new Date(startDate) > new Date()
    }
    // Check if end date is in the future
    return new Date(endDate) > new Date()
  }

  // Process events from database content
  const upcomingEvents: Event[] = eventsContent
    .filter(item => item.metadata?.name && item.metadata.name.startsWith('Event'))
    .map(item => {
      const metadata = item.metadata || {}
      return {
        id: item.id,
        title: metadata.title || 'Untitled Event',
        date: metadata.startDate || '',
        endDate: metadata.endDate || '',
        location: metadata.location || '',
        participants: `${metadata.currentAttendees || 0}/${metadata.maxAttendees || '∞'}`,
        image: metadata.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        description: metadata.description || '', // Use short description, not long content
        featured: metadata.featured === true || metadata.featured === 'true',
        price: metadata.price || '',
        category: metadata.category || ''
      }
    })
    .filter(event => isUpcomingEvent(event.date, event.endDate)) // Only show upcoming events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-b from-secondary-50 to-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </section>
    )
  }

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
              {getContentByMetadataName('title')}
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              {getContentByMetadataName('subtitle')}
            </p>
          </motion.div>
        </div>

        {/* No Events Message */}
        {upcomingEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
              <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
                No Events Currently Scheduled
              </h3>
              <p className="text-lg text-secondary-600 mb-8">
                We're working on planning amazing events for you. Check back soon for updates on upcoming retreats, workshops, and special gatherings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Contact Us
                </Link>
                <Link
                  href="/about"
                  className="btn-outline text-lg px-8 py-4"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>
        )}

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
                <div className="relative h-64 lg:h-full" style={{ cursor: 'pointer' }}>
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${event.image}')` }}
                    onClick={() => window.location.href = `/events/${event.id}`}
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
                      <span className="text-secondary-700">{formatDateRange(event.date, event.endDate)}</span>
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
                <div className="aspect-[4/3] overflow-hidden" style={{ cursor: 'pointer' }}>
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url('${event.image}')` }}
                    onClick={() => window.location.href = `/events/${event.id}`}
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
                      <span>{formatDateRange(event.date, event.endDate)}</span>
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

        {/* CTA - Only show when showCTA is true */}
        {showCTA && (
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
        )}
      </div>
    </section>
  )
}
