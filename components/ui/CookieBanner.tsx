'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const COOKIE_CONSENT_KEY = 'cookie_consent'
const SCROLL_THRESHOLD = 500 // Pixels scrolled before auto-dismiss (if enabled)

interface CookieConsent {
  accepted: boolean
  timestamp: number
  dismissedAfterScroll?: boolean
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [scrollAmount, setScrollAmount] = useState(0)

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (consent) {
      const consentData: CookieConsent = JSON.parse(consent)
      // Don't show if user has explicitly accepted or rejected
      if (consentData.accepted !== undefined) {
        return
      }
    }

    // Show banner after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // Track scroll position
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      setScrollAmount(scrollY)

      // Auto-dismiss after scrolling threshold (optional - some jurisdictions allow this)
      // Note: Explicit consent is still required for GDPR compliance in most cases
      if (scrollY >= SCROLL_THRESHOLD && !hasScrolled) {
        setHasScrolled(true)
        // Note: We still require explicit consent, but we can auto-hide after scroll
        // The banner will reappear on next visit if no explicit choice was made
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible, hasScrolled])

  const handleAccept = () => {
    const consent: CookieConsent = {
      accepted: true,
      timestamp: Date.now()
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent))
    setIsVisible(false)
  }

  const handleReject = () => {
    const consent: CookieConsent = {
      accepted: false,
      timestamp: Date.now()
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent))
    setIsVisible(false)
  }

  const handleDismiss = () => {
    // Store that user dismissed but didn't explicitly accept/reject
    // Banner will show again on next visit
    const consent: CookieConsent = {
      accepted: false, // Default to not accepted if dismissed
      timestamp: Date.now(),
      dismissedAfterScroll: hasScrolled
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent))
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary-600 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <InformationCircleIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-secondary-900 mb-1">
                  We Value Your Privacy
                </h3>
                <p className="text-sm text-secondary-700 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <Link 
                    href="/cookie-policy" 
                    className="text-primary-600 hover:text-primary-700 underline font-medium"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Reject All
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                Accept All
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close cookie banner"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

