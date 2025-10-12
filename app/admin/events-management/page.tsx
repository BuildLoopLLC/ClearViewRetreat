'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface Event {
  id: string
  title: string
  type: 'family-camp' | 'marriage-retreat' | 'ministry-event' | 'grieving-retreat' | 'family-mission-trip' | 'special-event'
  startDate: string
  endDate: string
  description: string
  maxAttendees: number | null
  isActive: boolean
}

const eventTypes = [
  { value: 'family-camp', label: 'Family Camp', color: 'bg-blue-100 text-blue-800' },
  { value: 'marriage-retreat', label: 'Marriage Retreat', color: 'bg-pink-100 text-pink-800' },
  { value: 'ministry-event', label: 'Ministry Event', color: 'bg-purple-100 text-purple-800' },
  { value: 'grieving-retreat', label: 'Grieving Retreat', color: 'bg-gray-100 text-gray-800' },
  { value: 'family-mission-trip', label: 'Family Mission Trip', color: 'bg-green-100 text-green-800' },
  { value: 'special-event', label: 'Special Event', color: 'bg-yellow-100 text-yellow-800' }
]

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    type: 'family-camp',
    startDate: '',
    endDate: '',
    description: ''
  })

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched events:', data)
        
        // Convert database format to form format
        const convertedEvents = data.map((event: any) => ({
          ...event,
          isActive: event.is_active === 1 || event.is_active === true,
          startDate: event.start_date,
          endDate: event.end_date,
          maxAttendees: event.max_attendees
        }))
        
        console.log('Converted events:', convertedEvents)
        setEvents(convertedEvents)
      } else {
        const errorData = await response.json()
        console.error('Failed to fetch events:', errorData)
        setError('Failed to fetch events')
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingEvent ? '/api/events' : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'
      
      // Convert form data to database format
      const submitData = {
        id: editingEvent?.id,
        title: formData.title,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        description: formData.description,
        isActive: true // All events are active by default
      }

      console.log('Submitting event data:', submitData)
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        await fetchEvents()
        closeModal()
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        setError(errorData.error || 'Failed to save event')
      }
    } catch (err) {
      console.error('Error saving event:', err)
      setError('Failed to save event')
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchEvents()
      } else {
        setError('Failed to delete event')
      }
    } catch (err) {
      console.error('Error deleting event:', err)
      setError('Failed to delete event')
    }
  }

  // Open modal for editing
  const openEditModal = (event: Event) => {
    console.log('Opening edit modal for event:', event)
    setEditingEvent(event)
    setFormData(event)
    setShowModal(true)
  }

  // Open modal for creating
  const openCreateModal = () => {
    setEditingEvent(null)
    setFormData({
      title: '',
      type: 'family-camp',
      startDate: '',
      endDate: '',
      description: ''
    })
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setEditingEvent(null)
    setFormData({
      title: '',
      type: 'family-camp',
      startDate: '',
      endDate: '',
      description: ''
    })
  }

  // Format date for input
  const formatDateForInput = (dateString: string) => {
    // Handle both YYYY-MM-DD format and other date formats
    if (dateString.includes('T')) {
      // If it's an ISO string, extract just the date part
      return new Date(dateString).toISOString().split('T')[0]
    } else {
      // If it's already in YYYY-MM-DD format, return as is
      return dateString
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Separate current/future events from past events
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison

  const currentEvents = events.filter(event => {
    const eventEndDate = new Date(event.endDate)
    eventEndDate.setHours(23, 59, 59, 999) // Set to end of day for accurate comparison
    return eventEndDate >= currentDate
  })

  const pastEvents = events.filter(event => {
    const eventEndDate = new Date(event.endDate)
    eventEndDate.setHours(23, 59, 59, 999) // Set to end of day for accurate comparison
    return eventEndDate < currentDate
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Header */}
        <div className="mb-6">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-sm font-medium text-secondary-600 hover:text-secondary-800 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Events Management</h1>
          <p className="mt-2 text-secondary-600">Manage calendar events and retreats</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Add Event Button */}
        <div className="mb-6">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Event
          </button>
        </div>

        {/* Current/Future Events Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Current & Future Events ({currentEvents.length})
            </h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      {event.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      eventTypes.find(t => t.value === event.type)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {eventTypes.find(t => t.value === event.type)?.label || event.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(event.startDate)}
                    {event.endDate !== event.startDate && (
                      <span className="text-gray-500"> - {formatDate(event.endDate)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(event)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Past Events Collapsible Section */}
        {pastEvents.length > 0 && (
          <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
            <button
              onClick={() => setShowPastEvents(!showPastEvents)}
              className="w-full px-6 py-4 border-b border-gray-200 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Past Events ({pastEvents.length})
                </h3>
                {showPastEvents ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </button>
            
            {showPastEvents && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pastEvents.map((event) => (
                    <tr key={event.id} className="opacity-75">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-500">{event.title}</div>
                          {event.description && (
                            <div className="text-sm text-gray-400 truncate max-w-xs">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          eventTypes.find(t => t.value === event.type)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {eventTypes.find(t => t.value === event.type)?.label || event.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(event.startDate)}
                        {event.endDate !== event.startDate && (
                          <span className="text-gray-400"> - {formatDate(event.endDate)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(event)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingEvent ? 'Edit Event' : 'Add Event'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={formData.type || 'family-camp'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      {eventTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate ? formatDateForInput(formData.startDate) : ''}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate ? formatDateForInput(formData.endDate) : ''}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>



                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      {editingEvent ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
