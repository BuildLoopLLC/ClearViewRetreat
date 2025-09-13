'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  CalendarIcon,
  TagIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import RichTextEditor from '@/components/admin/RichTextEditor'
import SecureImage from '@/components/ui/SecureImage'
import { BlogPost } from '@/types/firebase'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
}

export default function EditBlogPostPage() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    published: false,
    mainImage: '',
    thumbnail: ''
  })
  const [imageUploading, setImageUploading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch('/api/categories')
        if (response.ok) {
          const categoriesData = await response.json()
          setCategories(categoriesData)
        } else {
          console.error('Failed to fetch categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch blog post data
  useEffect(() => {
    if (postId) {
      fetchBlogPost()
    }
  }, [postId])

  const fetchBlogPost = async () => {
    try {
      setInitialLoading(true)
      setError('')
      
      const response = await fetch(`/api/blog?id=${postId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog post not found')
        }
        throw new Error('Failed to fetch blog post')
      }
      
      const post: BlogPost = await response.json()
      
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.category || '',
        tags: post.tags ? post.tags.join(', ') : '',
        published: post.published || false,
        mainImage: post.mainImage || '',
        thumbnail: post.thumbnail || ''
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB')
      return
    }

    try {
      setImageUploading(true)
      setError('')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'blog-main-image')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const result = await response.json()
      
      setFormData(prev => ({
        ...prev,
        mainImage: result.url,
        thumbnail: result.thumbnailUrl
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Failed to upload image. Please try again.')
    } finally {
      setImageUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      mainImage: '',
      thumbnail: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/blog?id=${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          mainImage: formData.mainImage,
          thumbnail: formData.thumbnail,
          category: formData.category,
          tags: formData.tags,
          published: formData.published,
          authorName: user?.displayName || 'Admin',
          authorEmail: user?.email || 'admin@clearviewretreat.com'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update blog post')
      }

      // Redirect to blog management page
      router.push('/admin/blog')
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
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
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
                href="/admin/blog"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Edit Blog Post</h1>
                <p className="text-secondary-600">Update your blog post content and settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
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
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="input w-full"
                  placeholder="Enter blog post title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-secondary-700 mb-2">
                  URL Slug *
                  <span className="text-xs text-gray-500 ml-2">(auto-generated from title)</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="url-friendly-slug"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can edit this manually if needed. Use lowercase letters, numbers, and hyphens only.
                </p>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  <Link href="/admin/blog/categories" className="text-primary-600 hover:text-primary-700">
                    Manage categories
                  </Link>
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="excerpt" className="block text-sm font-medium text-secondary-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="textarea w-full"
                  placeholder="Brief description of the blog post"
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

          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
              <PhotoIcon className="h-5 w-5 mr-2" />
              Featured Image
            </h2>
            
            <div className="space-y-4">
              {formData.mainImage ? (
                <div className="relative">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <SecureImage
                          src={formData.mainImage}
                          alt="Main image preview"
                          className="w-full h-full object-cover rounded-lg"
                          fallbackIcon={DocumentTextIcon}
                        />
                        <div className="hidden text-center text-gray-500">
                          <PhotoIcon className="h-8 w-8 mx-auto mb-1" />
                          <p className="text-xs">Image failed to load</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="w-16 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <SecureImage
                          src={formData.thumbnail}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover rounded"
                          fallbackIcon={DocumentTextIcon}
                        />
                        <div className="hidden text-center text-gray-500">
                          <PhotoIcon className="h-4 w-4 mx-auto" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Thumbnail (auto-generated)</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex-shrink-0 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-4">Upload a featured image for your blog post</p>
                  <label className="btn-primary cursor-pointer inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium">
                    <PhotoIcon className="h-5 w-5" />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </label>
                  {imageUploading && (
                    <p className="text-sm text-gray-500 mt-2">Uploading image...</p>
                  )}
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                <p>• Recommended size: 1200x630px or larger</p>
                <p>• Supported formats: JPG, PNG, WebP</p>
                <p>• Maximum file size: 10MB</p>
                <p>• A thumbnail will be automatically generated</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Content</h2>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Blog Post Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Write your blog post content here..."
              />
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Publishing Options
            </h2>
            
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
            <p className="text-xs text-gray-500 mt-1">
              Uncheck to save as draft
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/blog"
              className="btn px-8 py-3 text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-sm font-medium"
            >
              {loading ? 'Updating...' : 'Update Blog Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
