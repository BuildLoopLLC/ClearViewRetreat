'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  CreditCardIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

export default function EventPaymentPage() {
  const [success, setSuccess] = useState(false)
  const { content: paymentContent, loading } = useWebsiteContent('payment')

  const getContentByMetadataName = (name: string): string => {
    const item = paymentContent.find(item => item.metadata?.name === name)
    return item?.content || ''
  }

  const processContent = (content: string) => {
    if (!content) return ''
    return content.replace(/\n/g, '<br>')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading payment information...</p>
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
              href="/events"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Event Payment</h1>
              <p className="text-secondary-600">Complete your event registration payment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Payment</h2>
          
          <div className="prose prose-lg max-w-none text-secondary-600 mb-8">
            <div dangerouslySetInnerHTML={{ 
              __html: processContent(getContentByMetadataName('payment-instructions')) 
            }} />
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">PayPal Payment link:</h3>
            <div className="prose prose-lg max-w-none text-secondary-600">
              <div dangerouslySetInnerHTML={{ 
                __html: processContent(getContentByMetadataName('payment-methods')) 
              }} />
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-secondary-600">
              {getContentByMetadataName('contact-phone') || 'If you need further information, please contact 615-739-0634.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
