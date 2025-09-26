'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  HeartIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

export default function DonatePage() {
  const [success, setSuccess] = useState(false)
  const { content: donationContent, loading } = useWebsiteContent('donation')

  const getContentByMetadataName = (name: string): string => {
    const item = donationContent.find(item => item.metadata?.name === name)
    return item?.content || ''
  }

  const processContent = (content: string) => {
    if (!content) return ''
    // If content contains HTML tags, return as-is, otherwise convert line breaks
    if (content.includes('<') && content.includes('>')) {
      return content
    }
    return content.replace(/\n/g, '<br>')
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading donation information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
                <HeartIcon className="h-6 w-6 mr-2 text-primary-600" />
                Make a Donation
              </h1>
              <p className="text-secondary-600">Support our mission and help us grow</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Financial Donation</h2>
          
          <div className="prose prose-lg max-w-none text-secondary-600">
            <div dangerouslySetInnerHTML={{ 
              __html: processContent(getContentByMetadataName('donation-content')) 
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}
