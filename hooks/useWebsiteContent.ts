import { useState, useEffect, useRef } from 'react'
import { WebsiteContent } from '../types/firebase'

// Simple cache for storing fetched content
const contentCache = new Map<string, { data: WebsiteContent[]; timestamp: number }>()

// Cache duration: 5 minutes (300,000 ms)
const CACHE_DURATION = 5 * 60 * 1000

export function useWebsiteContent(section: string, subsection?: string) {
  const [content, setContent] = useState<WebsiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        
        // Create cache key that includes subsection
        const cacheKey = subsection ? `${section}-${subsection}` : section
        
        // Check cache first
        const cached = contentCache.get(cacheKey)
        const now = Date.now()
        
        if (cached && (now - cached.timestamp) < CACHE_DURATION) {
          console.log(`📦 Using cached content for ${cacheKey}`)
          setContent(cached.data)
          setLoading(false)
          return
        }

        // Cancel any previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        
        // Create new abort controller
        abortControllerRef.current = new AbortController()
        
        // Build URL with subsection if provided
        let url = `/api/website-content?section=${encodeURIComponent(section)}`
        if (subsection) {
          url += `&subsection=${encodeURIComponent(subsection)}`
        }
        
        console.log(`🔍 Fetching content for ${section}${subsection ? `-${subsection}` : ''} from ${url}`)
        
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const sectionContent = await response.json()
        
        // Update cache
        contentCache.set(cacheKey, { data: sectionContent, timestamp: now })
        console.log(`💾 Cached content for ${cacheKey}`)
        
        setContent(sectionContent)
        setError(null)
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Request was cancelled, don't set error
          return
        }
        setError(err.message || 'Failed to fetch content')
        console.error(`Error fetching ${section} content:`, err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()

    // Cleanup function to abort request if component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [section, subsection])

  // Helper function to get content by subsection
  const getContent = (subsection?: string): WebsiteContent | null => {
    if (!subsection) {
      return content[0] || null
    }
    return content.find(item => item.subsection === subsection) || null
  }

  // Helper function to get content value
  const getContentValue = (subsection?: string): string => {
    const item = getContent(subsection)
    return item?.content || ''
  }

  // Helper function to get metadata
  const getMetadata = (subsection?: string): Record<string, any> => {
    const item = getContent(subsection)
    return item?.metadata || {}
  }

  // Function to manually refresh content (bypass cache)
  const refreshContent = async () => {
    const cacheKey = subsection ? `${section}-${subsection}` : section
    contentCache.delete(cacheKey)
    setLoading(true)
    setError(null)
    
    try {
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController()
      
      // Build URL with subsection if provided
      let url = `/api/website-content?section=${encodeURIComponent(section)}`
      if (subsection) {
        url += `&subsection=${encodeURIComponent(subsection)}`
      }
      
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const sectionContent = await response.json()
      
      // Update cache
      contentCache.set(cacheKey, { data: sectionContent, timestamp: Date.now() })
      console.log(`🔄 Refreshed content for ${cacheKey}`)
      
      setContent(sectionContent)
      setError(null)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return
      }
      setError(err.message || 'Failed to refresh content')
      console.error(`Error refreshing ${section} content:`, err)
    } finally {
      setLoading(false)
    }
  }

  return {
    content,
    loading,
    error,
    getContent,
    getContentValue,
    getMetadata,
    refreshContent
  }
}

// Export cache management functions
export const cacheManager = {
  // Clear all cached content
  clearAll: () => {
    contentCache.clear()
    console.log('🗑️ Cleared all content cache')
  },
  
  // Clear cache for specific section
  clearSection: (section: string) => {
    contentCache.delete(section)
    console.log(`🗑️ Cleared cache for ${section}`)
  },
  
  // Get cache stats
  getStats: () => {
    const now = Date.now()
    const stats = {
      totalCached: contentCache.size,
      expired: 0,
      valid: 0
    }
    
    for (const [section, cached] of Array.from(contentCache.entries())) {
      if ((now - cached.timestamp) >= CACHE_DURATION) {
        stats.expired++
      } else {
        stats.valid++
      }
    }
    
    return stats
  }
}
