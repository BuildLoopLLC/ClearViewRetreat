'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  UserGroupIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Registration {
  id: number | string
  eventId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  emergencyContact: string
  emergencyPhone: string
  dietaryRestrictions: string
  specialRequests: string
  agreeToTerms: boolean
  createdAt: string
}

interface GroupRegistrationData {
  organization?: string
  groupSize?: string
  preferredDates?: string
  message?: string
}

interface Event {
  id: string
  title: string
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null)
  const [editFormData, setEditFormData] = useState<any>({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingRegistration, setDeletingRegistration] = useState<Registration | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch registrations
        const registrationsResponse = await fetch('/api/registrations')
        if (!registrationsResponse.ok) {
          throw new Error('Failed to fetch registrations')
        }
        const registrationsData = await registrationsResponse.json()
        setRegistrations(registrationsData.registrations || [])

        // Fetch events for display names
        const eventsResponse = await fetch('/api/sqlite-content?section=events')
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          const eventItems = eventsData.filter((item: any) =>
            item.metadata?.name && item.metadata.name.startsWith('Event')
          )
          const transformedEvents = eventItems.map((item: any) => ({
            id: item.id,
            title: item.metadata?.title || 'Untitled Event'
          }))
          setEvents(transformedEvents)
        }
        
      } catch (err: any) {
        setError('Failed to load registrations: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const isGroupRegistration = (eventId: string) => {
    return eventId?.startsWith('group-retreat-')
  }

  const getEventTitle = (eventId: string) => {
    // Handle group retreat registrations
    if (isGroupRegistration(eventId)) {
      const typeId = eventId.replace('group-retreat-', '')
      return `Group Retreat Registration (Type: ${typeId})`
    }
    const event = events.find(e => e.id === eventId)
    return event?.title || 'Unknown Event'
  }

  const parseGroupRegistrationData = (specialRequests: string): GroupRegistrationData => {
    const data: GroupRegistrationData = {}
    if (!specialRequests) return data

    // Parse the formatted string from the registration form
    const lines = specialRequests.split('\n')
    for (const line of lines) {
      if (line.toLowerCase().includes('organization:')) {
        data.organization = line.split(':').slice(1).join(':').trim()
      } else if (line.toLowerCase().includes('group size:')) {
        data.groupSize = line.split(':').slice(1).join(':').trim()
      } else if (line.toLowerCase().includes('preferred dates:')) {
        data.preferredDates = line.split(':').slice(1).join(':').trim()
      } else if (line.toLowerCase().includes('message:')) {
        const messageIndex = specialRequests.toLowerCase().indexOf('message:')
        if (messageIndex !== -1) {
          data.message = specialRequests.substring(messageIndex + 8).trim()
        }
      }
    }

    return data
  }

  const groupRegistrations = registrations.filter(r => isGroupRegistration(r.eventId))
  const eventRegistrations = registrations.filter(r => !isGroupRegistration(r.eventId))

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const handleEditRegistration = (registration: Registration) => {
    setEditingRegistration(registration)
    const isGroup = isGroupRegistration(registration.eventId)
    
    if (isGroup) {
      const groupData = parseGroupRegistrationData(registration.specialRequests || '')
      setEditFormData({
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        phone: registration.phone || '',
        organization: groupData.organization || '',
        groupSize: groupData.groupSize || '',
        preferredDates: groupData.preferredDates || '',
        message: groupData.message || '',
        specialRequests: registration.specialRequests || ''
      })
    } else {
      setEditFormData({
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        phone: registration.phone,
        emergencyContact: registration.emergencyContact,
        emergencyPhone: registration.emergencyPhone,
        dietaryRestrictions: registration.dietaryRestrictions || '',
        specialRequests: registration.specialRequests || '',
        agreeToTerms: registration.agreeToTerms
      })
    }
    setShowEditModal(true)
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setEditFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingRegistration) return

    try {
      const isGroup = isGroupRegistration(editingRegistration.eventId)
      let submitData = { ...editFormData }

      // For group registrations, reconstruct the specialRequests field
      if (isGroup) {
        submitData.specialRequests = `
Organization: ${editFormData.organization || 'Not provided'}
Group Size: ${editFormData.groupSize || 'Not provided'}
Preferred Dates: ${editFormData.preferredDates || 'Not provided'}

Message:
${editFormData.message || ''}
        `.trim()
        // Remove the parsed fields from submit data
        delete submitData.organization
        delete submitData.groupSize
        delete submitData.preferredDates
        delete submitData.message
      }

      const response = await fetch(`/api/registrations?id=${editingRegistration.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update registration')
      }
      
      // Update the registration in the local state
      setRegistrations(registrations.map(registration => 
        registration.id === editingRegistration.id 
          ? { ...registration, ...submitData, updatedAt: new Date().toISOString() }
          : registration
      ))
      
      setShowEditModal(false)
      setEditingRegistration(null)
      setEditFormData({})
      
    } catch (err: any) {
      alert('Failed to update registration: ' + err.message)
    }
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingRegistration(null)
    setEditFormData({})
  }

  const handleDeleteRegistration = (registration: Registration) => {
    setDeletingRegistration(registration)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingRegistration) return

    try {
      const response = await fetch(`/api/registrations?id=${deletingRegistration.id}&eventId=${deletingRegistration.eventId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete registration')
      }
      
      // Remove the registration from the local state
      setRegistrations(registrations.filter(registration => registration.id !== deletingRegistration.id))
      
      setShowDeleteModal(false)
      setDeletingRegistration(null)
      
    } catch (err: any) {
      alert('Failed to delete registration: ' + err.message)
    }
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletingRegistration(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading registrations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Error</h1>
          <p className="text-secondary-600 mb-8">{error}</p>
          <Link
            href="/admin"
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Admin
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
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Event Registrations</h1>
                <p className="text-secondary-600">Manage and view event registrations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-secondary-600">Event Registrations</p>
                <p className="text-2xl font-bold text-primary-600">{eventRegistrations.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary-600">Group Registrations</p>
                <p className="text-2xl font-bold text-blue-600">{groupRegistrations.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Event Registrations Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-secondary-900">Event Registrations</h2>
            <p className="text-sm text-secondary-600">Individual registrations for specific events</p>
          </div>
          {eventRegistrations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No Event Registrations Yet</h3>
              <p className="text-secondary-600">Event registrations will appear here once people start registering.</p>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registrant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emergency Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {eventRegistrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-secondary-900">
                            {getEventTitle(registration.eventId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-secondary-900">
                            {registration.firstName} {registration.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-secondary-900">
                            <div className="flex items-center">
                              <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                              {registration.email}
                            </div>
                            <div className="flex items-center mt-1">
                              <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                              {registration.phone || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-secondary-900">
                            {registration.emergencyContact || 'N/A'}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {registration.emergencyPhone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-secondary-500">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDate(registration.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          <div className="space-y-1">
                            {registration.dietaryRestrictions && (
                              <div>
                                <span className="font-medium">Dietary:</span> {registration.dietaryRestrictions}
                              </div>
                            )}
                            {registration.specialRequests && (
                              <div>
                                <span className="font-medium">Requests:</span> {registration.specialRequests}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditRegistration(registration)}
                              className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50 transition-colors"
                              title="Edit registration"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRegistration(registration)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                              title="Delete registration"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Group Retreat Registrations Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-secondary-900">Group Retreat Registrations</h2>
            <p className="text-sm text-secondary-600">Group registration requests for retreat planning</p>
          </div>
          {groupRegistrations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No Group Registrations Yet</h3>
              <p className="text-secondary-600">Group retreat registration requests will appear here.</p>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Retreat Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Person
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Group Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preferred Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupRegistrations.map((registration) => {
                      const groupData = parseGroupRegistrationData(registration.specialRequests)
                      return (
                        <tr key={registration.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-secondary-900">
                              {getEventTitle(registration.eventId)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-secondary-900">
                              {registration.firstName} {registration.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-secondary-900">
                              <div className="flex items-center">
                                <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                                {registration.email}
                              </div>
                              <div className="flex items-center mt-1">
                                <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                                {registration.phone || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-secondary-900">
                              {groupData.organization || 'Not provided'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-secondary-900">
                              {groupData.groupSize || 'Not provided'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-secondary-900">
                              {groupData.preferredDates || 'Not provided'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-secondary-500">
                              <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                              {formatDate(registration.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditRegistration(registration)}
                                className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50 transition-colors"
                                title="View details"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRegistration(registration)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                                title="Delete registration"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {isGroupRegistration(editingRegistration.eventId) ? 'View Group Registration' : 'Edit Registration'}
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {isGroupRegistration(editingRegistration.eventId) ? (
                // Group Registration Fields
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName || ''}
                        onChange={handleEditFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName || ''}
                        onChange={handleEditFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email || ''}
                        onChange={handleEditFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone || ''}
                        onChange={handleEditFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={editFormData.organization || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Size
                      </label>
                      <input
                        type="text"
                        name="groupSize"
                        value={editFormData.groupSize || ''}
                        onChange={handleEditFormChange}
                        placeholder="e.g., 20-30 people"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Dates
                      </label>
                      <input
                        type="text"
                        name="preferredDates"
                        value={editFormData.preferredDates || ''}
                        onChange={handleEditFormChange}
                        placeholder="e.g., June 2026"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Information
                    </label>
                    <textarea
                      name="message"
                      value={editFormData.message || ''}
                      onChange={handleEditFormChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </>
              ) : (
                // Regular Event Registration Fields
                <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editFormData.firstName || ''}
                    onChange={handleEditFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editFormData.lastName || ''}
                    onChange={handleEditFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email || ''}
                    onChange={handleEditFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone || ''}
                    onChange={handleEditFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={editFormData.emergencyContact || ''}
                    onChange={handleEditFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Phone *
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={editFormData.emergencyPhone || ''}
                    onChange={handleEditFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dietary Restrictions
                    </label>
                    <textarea
                      name="dietaryRestrictions"
                      value={editFormData.dietaryRestrictions || ''}
                      onChange={handleEditFormChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={editFormData.specialRequests || ''}
                      onChange={handleEditFormChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={editFormData.agreeToTerms || false}
                      onChange={handleEditFormChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Agree to Terms and Conditions
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
                >
                  Update Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Registration
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete the registration for{' '}
                  <span className="font-medium">
                    {deletingRegistration.firstName} {deletingRegistration.lastName}
                  </span>
                  ? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  >
                    Delete Registration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
