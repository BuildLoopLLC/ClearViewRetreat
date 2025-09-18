'use client'

import { useEffect } from 'react'

// Simple cache warming utility to pre-fetch commonly used content
const COMMON_SECTIONS = ['hero', 'features', 'about', 'events', 'gallery', 'contact']

export default function CacheWarmer() {
  useEffect(() => {
    // Pre-fetch all common sections
    const warmCache = async () => {
      console.log('🔥 Warming cache for all common sections...')
      
      const promises = COMMON_SECTIONS.map(section => 
        fetch(`/api/sqlite-content?section=${encodeURIComponent(section)}`)
          .then(response => {
            if (response.ok) {
              console.log(`✅ Pre-fetched ${section} section`)
            } else {
              console.warn(`⚠️ Failed to pre-fetch ${section} section`)
            }
          })
          .catch(error => {
            console.error(`❌ Error pre-fetching ${section} section:`, error)
          })
      )
      
      await Promise.allSettled(promises)
      console.log('🔥 Cache warming completed')
    }
    
    // Warm critical sections immediately
    warmCache()
  }, [])

  // This component doesn't render anything
  return null
}
