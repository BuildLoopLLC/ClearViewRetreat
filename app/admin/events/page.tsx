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
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { Event } from '@/types/firebase'

export default function EventManagementPage() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      
      // Transform the data to match the expected Event interface
      const transformedEvents = data.map((item: any) => ({
        id: item.id,
        title: item.metadata?.title || 'Untitled Event',
        slug: item.metadata?.slug || '',
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
                      <Link
                        href={`/events/${event.slug}`}
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
    </div>
  )
}
