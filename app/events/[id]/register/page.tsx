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
  CheckCircleIcon,
  ExclamationTriangleIcon
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
  maxAttendees?: number
  currentAttendees?: number
}

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  emergencyContact: string
  emergencyPhone: string
  dietaryRestrictions: string
  specialRequests: string
  agreeToTerms: boolean
}

export default function EventRegistrationPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    dietaryRestrictions: '',
    specialRequests: '',
    agreeToTerms: false
  })

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
          image: metadata.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
          description: metadata.description || '',
          content: eventData.content || '',
          featured: metadata.featured === true || metadata.featured === 'true',
          price: metadata.price ? `$${metadata.price}` : 'Free',
          category: metadata.category || '',
          maxAttendees: metadata.maxAttendees || null,
          currentAttendees: metadata.currentAttendees || 0
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setRegistrationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

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

  const isEventFull = () => {
    if (!event?.maxAttendees) return false
    return (event.currentAttendees || 0) >= event.maxAttendees
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Send registration data to the API
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventId,
          ...registrationData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      const result = await response.json()
      
      if (result.success) {
        setSuccess(true)
        
        // Redirect based on event price after showing success message
        setTimeout(() => {
          const eventPrice = event?.price ? parseFloat(event.price.replace('$', '')) : 0
          if (eventPrice > 0) {
            // Event has a price, redirect to payment page
            router.push('/events/payment')
          } else {
            // Free event, redirect to donation page
            router.push('/donate')
          }
        }, 5000) // Show success message for 5 seconds before redirect
      } else {
        throw new Error(result.message || 'Registration failed')
      }
      
    } catch (err: any) {
      setError('Registration failed: ' + err.message)
    } finally {
      setSubmitting(false)
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

  if (success) {
    const eventPrice = event?.price ? parseFloat(event.price.replace('$', '')) : 0
    const redirectMessage = eventPrice > 0 
      ? "Redirecting you to the payment page..." 
      : "Redirecting you to the donation page..."
    
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Registration Successful!</h1>
          <p className="text-secondary-600 mb-4">
            Thank you for registering for <strong>{event.title}</strong>. 
            You will receive a confirmation email shortly with event details.
          </p>
          <p className="text-primary-600 font-medium mb-8">
            {redirectMessage}
          </p>
          <div className="space-y-4">
            <Link
              href="/events"
              className="btn-outline inline-flex items-center"
            >
              View All Events
            </Link>
            <Link
              href={`/events/${event.id}`}
              className="btn-outline inline-flex items-center ml-4"
            >
              Event Details
            </Link>
          </div>
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
              href={`/events/${event.id}`}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Register for Event</h1>
              <p className="text-secondary-600">{event.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Event Details</h2>
              
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
                
                <div className="flex items-center text-secondary-700">
                  <CurrencyDollarIcon className="h-5 w-5 mr-3 text-primary-600" />
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-sm font-semibold text-primary-600">{event.price}</p>
                  </div>
                </div>
              </div>

              {isEventFull() && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700 font-medium">Event is Full</p>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    This event has reached its maximum capacity.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Registration Information</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={registrationData.firstName}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={registrationData.lastName}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={registrationData.email}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={registrationData.phone}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="emergencyContact" className="block text-sm font-medium text-secondary-700 mb-2">
                        Emergency Contact Name *
                      </label>
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={registrationData.emergencyContact}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="emergencyPhone" className="block text-sm font-medium text-secondary-700 mb-2">
                        Emergency Contact Phone *
                      </label>
                      <input
                        type="tel"
                        id="emergencyPhone"
                        name="emergencyPhone"
                        value={registrationData.emergencyPhone}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-secondary-700 mb-2">
                        Dietary Restrictions
                      </label>
                      <textarea
                        id="dietaryRestrictions"
                        name="dietaryRestrictions"
                        value={registrationData.dietaryRestrictions}
                        onChange={handleInputChange}
                        rows={3}
                        className="textarea w-full"
                        placeholder="Please let us know about any dietary restrictions or allergies"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="specialRequests" className="block text-sm font-medium text-secondary-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={registrationData.specialRequests}
                        onChange={handleInputChange}
                        rows={3}
                        className="textarea w-full"
                        placeholder="Any special requests or accommodations needed"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={registrationData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      required
                    />
                    <label htmlFor="agreeToTerms" className="ml-3 text-sm text-secondary-700">
                      I agree to the <Link href="/terms" className="text-primary-600 hover:text-primary-500">Terms and Conditions</Link> and <Link href="/privacy" className="text-primary-600 hover:text-primary-500">Privacy Policy</Link> *
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting || isEventFull()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Processing Registration...' : 'Complete Registration'}
                  </button>
                  
                  {isEventFull() && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      Registration is not available - event is full
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
