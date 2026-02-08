'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  CloudArrowUpIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface StaffMember {
  id: string
  name: string
  title: string
  email: string | null
  phone: string | null
  bio: string | null
  imageUrl: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface StaffFormData {
  name: string
  title: string
  email: string
  phone: string
  bio: string
  imageUrl: string
  isActive: boolean
}

export default function StaffManager() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null)
  const [formData, setFormData] = useState<StaffFormData>({
    name: '',
    title: '',
    email: '',
    phone: '',
    bio: '',
    imageUrl: '',
    isActive: true
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/staff?includeInactive=true')
      if (!response.ok) throw new Error('Failed to fetch staff')
      const data = await response.json()
      setStaff(data)
    } catch (error) {
      console.error('Error fetching staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingMember(null)
    setFormData({
      name: '',
      title: '',
      email: '',
      phone: '',
      bio: '',
      imageUrl: '',
      isActive: true
    })
    setShowModal(true)
  }

  const openEditModal = (member: StaffMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      title: member.title,
      email: member.email || '',
      phone: member.phone || '',
      bio: member.bio || '',
      imageUrl: member.imageUrl || '',
      isActive: member.isActive
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingMember(null)
    setFormData({
      name: '',
      title: '',
      email: '',
      phone: '',
      bio: '',
      imageUrl: '',
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
      uploadFormData.append('type', 'staff-image')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        imageUrl: data.url
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
    if (!formData.name || !formData.title) {
      alert('Name and title are required')
      return
    }

    try {
      setSaving(true)
      
      if (editingMember) {
        const response = await fetch(`/api/staff?id=${editingMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (!response.ok) throw new Error('Failed to update staff member')
      } else {
        const response = await fetch('/api/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (!response.ok) throw new Error('Failed to create staff member')
      }

      closeModal()
      fetchStaff()
    } catch (error) {
      console.error('Error saving staff member:', error)
      alert('Failed to save staff member. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (member: StaffMember) => {
    if (!confirm(`Are you sure you want to delete "${member.name}"?`)) return

    try {
      const response = await fetch(`/api/staff?id=${member.id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete staff member')

      // Also delete the image from S3 if it exists
      if (member.imageUrl) {
        await fetch(`/api/upload?imageUrl=${encodeURIComponent(member.imageUrl)}`, {
          method: 'DELETE'
        })
      }

      fetchStaff()
    } catch (error) {
      console.error('Error deleting staff member:', error)
      alert('Failed to delete staff member. Please try again.')
    }
  }

  const toggleActive = async (member: StaffMember) => {
    try {
      const response = await fetch(`/api/staff?id=${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !member.isActive })
      })
      if (!response.ok) throw new Error('Failed to update staff member')
      fetchStaff()
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, memberId: string) => {
    setDraggedItem(memberId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, memberId: string) => {
    e.preventDefault()
    if (draggedItem !== memberId) {
      setDragOverItem(memberId)
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

    const draggedIndex = staff.findIndex(m => m.id === draggedItem)
    const targetIndex = staff.findIndex(m => m.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newStaff = [...staff]
    const [removed] = newStaff.splice(draggedIndex, 1)
    newStaff.splice(targetIndex, 0, removed)

    const updatedStaff = newStaff.map((m, index) => ({
      ...m,
      order: index
    }))

    setStaff(updatedStaff)
    setDraggedItem(null)
    setDragOverItem(null)

    try {
      const response = await fetch('/api/staff?action=reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff: updatedStaff.map(m => ({ id: m.id, order: m.order }))
        })
      })
      if (!response.ok) throw new Error('Failed to save order')
    } catch (error) {
      console.error('Error saving order:', error)
      fetchStaff()
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-secondary-900">Staff Directory</h2>
            <p className="text-secondary-600">Manage team members shown on the staff page</p>
          </div>
          <button
            onClick={openAddModal}
            className="btn-primary flex items-center space-x-2 px-4 py-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Staff Member</span>
          </button>
        </div>

        {staff.length > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-3">
            <ArrowsUpDownIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Drag and drop staff members to reorder them. Changes are saved automatically.
            </p>
          </div>
        )}
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-xl shadow-sm">
        {staff.length === 0 ? (
          <div className="p-12 text-center">
            <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
            <p className="text-gray-500 mb-6">
              Add your first team member to display on the staff directory.
            </p>
            <button
              onClick={openAddModal}
              className="btn-primary inline-flex items-center space-x-2 px-6 py-3"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add First Staff Member</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {staff.map((member, index) => (
              <div
                key={member.id}
                draggable
                onDragStart={(e) => handleDragStart(e, member.id)}
                onDragOver={(e) => handleDragOver(e, member.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, member.id)}
                onDragEnd={handleDragEnd}
                className={`p-4 flex items-center space-x-4 cursor-grab active:cursor-grabbing transition-all ${
                  draggedItem === member.id
                    ? 'opacity-50 bg-gray-50'
                    : dragOverItem === member.id
                    ? 'bg-primary-50 border-l-4 border-primary-500'
                    : 'hover:bg-gray-50'
                } ${!member.isActive ? 'opacity-60' : ''}`}
              >
                {/* Order Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-semibold text-primary-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 truncate">{member.name}</h4>
                    {!member.isActive && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-primary-600">{member.title}</p>
                  {member.email && (
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => toggleActive(member)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title={member.isActive ? 'Hide' : 'Show'}
                  >
                    {member.isActive ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 sticky top-0">
              <h2 className="text-xl font-bold text-gray-900">
                {editingMember ? 'Edit Staff Member' : 'Add New Staff Member'}
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
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo
                </label>
                
                <div className="flex items-center space-x-4">
                  {/* Preview */}
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="btn flex items-center space-x-2 mb-2"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <CloudArrowUpIcon className="h-5 w-5" />
                          <span>Upload Photo</span>
                        </>
                      )}
                    </button>
                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title/Position *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Executive Director"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Brief description or bio..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700">Show on website</label>
                  <p className="text-xs text-gray-500">Hidden staff members won't appear on the public page</p>
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
                  disabled={saving || !formData.name || !formData.title}
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
                      <span>{editingMember ? 'Update' : 'Add Staff Member'}</span>
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

