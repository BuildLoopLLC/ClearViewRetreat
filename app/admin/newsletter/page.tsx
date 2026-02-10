'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface NewsletterSubscriber {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  source: string
  is_active: number
  subscribed_at: string
  unsubscribed_at: string | null
  created_at: string
  updated_at: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function NewsletterSignupsPage() {
  const { user, logout, loading: authLoading, isAdmin } = useAuthContext()
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [activeOnly, setActiveOnly] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [subscriberToDelete, setSubscriberToDelete] = useState<NewsletterSubscriber | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/admin/login')
    }
  }, [user, isAdmin, authLoading, router])

  useEffect(() => {
    if (user && isAdmin) {
      fetchSubscribers()
    }
  }, [user, isAdmin, pagination.page, activeOnly])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        active: activeOnly.toString()
      })
      
      const response = await fetch(`/api/newsletter?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers')
      }
      
      const data = await response.json()
      setSubscribers(data.subscribers || [])
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }))
    } catch (err: any) {
      setError(err.message || 'Failed to load subscribers')
      console.error('Error fetching subscribers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const handleExport = () => {
    // Fetch all subscribers for export
    const params = new URLSearchParams({
      active: 'false', // Get all for export
      limit: '10000', // Large limit to get all
      page: '1'
    })
    
    fetch(`/api/newsletter?${params}`)
      .then(res => res.json())
      .then(data => {
        const allSubscribers = data.subscribers || []
        
        // Create CSV content
        const headers = ['Email', 'First Name', 'Last Name', 'Source', 'Status', 'Subscribed At', 'Unsubscribed At']
        const rows = allSubscribers.map((sub: NewsletterSubscriber) => [
          sub.email,
          sub.first_name || '',
          sub.last_name || '',
          sub.source || '',
          sub.is_active ? 'Active' : 'Inactive',
          sub.subscribed_at || '',
          sub.unsubscribed_at || ''
        ])
        
        // Convert to CSV
        const csvContent = [
          headers.join(','),
          ...rows.map((row: (string | number)[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n')
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      .catch(err => {
        console.error('Error exporting subscribers:', err)
        alert('Failed to export subscribers')
      })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
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

  const handleDeleteClick = (subscriber: NewsletterSubscriber) => {
    setSubscriberToDelete(subscriber)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!subscriberToDelete) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/newsletter?id=${subscriberToDelete.id}&permanent=true`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete subscriber')
      }

      // Refresh the list
      await fetchSubscribers()
      setShowDeleteModal(false)
      setSubscriberToDelete(null)
    } catch (err: any) {
      console.error('Error deleting subscriber:', err)
      alert('Failed to delete subscriber: ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setSubscriberToDelete(null)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Newsletter Signups</h1>
                <p className="text-secondary-600">Manage newsletter subscribers</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="btn flex items-center space-x-2"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
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
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => {
                  setActiveOnly(e.target.checked)
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-secondary-700">Show active subscribers only</span>
            </label>
            <span className="text-sm text-secondary-500">
              Total: {pagination.total} subscribers
            </span>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-600">Loading subscribers...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Error Loading Subscribers</h3>
              <p className="text-secondary-600 mb-4">{error}</p>
              <button
                onClick={fetchSubscribers}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No Subscribers Found</h3>
              <p className="text-secondary-600">
                {activeOnly ? 'No active subscribers at this time.' : 'No subscribers found.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscribed
                      </th>
                      {!activeOnly && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unsubscribed
                        </th>
                      )}
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-secondary-900">{subscriber.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-secondary-700">
                            {subscriber.first_name || subscriber.last_name
                              ? `${subscriber.first_name || ''} ${subscriber.last_name || ''}`.trim()
                              : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {subscriber.source || 'website'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subscriber.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {subscriber.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          {formatDate(subscriber.subscribed_at)}
                        </td>
                        {!activeOnly && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                            {formatDate(subscriber.unsubscribed_at)}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteClick(subscriber)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete subscriber"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-secondary-700">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} subscribers
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <span className="text-sm text-secondary-700 px-4">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && subscriberToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleDeleteCancel}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-secondary-900">Delete Subscriber</h2>
                </div>
                <button
                  onClick={handleDeleteCancel}
                  className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <p className="text-secondary-700 mb-4">
                Are you sure you want to permanently delete this subscriber? This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-secondary-900 mb-1">Email:</p>
                <p className="text-sm text-secondary-700">{subscriberToDelete.email}</p>
                {(subscriberToDelete.first_name || subscriberToDelete.last_name) && (
                  <>
                    <p className="text-sm font-medium text-secondary-900 mt-3 mb-1">Name:</p>
                    <p className="text-sm text-secondary-700">
                      {`${subscriberToDelete.first_name || ''} ${subscriberToDelete.last_name || ''}`.trim()}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

