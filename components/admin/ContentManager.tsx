'use client'

import { useState, useEffect } from 'react'
import { cacheManager } from '../../hooks/useWebsiteContent'
import { WebsiteContent } from '../../types/firebase'
import { useWebsiteContent } from '../../hooks/useWebsiteContent'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ContentManagerProps {
  section: string
  title: string
}

export default function ContentManager({ section, title }: ContentManagerProps) {
  const { content, loading, error, refreshContent } = useWebsiteContent(section)
  const [editingItems, setEditingItems] = useState<Set<string>>(new Set())
  const [editForms, setEditForms] = useState<Record<string, Partial<WebsiteContent>>>({})
  const [hasChanges, setHasChanges] = useState(false)

  const handleEdit = (item: WebsiteContent) => {
    setEditingItems(prev => new Set(prev).add(item.id))
    setEditForms(prev => ({
      ...prev,
      [item.id]: {
        content: item.content
      }
    }))
    setHasChanges(true)
  }

  const handleFieldChange = (id: string, field: string, value: any) => {
    setEditForms(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSaveAll = async () => {
    try {
      const savePromises = Object.entries(editForms).map(async ([id, formData]) => {
        const response = await fetch(`/api/website-content?id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error(`Failed to update content for ${id}`)
        }
      })

      await Promise.all(savePromises)
      
      // Clear cache for this section
      cacheManager.clearSection(section)
      
      // Reset state
      setEditingItems(new Set())
      setEditForms({})
      setHasChanges(false)
      
      // Manually fetch updated content
      setTimeout(async () => {
        try {
          console.log('🔄 Manually fetching updated content...')
          const response = await fetch(`/api/website-content?section=${encodeURIComponent(section)}`)
          if (response.ok) {
            const updatedContent = await response.json()
            console.log('✅ Updated content fetched:', updatedContent)
            // Force a page reload to show the changes
            window.location.reload()
          } else {
            console.error('Failed to fetch updated content')
            window.location.reload()
          }
        } catch (error) {
          console.error('Error fetching updated content:', error)
          window.location.reload()
        }
      }, 1000)
    } catch (error) {
      console.error('Failed to update content:', error)
      alert('Failed to update content. Please try again.')
    }
  }

  const handleCancelAll = () => {
    setEditingItems(new Set())
    setEditForms({})
    setHasChanges(false)
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
                </div>
                
                {editingItems.has(item.id) ? (
                  <div className="space-y-3">
                    <textarea
                      value={editForms[item.id]?.content || ''}
                      onChange={(e) => handleFieldChange(item.id, 'content', e.target.value)}
                      className="textarea w-full"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div className="text-secondary-900">{item.content}</div>
                )}
              </div>
              
              <div className="ml-4 flex items-center space-x-2">
                {editingItems.has(item.id) ? (
                  <span className="text-sm text-primary-600 font-medium">Editing</span>
                ) : (
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit content"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Save/Cancel Buttons */}
      {hasChanges && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary-600">
              You have unsaved changes
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancelAll}
                className="btn flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Cancel All</span>
              </button>
              <button
                onClick={handleSaveAll}
                className="btn-primary flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <CheckIcon className="h-4 w-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
