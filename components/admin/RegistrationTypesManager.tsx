'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  Bars3Icon,
  LinkIcon,
  DocumentIcon,
  XMarkIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface RegistrationEventType {
  id: string
  name: string
  description: string | null
  form_link: string | null
  pdf_link: string | null
  order_index: number
  is_active: boolean
}

interface SortableItemProps {
  type: RegistrationEventType
  onEdit: (type: RegistrationEventType) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
}

function SortableItem({ type, onEdit, onDelete, onToggleActive }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: type.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 ${
        type.is_active ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-secondary-900">{type.name}</h4>
              {!type.is_active && (
                <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                  Hidden
                </span>
              )}
            </div>
            {type.description && (
              <p className="text-sm text-secondary-500 mt-1">{type.description}</p>
            )}
            <div className="flex items-center space-x-4 mt-2">
              {type.form_link ? (
                <a
                  href={type.form_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700"
                >
                  <LinkIcon className="h-3 w-3" />
                  <span>Form Link</span>
                </a>
              ) : (
                <span className="flex items-center space-x-1 text-xs text-gray-400">
                  <LinkIcon className="h-3 w-3" />
                  <span>No form link (will show modal)</span>
                </span>
              )}
              {type.pdf_link ? (
                <a
                  href={type.pdf_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700"
                >
                  <DocumentIcon className="h-3 w-3" />
                  <span>PDF Link</span>
                </a>
              ) : (
                <span className="flex items-center space-x-1 text-xs text-gray-400">
                  <DocumentIcon className="h-3 w-3" />
                  <span>No PDF</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleActive(type.id, !type.is_active)}
            className={`p-2 rounded-lg transition-colors ${
              type.is_active 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            title={type.is_active ? 'Hide' : 'Show'}
          >
            {type.is_active ? (
              <EyeIcon className="h-4 w-4" />
            ) : (
              <EyeSlashIcon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => onEdit(type)}
            className="p-2 text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(type.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RegistrationTypesManager() {
  const [types, setTypes] = useState<RegistrationEventType[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingType, setEditingType] = useState<RegistrationEventType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    form_link: '',
    pdf_link: ''
  })
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    fetchTypes()
  }, [])

  const fetchTypes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/registration-types')
      if (response.ok) {
        const data = await response.json()
        setTypes(data)
      }
    } catch (error) {
      console.error('Error fetching registration types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = types.findIndex(t => t.id === active.id)
      const newIndex = types.findIndex(t => t.id === over.id)
      
      const newTypes = arrayMove(types, oldIndex, newIndex)
      setTypes(newTypes)
      
      // Save new order to server
      try {
        await fetch('/api/registration-types?id=reorder&action=reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: newTypes })
        })
      } catch (error) {
        console.error('Error saving order:', error)
        fetchTypes() // Revert on error
      }
    }
  }

  const openAddModal = () => {
    setEditingType(null)
    setFormData({ name: '', description: '', form_link: '', pdf_link: '' })
    setShowModal(true)
  }

  const openEditModal = (type: RegistrationEventType) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      description: type.description || '',
      form_link: type.form_link || '',
      pdf_link: type.pdf_link || ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingType(null)
    setFormData({ name: '', description: '', form_link: '', pdf_link: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Name is required')
      return
    }

    try {
      setSaving(true)
      
      if (editingType) {
        // Update existing
        const response = await fetch(`/api/registration-types?id=${editingType.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            is_active: editingType.is_active
          })
        })
        
        if (response.ok) {
          setTypes(prev => prev.map(t => 
            t.id === editingType.id 
              ? { ...t, ...formData }
              : t
          ))
          closeModal()
        }
      } else {
        // Create new
        const response = await fetch('/api/registration-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (response.ok) {
          const { type } = await response.json()
          setTypes(prev => [...prev, type])
          closeModal()
        }
      }
    } catch (error) {
      console.error('Error saving type:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration type?')) return
    
    try {
      const response = await fetch(`/api/registration-types?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setTypes(prev => prev.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting type:', error)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const type = types.find(t => t.id === id)
    if (!type) return

    try {
      const response = await fetch(`/api/registration-types?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: type.name,
          description: type.description,
          form_link: type.form_link,
          pdf_link: type.pdf_link,
          is_active: isActive
        })
      })
      
      if (response.ok) {
        setTypes(prev => prev.map(t => 
          t.id === id ? { ...t, is_active: isActive } : t
        ))
      }
    } catch (error) {
      console.error('Error toggling active:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-secondary-600">Loading registration types...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Registration Event Types</h2>
            <p className="text-secondary-600 mt-1">
              Manage the event types shown on the Group Event Registration page. 
              Drag to reorder.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Event Type</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {types.length === 0 ? (
          <div className="text-center py-12 text-secondary-500">
            <DocumentIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No registration event types configured.</p>
            <p className="text-sm mt-2">Click "Add Event Type" to get started.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={types.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {types.map((type) => (
                  <SortableItem
                    key={type.id}
                    type={type}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Help text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> Each event type will show on the registration page. 
            If you provide a form link, clicking will open that link. 
            If you provide a PDF link, it will show a download option. 
            If neither is provided, clicking will open a registration form modal.
          </p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingType ? 'Edit Event Type' : 'Add Event Type'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Family Camp Registration"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Form Link (optional)
                </label>
                <input
                  type="url"
                  value={formData.form_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, form_link: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://forms.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  External form URL (e.g., Google Forms, Typeform)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  PDF Link (optional)
                </label>
                <input
                  type="url"
                  value={formData.pdf_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, pdf_link: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com/form.pdf"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to a downloadable PDF form
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingType ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

