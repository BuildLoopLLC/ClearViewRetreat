'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CalendarIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { Event } from '@/types/firebase'

export default function EventManagementPage() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAttendeesModal, setShowAttendeesModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [attendees, setAttendees] = useState<any[]>([])
  const [attendeesLoading, setAttendeesLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAttendee, setEditingAttendee] = useState<any>(null)
  const [editFormData, setEditFormData] = useState<any>({})

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sqlite-content?section=events')
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      const data = await response.json()
      
      // Filter out section headers and only include actual events
      const eventItems = data.filter((item: any) => 
        item.metadata?.name && item.metadata.name.startsWith('Event')
      )
      
      // Transform the data to match the expected Event interface
      const transformedEvents = eventItems.map((item: any) => ({
        id: item.id,
        title: item.metadata?.title || 'Untitled Event',
        description: item.metadata?.description || item.content || '',
        content: item.content || '',
        startDate: item.metadata?.startDate || '',
        endDate: item.metadata?.endDate || '',
        location: item.metadata?.location || '',
        maxAttendees: item.metadata?.maxAttendees || null,
        currentAttendees: item.metadata?.currentAttendees || 0,
        price: item.metadata?.price || 0,
        category: item.metadata?.category || '',
        tags: item.metadata?.tags || [],
        published: item.metadata?.published || false,
        publishedAt: item.metadata?.publishedAt || null,
        authorName: item.metadata?.authorName || '',
        authorEmail: item.metadata?.authorEmail || '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
      
      setEvents(transformedEvents)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendees = async (eventId: string) => {
    try {
      setAttendeesLoading(true)
      const response = await fetch(`/api/registrations?eventId=${eventId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch attendees')
      }
      const data = await response.json()
      setAttendees(data.registrations || [])
    } catch (err: any) {
      console.error('Error fetching attendees:', err)
      setAttendees([])
    } finally {
      setAttendeesLoading(false)
    }
  }

  const handleViewAttendees = (event: Event) => {
    setSelectedEvent(event)
    setShowAttendeesModal(true)
    fetchAttendees(event.id)
  }

  const closeAttendeesModal = () => {
    setShowAttendeesModal(false)
    setSelectedEvent(null)
    setAttendees([])
  }

  const handleDeleteAttendee = async (registrationId: number, eventId: string) => {
    if (!confirm('Are you sure you want to remove this attendee from the event?')) return
    
    try {
      const response = await fetch(`/api/registrations?id=${registrationId}&eventId=${eventId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove attendee')
      }
      
      // Remove the attendee from the local state
      setAttendees(attendees.filter(attendee => attendee.id !== registrationId))
      
      // Refresh the events list to update attendee counts
      fetchEvents()
      
    } catch (err: any) {
      alert('Failed to remove attendee: ' + err.message)
    }
  }

  const handleEditAttendee = (attendee: any) => {
    setEditingAttendee(attendee)
    setEditFormData({
      firstName: attendee.firstName,
      lastName: attendee.lastName,
      email: attendee.email,
      phone: attendee.phone,
      emergencyContact: attendee.emergencyContact,
      emergencyPhone: attendee.emergencyPhone,
      dietaryRestrictions: attendee.dietaryRestrictions || '',
      specialRequests: attendee.specialRequests || '',
      agreeToTerms: attendee.agreeToTerms === 1
    })
    setShowEditModal(true)
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/registrations?id=${editingAttendee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update attendee')
      }
      
      // Update the attendee in the local state
      setAttendees(attendees.map(attendee => 
        attendee.id === editingAttendee.id 
          ? { ...attendee, ...editFormData, updatedAt: new Date().toISOString() }
          : attendee
      ))
      
      setShowEditModal(false)
      setEditingAttendee(null)
      setEditFormData({})
      
    } catch (err: any) {
      alert('Failed to update attendee: ' + err.message)
    }
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingAttendee(null)
    setEditFormData({})
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      const response = await fetch(`/api/sqlite-content?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete event')
      }
      
      setEvents(events.filter(event => event.id !== id))
    } catch (err: any) {
      alert('Failed to delete event: ' + err.message)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date set'
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
    if (!dateString) return 'No time set'
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

  const isUpcoming = (dateString: string) => {
    if (!dateString) return false
    try {
      return new Date(dateString) > new Date()
    } catch {
      return false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Event Management</h1>
              <p className="text-secondary-600">Manage retreat events and activities</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/events/new"
                className="btn-primary flex items-center space-x-2 px-6 py-3"
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Event</span>
              </Link>
              <Link
                href="/admin"
                className="btn"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn text-red-600 hover:text-red-700 hover:border-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-secondary-900">All Events</h2>
          </div>
          
          {events.length === 0 ? (
            <div className="p-6 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first event.</p>
              <Link
                href="/admin/events/new"
                className="btn-primary inline-flex items-center space-x-2 px-6 py-3"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create First Event</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {events.map((event) => (
                <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          event.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.published ? 'Published' : 'Draft'}
                        </span>
                        {isUpcoming(event.startDate) && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Upcoming
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4" />
                          <span>{formatTime(event.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span>{event.price && event.price > 0 ? `$${event.price}` : 'Free'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>{event.currentAttendees} / {event.maxAttendees ? event.maxAttendees : '∞'} attendees</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{event.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleViewAttendees(event)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Attendees"
                      >
                        <UserGroupIcon className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/events/${event.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Event"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/events/edit/${event.id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit Event"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attendees Modal */}
      {showAttendeesModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Attendees for "{selectedEvent.title}"
                  </h3>
                  <p className="text-sm text-gray-500">
                    {attendees.length} registered attendee{attendees.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={closeAttendeesModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="mt-4">
                {attendeesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-2 text-gray-600">Loading attendees...</span>
                  </div>
                ) : attendees.length === 0 ? (
                  <div className="text-center py-8">
                    <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No attendees yet</h4>
                    <p className="text-gray-500">No one has registered for this event yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {attendees.map((attendee, index) => (
                      <div key={attendee.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {attendee.firstName} {attendee.lastName}
                            </h4>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <EnvelopeIcon className="h-4 w-4" />
                                <span>{attendee.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <PhoneIcon className="h-4 w-4" />
                                <span>{attendee.phone}</span>
                              </div>
                              {attendee.dietaryRestrictions && (
                                <div className="mt-2">
                                  <span className="text-xs font-medium text-gray-500">Dietary Restrictions:</span>
                                  <p className="text-xs text-gray-600 mt-1">{attendee.dietaryRestrictions}</p>
                                </div>
                              )}
                              {attendee.specialRequests && (
                                <div className="mt-2">
                                  <span className="text-xs font-medium text-gray-500">Special Requests:</span>
                                  <p className="text-xs text-gray-600 mt-1">{attendee.specialRequests}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right text-xs text-gray-500">
                              <p>Registered:</p>
                              <p>{new Date(attendee.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditAttendee(attendee)}
                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit Attendee"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAttendee(attendee.id, selectedEvent.id)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Remove Attendee"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Emergency Contact */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h5 className="text-xs font-medium text-gray-500 mb-1">Emergency Contact</h5>
                          <p className="text-sm text-gray-700">
                            {attendee.emergencyContact} - {attendee.emergencyPhone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={closeAttendeesModal}
                  className="btn-outline px-6 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Attendee Modal */}
      {showEditModal && editingAttendee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Edit Attendee Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Update {editingAttendee.firstName} {editingAttendee.lastName}'s registration details
                  </p>
                </div>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="mt-4">
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={editFormData.firstName || ''}
                          onChange={handleEditFormChange}
                          className="input w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={editFormData.lastName || ''}
                          onChange={handleEditFormChange}
                          className="input w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editFormData.email || ''}
                          onChange={handleEditFormChange}
                          className="input w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={editFormData.phone || ''}
                          onChange={handleEditFormChange}
                          className="input w-full"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Name *
                        </label>
                        <input
                          type="text"
                          id="emergencyContact"
                          name="emergencyContact"
                          value={editFormData.emergencyContact || ''}
                          onChange={handleEditFormChange}
                          className="input w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Phone *
                        </label>
                        <input
                          type="tel"
                          id="emergencyPhone"
                          name="emergencyPhone"
                          value={editFormData.emergencyPhone || ''}
                          onChange={handleEditFormChange}
                          className="input w-full"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Additional Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-1">
                          Dietary Restrictions
                        </label>
                        <textarea
                          id="dietaryRestrictions"
                          name="dietaryRestrictions"
                          value={editFormData.dietaryRestrictions || ''}
                          onChange={handleEditFormChange}
                          rows={3}
                          className="textarea w-full"
                          placeholder="Please let us know about any dietary restrictions or allergies"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                          Special Requests
                        </label>
                        <textarea
                          id="specialRequests"
                          name="specialRequests"
                          value={editFormData.specialRequests || ''}
                          onChange={handleEditFormChange}
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
                        checked={editFormData.agreeToTerms || false}
                        onChange={handleEditFormChange}
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        required
                      />
                      <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
                        I agree to the Terms and Conditions and Privacy Policy *
                      </label>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="btn-outline w-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary w-full"
                    >
                      Update Attendee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
