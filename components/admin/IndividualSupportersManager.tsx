'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface IndividualSupportersManagerProps {
  supporters: string[]
  onSave: (supporters: string[]) => void
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
  const [editingSupporters, setEditingSupporters] = useState<string[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [newSupporter, setNewSupporter] = useState('')

  useEffect(() => {
    setEditingSupporters([...supporters])
  }, [supporters])

  const handleAddSupporter = () => {
    if (newSupporter.trim()) {
      const updatedSupporters = [...editingSupporters, newSupporter.trim()]
      setEditingSupporters(updatedSupporters)
      setNewSupporter('')
    }
  }

  const handleRemoveSupporter = (index: number) => {
    const updatedSupporters = editingSupporters.filter((_, i) => i !== index)
    setEditingSupporters(updatedSupporters)
  }

  const handleStartEdit = (index: number) => {
    setEditingIndex(index)
    setEditingValue(editingSupporters[index])
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingValue.trim()) {
      const updatedSupporters = [...editingSupporters]
      updatedSupporters[editingIndex] = editingValue.trim()
      setEditingSupporters(updatedSupporters)
      setEditingIndex(null)
      setEditingValue('')
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingValue('')
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
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSupporter}
              onChange={(e) => setNewSupporter(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'add')}
              placeholder="Enter supporter name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleAddSupporter}
              disabled={!newSupporter.trim()}
              className="btn-primary px-4 py-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Supporters list */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {editingSupporters.map((supporter, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, 'edit')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editingValue.trim()}
                      className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-gray-600 hover:text-gray-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-secondary-800 font-medium">{supporter}</span>
                    <button
                      onClick={() => handleStartEdit(index)}
                      className="p-2 text-blue-600 hover:text-blue-700"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveSupporter(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </>
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
            <div className="flex flex-wrap gap-2">
              {supporters.map((supporter, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-secondary-100 rounded-lg text-secondary-800 font-medium"
                >
                  {supporter}
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
