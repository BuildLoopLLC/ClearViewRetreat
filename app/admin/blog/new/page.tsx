'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  ArrowLeftIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function NewBlogPost() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    status: 'draft',
    publishedAt: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN')) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, this would save to database
    console.log('Saving blog post:', formData)
    
    setIsSubmitting(false)
    
    // Redirect to blog management
    router.push('/admin/blog')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/blog"
                className="btn-outline inline-flex items-center"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Blog
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">New Blog Post</h1>
                <p className="text-secondary-600">Create and publish a new blog post</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="btn-outline inline-flex items-center"
              >
                {showPreview ? (
                  <>
                    <EyeSlashIcon className="h-5 w-5 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-5 w-5 mr-2" />
                    Show Preview
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input text-xl"
                  placeholder="Enter your blog post title..."
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-secondary-700 mb-2">
                  URL Slug *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    clearviewretreat.org/blog/
                  </span>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    className="input rounded-l-none"
                    placeholder="url-slug"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-secondary-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="textarea"
                  placeholder="A brief summary of your blog post..."
                />
                <p className="mt-1 text-sm text-secondary-500">
                  This will appear in blog listings and social media shares.
                </p>
              </div>

              {/* Featured Image */}
              <div>
                <label htmlFor="featuredImage" className="block text-sm font-medium text-secondary-700 mb-2">
                  Featured Image URL
                </label>
                <div className="flex space-x-4">
                  <input
                    type="url"
                    id="featuredImage"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleChange}
                    className="input flex-1"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="btn-outline inline-flex items-center"
                  >
                    <PhotoIcon className="h-5 w-5 mr-2" />
                    Upload
                  </button>
                </div>
                {formData.featuredImage && (
                  <div className="mt-3">
                    <img
                      src={formData.featuredImage}
                      alt="Featured image preview"
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={15}
                  value={formData.content}
                  onChange={handleChange}
                  className="textarea font-mono text-sm"
                  placeholder="Write your blog post content here... You can use Markdown formatting."
                />
                <p className="mt-1 text-sm text-secondary-500">
                  Supports Markdown formatting. Use # for headings, ** for bold, * for italic, etc.
                </p>
              </div>

              {/* Status and Publish Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="publishedAt" className="block text-sm font-medium text-secondary-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    id="publishedAt"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/blog"
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Sidebar */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Preview</h3>
                
                {formData.title ? (
                  <div className="space-y-4">
                    {formData.featuredImage && (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={formData.featuredImage}
                          alt="Featured image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div>
                      <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                        {formData.title}
                      </h1>
                      
                      {formData.excerpt && (
                        <p className="text-secondary-600 mb-3">
                          {formData.excerpt}
                        </p>
                      )}
                      
                      <div className="text-sm text-secondary-500">
                        <p>By {session.user?.name}</p>
                        <p>{new Date(formData.publishedAt).toLocaleDateString()}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          formData.status === 'published' ? 'bg-green-100 text-green-800' :
                          formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {formData.status}
                        </span>
                      </div>
                    </div>
                    
                    {formData.content && (
                      <div className="prose prose-sm max-w-none">
                        <h4 className="text-lg font-semibold text-secondary-900 mb-2">Content Preview:</h4>
                        <div className="text-secondary-600 text-sm">
                          {formData.content.length > 200 
                            ? `${formData.content.substring(0, 200)}...`
                            : formData.content
                          }
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-secondary-500 py-8">
                    <p>Start typing to see a preview</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
