'use client'

import { useState } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CogIcon,
  HomeIcon,
  InformationCircleIcon,
  CalendarIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import ContentManager from '@/components/admin/ContentManager'

interface PageSection {
  id: string
  title: string
  description: string
  sections: {
    id: string
    title: string
    description: string
  }[]
}

const pageSections: PageSection[] = [
  {
    id: 'home',
    title: 'Home Page',
    description: 'Main landing page content and sections',
    sections: [
      { id: 'hero', title: 'Hero Section', description: 'Main banner and call-to-action' },
      { id: 'features', title: 'Features Section', description: 'Key features and benefits' },
      { id: 'testimonials', title: 'Testimonials', description: 'Customer testimonials and reviews' }
    ]
  },
  {
    id: 'about',
    title: 'About Page',
    description: 'About us content and company information',
    sections: [
      { id: 'about', title: 'Main About Content', description: 'Primary about us content' }
    ]
  },
  {
    id: 'events',
    title: 'Events Page',
    description: 'Events and retreat information',
    sections: [
      { id: 'events', title: 'Events Section', description: 'Events and retreat content' }
    ]
  },
  {
    id: 'gallery',
    title: 'Gallery Page',
    description: 'Photo galleries and visual content',
    sections: [
      { id: 'gallery', title: 'Gallery Section', description: 'Gallery content and CTAs' }
    ]
  },
  {
    id: 'contact',
    title: 'Contact Page',
    description: 'Contact information and forms',
    sections: [
      { id: 'contact', title: 'Contact Section', description: 'Contact information and forms' }
    ]
  },
  {
    id: 'footer',
    title: 'Footer',
    description: 'Footer content and links',
    sections: [
      { id: 'footer', title: 'Footer Section', description: 'Footer content and contact info' }
    ]
  }
]

export default function SiteSettingsPage() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['home']))
  const [activeSection, setActiveSection] = useState<{page: string, section: string} | null>(null)

  const togglePage = (pageId: string) => {
    const newExpanded = new Set(expandedPages)
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId)
    } else {
      newExpanded.add(pageId)
    }
    setExpandedPages(newExpanded)
  }

  const handleSectionClick = (pageId: string, sectionId: string) => {
    setActiveSection({ page: pageId, section: sectionId })
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const getPageIcon = (pageId: string) => {
    switch (pageId) {
      case 'home': return HomeIcon
      case 'about': return InformationCircleIcon
      case 'events': return CalendarIcon
      case 'gallery': return PhotoIcon
      case 'contact': return ChatBubbleLeftRightIcon
      case 'blog': return CogIcon
      default: return CogIcon
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Site Settings</h1>
                <p className="text-secondary-600">Manage website content and configuration</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6">Content Sections</h2>
              
              <div className="space-y-2">
                {pageSections.map((page) => {
                  const PageIcon = getPageIcon(page.id)
                  const isExpanded = expandedPages.has(page.id)
                  
                  return (
                    <div key={page.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => togglePage(page.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <PageIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-secondary-900">{page.title}</div>
                            <div className="text-sm text-secondary-500">{page.description}</div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t border-gray-200">
                          {page.sections.map((section) => (
                            <button
                              key={section.id}
                              onClick={() => handleSectionClick(page.id, section.id)}
                              className={`w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                                activeSection?.page === page.id && activeSection?.section === section.id
                                  ? 'bg-primary-50 border-r-2 border-primary-600'
                                  : ''
                              }`}
                            >
                              <div className="font-medium text-secondary-900">{section.title}</div>
                              <div className="text-sm text-secondary-500">{section.description}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2">
            {activeSection ? (
              <ContentManager 
                section={activeSection.section} 
                title={`${pageSections.find(p => p.id === activeSection.page)?.title} - ${pageSections.find(p => p.id === activeSection.page)?.sections.find(s => s.id === activeSection.section)?.title}`}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <CogIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Content Section</h3>
                <p className="text-gray-500">
                  Choose a page and section from the sidebar to start editing content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
