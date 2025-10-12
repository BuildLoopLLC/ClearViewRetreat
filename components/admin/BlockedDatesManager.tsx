'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface BlockedDate {
  id: string
  title: string
  startDate: string
  endDate: string
  reason: string
  isActive: boolean
}

export default function BlockedDatesManager() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBlockedDate, setEditingBlockedDate] = useState<BlockedDate | null>(null)
  const [formData, setFormData] = useState<Partial<BlockedDate>>({
    title: '',
    startDate: '',
    endDate: '',
    reason: '',
    isActive: true
  })

  // Fetch blocked dates
  const fetchBlockedDates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blocked-dates')
      if (response.ok) {
        const data = await response.json()
        setBlockedDates(data)
      } else {
        setError('Failed to fetch blocked dates')
      }
    } catch (err) {
      console.error('Error fetching blocked dates:', err)
      setError('Failed to fetch blocked dates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlockedDates()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/blocked-dates'
      const method = editingBlockedDate ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingBlockedDate?.id
        })
      })

      if (response.ok) {
        await fetchBlockedDates()
        closeModal()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save blocked date')
      }
    } catch (err) {
      console.error('Error saving blocked date:', err)
      setError('Failed to save blocked date')
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blocked date range?')) return

    try {
      const response = await fetch(`/api/blocked-dates?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchBlockedDates()
      } else {
        setError('Failed to delete blocked date')
      }
    } catch (err) {
      console.error('Error deleting blocked date:', err)
      setError('Failed to delete blocked date')
    }
  }

  // Open modal for editing
  const openEditModal = (blockedDate: BlockedDate) => {
    setEditingBlockedDate(blockedDate)
    setFormData(blockedDate)
    setShowModal(true)
  }

  // Open modal for creating
  const openCreateModal = () => {
    setEditingBlockedDate(null)
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      reason: '',
      isActive: true
    })
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setEditingBlockedDate(null)
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      reason: '',
      isActive: true
    })
  }

  // Format date for input
  const formatDateForInput = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0]
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-secondary-600">Loading blocked dates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Blocked Date Ranges</h3>
          <p className="text-sm text-gray-500">Manage dates that appear as unavailable on the calendar</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Blocked Dates
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Blocked Dates List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {blockedDates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No blocked date ranges configured</p>
            <p className="text-sm text-gray-400 mt-1">Add blocked dates to mark them as unavailable on the calendar</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {blockedDates.map((blockedDate) => (
              <div key={blockedDate.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-gray-900">{blockedDate.title}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        blockedDate.isActive ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {blockedDate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {formatDate(blockedDate.startDate)} - {formatDate(blockedDate.endDate)}
                    </div>
                    {blockedDate.reason && (
                      <div className="mt-1 text-sm text-gray-600">{blockedDate.reason}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(blockedDate)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blockedDate.id)}
                      className="text-red-600 hover:text-red-900"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingBlockedDate ? 'Edit Blocked Date Range' : 'Add Blocked Date Range'}
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
                    placeholder="e.g., Holiday Break, Maintenance"
                    required
                  />
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
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason (Optional)</label>
                  <textarea
                    value={formData.reason || ''}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Facility maintenance, Holiday break"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive || false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active (appears as blocked on calendar)</label>
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
                    {editingBlockedDate ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
