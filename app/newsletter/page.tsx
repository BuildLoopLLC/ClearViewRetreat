'use client'

import { useState } from 'react'
import { ShareIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import SubpageLayout from '@/components/ui/SubpageLayout'
import { QRCodeSVG } from 'qrcode.react'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showQRModal, setShowQRModal] = useState(false)
  const { getContentValue } = useWebsiteContent('newsletter-popup')

  // Get customizable message from website content, with fallback
  const newsletterMessage = getContentValue('message') || 'Stay connected with Clear View Retreat! Subscribe to our newsletter for updates on upcoming retreats, ministry news, and special events.'
  const newsletterTitle = getContentValue('title') || 'Join Our Newsletter'

  // Get the current page URL for QR code
  const newsletterUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          source: 'newsletter_page',
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setEmail('')
        setFirstName('')
        setLastName('')
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    setShowQRModal(true)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(newsletterUrl)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  return (
    <SubpageLayout
      title={newsletterTitle}
      subtitle={newsletterMessage}
      breadcrumbs={[
        { name: 'Newsletter', href: '/newsletter' }
      ]}
    >
      <div className="max-w-2xl mx-auto">
        {/* Share Button */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-200 font-medium"
          >
            <ShareIcon className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-secondary-200 p-8">
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="mb-6"
              >
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
                Thank You for Subscribing!
              </h3>
              <p className="text-secondary-600 mb-6">
                You'll receive updates about retreats and ministry news. Check your email for confirmation.
              </p>
              <button
                onClick={() => {
                  setSubmitStatus('idle')
                  setEmail('')
                  setFirstName('')
                  setLastName('')
                }}
                className="btn-primary"
              >
                Subscribe Another Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name (optional)"
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name (optional)"
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base transition-colors"
                  />
                </div>
              </div>

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm font-medium">
                    Something went wrong. Please try again.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
              </button>
            </form>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-secondary-600 text-sm">
            By subscribing, you agree to receive email updates from Clear View Retreat. 
            You can unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowQRModal(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-display font-semibold text-secondary-900">
                    Share Newsletter Signup
                  </h3>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="p-2 rounded-full hover:bg-secondary-100 text-secondary-600 transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center space-y-6">
                  <div className="bg-white p-4 rounded-lg border-2 border-secondary-200">
                    {newsletterUrl && (
                      <QRCodeSVG
                        value={newsletterUrl}
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                    )}
                  </div>
                  
                  <div className="text-center space-y-4 w-full">
                    <p className="text-secondary-600 text-sm">
                      Scan this QR code to share the newsletter signup page
                    </p>
                    
                    {/* Copy Link Button */}
                    <button
                      onClick={handleCopyLink}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SubpageLayout>
  )
}

