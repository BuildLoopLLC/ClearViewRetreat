'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

// Mock blog posts data - in real app this would come from the database
const mockBlogPosts = [
  {
    id: 1,
    title: 'Spring Renewal Retreat Guide',
    excerpt: 'Everything you need to know about our upcoming spring retreat, including activities, accommodations, and spiritual focus areas.',
    author: 'Sarah Johnson',
    publishedAt: '2024-03-01',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    slug: 'spring-renewal-retreat-guide',
  },
  {
    id: 2,
    title: 'The Power of Nature in Spiritual Growth',
    excerpt: 'Discover how spending time in God\'s creation can deepen your faith and provide clarity in your spiritual journey.',
    author: 'Mike Chen',
    publishedAt: '2024-02-28',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    slug: 'power-of-nature-spiritual-growth',
  },
  {
    id: 3,
    title: 'Building Community Through Shared Experiences',
    excerpt: 'How our retreats create lasting bonds and strengthen relationships through meaningful activities and shared spiritual moments.',
    author: 'Emily Rodriguez',
    publishedAt: '2024-02-25',
    status: 'draft',
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    slug: 'building-community-shared-experiences',
  },
  {
    id: 4,
    title: 'Preparing Your Heart for Retreat',
    excerpt: 'Practical tips and spiritual preparation to help you get the most out of your retreat experience.',
    author: 'David Thompson',
    publishedAt: '2024-02-20',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    slug: 'preparing-heart-retreat',
  },
]

export default function BlogManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState(mockBlogPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      setBlogPosts(prev => prev.filter(post => post.id !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', text: 'Published' },
      draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' },
      archived: { color: 'bg-gray-100 text-gray-800', text: 'Archived' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
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
                href="/admin"
                className="btn-outline"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/admin/blog/new"
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Blog Post
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-full sm:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Blog Posts List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-secondary-900">
              Blog Posts ({filteredPosts.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-secondary-50 transition-colors duration-200">
                <div className="flex items-start space-x-4">
                  {/* Featured Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <div 
                        className="w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('${post.featuredImage}')` }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-secondary-500">
                          <div className="flex items-center space-x-1">
                            <UserIcon className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                          {getStatusBadge(post.status)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                          title="View Post"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                          title="Edit Post"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-secondary-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete Post"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-secondary-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No blog posts found</h3>
              <p className="text-secondary-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating your first blog post.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link
                  href="/admin/blog/new"
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Blog Post
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
