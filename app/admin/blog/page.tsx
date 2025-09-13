'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  DocumentTextIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { BlogPost } from '@/types/firebase'

export default function BlogManagementPage() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/website-content?section=blog')
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
      }
      const data = await response.json()
      setPosts(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    try {
      const response = await fetch(`/api/website-content?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete blog post')
      }
      
      setPosts(posts.filter(post => post.id !== id))
    } catch (err: any) {
      alert('Failed to delete blog post: ' + err.message)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading blog posts...</p>
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
              <h1 className="text-2xl font-bold text-secondary-900">Blog Management</h1>
              <p className="text-secondary-600">Manage your blog posts and content</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/blog/new"
                className="btn-primary flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Post</span>
              </Link>
              <Link
                href="/admin/blog/categories"
                className="btn flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <TagIcon className="h-5 w-5" />
                <span>Categories</span>
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

        {/* Blog Posts List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-secondary-900">All Blog Posts</h2>
          </div>
          
          {posts.length === 0 ? (
            <div className="p-6 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first blog post.</p>
              <Link
                href="/admin/blog/new"
                className="btn-primary inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create First Post</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 flex items-start space-x-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        {post.thumbnail ? (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-20 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{post.excerpt}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span>by {post.authorName}</span>
                          <span>•</span>
                          <span>{post.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="btn flex items-center space-x-2 px-4 py-2 text-sm"
                        title="View Post"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                      <Link
                        href={`/admin/blog/edit/${post.id}`}
                        className="btn-primary flex items-center space-x-2 px-4 py-2 text-sm"
                        title="Edit Post"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="btn flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:border-red-300"
                        title="Delete Post"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Delete</span>
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