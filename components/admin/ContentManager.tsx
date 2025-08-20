'use client'

import { useState, useEffect } from 'react'
import { cacheManager } from '../../hooks/useWebsiteContent'
import { WebsiteContent } from '../../types/dynamodb'
import { useWebsiteContent } from '../../hooks/useWebsiteContent'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ContentManagerProps {
  section: string
  title: string
}

export default function ContentManager({ section, title }: ContentManagerProps) {
  const { content, loading, error, getContent } = useWebsiteContent(section)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<WebsiteContent>>({})

  const handleEdit = (item: WebsiteContent) => {
    setEditingId(item.id)
    setEditForm({
      content: item.content,
      isActive: item.isActive,
      order: item.order
    })
  }

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/website-content?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Clear cache for this section
      cacheManager.clearSection(section)
      
      setEditingId(null)
      setEditForm({})
      // Refresh content using the hook's refresh function instead of page reload
      window.location.reload()
    } catch (error) {
      console.error('Failed to update content:', error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-red-600">Error loading content: {error}</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-secondary-900 mb-6">{title}</h3>
      
      <div className="space-y-4">
        {content.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-medium text-secondary-700">
                    {item.subsection || 'Main'}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-secondary-500">Order: {item.order}</span>
                </div>
                
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editForm.content || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                      className="textarea w-full"
                      rows={3}
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={editForm.order || item.order}
                        onChange={(e) => setEditForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                        className="input w-20"
                        min="1"
                      />
                      <label className="text-sm text-secondary-600">Order</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`active-${item.id}`}
                        checked={editForm.isActive ?? item.isActive}
                        onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor={`active-${item.id}`} className="text-sm text-secondary-600">
                        Active
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="text-secondary-900">{item.content}</div>
                )}
              </div>
              
              <div className="ml-4 flex items-center space-x-2">
                {editingId === item.id ? (
                  <>
                    <button
                      onClick={() => handleSave(item.id)}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
