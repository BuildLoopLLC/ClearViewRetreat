'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon, LinkIcon } from '@heroicons/react/24/outline'

interface Supporter {
  id: string
  name: string
  link: string
}

interface IndividualSupportersManagerProps {
  supporters: Supporter[]
  onSave: (supporters: Supporter[]) => void
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
}

export default function IndividualSupportersManager({
  supporters,
  onSave,
  isEditing,
  onEdit,
  onCancel
}: IndividualSupportersManagerProps) {
  const [editingSupporters, setEditingSupporters] = useState<Supporter[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingLink, setEditingLink] = useState('')
  const [newSupporterName, setNewSupporterName] = useState('')
  const [newSupporterLink, setNewSupporterLink] = useState('')

  useEffect(() => {
    setEditingSupporters([...supporters])
  }, [supporters])

  const handleAddSupporter = () => {
    if (newSupporterName.trim()) {
      const newSupporter: Supporter = {
        id: `supporter-${Date.now()}`,
        name: newSupporterName.trim(),
        link: newSupporterLink.trim()
      }
      const updatedSupporters = [...editingSupporters, newSupporter]
      setEditingSupporters(updatedSupporters)
      setNewSupporterName('')
      setNewSupporterLink('')
      
      // Auto-save the changes
      onSave(updatedSupporters)
    }
  }

  const handleRemoveSupporter = (index: number) => {
    const updatedSupporters = editingSupporters.filter((_, i) => i !== index)
    setEditingSupporters(updatedSupporters)
    
    // Auto-save the changes
    onSave(updatedSupporters)
  }

  const handleStartEdit = (index: number) => {
    setEditingIndex(index)
    setEditingName(editingSupporters[index].name)
    setEditingLink(editingSupporters[index].link)
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingName.trim()) {
      const updatedSupporters = [...editingSupporters]
      updatedSupporters[editingIndex] = {
        ...updatedSupporters[editingIndex],
        name: editingName.trim(),
        link: editingLink.trim()
      }
      setEditingSupporters(updatedSupporters)
      setEditingIndex(null)
      setEditingName('')
      setEditingLink('')
      
      // Auto-save the changes
      onSave(updatedSupporters)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingName('')
    setEditingLink('')
  }

  const handleSave = () => {
    onSave(editingSupporters)
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (action === 'add') {
        handleAddSupporter()
      } else if (action === 'edit') {
        handleSaveEdit()
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-secondary-900">Individual Supporters</h4>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn-primary text-sm px-4 py-2 flex items-center space-x-2"
              >
                <CheckIcon className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={onCancel}
                className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="btn-primary text-sm px-4 py-2 flex items-center space-x-2"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Edit Supporters</span>
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {/* Add new supporter */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-700">Add New Supporter</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newSupporterName}
                  onChange={(e) => setNewSupporterName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'add')}
                  placeholder="Enter supporter name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
                <input
                  type="url"
                  value={newSupporterLink}
                  onChange={(e) => setNewSupporterLink(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <button
              onClick={handleAddSupporter}
              disabled={!newSupporterName.trim()}
              className="btn-primary px-4 py-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Supporter</span>
            </button>
          </div>

          {/* Supporters list */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <h5 className="text-sm font-medium text-gray-700">Current Supporters</h5>
            {editingSupporters.map((supporter, index) => (
              <div key={supporter.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                {editingIndex === index ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, 'edit')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
                        <input
                          type="url"
                          value={editingLink}
                          onChange={(e) => setEditingLink(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={!editingName.trim()}
                        className="btn-primary px-3 py-1 text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckIcon className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-secondary px-3 py-1 text-sm flex items-center space-x-1"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-secondary-800">{supporter.name}</div>
                      {supporter.link && (
                        <div className="text-sm text-blue-600 mt-1 flex items-center space-x-1">
                          <LinkIcon className="h-3 w-3" />
                          <a 
                            href={supporter.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {supporter.link}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleStartEdit(index)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Edit supporter"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveSupporter(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Remove supporter"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {editingSupporters.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No supporters added yet. Add your first supporter above.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Display mode */
        <div className="space-y-4">
          {supporters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {supporters.map((supporter, index) => (
                <div
                  key={supporter.id || index}
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="font-medium text-secondary-800 mb-1">{supporter.name}</div>
                  {supporter.link && (
                    <div className="text-sm text-blue-600 flex items-center space-x-1">
                      <LinkIcon className="h-3 w-3 flex-shrink-0" />
                      <a 
                        href={supporter.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline truncate"
                        title={supporter.link}
                      >
                        {supporter.link}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No individual supporters configured yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
