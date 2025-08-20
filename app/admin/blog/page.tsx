'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline'

// Mock blog posts data - in real app this would come from the database
const mockBlogPosts = [
  {
    id: '1',
    title: 'Spring Renewal Retreat Guide',
    excerpt: 'Discover the perfect way to welcome spring with our comprehensive retreat guide...',
    author: 'Sarah Johnson',
    publishedAt: '2024-03-15',
    status: 'published',
    featuredImage: '/images/blog/spring-retreat.jpg'
  },
  {
    id: '2',
    title: 'Building Community Through Shared Meals',
    excerpt: 'How breaking bread together strengthens bonds and creates lasting friendships...',
    author: 'Mike Chen',
    publishedAt: '2024-03-10',
    status: 'published',
    featuredImage: '/images/blog/community-meals.jpg'
  },
  {
    id: '3',
    title: 'The Healing Power of Nature',
    excerpt: 'Exploring the scientific and spiritual benefits of spending time outdoors...',
    author: 'Emily Rodriguez',
    publishedAt: '2024-03-05',
    status: 'draft',
    featuredImage: '/images/blog/nature-healing.jpg'
  },
  {
    id: '4',
    title: 'Preparing for Your First Retreat',
    excerpt: 'Essential tips and packing lists for first-time retreat participants...',
    author: 'David Thompson',
    publishedAt: '2024-02-28',
    status: 'published',
    featuredImage: '/images/blog/first-retreat.jpg'
  }
]

export default function AdminBlogPage() {
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
              <h1 className="text-2xl font-bold text-secondary-900">Blog Management</h1>
              <p className="text-secondary-600">Manage your blog posts and content</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/blog/new"
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Post</span>
              </Link>
              <Link
                href="/admin"
                className="btn-outline"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Posts Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-secondary-900">All Blog Posts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockBlogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={post.featuredImage}
                            alt={post.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">{post.title}</div>
                          <div className="text-sm text-secondary-500">{post.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-secondary-400 mr-2" />
                        <span className="text-sm text-secondary-900">{post.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-secondary-400 mr-2" />
                        <span className="text-sm text-secondary-900">{post.publishedAt}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="text-primary-600 hover:text-primary-900 p-1"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-secondary-600 hover:text-secondary-900 p-1"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this post?')) {
                              // Handle delete
                              console.log('Delete post:', post.id)
                            }
                          }}
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
      </div>
    </div>
  )
}
