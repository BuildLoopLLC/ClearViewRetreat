'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function EditEventPage() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    startDate: '',
    endDate: '',
    location: '',
    maxAttendees: '',
    price: '',
    category: '',
    tags: '',
    published: false,
    image: '',
    featured: false
  })

  // Load existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setInitialLoading(true)
        const response = await fetch(`/api/sqlite-content?id=${eventId}`)
        if (!response.ok) {
          throw new Error('Event not found')
        }
        
        const event = await response.json()
        const metadata = event.metadata || {}
        
        setFormData({
          title: metadata.title || '',
          description: metadata.description || '',
          content: event.content || '',
          startDate: metadata.startDate || '',
          endDate: metadata.endDate || '',
          location: metadata.location || '',
          maxAttendees: metadata.maxAttendees?.toString() || '',
          price: metadata.price?.toString() || '',
          category: metadata.category || '',
          tags: metadata.tags?.join(', ') || '',
          published: metadata.published || false,
          image: metadata.image || '',
          featured: metadata.featured || false
        })
      } catch (err: any) {
        setError('Failed to load event: ' + err.message)
      } finally {
        setInitialLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        image: data.url
      }))
    } catch (err: any) {
      setError('Failed to upload image: ' + err.message)
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      // If this event is being set as featured, unfeature all other events
      if (formData.featured) {
        try {
          const response = await fetch('/api/sqlite-content?section=events')
          if (response.ok) {
            const events = await response.json()
            for (const event of events) {
              if (event.metadata?.featured && event.id !== eventId) {
                const updateData = {
                  ...event,
                  metadata: {
                    ...event.metadata,
                    featured: false
                  }
                }
                await fetch(`/api/sqlite-content?id=${event.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updateData)
                })
              }
            }
          }
        } catch (err) {
          console.error('Error unfeaturing other events:', err)
        }
      }
      
      const eventData = {
        section: 'events',
        subsection: null,
        contentType: 'text' as const,
        content: formData.content,
        metadata: {
          name: `Event: ${formData.title}`,
          title: formData.title,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          location: formData.location,
          maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
          currentAttendees: 0,
          price: formData.price ? parseFloat(formData.price) : 0,
          category: formData.category,
          tags: tagsArray,
          published: formData.published,
          publishedAt: formData.published ? new Date().toISOString() : null,
          authorName: user?.displayName || 'Admin',
          authorEmail: user?.email || '',
          image: formData.image,
          featured: formData.featured
        },
        order: 0,
        isActive: formData.published,
        user: user?.email || 'admin@clearviewretreat.com'
      }

      const response = await fetch(`/api/sqlite-content?id=${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update event')
      }

      router.push('/admin/events')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading event...</p>
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
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/events"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Edit Event</h1>
                <p className="text-secondary-600">Update event information and settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/events"
                className="btn"
              >
                Back to Events
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
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

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Event Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="e.g., Retreat, Workshop, Conference"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="textarea w-full"
                  placeholder="Brief description of the event"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="tags" className="block text-sm font-medium text-secondary-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              Date & Time
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-secondary-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-secondary-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location & Pricing */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2" />
              Location & Pricing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Event location"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-secondary-700 mb-2">
                  Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input w-full pl-10"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium text-secondary-700 mb-2">
                  Max Attendees
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="maxAttendees"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    className="input w-full pl-10"
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Event Details</h2>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-2">
                Full Event Description *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                className="textarea w-full"
                placeholder="Detailed description of the event, what participants can expect, what to bring, etc."
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Event Image</h2>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-secondary-700 mb-2">
                Event Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="input w-full"
                disabled={imageUploading}
              />
              {imageUploading && (
                <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
              )}
              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Event preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload an image to represent this event. Recommended size: 800x600px
              </p>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Publishing Options</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="published" className="ml-2 text-sm text-secondary-700">
                  Publish immediately
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Uncheck to save as draft
              </p>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-secondary-700">
                  Featured Event
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Only one event can be featured at a time. This will unfeature any other featured event.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/events"
              className="btn px-6 py-3"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
            >
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
