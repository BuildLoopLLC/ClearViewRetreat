'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  createdAt: string
  updatedAt: string
}


export default function BlogCategoriesPage() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: 'bg-blue-100 text-blue-800'
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const categoriesData = await response.json()
        setCategories(categoriesData)
      } else {
        setError('Failed to fetch categories')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && { slug: generateSlug(value) })
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingCategory) {
        // Update existing category
        const response = await fetch('/api/categories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingCategory.id,
            ...formData
          }),
        })
        
        if (response.ok) {
          const updatedCategory = await response.json()
          setCategories(prev => prev.map(cat => 
            cat.id === editingCategory.id ? updatedCategory : cat
          ))
        } else {
          setError('Failed to update category')
          return
        }
      } else {
        // Add new category
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        
        if (response.ok) {
          const newCategory = await response.json()
          setCategories(prev => [...prev, newCategory])
        } else {
          setError('Failed to create category')
          return
        }
      }
      
      setShowAddForm(false)
      setEditingCategory(null)
      setFormData({ name: '', slug: '', description: '', color: 'bg-blue-100 text-blue-800' })
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/categories?id=${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setCategories(prev => prev.filter(cat => cat.id !== id))
        } else {
          setError('Failed to delete category')
        }
      } catch (err: any) {
        setError(err.message)
      }
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingCategory(null)
    setFormData({ name: '', slug: '', description: '', color: 'bg-blue-100 text-blue-800' })
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const colorOptions = [
    { value: 'bg-blue-100 text-blue-800', label: 'Blue' },
    { value: 'bg-green-100 text-green-800', label: 'Green' },
    { value: 'bg-purple-100 text-purple-800', label: 'Purple' },
    { value: 'bg-orange-100 text-orange-800', label: 'Orange' },
    { value: 'bg-pink-100 text-pink-800', label: 'Pink' },
    { value: 'bg-red-100 text-red-800', label: 'Red' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow' },
    { value: 'bg-indigo-100 text-indigo-800', label: 'Indigo' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading categories...</p>
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
                <h1 className="text-2xl font-bold text-secondary-900">Blog Categories</h1>
                <p className="text-secondary-600">Manage blog post categories</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Category</span>
              </button>
              <Link
                href="/admin/blog"
                className="btn px-6 py-3 text-sm font-medium"
              >
                Back to Posts
              </Link>
              <button
                onClick={handleLogout}
                className="btn text-red-600 hover:text-red-700 hover:border-red-300 px-6 py-3 text-sm font-medium"
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

        {/* Add/Edit Category Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-secondary-700 mb-2">
                    URL Slug *
                    <span className="text-xs text-gray-500 ml-2">(auto-generated from name)</span>
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
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="textarea w-full"
                    placeholder="Brief description of this category"
                  />
                </div>
                
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-secondary-700 mb-2">
                    Color Theme
                  </label>
                  <select
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="input w-full"
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-secondary-700">Preview:</span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${formData.color}`}>
                    {formData.name || 'Category Name'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn px-6 py-3 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-3 text-sm font-medium"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-secondary-900">All Categories</h2>
          </div>
          
          {categories.length === 0 ? (
            <div className="p-6 text-center">
              <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first category.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create First Category</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${category.color}`}>
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-500">/{category.slug}</span>
                      </div>
                      
                      {category.description && (
                        <p className="text-gray-600 mb-2">{category.description}</p>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="btn flex items-center space-x-2 px-4 py-2 text-sm"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="btn flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:border-red-300"
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
