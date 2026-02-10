'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SubpageLayout from '@/components/ui/SubpageLayout'
import EventCalendar from '@/components/calendar/EventCalendar'
import { 
  LinkIcon, 
  DocumentIcon, 
  XMarkIcon,
  CheckCircleIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

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

interface RegistrationEventType {
  id: string
  name: string
  description: string | null
  form_link: string | null
  pdf_link: string | null
  is_active: boolean
}

export default function EventRegistrationPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [events, setEvents] = useState<EventData[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [registrationTypes, setRegistrationTypes] = useState<RegistrationEventType[]>([])
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedType, setSelectedType] = useState<RegistrationEventType | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    groupSize: '',
    preferredDates: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [eventsRes, blockedDatesRes, typesRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/blocked-dates'),
          fetch('/api/registration-types')
        ])

        // Process events
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
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

        // Process registration types
        if (typesRes.ok) {
          const typesData = await typesRes.json()
          setRegistrationTypes(typesData.filter((t: RegistrationEventType) => t.is_active))
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

  const handleTypeClick = (type: RegistrationEventType) => {
    // If there's a form link, open it
    if (type.form_link) {
      window.open(type.form_link, '_blank')
      return
    }
    
    // Otherwise, show the registration modal
    setSelectedType(type)
    setShowModal(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Submit to registrations API for group retreat registration
      const specialRequests = `
Organization: ${formData.organization || 'Not provided'}
Group Size: ${formData.groupSize || 'Not provided'}
Preferred Dates: ${formData.preferredDates || 'Not provided'}

Message:
${formData.message}
      `.trim()

      // Use registration type ID as event_id for group retreat registrations
      const eventId = selectedType ? `group-retreat-${selectedType.id}` : 'group-retreat-general'
      
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: eventId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || '',
          specialRequests: specialRequests,
          registrationTypeId: selectedType?.id,
          registrationTypeName: selectedType?.name
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setShowModal(false)
          setSubmitted(false)
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            organization: '',
            groupSize: '',
            preferredDates: '',
            message: ''
          })
        }, 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('There was an error submitting your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <SubpageLayout
        title="Group Event Registration"
        subtitle="Register for upcoming group events and retreats"
        breadcrumbs={[
          { name: 'Events', href: '/events' },
          { name: 'Group Event Registration', href: '/events/registration' }
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
        title="Group Event Registration"
        subtitle="Register for upcoming group events and retreats"
        breadcrumbs={[
          { name: 'Events', href: '/events' },
          { name: 'Group Event Registration', href: '/events/registration' }
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
      title="Group Event Registration"
      subtitle="Register for upcoming events and retreats"
      breadcrumbs={[
        { name: 'Events', href: '/events' },
        { name: 'Group Event Registration', href: '/events/registration' }
      ]}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Registration Types */}
        {registrationTypes.length > 0 && (
          <div className="bg-white rounded-2xl overflow-hidden mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Register for a Retreat</h2>
              <p className="text-lg text-secondary-600 mb-8">
                Click on a retreat type below to begin registration. You can fill out our online form or download a PDF to mail in.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {registrationTypes.map((type) => (
                  <div
                    key={type.id}
                    className="group bg-white rounded-xl border-2 border-secondary-200 shadow-sm p-6 hover:shadow-xl hover:border-primary-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => handleTypeClick(type)}
                  >
                    <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                      {type.name}
                    </h3>
                    {type.description && (
                      <p className="text-secondary-600 mb-5 leading-relaxed">{type.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-3">
                      {/* Online form button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTypeClick(type)
                        }}
                        className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        {type.form_link ? 'Online Form' : 'Register Online'}
                      </button>
                      
                      {/* PDF link if available */}
                      {type.pdf_link && (
                        <a
                          href={type.pdf_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition-all duration-200 border border-secondary-300 hover:border-secondary-400"
                        >
                          <DocumentIcon className="h-4 w-4 mr-2" />
                          Download PDF
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Calendar Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">View Available Dates</h2>
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

      {/* Registration Modal */}
      {showModal && selectedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  {selectedType.name}
                </h3>
                <p className="text-sm text-secondary-600">Registration Request Form</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {submitted ? (
              <div className="p-8 text-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-secondary-900 mb-2">Request Submitted!</h4>
                <p className="text-secondary-600">
                  Thank you for your registration request. We'll contact you within 24-48 hours to confirm your booking.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Organization/Church Name
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Estimated Group Size
                    </label>
                    <input
                      type="text"
                      value={formData.groupSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, groupSize: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., 20-30 people"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Preferred Dates
                    </label>
                    <input
                      type="text"
                      value={formData.preferredDates}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredDates: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., June 2026"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Any special requirements or questions..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </SubpageLayout>
  )
}
