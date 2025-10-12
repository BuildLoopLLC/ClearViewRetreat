'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SubpageLayout from '@/components/ui/SubpageLayout'
import EventCalendar from '@/components/calendar/EventCalendar'

interface EventData {
  id: string
  title: string
  type: 'family-camp' | 'marriage-retreat' | 'ministry-event' | 'grieving-retreat' | 'family-mission-trip' | 'special-event'
  startDate: string
  endDate: string
  available: boolean
}

interface BlockedDate {
  id: string
  title: string
  startDate: string
  endDate: string
  reason: string
  isActive: boolean
}

export default function EventRegistrationPage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [events, setEvents] = useState<EventData[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])

  // Fetch content and events from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch content, events, and blocked dates in parallel
        const [contentRes, eventsRes, blockedDatesRes] = await Promise.all([
          fetch('/api/sqlite-content?section=events&subsection=registration'),
          fetch('/api/events'),
          fetch('/api/blocked-dates')
        ])

        // Process content
        if (contentRes.ok) {
          const contentData = await contentRes.json()
          if (contentData.length > 0) {
            setContent(contentData[0].content || '')
          } else {
            // Set default content if none exists
            setContent(`
              <h1>Register For Retreat</h1>
              <h2>Click a retreat to register:</h2>
              <h4>Group Planning Forms (online | pdf)</h4>
              <h4>Individual Family Registration (online | pdf)</h4>
              <h4>Marriage Retreat (online | pdf)</h4>
              <h4>Pastor/Missionary Retreats (online | pdf)</h4>
              <h4>Grieving Retreat (online | pdf)</h4>
              <h4>Family Mission Trip (online | pdf)</h4>
            `)
          }
        }

        // Process events
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          // Convert database events to calendar format
          const calendarEvents = eventsData.map((event: any) => ({
            id: event.id,
            title: event.title,
            type: event.type,
            startDate: event.start_date,
            endDate: event.end_date,
            available: event.is_active
          }))
          setEvents(calendarEvents)
        }

        // Process blocked dates
        if (blockedDatesRes.ok) {
          const blockedDatesData = await blockedDatesRes.json()
          setBlockedDates(blockedDatesData)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <SubpageLayout
        title="Event Registration"
        subtitle="Register for upcoming events and retreats"
        breadcrumbs={[
          { name: 'Events', href: '/events' },
          { name: 'Registration', href: '/events/registration' }
        ]}
      >
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading registration page...</p>
        </div>
      </SubpageLayout>
    )
  }

  if (error) {
    return (
      <SubpageLayout
        title="Event Registration"
        subtitle="Register for upcoming events and retreats"
        breadcrumbs={[
          { name: 'Events', href: '/events' },
          { name: 'Registration', href: '/events/registration' }
        ]}
      >
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Error</h2>
          <p className="text-secondary-600">{error}</p>
        </div>
      </SubpageLayout>
    )
  }

  return (
    <SubpageLayout
      title="Event Registration"
      subtitle="Register for upcoming events and retreats"
      breadcrumbs={[
        { name: 'Events', href: '/events' },
        { name: 'Registration', href: '/events/registration' }
      ]}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>

        {/* Interactive Calendar Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Interactive Calendar</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <EventCalendar 
                events={events}
                blockedDates={blockedDates}
                onDateClick={(date, event) => {
                  console.log('Date clicked:', date, event)
                }}
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Types</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                    <span className="text-sm text-gray-600">Family Camp</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-pink-100"></div>
                    <span className="text-sm text-gray-600">Marriage Retreat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-purple-100"></div>
                    <span className="text-sm text-gray-600">Ministry Event</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                    <span className="text-sm text-gray-600">Grieving Retreat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-100"></div>
                    <span className="text-sm text-gray-600">Family Mission Trip</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-100"></div>
                    <span className="text-sm text-gray-600">Special Event</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Need Help with Registration?
          </h3>
          <p className="text-blue-700 mb-4">
            If you have questions about event registration or need assistance, please don't hesitate to contact us.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Contact Us
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View All Events
            </Link>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}
