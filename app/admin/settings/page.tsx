'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
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
  ChevronRightIcon,
  ChartBarIcon,
  HeartIcon
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
      { id: 'statistics-hero', title: 'Hero Statistics', description: 'Statistics shown in the hero section (500+ Guests Served, etc.)' },
      { id: 'features', title: 'Features Section', description: 'Key features and benefits' },
      { id: 'testimonials', title: 'Testimonials', description: 'Customer testimonials and reviews' },
      { id: 'statistics-testimonials', title: 'Testimonials Statistics', description: 'Statistics shown in the testimonials section (98% Guest Satisfaction, etc.)' }
    ]
  },
  {
    id: 'about',
    title: 'About Page',
    description: 'About us content and company information',
    sections: [
      { id: 'about-main', title: 'Main About Content', description: 'Primary about us intro content for the main about page' },
      { id: 'statistics-about', title: 'About Statistics', description: 'Statistics shown in the about section (25+ Years of Ministry, etc.)' },
      { id: 'about-history', title: 'History', description: 'Our organization history and milestones' },
      { id: 'about-beliefs', title: 'Beliefs', description: 'Core beliefs and theological foundation' },
      { id: 'about-board', title: 'Board of Trustees', description: 'Board members, titles, bios, and photos - fully configurable' },
      { id: 'about-founders', title: 'Founders', description: 'Information about our founders' },
      { id: 'about-gratitude', title: 'With Gratitude', description: 'Thanks and acknowledgments' }
    ]
  },
  {
    id: 'events',
    title: 'Events Page',
    description: 'Events section headers and configuration',
    sections: [
      { id: 'events', title: 'Events Section', description: 'Events section title and subtitle' },
      { id: 'events-registration', title: 'Event Registration', description: 'Registration page content with links, calendar, and payment instructions' },
      { id: 'events-type-family-camps', title: 'Family Camps', description: 'Rich text modal content for Family Camps retreat type' },
      { id: 'events-type-marriage-retreats', title: 'Marriage Retreats', description: 'Rich text modal content for Marriage Retreats' },
      { id: 'events-type-pastors-missionaries', title: 'Pastors & Missionaries', description: 'Rich text modal content for Pastors & Missionaries retreats' },
      { id: 'events-type-grieving-families', title: 'Grieving Families', description: 'Rich text modal content for Grieving Families retreats' },
      { id: 'events-type-facility-rental', title: 'Cabins & Facility Rental', description: 'Rich text modal content for Facility Rental' },
      { id: 'events-type-mission-trips', title: 'Family Mission Trips', description: 'Rich text modal content for Family Mission Trips' },
      { id: 'events-type-other-options', title: 'Other Options', description: 'Rich text modal content for Other Options' },
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
      { id: 'contact', title: 'Main Contact Content', description: 'Primary contact information and forms' },
      { id: 'contact-location', title: 'Location & Directions', description: 'Rich text content for location and directions page' },
      { id: 'contact-staff', title: 'Staff Directory', description: 'Team members and contact information' },
      { id: 'contact-volunteer', title: 'Volunteer Opportunities', description: 'Rich text content for volunteer opportunities page' }
    ]
  },
  {
    id: 'support',
    title: 'Support Us Page',
    description: 'Support options and giving opportunities',
    sections: [
      { id: 'support-donate', title: 'Donate', description: 'Rich text modal content for the Donate option' },
      { id: 'support-shop', title: 'Shop to Support', description: 'Rich text modal content for the Shop to Support option' },
      { id: 'support-adopt-cabin', title: 'Adopt-a-Cabin', description: 'Rich text modal content for the Adopt-a-Cabin option' },
      { id: 'support-items-needed', title: 'Items Needed', description: 'Rich text modal content for the Items Needed option' }
    ]
  },
  {
    id: 'footer',
    title: 'Footer',
    description: 'Footer content and links',
    sections: [
      { id: 'footer', title: 'Footer Content', description: 'Footer text content and contact information' },
      { id: 'footer-social', title: 'Social Media Links', description: 'Social media links and their visibility settings' }
    ]
  },
  {
    id: 'payment',
    title: 'Payment Page',
    description: 'Event payment information and instructions',
    sections: [
      { id: 'payment', title: 'Payment Information', description: 'Payment methods, instructions, and contact information' }
    ]
  },
  {
    id: 'donation',
    title: 'Donation Page',
    description: 'Donation information and giving options',
    sections: [
      { id: 'donation', title: 'Donation Information', description: 'Donation methods, impact information, and giving options' }
    ]
  }
]

export default function SiteSettingsPage() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['home']))
  
  // Process URL parameter directly in render
  const sectionParam = searchParams.get('section')
  const initialActiveSection = sectionParam ? (() => {
    const allSections = pageSections.flatMap(page => 
      page.sections.map(section => ({ page: page.id, section: section.id }))
    )
    const matchingSection = allSections.find(s => s.section === sectionParam)
    return matchingSection || null
  })() : null
  
  const [activeSection, setActiveSection] = useState<{page: string, section: string} | null>(initialActiveSection)

  // Handle URL parameters to set active section
  useEffect(() => {
    // Try useSearchParams first, then fallback to window.location.search
    const section = searchParams.get('section') || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('section') : null)
    if (section) {
      // Find the section in our pageSections configuration
      const allSections = pageSections.flatMap(page => 
        page.sections.map(section => ({ page: page.id, section: section.id }))
      )
      const matchingSection = allSections.find(s => s.section === section)
      if (matchingSection) {
        setActiveSection(matchingSection)
        setExpandedPages(new Set([matchingSection.page]))
      }
    }
  }, [searchParams])

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href)
      const section = url.searchParams.get('section')
      if (section) {
        const allSections = pageSections.flatMap(page => 
          page.sections.map(section => ({ page: page.id, section: section.id }))
        )
        const matchingSection = allSections.find(s => s.section === section)
        if (matchingSection) {
          setActiveSection(matchingSection)
          setExpandedPages(new Set([matchingSection.page]))
        }
      } else {
        setActiveSection(null)
        setExpandedPages(new Set(['home']))
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const togglePage = (pageId: string) => {
    // If already expanded, collapse it. Otherwise, expand only this one (closing others)
    if (expandedPages.has(pageId)) {
      setExpandedPages(new Set())
    } else {
      setExpandedPages(new Set([pageId]))
    }
  }

  const handleSectionClick = (pageId: string, sectionId: string) => {
    setActiveSection({ page: pageId, section: sectionId })
    // Update URL with section parameter
    const url = new URL(window.location.href)
    url.searchParams.set('section', sectionId)
    window.history.pushState({}, '', url.toString())
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
      case 'support': return HeartIcon
      case 'statistics': return ChartBarIcon
      case 'blog': return CogIcon
      case 'custom': return CogIcon
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
