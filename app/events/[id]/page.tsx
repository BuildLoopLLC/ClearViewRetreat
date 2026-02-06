'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

interface Event {
  id: string
  title: string
  date: string
  endDate: string
  location: string
  participants: string
  image: string
  description: string
  content: string
  featured: boolean
  price?: string
  category?: string
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const isUpcomingEvent = (startDate: string, endDate: string) => {
    if (!endDate) {
      // If no end date, check start date
      return new Date(startDate) > new Date()
    }
    // Check if end date is in the future
    return new Date(endDate) > new Date()
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/sqlite-content?id=${eventId}`)
        if (!response.ok) {
          throw new Error('Event not found')
        }
        
        const eventData = await response.json()
        const metadata = eventData.metadata || {}
        
        // Transform the data to match the Event interface
        const transformedEvent: Event = {
          id: eventData.id,
          title: metadata.title || 'Untitled Event',
          date: metadata.startDate || '',
          endDate: metadata.endDate || '',
          location: metadata.location || '',
          participants: `${metadata.currentAttendees || 0}/${metadata.maxAttendees || '∞'}`,
          image: metadata.image || 'images/TNMountains2.jpg',
          description: metadata.description || '',
          content: eventData.content || '',
          featured: metadata.featured === true || metadata.featured === 'true',
          price: metadata.price ? `$${metadata.price}` : 'Free',
          category: metadata.category || ''
        }
        
        setEvent(transformedEvent)
      } catch (err: any) {
        setError('Failed to load event: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

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

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Time TBD'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid time'
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return 'Invalid time'
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Event Not Found</h1>
          <p className="text-secondary-600 mb-8">{error || 'The event you are looking for does not exist.'}</p>
          <Link
            href="/events"
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/events"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">{event.title}</h1>
              {event.category && (
                <p className="text-secondary-600">{event.category}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Event Image */}
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="p-8">
            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-secondary-700">
                  <CalendarIcon className="h-5 w-5 mr-3 text-primary-600" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm">{formatDateRange(event.date, event.endDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-secondary-700">
                  <ClockIcon className="h-5 w-5 mr-3 text-primary-600" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm">{formatTime(event.date)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-secondary-700">
                  <MapPinIcon className="h-5 w-5 mr-3 text-primary-600" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-secondary-700">
                  <UserGroupIcon className="h-5 w-5 mr-3 text-primary-600" />
                  <div>
                    <p className="font-medium">Participants</p>
                    <p className="text-sm">{event.participants}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-8 p-4 bg-primary-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-primary-600 mr-2" />
                  <span className="text-lg font-semibold text-primary-900">Price</span>
                </div>
                <span className="text-2xl font-bold text-primary-600">{event.price}</span>
              </div>
            </div>

            {/* Short Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">About This Event</h2>
              <p className="text-lg text-secondary-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Full Content */}
            {event.content && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Event Details</h2>
                <div 
                  className="prose prose-lg max-w-none text-secondary-600"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isUpcomingEvent(event.date, event.endDate) && (
              <Link
                href={`/events/${event.id}/register`}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group"
              >
                Register Now
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              )}
              <Link
                href="/events"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                View All Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
