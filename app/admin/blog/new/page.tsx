'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NewBlogPostPage() {
  const { user, loading, isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Create New Blog Post</h1>
              <p className="text-secondary-600">Add a new blog post to your website</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/blog"
                className="btn-outline flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Blog</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">Blog Post Form Coming Soon</h3>
            <p className="text-secondary-600 mb-6">
              The blog post creation form will be implemented here with rich text editing, image uploads, and publishing options.
            </p>
            <Link
              href="/admin/blog"
              className="btn-primary inline-flex items-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Blog Management
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
