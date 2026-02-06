'use client'

import { useState, useEffect } from 'react'
import { cacheManager } from '../../hooks/useWebsiteContentSQLite'
import { WebsiteContent } from '../../types/firebase'
import { useWebsiteContent } from '../../hooks/useWebsiteContentSQLite'
import { useAuthContext } from '../../contexts/AuthContext'
import { PencilIcon, CheckIcon, XMarkIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import IndividualSupportersManager from './IndividualSupportersManager'
import RichTextEditor from './RichTextEditor'
import BlockedDatesManager from './BlockedDatesManager'

interface ContentManagerProps {
  section: string
  title: string
}

export default function ContentManager({ section, title }: ContentManagerProps) {
  // For statistics subsections, we need to fetch all statistics and filter
  const isStatisticsSubsection = section.startsWith('statistics-')
  const isFooterSocial = section === 'footer-social'
  const isAboutMain = section === 'about-main'
  const isAboutSubpage = section.startsWith('about-') && !isAboutMain
  const isContactSubpage = section.startsWith('contact-')
  const isCustomSections = section === 'custom-sections'
  const isEventsSection = section === 'events'
  const isEventsRegistration = section === 'events-registration'
  const isEventTypeSection = section.startsWith('events-type-')
  const isBlockedDates = section === 'blocked-dates'
  const actualSection = isStatisticsSubsection ? 'statistics' : 
                       isFooterSocial ? 'footer' : 
                       isAboutSubpage ? 'about' : 
                       isContactSubpage ? 'contact' : 
                       isAboutMain ? 'about' :
                       isCustomSections ? 'custom' :
                       isEventsRegistration ? 'events' :
                       isEventTypeSection ? 'events' :
                       isBlockedDates ? 'blocked-dates' :
                       section
  
  const { content: allContent, loading, error, refreshContent } = useWebsiteContent(actualSection)
  const { user } = useAuthContext()
  const [editingItems, setEditingItems] = useState<Set<string>>(new Set())
  const [editForms, setEditForms] = useState<Record<string, Partial<WebsiteContent>>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [isSavingAll, setIsSavingAll] = useState(false)
  const [isEditingSupporters, setIsEditingSupporters] = useState(false)
  const [isSupportersExpanded, setIsSupportersExpanded] = useState(false)

  // Function to move section up
  const moveSectionUp = async (sectionId: string) => {
    const currentContent = isStatisticsSubsection ? allContent.filter(item => {
      if (section === 'statistics-testimonials') {
        return item.subsection?.startsWith('testimonial-stat-') || item.subsection === 'testimonials-stat-satisfaction'
      } else if (section === 'statistics-hero') {
        return item.subsection?.startsWith('hero-stat-')
      } else if (section === 'statistics-about') {
        return item.subsection?.startsWith('about-stat-')
      }
      return false
    }) : isFooterSocial ? allContent.filter(item => item.subsection === 'social') :
         isAboutSubpage ? allContent.filter(item => item.subsection === 'gratitude') :
         isContactSubpage ? allContent.filter(item => item.subsection === 'contact-us') :
         isCustomSections ? allContent.filter(item => item.section === 'custom') :
         allContent

    const dynamicSections = currentContent.filter(item => 
      item.metadata?.name && 
      item.metadata.name.startsWith('Gratitude Section')
    ).sort((a, b) => (a.order || 0) - (b.order || 0))

    const currentIndex = dynamicSections.findIndex(s => s.id === sectionId)
    if (currentIndex <= 0) return
    
    const currentSection = dynamicSections[currentIndex]
    const previousSection = dynamicSections[currentIndex - 1]
    
    // Swap orders
    const tempOrder = currentSection.order
    currentSection.order = previousSection.order
    previousSection.order = tempOrder
    
    // Update both sections
    try {
      await Promise.all([
        fetch(`/api/sqlite-content?id=${currentSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: currentSection.order })
        }),
        fetch(`/api/sqlite-content?id=${previousSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: previousSection.order })
        })
      ])
      refreshContent()
    } catch (error) {
      console.error('Error reordering sections:', error)
    }
  }

  // Function to move section down
  const moveSectionDown = async (sectionId: string) => {
    const currentContent = isStatisticsSubsection ? allContent.filter(item => {
      if (section === 'statistics-testimonials') {
        return item.subsection?.startsWith('testimonial-stat-') || item.subsection === 'testimonials-stat-satisfaction'
      } else if (section === 'statistics-hero') {
        return item.subsection?.startsWith('hero-stat-')
      } else if (section === 'statistics-about') {
        return item.subsection?.startsWith('about-stat-')
      }
      return false
    }) : isFooterSocial ? allContent.filter(item => item.subsection === 'social') :
         isAboutSubpage ? allContent.filter(item => item.subsection === 'gratitude') :
         isContactSubpage ? allContent.filter(item => item.subsection === 'contact-us') :
         isCustomSections ? allContent.filter(item => item.section === 'custom') :
         allContent

    const dynamicSections = currentContent.filter(item => 
      item.metadata?.name && 
      item.metadata.name.startsWith('Gratitude Section')
    ).sort((a, b) => (a.order || 0) - (b.order || 0))

    const currentIndex = dynamicSections.findIndex(s => s.id === sectionId)
    if (currentIndex >= dynamicSections.length - 1) return
    
    const currentSection = dynamicSections[currentIndex]
    const nextSection = dynamicSections[currentIndex + 1]
    
    // Swap orders
    const tempOrder = currentSection.order
    currentSection.order = nextSection.order
    nextSection.order = tempOrder
    
    // Update both sections
    try {
      await Promise.all([
        fetch(`/api/sqlite-content?id=${currentSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: currentSection.order })
        }),
        fetch(`/api/sqlite-content?id=${nextSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: nextSection.order })
        })
      ])
      refreshContent()
    } catch (error) {
      console.error('Error reordering sections:', error)
    }
  }

  // Filter content based on the section
  const content = isStatisticsSubsection ? allContent.filter(item => {
    if (section === 'statistics-testimonials') {
      return item.subsection?.startsWith('testimonial-stat-') || item.subsection === 'testimonials-stat-satisfaction'
    } else if (section === 'statistics-hero') {
      return item.subsection?.startsWith('hero-stat-')
    } else if (section === 'statistics-about') {
      return item.subsection?.startsWith('about-stat-')
    }
    return false
  }) : isFooterSocial ? allContent.filter(item => 
    item.subsection?.startsWith('social-')
  ) : isAboutSubpage ? allContent.filter(item => 
    item.subsection === section.replace('about-', '')
  ) : isContactSubpage ? allContent.filter(item => 
    item.subsection === section.replace('contact-', '')
  ) : isAboutMain ? allContent.filter(item => 
    // Include items with specific subsections
    item.subsection === 'title' || item.subsection === 'subtitle' || item.subsection === 'description' || 
    item.subsection === 'mission' || item.subsection === 'values-title' || item.subsection?.startsWith('value-') ||
    // Also include items with metadata names that match what we're looking for
    item.metadata?.name === 'About Title' || item.metadata?.name === 'About Description' ||
    item.metadata?.name === 'about-values-title' || item.metadata?.name?.startsWith('about-value-')
  ) : isCustomSections ? allContent.filter(item => 
    item.section === 'custom'
  ) : isEventsSection ? allContent.filter(item => 
    // Only show section-level content (title/subtitle), exclude individual events
    item.metadata?.name === 'title' || item.metadata?.name === 'subtitle'
  ) : isEventsRegistration ? allContent.filter(item => 
    // Show only registration page content
    item.subsection === 'registration'
  ) : isEventTypeSection ? allContent.filter(item => 
    // Show only content for this specific event type
    item.subsection === section
  ) : allContent







  const handleEdit = (item: WebsiteContent) => {
    console.log('handleEdit called for item:', item.id)
    console.log('Database content:', item.content)
    console.log('Content contains width attributes:', item.content.includes('width='))
    console.log('Content contains height attributes:', item.content.includes('height='))
    
    setEditingItems(prev => new Set(prev).add(item.id))
    setEditForms(prev => ({
      ...prev,
      [item.id]: {
        content: item.content  // Always load from database, not from editForms
      }
    }))
    setHasChanges(true)
  }

  const handleFieldChange = (id: string, field: string, value: any) => {
    console.log('handleFieldChange called:', { id, field, value: value?.substring(0, 100) + '...' })
    setEditForms(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
    setHasChanges(true)
    console.log('Edit form updated for:', id)
  }

  const handleSaveAll = async () => {
    try {
      setIsSavingAll(true)
      
      const savePromises = Object.entries(editForms).map(async ([id, formData]) => {
        const response = await fetch(`/api/sqlite-content?id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            user: user?.email || 'unknown@clearviewretreat.com'
          }),
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
      
      // Show loading for 3 seconds then refresh content
      setTimeout(async () => {
        try {
          await refreshContent()
          setIsSavingAll(false)
          console.log('All changes saved and content refreshed successfully')
        } catch (error) {
          console.error('Error refreshing content:', error)
          setIsSavingAll(false)
        }
      }, 3000)
      
    } catch (error) {
      console.error('Failed to update content:', error)
      setIsSavingAll(false)
      alert('Failed to update content. Please try again.')
    }
  }

  const handleCancelAll = () => {
    setEditingItems(new Set())
    setEditForms({})
    setHasChanges(false)
  }

  const handleSave = async (id: string) => {
    try {
      const formData = editForms[id]
      if (!formData) return

      const response = await fetch(`/api/sqlite-content?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user: user?.email || 'admin@clearviewretreat.com'
        }),
      })

      if (response.ok) {
        setEditingItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        setEditForms(prev => {
          const newForms = { ...prev }
          delete newForms[id]
          return newForms
        })
        setHasChanges(false)
        refreshContent()
      }
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  const handleCancel = (id: string) => {
    setEditingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
    setEditForms(prev => {
      const newForms = { ...prev }
      delete newForms[id]
      return newForms
    })
    setHasChanges(false)
  }

  // Individual supporters helper functions
  const handleSupportersEdit = () => {
    setIsEditingSupporters(true)
  }

  const handleSupportersCancel = () => {
    setIsEditingSupporters(false)
  }

  const handleSupportersSave = async (supporters: any[]) => {
    try {
      // Convert supporters back to JSON array format with both name and link
      const supportersArray = supporters.map(supporter => ({
        name: supporter.name,
        link: supporter.link || ''
      }))
      const supportersJson = JSON.stringify(supportersArray)

      // Find the individual supporters entry
      const individualSupportersEntry = content.find(item => item.metadata?.name === 'Individual Supporters')
      
      // Update the individual supporters entry
      if (individualSupportersEntry) {
        await fetch(`/api/sqlite-content?id=${individualSupportersEntry.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: supportersJson
          })
        })
      }

      setIsEditingSupporters(false)
      refreshContent()
    } catch (error) {
      console.error('Error saving supporters:', error)
    }
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


  // Get section context information
  const getSectionContext = (section: string) => {
    if (section === 'statistics-testimonials') {
      return {
        description: 'These statistics appear in the testimonials section at the bottom of the home page.',
        example: '98% Guest Satisfaction, 500+ Happy Guests, 25+ Years of Service, 4.9/5 Average Rating'
      }
    } else if (section === 'statistics-hero') {
      return {
        description: 'These statistics appear in the hero section at the top of the home page.',
        example: '500+ Guests Served, 25+ Years Experience, 50+ Acres of Nature, 100% Satisfaction'
      }
    } else if (section === 'statistics-about') {
      return {
        description: 'These statistics appear in the about section floating card.',
        example: '25+ Years of Ministry, 1000+ Lives Transformed, 50+ Acres of Natural Beauty, 100% Christ-Centered'
      }
    } else if (section === 'about-history') {
      return {
        description: 'Content for the About > History page (/about/history).',
        example: 'Organization milestones, founding story, key events, and historical timeline'
      }
    } else if (section === 'about-beliefs') {
      return {
        description: 'Content for the About > Beliefs page (/about/beliefs).',
        example: 'Core theological beliefs, doctrinal statements, and faith foundation'
      }
    } else if (section === 'about-board') {
      return {
        description: 'Content for the About > Board of Trustees page (/about/board).',
        example: 'Board member profiles, leadership information, and governance details'
      }
    } else if (section === 'about-founders') {
      return {
        description: 'Content for the About > Founders page (/about/founders).',
        example: 'Founder biographies, vision stories, and founding principles'
      }
    } else if (section === 'about-gratitude') {
      return {
        description: 'Content for the About > With Gratitude page (/about/gratitude).',
        example: 'Thank you messages, acknowledgments, and appreciation content'
      }
    } else if (section === 'about-board') {
      return {
        description: 'Board members for the About > Board of Trustees page (/about/board).',
        example: 'Add/remove board members, update their names, titles, bios, and photos. Each member needs: Name, Title, Bio, and Image URL.'
      }
    } else if (section === 'contact-contact-us') {
      return {
        description: 'Content for the Contact > Get in Touch page (/contact/contact-us).',
        example: 'Contact forms, messaging options, and communication channels'
      }
    } else if (section === 'contact-location') {
      return {
        description: 'Content for the Contact > Location & Directions page (/contact/location).',
        example: 'Address, directions, maps, parking information, and location details'
      }
    } else if (section === 'contact-staff') {
      return {
        description: 'Content for the Contact > Staff Directory page (/contact/staff).',
        example: 'Staff profiles, contact information, and team member details'
      }
    } else if (section === 'contact-volunteer') {
      return {
        description: 'Content for the Contact > Volunteer Opportunities page (/contact/volunteer).',
        example: 'Volunteer opportunities, how to get involved, and service information'
      }
    } else if (section === 'contact-prayer') {
      return {
        description: 'Content for the Contact > Prayer Requests page (/contact/prayer).',
        example: 'Prayer request forms, spiritual support information, and prayer ministry details'
      }
    } else if (section === 'testimonials') {
      return {
        description: 'Customer testimonials and reviews displayed on the home page.',
        example: 'Testimonial content, author names, and locations for guest reviews'
      }
    } else {
      return null
    }
  }

  const context = getSectionContext(section)

  // Special handling for blocked dates section
  if (isBlockedDates) {
    return <BlockedDatesManager />
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-secondary-900 mb-6">{title}</h3>
      
      {context && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Location:</strong> {context.description}
          </p>
          <p className="text-sm text-blue-700">
            <strong>Example:</strong> {context.example}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {content.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <p>No content found for this section.</p>
            {isEventTypeSection ? (
              <div className="mt-4">
                <p className="text-sm mb-3">Create rich text content that will appear in the modal when users click on this retreat type.</p>
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/sqlite-content', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          section: 'events',
                          subsection: section,
                          contentType: 'html',
                          content: '<p>Enter your retreat type description here...</p>',
                          metadata: { 
                            name: `${title.replace('Events Page - ', '')} Modal Content`,
                            isRichText: true 
                          },
                          order: 1,
                          isActive: true
                        })
                      })
                      if (response.ok) {
                        refreshContent()
                      }
                    } catch (error) {
                      console.error('Error creating event type content:', error)
                    }
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create Modal Content
                </button>
              </div>
            ) : (
              <button 
                onClick={refreshContent}
                className="mt-2 text-primary-600 hover:text-primary-700 underline"
              >
                Refresh
              </button>
            )}
          </div>
        )}
        {isStatisticsSubsection ? (
          // Special layout for statistics subsections
          (() => {
            // Group statistics by their base number for better organization
            const groupedStats = content.reduce((acc, item) => {
              const baseKey = item.subsection?.replace(/-number|-label$/, '') || 'unknown'
              if (!acc[baseKey]) {
                acc[baseKey] = { number: null, label: null }
              }
              if (item.subsection?.includes('-number')) {
                acc[baseKey].number = item
              } else if (item.subsection?.includes('-label')) {
                acc[baseKey].label = item
              }
              return acc
            }, {} as Record<string, { number: WebsiteContent | null, label: WebsiteContent | null }>)

            return Object.entries(groupedStats).map(([baseKey, stats]: [string, any]) => {
              const statNumber = stats.number
              const statLabel = stats.label
              const statIndex = baseKey.replace(/^(stat-|hero-stat-|about-stat-)/, '')
              
              return (
                <div key={baseKey} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-lg font-semibold text-secondary-900">
                      Statistic #{statIndex}
                    </span>
                    <div className="flex space-x-2">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Number
                      </span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Label
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Number Field */}
                    {statNumber && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary-700">Number</label>
                        {editingItems.has(statNumber.id) ? (
                          <textarea
                            value={editForms[statNumber.id]?.content || ''}
                            onChange={(e) => handleFieldChange(statNumber.id, 'content', e.target.value)}
                            className="textarea w-full"
                            rows={1}
                            placeholder="Enter number (e.g., 98%, 500+, 25+)"
                          />
                        ) : (
                          <div className="text-lg font-semibold text-secondary-900 bg-white p-3 rounded border">
                            {statNumber.content}
                          </div>
                        )}
                        <button
                          onClick={() => handleEdit(statNumber)}
                          className="text-xs text-primary-600 hover:text-primary-700 underline"
                        >
                          {editingItems.has(statNumber.id) ? 'Editing...' : 'Edit Number'}
                        </button>
                      </div>
                    )}
                    
                    {/* Label Field */}
                    {statLabel && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary-700">Label</label>
                        {editingItems.has(statLabel.id) ? (
                          <textarea
                            value={editForms[statLabel.id]?.content || ''}
                            onChange={(e) => handleFieldChange(statLabel.id, 'content', e.target.value)}
                            className="textarea w-full"
                            rows={2}
                            placeholder="Enter label text"
                          />
                        ) : (
                          <div className="text-secondary-900 bg-white p-3 rounded border">
                            {statLabel.content}
                          </div>
                        )}
                        <button
                          onClick={() => handleEdit(statLabel)}
                          className="text-xs text-primary-600 hover:text-primary-700 underline"
                        >
                          {editingItems.has(statLabel.id) ? 'Editing...' : 'Edit Label'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          })()
        ) : isFooterSocial ? (
          // Special layout for social media links
          (() => {
            const platforms = ['facebook', 'instagram', 'youtube', 'twitter', 'linkedin']
            return (
              <div className="space-y-4">
                {platforms.map(platform => {
                  const urlItem = content.find(item => item.subsection === `social-${platform}-url`)
                  const enabledItem = content.find(item => item.subsection === `social-${platform}-enabled`)
                  
                  if (!urlItem || !enabledItem) return null
                  
                  return (
                    <div key={platform} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-md font-semibold text-secondary-900 capitalize">
                          {platform} Link
                        </h5>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            enabledItem.content === 'true' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {enabledItem.content === 'true' ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* URL Field */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-secondary-700">URL</label>
                          {editingItems.has(urlItem.id) ? (
                            <input
                              type="url"
                              value={editForms[urlItem.id]?.content || ''}
                              onChange={(e) => handleFieldChange(urlItem.id, 'content', e.target.value)}
                              className="input w-full"
                              placeholder="https://facebook.com/yourpage"
                            />
                          ) : (
                            <div className="text-secondary-900 bg-white p-3 rounded border">
                              {urlItem.content || 'No URL set'}
                            </div>
                          )}
                          <button
                            onClick={() => handleEdit(urlItem)}
                            className="text-xs text-primary-600 hover:text-primary-700 underline"
                          >
                            {editingItems.has(urlItem.id) ? 'Editing...' : 'Edit URL'}
                          </button>
                        </div>
                        
                        {/* Enabled Field */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-secondary-700">Status</label>
                          {editingItems.has(enabledItem.id) ? (
                            <select
                              value={editForms[enabledItem.id]?.content || ''}
                              onChange={(e) => handleFieldChange(enabledItem.id, 'content', e.target.value)}
                              className="input w-full"
                            >
                              <option value="true">Enabled</option>
                              <option value="false">Disabled</option>
                            </select>
                          ) : (
                            <div className="text-secondary-900 bg-white p-3 rounded border">
                              {enabledItem.content === 'true' ? 'Enabled' : 'Disabled'}
                            </div>
                          )}
                          <button
                            onClick={() => handleEdit(enabledItem)}
                            className="text-xs text-primary-600 hover:text-primary-700 underline"
                          >
                            {editingItems.has(enabledItem.id) ? 'Editing...' : 'Edit Status'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()
        ) : (
          // Regular layout for all other sections
          (() => {
            // For footer section, filter out social media items since they have their own tab
            if (section === 'footer') {
              const otherItems = content.filter(item => 
                !item.subsection?.startsWith('social-')
              )
              
              return otherItems.map((item) => (
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
              ))
            }
            
            // Special layout for history content
            if (section === 'about-history') {
              // Group history content by type
              const historyIntro = content.find(item => item.metadata?.name === 'History Introduction')
              const foundationTitle = content.find(item => item.metadata?.name === 'Foundation Section Title')
              const foundationContent = content.find(item => item.metadata?.name === 'Foundation Section Content')
              const partnershipTitle = content.find(item => item.metadata?.name === 'Partnership Section Title')
              const partnershipContent = content.find(item => item.metadata?.name === 'Partnership Section Content')
              const differentTitle = content.find(item => item.metadata?.name === 'Different Section Title')
              const differentIntro = content.find(item => item.metadata?.name === 'Different Section Intro')
              const point1Title = content.find(item => item.metadata?.name === 'Different Point 1 Title')
              const point1Content = content.find(item => item.metadata?.name === 'Different Point 1 Content')
              const point2Title = content.find(item => item.metadata?.name === 'Different Point 2 Title')
              const point2Content = content.find(item => item.metadata?.name === 'Different Point 2 Content')
              const point3Title = content.find(item => item.metadata?.name === 'Different Point 3 Title')
              const point3Content = content.find(item => item.metadata?.name === 'Different Point 3 Content')
              const point4Title = content.find(item => item.metadata?.name === 'Different Point 4 Title')
              const point4Content = content.find(item => item.metadata?.name === 'Different Point 4 Content')
              
              return (
                <div className="space-y-6">
                  {/* History Introduction */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">History Introduction</h4>
                    <div className="space-y-4">
                      {historyIntro && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Introduction Text</label>
                          {editingItems.has(historyIntro.id) ? (
                            <textarea
                              value={editForms[historyIntro.id]?.content || ''}
                              onChange={(e) => handleFieldChange(historyIntro.id, 'content', e.target.value)}
                              rows={4}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: historyIntro.content }} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {historyIntro && (
                        <button
                          onClick={() => editingItems.has(historyIntro.id) ? handleSave(historyIntro.id) : handleEdit(historyIntro)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(historyIntro.id) ? 'Save Introduction' : 'Edit Introduction'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Foundation Section */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Foundation Section</h4>
                    <div className="space-y-4">
                      {foundationTitle && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Title</label>
                          {editingItems.has(foundationTitle.id) ? (
                            <input
                              type="text"
                              value={editForms[foundationTitle.id]?.content || ''}
                              onChange={(e) => handleFieldChange(foundationTitle.id, 'content', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600">{foundationTitle.content}</p>
                          )}
                        </div>
                      )}
                      {foundationContent && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Content</label>
                          {editingItems.has(foundationContent.id) ? (
                            <textarea
                              value={editForms[foundationContent.id]?.content || ''}
                              onChange={(e) => handleFieldChange(foundationContent.id, 'content', e.target.value)}
                              rows={6}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: foundationContent.content }} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {foundationTitle && (
                        <button
                          onClick={() => editingItems.has(foundationTitle.id) ? handleSave(foundationTitle.id) : handleEdit(foundationTitle)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(foundationTitle.id) ? 'Save Title' : 'Edit Title'}
                        </button>
                      )}
                      {foundationContent && (
                        <button
                          onClick={() => editingItems.has(foundationContent.id) ? handleSave(foundationContent.id) : handleEdit(foundationContent)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(foundationContent.id) ? 'Save Content' : 'Edit Content'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Partnership Section */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Partnership Section</h4>
                    <div className="space-y-4">
                      {partnershipTitle && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Title</label>
                          {editingItems.has(partnershipTitle.id) ? (
                            <input
                              type="text"
                              value={editForms[partnershipTitle.id]?.content || ''}
                              onChange={(e) => handleFieldChange(partnershipTitle.id, 'content', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600">{partnershipTitle.content}</p>
                          )}
                        </div>
                      )}
                      {partnershipContent && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Content</label>
                          {editingItems.has(partnershipContent.id) ? (
                            <textarea
                              value={editForms[partnershipContent.id]?.content || ''}
                              onChange={(e) => handleFieldChange(partnershipContent.id, 'content', e.target.value)}
                              rows={4}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600">{partnershipContent.content}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {partnershipTitle && (
                        <button
                          onClick={() => editingItems.has(partnershipTitle.id) ? handleSave(partnershipTitle.id) : handleEdit(partnershipTitle)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(partnershipTitle.id) ? 'Save Title' : 'Edit Title'}
                        </button>
                      )}
                      {partnershipContent && (
                        <button
                          onClick={() => editingItems.has(partnershipContent.id) ? handleSave(partnershipContent.id) : handleEdit(partnershipContent)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(partnershipContent.id) ? 'Save Content' : 'Edit Content'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Why We're Different Section */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Why We're Different Section</h4>
                    <div className="space-y-4">
                      {differentTitle && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Title</label>
                          {editingItems.has(differentTitle.id) ? (
                            <input
                              type="text"
                              value={editForms[differentTitle.id]?.content || ''}
                              onChange={(e) => handleFieldChange(differentTitle.id, 'content', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600">{differentTitle.content}</p>
                          )}
                        </div>
                      )}
                      {differentIntro && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Introduction</label>
                          {editingItems.has(differentIntro.id) ? (
                            <textarea
                              value={editForms[differentIntro.id]?.content || ''}
                              onChange={(e) => handleFieldChange(differentIntro.id, 'content', e.target.value)}
                              rows={3}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600">{differentIntro.content}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Key Points */}
                      <div className="space-y-4">
                        <h5 className="text-md font-medium text-secondary-800">Key Points</h5>
                        
                        {/* Point 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {point1Title && (
                            <div>
                              <label className="text-sm font-medium text-secondary-700">Point 1 Title</label>
                              {editingItems.has(point1Title.id) ? (
                                <input
                                  type="text"
                                  value={editForms[point1Title.id]?.content || ''}
                                  onChange={(e) => handleFieldChange(point1Title.id, 'content', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              ) : (
                                <p className="mt-1 text-secondary-600">{point1Title.content}</p>
                              )}
                            </div>
                          )}
                          {point1Content && (
                            <div>
                              <label className="text-sm font-medium text-secondary-700">Point 1 Content</label>
                              {editingItems.has(point1Content.id) ? (
                                <textarea
                                  value={editForms[point1Content.id]?.content || ''}
                                  onChange={(e) => handleFieldChange(point1Content.id, 'content', e.target.value)}
                                  rows={3}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              ) : (
                                <p className="mt-1 text-secondary-600">{point1Content.content}</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Point 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {point2Title && (
                            <div>
                              <label className="text-sm font-medium text-secondary-700">Point 2 Title</label>
                              {editingItems.has(point2Title.id) ? (
                                <input
                                  type="text"
                                  value={editForms[point2Title.id]?.content || ''}
                                  onChange={(e) => handleFieldChange(point2Title.id, 'content', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              ) : (
                                <p className="mt-1 text-secondary-600">{point2Title.content}</p>
                              )}
                            </div>
                          )}
                          {point2Content && (
                            <div>
                              <label className="text-sm font-medium text-secondary-700">Point 2 Content</label>
                              {editingItems.has(point2Content.id) ? (
                                <textarea
                                  value={editForms[point2Content.id]?.content || ''}
                                  onChange={(e) => handleFieldChange(point2Content.id, 'content', e.target.value)}
                                  rows={3}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              ) : (
                                <p className="mt-1 text-secondary-600">{point2Content.content}</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Point 3 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {point3Title && (
                            <div>
                              <label className="text-sm font-medium text-secondary-700">Point 3 Title</label>
                              {editingItems.has(point3Title.id) ? (
                                <input
                                  type="text"
                                  value={editForms[point3Title.id]?.content || ''}
                                  onChange={(e) => handleFieldChange(point3Title.id, 'content', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              ) : (
                                <p className="mt-1 text-secondary-600">{point3Title.content}</p>
                              )}
                            </div>
                          )}
                          {point3Content && (
                            <div>
                              <label className="text-sm font-medium text-secondary-700">Point 3 Content</label>
                              {editingItems.has(point3Content.id) ? (
                                <textarea
                                  value={editForms[point3Content.id]?.content || ''}
                                  onChange={(e) => handleFieldChange(point3Content.id, 'content', e.target.value)}
                                  rows={3}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              ) : (
                                <p className="mt-1 text-secondary-600">{point3Content.content}</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Point 4 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {point4Title && (
                            <div>
                              <label className="text-sm font-medium text-secondary-700">Point 4 Title</label>
                              {editingItems.has(point4Title.id) ? (
                                <input
                                  type="text"
                                  value={editForms[point4Title.id]?.content || ''}
                                  onChange={(e) => handleFieldChange(point4Title.id, 'content', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              ) : (
                                <p className="mt-1 text-secondary-600">{point4Title.content}</p>
                              )}
                            </div>
                          )}
                          {point4Content && (
                            <div>
                              <label className="text-sm font-medium text-secondary-700">Point 4 Content</label>
                              {editingItems.has(point4Content.id) ? (
                                <textarea
                                  value={editForms[point4Content.id]?.content || ''}
                                  onChange={(e) => handleFieldChange(point4Content.id, 'content', e.target.value)}
                                  rows={3}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              ) : (
                                <p className="mt-1 text-secondary-600">{point4Content.content}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {differentTitle && (
                        <button
                          onClick={() => editingItems.has(differentTitle.id) ? handleSave(differentTitle.id) : handleEdit(differentTitle)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(differentTitle.id) ? 'Save Title' : 'Edit Title'}
                        </button>
                      )}
                      {differentIntro && (
                        <button
                          onClick={() => editingItems.has(differentIntro.id) ? handleSave(differentIntro.id) : handleEdit(differentIntro)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(differentIntro.id) ? 'Save Intro' : 'Edit Intro'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            }
            
      // Special layout for founders content
      if (section === 'about-founders') {
        // Group founders content by type
        const foundersIntro = content.find(item => item.metadata?.name === 'Founders Introduction')
        const foundersStory = content.find(item => item.metadata?.name === 'Founders Story')
        const theVision = content.find(item => item.metadata?.name === 'The Vision')
        const theJourney = content.find(item => item.metadata?.name === 'The Journey')
        const callToAction = content.find(item => item.metadata?.name === 'Call to Action')

        return (
          <div className="space-y-6">
            {/* Founders Introduction */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Founders Introduction</h4>
              <div className="space-y-4">
                {foundersIntro && (
                  <div>
                    <label className="text-sm font-medium text-secondary-700">Introduction Text</label>
                    {editingItems.has(foundersIntro.id) ? (
                      <textarea
                        value={editForms[foundersIntro.id]?.content || ''}
                        onChange={(e) => handleFieldChange(foundersIntro.id, 'content', e.target.value)}
                        rows={4}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: foundersIntro.content }} />
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                {foundersIntro && (
                  <button
                    onClick={() => editingItems.has(foundersIntro.id) ? handleSave(foundersIntro.id) : handleEdit(foundersIntro)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    {editingItems.has(foundersIntro.id) ? 'Save Introduction' : 'Edit Introduction'}
                  </button>
                )}
              </div>
            </div>

            {/* Founders Story */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Founders Story</h4>
              <div className="space-y-4">
                {foundersStory && (
                  <div>
                    <label className="text-sm font-medium text-secondary-700">Story Content</label>
                    {editingItems.has(foundersStory.id) ? (
                      <textarea
                        value={editForms[foundersStory.id]?.content || ''}
                        onChange={(e) => handleFieldChange(foundersStory.id, 'content', e.target.value)}
                        rows={8}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: foundersStory.content }} />
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                {foundersStory && (
                  <button
                    onClick={() => editingItems.has(foundersStory.id) ? handleSave(foundersStory.id) : handleEdit(foundersStory)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    {editingItems.has(foundersStory.id) ? 'Save Story' : 'Edit Story'}
                  </button>
                )}
              </div>
            </div>

            {/* The Vision */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">The Vision</h4>
              <div className="space-y-4">
                {theVision && (
                  <div>
                    <label className="text-sm font-medium text-secondary-700">Vision Content</label>
                    {editingItems.has(theVision.id) ? (
                      <textarea
                        value={editForms[theVision.id]?.content || ''}
                        onChange={(e) => handleFieldChange(theVision.id, 'content', e.target.value)}
                        rows={8}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: theVision.content }} />
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                {theVision && (
                  <button
                    onClick={() => editingItems.has(theVision.id) ? handleSave(theVision.id) : handleEdit(theVision)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    {editingItems.has(theVision.id) ? 'Save Vision' : 'Edit Vision'}
                  </button>
                )}
              </div>
            </div>

            {/* The Journey */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">The Journey</h4>
              <div className="space-y-4">
                {theJourney && (
                  <div>
                    <label className="text-sm font-medium text-secondary-700">Journey Content</label>
                    {editingItems.has(theJourney.id) ? (
                      <textarea
                        value={editForms[theJourney.id]?.content || ''}
                        onChange={(e) => handleFieldChange(theJourney.id, 'content', e.target.value)}
                        rows={8}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: theJourney.content }} />
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                {theJourney && (
                  <button
                    onClick={() => editingItems.has(theJourney.id) ? handleSave(theJourney.id) : handleEdit(theJourney)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    {editingItems.has(theJourney.id) ? 'Save Journey' : 'Edit Journey'}
                  </button>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Call to Action</h4>
              <div className="space-y-4">
                {callToAction && (
                  <div>
                    <label className="text-sm font-medium text-secondary-700">Call to Action Content</label>
                    {editingItems.has(callToAction.id) ? (
                      <textarea
                        value={editForms[callToAction.id]?.content || ''}
                        onChange={(e) => handleFieldChange(callToAction.id, 'content', e.target.value)}
                        rows={6}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: callToAction.content }} />
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                {callToAction && (
                  <button
                    onClick={() => editingItems.has(callToAction.id) ? handleSave(callToAction.id) : handleEdit(callToAction)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    {editingItems.has(callToAction.id) ? 'Save Call to Action' : 'Edit Call to Action'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      }

      // Special layout for gratitude content
      if (section === 'about-gratitude') {
        // Group gratitude content by type
        const gratitudeIntro = content.find(item => item.metadata?.name === 'Gratitude Introduction')
        const individualSupporters = content.find(item => item.metadata?.name === 'Individual Supporters')
        const callToAction = content.find(item => item.metadata?.name === 'Call to Action')
        
        // Get dynamic gratitude sections
        const dynamicSections = content.filter(item => 
          item.metadata?.name && 
          item.metadata.name.startsWith('Gratitude Section')
        ).sort((a, b) => (a.order || 0) - (b.order || 0))


        // Function to add a new gratitude section
        const addGratitudeSection = async () => {
          // Find the highest order number and add 10 to place it at the end
          const maxOrder = Math.max(...dynamicSections.map(s => s.order || 0), 0)
          const newOrder = maxOrder + 10
          
          const newSection = {
            section: 'about',
            subsection: 'gratitude',
            content_type: 'text',
            content: `<h1>New Gratitude Section</h1>\n\n<p>Add your content here...</p>`,
            order: newOrder,
            is_active: true,
            metadata: { 
              name: `Gratitude Section ${Date.now()}`,
              sectionData: JSON.stringify({
                title: `New Gratitude Section`
              })
            },
            user: user?.email || 'admin@clearviewretreat.com'
          }

          try {
            const response = await fetch('/api/sqlite-content', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newSection)
            })
            if (response.ok) {
              refreshContent()
            }
          } catch (error) {
            console.error('Error adding gratitude section:', error)
          }
        }

        // Function to remove a gratitude section
        const removeGratitudeSection = async (sectionId: string) => {
          try {
            const response = await fetch(`/api/sqlite-content?id=${sectionId}`, {
              method: 'DELETE'
            })
            if (response.ok) {
              refreshContent()
            }
          } catch (error) {
            console.error('Error removing gratitude section:', error)
          }
        }

        return (
          <div className="space-y-6">
            {/* Gratitude Introduction */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Gratitude Introduction</h4>
              <div className="space-y-4">
                {gratitudeIntro && (
                  <div>
                    <label className="text-sm font-medium text-secondary-700">Introduction Text</label>
                    {editingItems.has(gratitudeIntro.id) ? (
                      <textarea
                        value={editForms[gratitudeIntro.id]?.content || ''}
                        onChange={(e) => handleFieldChange(gratitudeIntro.id, 'content', e.target.value)}
                        rows={6}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: gratitudeIntro.content }} />
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                {gratitudeIntro && (
                  <button
                    onClick={() => editingItems.has(gratitudeIntro.id) ? handleSave(gratitudeIntro.id) : handleEdit(gratitudeIntro)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    {editingItems.has(gratitudeIntro.id) ? 'Save Introduction' : 'Edit Introduction'}
                  </button>
                )}
              </div>
            </div>

            {/* Individual Supporters */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-secondary-900">Individual Supporters</h4>
                <button
                  onClick={() => setIsSupportersExpanded(!isSupportersExpanded)}
                  className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <span>{isSupportersExpanded ? 'Collapse' : 'Expand'}</span>
                  {isSupportersExpanded ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {isSupportersExpanded && (
                <IndividualSupportersManager
                supporters={individualSupporters ? (() => {
                  try {
                    const supportersArray = JSON.parse(individualSupporters.content || '[]')
                    // Handle both old format (array of strings) and new format (array of objects)
                    return supportersArray.map((supporter: any, index: number) => {
                      if (typeof supporter === 'string') {
                        // Old format: array of strings
                        return {
                          id: `supporter-${index}`,
                          name: supporter,
                          link: ''
                        }
                      } else {
                        // New format: array of objects with name and link
                        return {
                          id: `supporter-${index}`,
                          name: supporter.name || '',
                          link: supporter.link || ''
                        }
                      }
                    })
                  } catch (e) {
                    return []
                  }
                })() : []}
                onSave={handleSupportersSave}
                isEditing={isEditingSupporters}
                onEdit={handleSupportersEdit}
                onCancel={handleSupportersCancel}
                />
              )}
            </div>

            {/* Dynamic Gratitude Sections */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-secondary-900">Gratitude Sections</h4>
                <button
                  onClick={addGratitudeSection}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Add New Section
                </button>
              </div>
              
              <div className="space-y-4">
                {dynamicSections.map((section, index) => {
                  return (
                    <div key={section.id} className="border border-gray-300 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Section {index + 1}</span>
                          {index > 0 && (
                            <button
                              onClick={() => moveSectionUp(section.id)}
                              className="text-blue-600 hover:text-blue-700 text-sm px-2 py-1"
                              title="Move up"
                            >
                              ↑
                            </button>
                          )}
                          {index < dynamicSections.length - 1 && (
                            <button
                              onClick={() => moveSectionDown(section.id)}
                              className="text-blue-600 hover:text-blue-700 text-sm px-2 py-1"
                              title="Move down"
                            >
                              ↓
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => removeGratitudeSection(section.id)}
                          className="text-red-600 hover:text-red-700 text-sm px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Content</label>
                          {editingItems.has(section.id) ? (
                            <div className="mt-1">
                              <RichTextEditor
                                value={editForms[section.id]?.content || ''}
                                onChange={(value) => handleFieldChange(section.id, 'content', value)}
                                placeholder="Enter your gratitude content here. Use the rich text editor to format text, add images, and create engaging content..."
                              />
                            </div>
                          ) : (
                            <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => editingItems.has(section.id) ? handleSave(section.id) : handleEdit(section)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(section.id) ? 'Save Section' : 'Edit Section'}
                        </button>
                      </div>
                    </div>
                  )
                })}
                
                {dynamicSections.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No gratitude sections added yet.</p>
                    <p className="text-sm">Click "Add New Section" to create your first gratitude section.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Call to Action</h4>
              <div className="space-y-4">
                {callToAction && (
                  <div>
                    <label className="text-sm font-medium text-secondary-700">Call to Action Content</label>
                    {editingItems.has(callToAction.id) ? (
                      <textarea
                        value={editForms[callToAction.id]?.content || ''}
                        onChange={(e) => handleFieldChange(callToAction.id, 'content', e.target.value)}
                        rows={6}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: callToAction.content }} />
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                {callToAction && (
                  <button
                    onClick={() => editingItems.has(callToAction.id) ? handleSave(callToAction.id) : handleEdit(callToAction)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    {editingItems.has(callToAction.id) ? 'Save Call to Action' : 'Edit Call to Action'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      }

      // Special layout for custom sections
      if (section === 'custom-sections') {
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Custom Sections</h4>
              <p className="text-blue-700 text-sm">
                Create and manage custom content sections with images and rich text. 
                These sections can be displayed on any page using the CustomSection component.
              </p>
            </div>

            {content.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No custom sections created yet.</p>
                <p className="text-sm mt-2">Use the "Create New Section" form below to add your first custom section.</p>
              </div>
            ) : (
              content.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900">
                        {item.metadata?.name || 'Untitled Section'}
                      </h4>
                      <p className="text-sm text-secondary-600">
                        Section: {item.section} | Subsection: {item.subsection || 'None'} | Order: {item.order}
                      </p>
                      {item.metadata?.description && (
                        <p className="text-sm text-secondary-500 mt-1">{item.metadata.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.metadata?.hasImage && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Has Image
                        </span>
                      )}
                      {item.metadata?.isRichText && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Rich Text
                        </span>
                      )}
                      {!item.isActive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {item.metadata?.hasImage && item.metadata?.imageUrl && (
                    <div className="mb-4">
                      <img 
                        src={item.metadata.imageUrl} 
                        alt={item.metadata.name || 'Section image'}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="text-sm font-medium text-secondary-700 mb-2 block">Content</label>
                    {editingItems.has(item.id) ? (
                      <textarea
                        value={editForms[item.id]?.content || ''}
                        onChange={(e) => handleFieldChange(item.id, 'content', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {item.metadata?.isRichText ? (
                          <div dangerouslySetInnerHTML={{ __html: item.content }} />
                        ) : (
                          <div className="whitespace-pre-wrap">{item.content}</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-secondary-500">
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      {editingItems.has(item.id) ? (
                        <>
                          <button
                            onClick={() => handleSave(item.id)}
                            className="btn-primary text-sm px-4 py-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleCancel(item.id)}
                            className="btn-outline text-sm px-4 py-2"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(item)}
                          className="btn-outline text-sm px-4 py-2"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      }

      // Special layout for beliefs content
      if (section === 'about-beliefs') {
              // Group beliefs content by type
              const beliefsQuote = content.find(item => item.metadata?.name === 'Beliefs Quote')
              const statementTitle = content.find(item => item.metadata?.name === 'Statement of Faith Title')
              const statementContent = content.find(item => item.metadata?.name === 'Statement of Faith Content')
              const valuesTitle = content.find(item => item.metadata?.name === 'Core Values Title')
              const value1Title = content.find(item => item.metadata?.name === 'Core Value 1 Title')
              const value1Content = content.find(item => item.metadata?.name === 'Core Value 1 Content')
              const value2Title = content.find(item => item.metadata?.name === 'Core Value 2 Title')
              const value2Content = content.find(item => item.metadata?.name === 'Core Value 2 Content')
              const value3Title = content.find(item => item.metadata?.name === 'Core Value 3 Title')
              const value3Content = content.find(item => item.metadata?.name === 'Core Value 3 Content')
              const value4Title = content.find(item => item.metadata?.name === 'Core Value 4 Title')
              const value4Content = content.find(item => item.metadata?.name === 'Core Value 4 Content')
              const discussionTitle = content.find(item => item.metadata?.name === 'Theological Discussion Title')
              const discussionContent = content.find(item => item.metadata?.name === 'Theological Discussion Content')
              
              return (
                <div className="space-y-6">
                  {/* Beliefs Quote */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Main Quote</h4>
                    <div className="space-y-4">
                      {beliefsQuote && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Quote Text</label>
                          {editingItems.has(beliefsQuote.id) ? (
                            <textarea
                              value={editForms[beliefsQuote.id]?.content || ''}
                              onChange={(e) => handleFieldChange(beliefsQuote.id, 'content', e.target.value)}
                              rows={3}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600 italic">"{beliefsQuote.content}"</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {beliefsQuote && (
                        <button
                          onClick={() => editingItems.has(beliefsQuote.id) ? handleSave(beliefsQuote.id) : handleEdit(beliefsQuote)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(beliefsQuote.id) ? 'Save Quote' : 'Edit Quote'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Statement of Faith */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Statement of Faith</h4>
                    <div className="space-y-4">
                      {statementTitle && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Title</label>
                          {editingItems.has(statementTitle.id) ? (
                            <input
                              type="text"
                              value={editForms[statementTitle.id]?.content || ''}
                              onChange={(e) => handleFieldChange(statementTitle.id, 'content', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600">{statementTitle.content}</p>
                          )}
                        </div>
                      )}
                      {statementContent && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Content</label>
                          {editingItems.has(statementContent.id) ? (
                            <textarea
                              value={editForms[statementContent.id]?.content || ''}
                              onChange={(e) => handleFieldChange(statementContent.id, 'content', e.target.value)}
                              rows={8}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: statementContent.content }} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {statementTitle && (
                        <button
                          onClick={() => editingItems.has(statementTitle.id) ? handleSave(statementTitle.id) : handleEdit(statementTitle)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(statementTitle.id) ? 'Save Title' : 'Edit Title'}
                        </button>
                      )}
                      {statementContent && (
                        <button
                          onClick={() => editingItems.has(statementContent.id) ? handleSave(statementContent.id) : handleEdit(statementContent)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(statementContent.id) ? 'Save Content' : 'Edit Content'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Core Values */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Core Values</h4>
                    <div className="space-y-4">
                      {valuesTitle && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Title</label>
                          {editingItems.has(valuesTitle.id) ? (
                            <input
                              type="text"
                              value={editForms[valuesTitle.id]?.content || ''}
                              onChange={(e) => handleFieldChange(valuesTitle.id, 'content', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600">{valuesTitle.content}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Value 1 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {value1Title && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 1 Title</label>
                            {editingItems.has(value1Title.id) ? (
                              <input
                                type="text"
                                value={editForms[value1Title.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value1Title.id, 'content', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value1Title.content}</p>
                            )}
                          </div>
                        )}
                        {value1Content && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 1 Content</label>
                            {editingItems.has(value1Content.id) ? (
                              <textarea
                                value={editForms[value1Content.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value1Content.id, 'content', e.target.value)}
                                rows={3}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value1Content.content}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Value 2 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {value2Title && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 2 Title</label>
                            {editingItems.has(value2Title.id) ? (
                              <input
                                type="text"
                                value={editForms[value2Title.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value2Title.id, 'content', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value2Title.content}</p>
                            )}
                          </div>
                        )}
                        {value2Content && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 2 Content</label>
                            {editingItems.has(value2Content.id) ? (
                              <textarea
                                value={editForms[value2Content.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value2Content.id, 'content', e.target.value)}
                                rows={3}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value2Content.content}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Value 3 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {value3Title && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 3 Title</label>
                            {editingItems.has(value3Title.id) ? (
                              <input
                                type="text"
                                value={editForms[value3Title.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value3Title.id, 'content', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value3Title.content}</p>
                            )}
                          </div>
                        )}
                        {value3Content && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 3 Content</label>
                            {editingItems.has(value3Content.id) ? (
                              <textarea
                                value={editForms[value3Content.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value3Content.id, 'content', e.target.value)}
                                rows={3}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value3Content.content}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Value 4 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {value4Title && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 4 Title</label>
                            {editingItems.has(value4Title.id) ? (
                              <input
                                type="text"
                                value={editForms[value4Title.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value4Title.id, 'content', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value4Title.content}</p>
                            )}
                          </div>
                        )}
                        {value4Content && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 4 Content</label>
                            {editingItems.has(value4Content.id) ? (
                              <textarea
                                value={editForms[value4Content.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value4Content.id, 'content', e.target.value)}
                                rows={3}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value4Content.content}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {valuesTitle && (
                        <button
                          onClick={() => editingItems.has(valuesTitle.id) ? handleSave(valuesTitle.id) : handleEdit(valuesTitle)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(valuesTitle.id) ? 'Save Title' : 'Edit Title'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Theological Discussion */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Theological Discussion</h4>
                    <div className="space-y-4">
                      {discussionTitle && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Title</label>
                          {editingItems.has(discussionTitle.id) ? (
                            <input
                              type="text"
                              value={editForms[discussionTitle.id]?.content || ''}
                              onChange={(e) => handleFieldChange(discussionTitle.id, 'content', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600">{discussionTitle.content}</p>
                          )}
                        </div>
                      )}
                      {discussionContent && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Section Content</label>
                          {editingItems.has(discussionContent.id) ? (
                            <textarea
                              value={editForms[discussionContent.id]?.content || ''}
                              onChange={(e) => handleFieldChange(discussionContent.id, 'content', e.target.value)}
                              rows={4}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: discussionContent.content }} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {discussionTitle && (
                        <button
                          onClick={() => editingItems.has(discussionTitle.id) ? handleSave(discussionTitle.id) : handleEdit(discussionTitle)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(discussionTitle.id) ? 'Save Title' : 'Edit Title'}
                        </button>
                      )}
                      {discussionContent && (
                        <button
                          onClick={() => editingItems.has(discussionContent.id) ? handleSave(discussionContent.id) : handleEdit(discussionContent)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(discussionContent.id) ? 'Save Content' : 'Edit Content'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            }
            
            // Special layout for about-main content
            if (section === 'about-main') {
              // Group about-main content by type
              const mainContent = content.find(item => item.metadata?.name === 'About Description')
              const mainTitle = content.find(item => item.metadata?.name === 'About Title')
              const valuesTitle = content.find(item => item.metadata?.name === 'about-values-title')
              const value1Title = content.find(item => item.metadata?.name === 'about-value-1-title')
              const value1Desc = content.find(item => item.metadata?.name === 'about-value-1-description')
              const value2Title = content.find(item => item.metadata?.name === 'about-value-2-title')
              const value2Desc = content.find(item => item.metadata?.name === 'about-value-2-description')
              const value3Title = content.find(item => item.metadata?.name === 'about-value-3-title')
              const value3Desc = content.find(item => item.metadata?.name === 'about-value-3-description')
              
              return (
                <div className="space-y-6">
                  {/* Main About Content */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Main About Content</h4>
                    <div className="space-y-4">
                      {mainTitle && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Title</label>
                          {editingItems.has(mainTitle.id) ? (
                            <input
                              type="text"
                              value={editForms[mainTitle.id]?.content || ''}
                              onChange={(e) => handleFieldChange(mainTitle.id, 'content', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600">{mainTitle.content}</p>
                          )}
                        </div>
                      )}
                      {mainContent && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Content</label>
                          {editingItems.has(mainContent.id) ? (
                            <textarea
                              value={editForms[mainContent.id]?.content || ''}
                              onChange={(e) => handleFieldChange(mainContent.id, 'content', e.target.value)}
                              rows={6}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <div className="mt-1 text-secondary-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: mainContent.content }} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {mainTitle && (
                        <button
                          onClick={() => editingItems.has(mainTitle.id) ? handleSave(mainTitle.id) : handleEdit(mainTitle)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(mainTitle.id) ? 'Save Title' : 'Edit Title'}
                        </button>
                      )}
                      {mainContent && (
                        <button
                          onClick={() => editingItems.has(mainContent.id) ? handleSave(mainContent.id) : handleEdit(mainContent)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(mainContent.id) ? 'Save Content' : 'Edit Content'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Values Section */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Values Section</h4>
                    <div className="space-y-4">
                      {valuesTitle && (
                        <div>
                          <label className="text-sm font-medium text-secondary-700">Values Title</label>
                          {editingItems.has(valuesTitle.id) ? (
                            <input
                              type="text"
                              value={editForms[valuesTitle.id]?.content || ''}
                              onChange={(e) => handleFieldChange(valuesTitle.id, 'content', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <p className="mt-1 text-secondary-600">{valuesTitle.content}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Value 1 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {value1Title && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 1 Title</label>
                            {editingItems.has(value1Title.id) ? (
                              <input
                                type="text"
                                value={editForms[value1Title.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value1Title.id, 'content', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value1Title.content}</p>
                            )}
                          </div>
                        )}
                        {value1Desc && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 1 Description</label>
                            {editingItems.has(value1Desc.id) ? (
                              <textarea
                                value={editForms[value1Desc.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value1Desc.id, 'content', e.target.value)}
                                rows={3}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value1Desc.content}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Value 2 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {value2Title && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 2 Title</label>
                            {editingItems.has(value2Title.id) ? (
                              <input
                                type="text"
                                value={editForms[value2Title.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value2Title.id, 'content', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value2Title.content}</p>
                            )}
                          </div>
                        )}
                        {value2Desc && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 2 Description</label>
                            {editingItems.has(value2Desc.id) ? (
                              <textarea
                                value={editForms[value2Desc.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value2Desc.id, 'content', e.target.value)}
                                rows={3}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value2Desc.content}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Value 3 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {value3Title && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 3 Title</label>
                            {editingItems.has(value3Title.id) ? (
                              <input
                                type="text"
                                value={editForms[value3Title.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value3Title.id, 'content', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value3Title.content}</p>
                            )}
                          </div>
                        )}
                        {value3Desc && (
                          <div>
                            <label className="text-sm font-medium text-secondary-700">Value 3 Description</label>
                            {editingItems.has(value3Desc.id) ? (
                              <textarea
                                value={editForms[value3Desc.id]?.content || ''}
                                onChange={(e) => handleFieldChange(value3Desc.id, 'content', e.target.value)}
                                rows={3}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            ) : (
                              <p className="mt-1 text-secondary-600">{value3Desc.content}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      {valuesTitle && (
                        <button
                          onClick={() => editingItems.has(valuesTitle.id) ? handleSave(valuesTitle.id) : handleEdit(valuesTitle)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(valuesTitle.id) ? 'Save Values Title' : 'Edit Values Title'}
                        </button>
                      )}
                      {value1Title && (
                        <button
                          onClick={() => editingItems.has(value1Title.id) ? handleSave(value1Title.id) : handleEdit(value1Title)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(value1Title.id) ? 'Save Value 1' : 'Edit Value 1'}
                        </button>
                      )}
                      {value2Title && (
                        <button
                          onClick={() => editingItems.has(value2Title.id) ? handleSave(value2Title.id) : handleEdit(value2Title)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(value2Title.id) ? 'Save Value 2' : 'Edit Value 2'}
                        </button>
                      )}
                      {value3Title && (
                        <button
                          onClick={() => editingItems.has(value3Title.id) ? handleSave(value3Title.id) : handleEdit(value3Title)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          {editingItems.has(value3Title.id) ? 'Save Value 3' : 'Edit Value 3'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            }
            
            // Special layout for board members
            if (section === 'about-board') {
              // Group board members by their number
              const boardMembers = content.reduce((acc, item) => {
                const match = item.metadata?.name?.match(/Board Member (\d+) (Name|Title|Bio|Image)/)
                if (match) {
                  const memberNumber = match[1]
                  const fieldType = match[2]
                  if (!acc[memberNumber]) {
                    acc[memberNumber] = { name: null, title: null, bio: null, image: null }
                  }
                  (acc[memberNumber] as any)[fieldType.toLowerCase()] = item
                }
                return acc
              }, {} as Record<string, { name: WebsiteContent | null, title: WebsiteContent | null, bio: WebsiteContent | null, image: WebsiteContent | null }>)

              const addBoardMember = async () => {
                const nextMemberNumber = Math.max(...Object.keys(boardMembers).map(Number), 0) + 1
                const newMemberFields = [
                  { field: 'Name', content: '' },
                  { field: 'Title', content: '' },
                  { field: 'Bio', content: '' },
                  { field: 'Image', content: '' }
                ]

                for (const field of newMemberFields) {
                  const response = await fetch('/api/sqlite-content', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      section: 'about',
                      subsection: 'board',
                      contentType: 'text',
                      content: field.content,
                      order: nextMemberNumber * 4 + newMemberFields.indexOf(field) + 1,
                      isActive: true,
                      metadata: { name: `Board Member ${nextMemberNumber} ${field.field}` },
                      user: user?.email || 'admin@clearviewretreat.com'
                    }),
                  })
                }
                refreshContent()
              }

              const removeBoardMember = async (memberNumber: string) => {
                const memberItems = content.filter(item => 
                  item.metadata?.name?.startsWith(`Board Member ${memberNumber}`)
                )
                
                for (const item of memberItems) {
                  await fetch(`/api/sqlite-content?id=${item.id}`, {
                    method: 'DELETE',
                  })
                }
                refreshContent()
              }

              return (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-secondary-900">
                      Board Members ({Object.keys(boardMembers).length})
                    </h4>
                    <button
                      onClick={addBoardMember}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Add Board Member
                    </button>
                  </div>
                  
                  {Object.entries(boardMembers).map(([memberNumber, member]: [string, any]) => (
                <div key={memberNumber} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-secondary-900">
                      Board Member #{memberNumber}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-2">
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          Name
                        </span>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Title
                        </span>
                        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                          Bio
                        </span>
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                          Image
                        </span>
                      </div>
                      <button
                        onClick={() => removeBoardMember(memberNumber)}
                        className="text-red-600 hover:text-red-700 text-sm px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Name
                      </label>
                      {editingItems.has(member.name?.id || '') ? (
                        <input
                          type="text"
                          value={editForms[member.name?.id || '']?.content || ''}
                          onChange={(e) => handleFieldChange(member.name?.id || '', 'content', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-white border border-gray-200 rounded-md">
                          {member.name?.content || 'Not set'}
                        </div>
                      )}
                    </div>
                    
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Title
                      </label>
                      {editingItems.has(member.title?.id || '') ? (
                        <input
                          type="text"
                          value={editForms[member.title?.id || '']?.content || ''}
                          onChange={(e) => handleFieldChange(member.title?.id || '', 'content', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-white border border-gray-200 rounded-md">
                          {member.title?.content || 'Not set'}
                        </div>
                      )}
                    </div>
                    
                    {/* Bio */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Bio
                      </label>
                      {editingItems.has(member.bio?.id || '') ? (
                        <textarea
                          value={editForms[member.bio?.id || '']?.content || ''}
                          onChange={(e) => handleFieldChange(member.bio?.id || '', 'content', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-white border border-gray-200 rounded-md">
                          {member.bio?.content || 'Not set'}
                        </div>
                      )}
                    </div>
                    
                    {/* Image URL */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Image URL
                      </label>
                      {editingItems.has(member.image?.id || '') ? (
                        <input
                          type="url"
                          value={editForms[member.image?.id || '']?.content || ''}
                          onChange={(e) => handleFieldChange(member.image?.id || '', 'content', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-white border border-gray-200 rounded-md">
                          {member.image?.content || 'No image set'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    {(editingItems.has(member.name?.id || '') || 
                      editingItems.has(member.title?.id || '') || 
                      editingItems.has(member.bio?.id || '') || 
                      editingItems.has(member.image?.id || '')) ? (
                      <>
                        <button
                          onClick={() => {
                            if (member.name && editingItems.has(member.name.id)) handleSave(member.name.id)
                            if (member.title && editingItems.has(member.title.id)) handleSave(member.title.id)
                            if (member.bio && editingItems.has(member.bio.id)) handleSave(member.bio.id)
                            if (member.image && editingItems.has(member.image.id)) handleSave(member.image.id)
                          }}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            if (member.name && editingItems.has(member.name.id)) handleCancel(member.name.id)
                            if (member.title && editingItems.has(member.title.id)) handleCancel(member.title.id)
                            if (member.bio && editingItems.has(member.bio.id)) handleCancel(member.bio.id)
                            if (member.image && editingItems.has(member.image.id)) handleCancel(member.image.id)
                          }}
                          className="btn-outline text-sm px-4 py-2"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          if (member.name) handleEdit(member.name)
                          if (member.title) handleEdit(member.title)
                          if (member.bio) handleEdit(member.bio)
                          if (member.image) handleEdit(member.image)
                        }}
                        className="btn-outline text-sm px-4 py-2"
                      >
                        Edit Member
                      </button>
                    )}
                  </div>
                </div>
              ))}
                </div>
              )
            }
            
            // Default layout for other sections
            return content.map((item) => (
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
                        {section === 'payment' || section === 'donation' || isEventsRegistration || isEventTypeSection ? (
                          <RichTextEditor
                            value={editForms[item.id]?.content || ''}
                            onChange={(value) => handleFieldChange(item.id, 'content', value)}
                            placeholder={section === 'payment' 
                              ? "Enter payment information here. Use the rich text editor to format text, add links, and create engaging content..."
                              : section === 'donation'
                              ? "Enter donation information here. Use the rich text editor to format text, add links, and create engaging content..."
                              : isEventTypeSection
                              ? "Enter detailed information about this retreat type. Use the rich text editor to format text, add images, and create engaging modal content..."
                              : item.subsection === 'events-registration-links'
                              ? "Enter registration links and forms here. Use the rich text editor to format text, add links, and create engaging content..."
                              : item.subsection === 'events-registration-calendar'
                              ? "Enter calendar configuration and event availability information here. Use the rich text editor to format text and add details..."
                              : item.subsection === 'events-registration-payment'
                              ? "Enter payment instructions, mailing address, and payment details here. Use the rich text editor to format text and add information..."
                              : "Enter registration page content here. Use the rich text editor to format text, add images, and create engaging content..."
                            }
                          />
                        ) : (
                          <textarea
                            value={editForms[item.id]?.content || ''}
                            onChange={(e) => handleFieldChange(item.id, 'content', e.target.value)}
                            className="textarea w-full"
                            rows={3}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-secondary-900">
                        {isEventsRegistration || isEventTypeSection ? (
                          <div dangerouslySetInnerHTML={{ __html: item.content }} />
                        ) : (
                          item.content
                        )}
                      </div>
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
            ))
          })()
        )}
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
                disabled={isSavingAll}
                className="btn-primary flex items-center space-x-2 px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingAll ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span>Save All Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
