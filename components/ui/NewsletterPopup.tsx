'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

const STORAGE_KEY = 'newsletter_popup_dismissed'
const STORAGE_EXPIRY_DAYS = 30 // Show popup again after 30 days if dismissed

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const { getContentValue } = useWebsiteContent('newsletter-popup')

  // Get customizable message from website content, with fallback
  const popupMessage = getContentValue('message') || 'Stay connected with Clear View Retreat! Subscribe to our newsletter for updates on upcoming retreats, ministry news, and special events.'
  const popupTitle = getContentValue('title') || 'Join Our Newsletter'

  useEffect(() => {
    // Function to check if popup should be shown
    const shouldShowPopup = () => {
      const dismissedData = localStorage.getItem(STORAGE_KEY)
      if (dismissedData) {
        const { timestamp } = JSON.parse(dismissedData)
        const daysSinceDismissed = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
        
        // Don't show if dismissed within expiry period
        if (daysSinceDismissed < STORAGE_EXPIRY_DAYS) {
          return false
        }
      }
      return true
    }

    // Show popup after a short delay (2 seconds) if not dismissed
    const timer = setTimeout(() => {
      if (shouldShowPopup()) {
        setIsVisible(true)
      }
    }, 2000)

    // Listen for custom event to show popup (from footer link)
    const handleShowPopup = () => {
      setIsVisible(true)
    }

    window.addEventListener('showNewsletterPopup', handleShowPopup)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('showNewsletterPopup', handleShowPopup)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    // Store dismissal with timestamp
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }))
  }

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
          source: 'newsletter_popup',
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setEmail('')
        setFirstName('')
        setLastName('')
        
        // Auto-dismiss after success (optional - you can remove this if you want to keep it open)
        setTimeout(() => {
          handleDismiss()
        }, 2000)
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-full max-w-sm"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <EnvelopeIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{popupTitle}</h3>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close newsletter popup"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-secondary-700 text-sm mb-4">
                {popupMessage}
              </p>

              {submitStatus === 'success' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 text-sm font-medium">
                    Thank you for subscribing! Check your email for confirmation.
                  </p>
                </div>
              ) : submitStatus === 'error' ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-4">
                  <p className="text-red-800 text-sm font-medium">
                    Something went wrong. Please try again.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="popup-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="popup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="popup-firstname" className="sr-only">
                        First name
                      </label>
                      <input
                        id="popup-firstname"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name (optional)"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="popup-lastname" className="sr-only">
                        Last name
                      </label>
                      <input
                        id="popup-lastname"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name (optional)"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

