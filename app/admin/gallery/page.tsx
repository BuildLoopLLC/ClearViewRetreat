'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  PhotoIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'

// Gallery types with their display names
const GALLERY_TYPES = [
  { id: 'retreat-center', name: 'Retreat Center', description: 'Photos of our retreat center and facilities' },
  { id: 'events', name: 'Event Photos', description: 'Photos from seminars, workshops, and retreats' },
  { id: 'nature', name: 'Nature & Grounds', description: 'Natural beauty of our surroundings' },
  { id: 'community', name: 'Community Life', description: 'Fellowship and community activities' },
  { id: 'cabins', name: 'Cabins', description: 'Our cabin accommodations' },
] as const

type GalleryType = typeof GALLERY_TYPES[number]['id']

interface GalleryImage {
  id: string
  galleryType: GalleryType
  title: string
  description: string | null
  url: string
  thumbnailUrl: string | null
  category: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ImageFormData {
  title: string
  description: string
  category: string
  url: string
  thumbnailUrl: string
  isActive: boolean
}

export default function GalleryManagementPage() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGallery, setSelectedGallery] = useState<GalleryType>('retreat-center')
  const [showModal, setShowModal] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [formData, setFormData] = useState<ImageFormData>({
    title: '',
    description: '',
    category: '',
    url: '',
    thumbnailUrl: '',
    isActive: true
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch images for selected gallery
  useEffect(() => {
    fetchImages()
  }, [selectedGallery])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/gallery?type=${selectedGallery}&includeInactive=true`)
      if (!response.ok) throw new Error('Failed to fetch images')
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const openAddModal = () => {
    setEditingImage(null)
    setFormData({
      title: '',
      description: '',
      category: '',
      url: '',
      thumbnailUrl: '',
      isActive: true
    })
    setShowModal(true)
  }

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image)
    setFormData({
      title: image.title,
      description: image.description || '',
      category: image.category || '',
      url: image.url,
      thumbnailUrl: image.thumbnailUrl || '',
      isActive: image.isActive
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingImage(null)
    setFormData({
      title: '',
      description: '',
      category: '',
      url: '',
      thumbnailUrl: '',
      isActive: true
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('type', 'gallery-image')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl || data.url
      }))
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.url) {
      alert('Title and image URL are required')
      return
    }

    try {
      setSaving(true)
      
      if (editingImage) {
        // Update existing image
        const response = await fetch(`/api/gallery?id=${editingImage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (!response.ok) throw new Error('Failed to update image')
      } else {
        // Create new image
        const response = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            galleryType: selectedGallery
          })
        })
        if (!response.ok) throw new Error('Failed to create image')
      }

      closeModal()
      fetchImages()
    } catch (error) {
      console.error('Error saving image:', error)
      alert('Failed to save image. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm(`Are you sure you want to delete "${image.title}"?`)) return

    try {
      // Delete from database
      const response = await fetch(`/api/gallery?id=${image.id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete image')

      // Also delete the actual files from S3
      if (image.url) {
        await fetch(`/api/upload?imageUrl=${encodeURIComponent(image.url)}&thumbnailUrl=${encodeURIComponent(image.thumbnailUrl || '')}`, {
          method: 'DELETE'
        })
      }

      fetchImages()
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image. Please try again.')
    }
  }

  const toggleActive = async (image: GalleryImage) => {
    try {
      const response = await fetch(`/api/gallery?id=${image.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !image.isActive })
      })
      if (!response.ok) throw new Error('Failed to update image')
      fetchImages()
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    setDraggedItem(imageId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, imageId: string) => {
    e.preventDefault()
    if (draggedItem !== imageId) {
      setDragOverItem(imageId)
    }
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    const draggedIndex = images.findIndex(img => img.id === draggedItem)
    const targetIndex = images.findIndex(img => img.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Reorder locally first for immediate feedback
    const newImages = [...images]
    const [removed] = newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, removed)

    // Update order values
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      order: index
    }))

    setImages(updatedImages)
    setDraggedItem(null)
    setDragOverItem(null)

    // Save new order to database
    try {
      const response = await fetch('/api/gallery?action=reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: updatedImages.map(img => ({ id: img.id, order: img.order }))
        })
      })
      if (!response.ok) throw new Error('Failed to save order')
    } catch (error) {
      console.error('Error saving order:', error)
      fetchImages() // Revert on error
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const currentGalleryInfo = GALLERY_TYPES.find(g => g.id === selectedGallery)

  if (loading && images.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading gallery...</p>
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
              <h1 className="text-2xl font-bold text-secondary-900">Photo Gallery Management</h1>
              <p className="text-secondary-600">Manage gallery images across different sections</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={openAddModal}
                className="btn-primary flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Image</span>
              </button>
              <Link href="/admin" className="btn">
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
        {/* Gallery Type Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Select Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {GALLERY_TYPES.map((gallery) => (
              <button
                key={gallery.id}
                onClick={() => setSelectedGallery(gallery.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedGallery === gallery.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`font-medium mb-1 ${
                  selectedGallery === gallery.id ? 'text-primary-700' : 'text-gray-900'
                }`}>
                  {gallery.name}
                </div>
                <div className="text-xs text-gray-500 line-clamp-2">
                  {gallery.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Gallery Info */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-sm p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">{currentGalleryInfo?.name}</h3>
              <p className="text-primary-100">{currentGalleryInfo?.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{images.length}</div>
              <div className="text-primary-200 text-sm">
                {images.filter(img => img.isActive).length} active
              </div>
            </div>
          </div>
        </div>

        {/* Drag & Drop Instructions */}
        {images.length > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <ArrowsUpDownIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Drag and drop images to reorder them. Changes are saved automatically.
            </p>
          </div>
        )}

        {/* Images Grid */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-secondary-900">
              {currentGalleryInfo?.name} Images
            </h2>
          </div>

          {images.length === 0 ? (
            <div className="p-12 text-center">
              <PhotoIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
              <p className="text-gray-500 mb-6">
                Start by adding images to the {currentGalleryInfo?.name?.toLowerCase()} gallery.
              </p>
              <button
                onClick={openAddModal}
                className="btn-primary inline-flex items-center space-x-2 px-6 py-3"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add First Image</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, image.id)}
                  onDragOver={(e) => handleDragOver(e, image.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, image.id)}
                  onDragEnd={handleDragEnd}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                    draggedItem === image.id
                      ? 'opacity-50 scale-95'
                      : dragOverItem === image.id
                      ? 'border-primary-500 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!image.isActive ? 'opacity-60' : ''}`}
                >
                  {/* Order Badge */}
                  <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    #{index + 1}
                  </div>

                  {/* Active/Inactive Badge */}
                  {!image.isActive && (
                    <div className="absolute top-2 right-2 z-10 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Hidden
                    </div>
                  )}

                  {/* Image */}
                  <div className="aspect-square">
                    <img
                      src={image.thumbnailUrl || image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(image)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => toggleActive(image)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title={image.isActive ? 'Hide' : 'Show'}
                      >
                        {image.isActive ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-700" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-700" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(image)}
                        className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-3 bg-gray-50">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{image.title}</h4>
                    {image.category && (
                      <span className="text-xs text-gray-500">{image.category}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload/Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                
                {formData.url ? (
                  <div className="relative">
                    <img
                      src={formData.thumbnailUrl || formData.url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, url: '', thumbnailUrl: '' }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
                        <p className="text-sm text-gray-600">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">Click to upload an image</p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Manual URL input */}
                <div className="mt-3">
                  <label className="text-xs text-gray-500 block mb-1">Or enter image URL directly:</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter image title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter image description (optional)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Exterior, Interior, Landscape"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700">Visible on website</label>
                  <p className="text-xs text-gray-500">Hidden images won't appear on the public gallery</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    formData.isActive ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.url || !formData.title}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      <span>{editingImage ? 'Update Image' : 'Add Image'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

