'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'
import SubpageLayout from '@/components/ui/SubpageLayout'

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

export default function PastEventsPage() {
  const { content: eventsContent, loading } = useWebsiteContent('events')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
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
  
  // Helper function to check if an event is past
  const isPastEvent = (startDate: string, endDate: string) => {
    if (!endDate) {
      // If no end date, check start date
      return new Date(startDate) < new Date()
    }
    // Check if end date is in the past
    return new Date(endDate) < new Date()
  }

  // Process events from database content
  const pastEvents: Event[] = eventsContent
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
        image: metadata.image || 'images/TNMountains2.jpg',
        description: metadata.description || '', // Use short description, not long content
        featured: metadata.featured === true || metadata.featured === 'true',
        price: metadata.price || '',
        category: metadata.category || ''
      }
    })
    .filter(event => isPastEvent(event.date, event.endDate)) // Only show past events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by most recent first

  // Get unique categories from events
  const categories: string[] = ['All', ...Array.from(new Set(pastEvents.map(event => event.category).filter((cat): cat is string => Boolean(cat))))]

  // Filter events by category
  const filteredEvents = selectedCategory === 'All' 
    ? pastEvents 
    : pastEvents.filter(event => event.category === selectedCategory)

  if (loading) {
    return (
      <SubpageLayout
        title="Past Events"
        subtitle="Explore highlights and photos from our previous events"
        breadcrumbs={[
          { name: 'Events', href: '/events' },
          { name: 'Past Events', href: '/events/past' }
        ]}
      >
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-200 rounded-lg h-64"></div>
            <div className="bg-gray-200 rounded-lg h-64"></div>
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        </div>
      </SubpageLayout>
    )
  }

  return (
    <SubpageLayout
      title="Past Events"
      subtitle="Explore highlights and photos from our previous events"
      breadcrumbs={[
        { name: 'Events', href: '/events' },
        { name: 'Past Events', href: '/events/past' }
      ]}
    >
      <div className="space-y-12">
        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  {event.featured && (
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {formatDateRange(event.date, event.endDate)}
                      </span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.participants} attendees</span>
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-primary-600">
                      {event.price === '0' || !event.price ? 'Free' : `$${event.price}`}
                    </div>
                    
                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group"
                    >
                      View Details
                      <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Past Events Found
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedCategory === 'All' 
                  ? "We don't have any past events to show at the moment."
                  : `No past events found in the ${selectedCategory.toLowerCase()} category.`
                }
              </p>
              <Link
                href="/events"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                View Upcoming Events
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </SubpageLayout>
  )
}
