'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  XMarkIcon,
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  FolderIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface FileItem {
  key: string
  name: string
  url: string
  size: number
  lastModified: string
  extension: string
  contentType: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function FileManagerPage() {
  const { user, logout, loading: authLoading, isAdmin } = useAuthContext()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/admin/login')
    }
  }, [user, isAdmin, authLoading, router])

  useEffect(() => {
    if (user && isAdmin) {
      fetchFiles()
    }
  }, [user, isAdmin, pagination.page])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })
      
      const response = await fetch(`/api/files?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch files')
      }
      
      const data = await response.json()
      setFiles(data.files || [])
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }))
    } catch (err: any) {
      setError(err.message || 'Failed to load files')
      console.error('Error fetching files:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload file')
      }

      // Refresh file list
      await fetchFiles()
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload file')
      console.error('Error uploading file:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteClick = (file: FileItem) => {
    setFileToDelete(file)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/files?key=${encodeURIComponent(fileToDelete.key)}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      // Refresh file list
      await fetchFiles()
      setShowDeleteModal(false)
      setFileToDelete(null)
    } catch (err: any) {
      console.error('Error deleting file:', err)
      alert('Failed to delete file: ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setFileToDelete(null)
  }

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      alert('Failed to copy link to clipboard')
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

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

  const getFileIcon = (contentType: string, extension: string) => {
    if (contentType.startsWith('image/')) {
      return PhotoIcon
    } else if (contentType.startsWith('video/')) {
      return VideoCameraIcon
    } else if (contentType.startsWith('audio/')) {
      return MusicalNoteIcon
    } else if (contentType === 'application/pdf') {
      return DocumentIcon
    } else {
      return DocumentIcon
    }
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
                <h1 className="text-2xl font-bold text-secondary-900">File Manager</h1>
                <p className="text-secondary-600">Upload and manage files for your site</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                multiple={false}
              />
              <button
                onClick={handleFileSelect}
                disabled={uploading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span>Upload File</span>
                  </>
                )}
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
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Files Grid */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-600">Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No Files Found</h3>
              <p className="text-secondary-600 mb-4">Upload your first file to get started.</p>
              <button
                onClick={handleFileSelect}
                className="btn-primary"
              >
                Upload File
              </button>
            </div>
          ) : (
            <>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {files.map((file) => {
                    const FileIcon = getFileIcon(file.contentType, file.extension)
                    const isImage = file.contentType.startsWith('image/')
                    
                    return (
                      <div
                        key={file.key}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {/* File Preview/Icon */}
                        <div className="mb-3">
                          {isImage ? (
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            </div>
                          ) : (
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                              <FileIcon className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="mb-3">
                          <h3 className="text-sm font-medium text-secondary-900 truncate mb-1" title={file.name}>
                            {file.name}
                          </h3>
                          <p className="text-xs text-secondary-500">
                            {formatFileSize(file.size)} • {formatDate(file.lastModified)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopyLink(file.url)}
                            className="flex-1 px-3 py-2 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center space-x-1"
                            title="Copy link"
                          >
                            {copiedUrl === file.url ? (
                              <>
                                <CheckIcon className="h-4 w-4" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <ClipboardDocumentIcon className="h-4 w-4" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(file)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete file"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-secondary-700">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} files
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
      {showDeleteModal && fileToDelete && (
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
                  <h2 className="text-xl font-bold text-secondary-900">Delete File</h2>
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
                Are you sure you want to permanently delete this file? This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-secondary-900 mb-1">File Name:</p>
                <p className="text-sm text-secondary-700">{fileToDelete.name}</p>
                <p className="text-sm font-medium text-secondary-900 mt-3 mb-1">Size:</p>
                <p className="text-sm text-secondary-700">{formatFileSize(fileToDelete.size)}</p>
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

