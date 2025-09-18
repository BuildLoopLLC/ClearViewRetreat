import { useState, useEffect } from 'react'

// Simple cache for storing fetched content
const contentCache = new Map<string, { data: any[]; timestamp: number }>()

// Request deduplication to prevent multiple simultaneous requests for the same content
const pendingRequests = new Map<string, Promise<any[]>>()

// Cache duration: 1 hour (much more reasonable than Firebase)
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export function useWebsiteContent(section: string, subsection?: string) {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Debug logging
  console.log(`🔄 SQLite useWebsiteContent render:`, { section, subsection, loading, contentLength: content.length, error })

  useEffect(() => {
    let isMounted = true
    
    async function fetchContent() {
      try {
        setLoading(true)
        
        // Build API URL
        let url = `/api/sqlite-content?section=${encodeURIComponent(section)}`
        if (subsection) {
          url += `&subsection=${encodeURIComponent(subsection)}`
        }
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const sectionContent = await response.json()
        
        if (isMounted) {
          setContent(sectionContent)
          setError(null)
          setLoading(false)
        }
        
      } catch (err: any) {
        console.error(`❌ Error fetching content:`, err)
        if (isMounted) {
          setError(err.message || 'Failed to fetch content')
          setLoading(false)
        }
      }
    }

    fetchContent()
    
    return () => {
      isMounted = false
    }
  }, [section, subsection, refreshTrigger])

  // Helper function to get content by metadata name
  const getContentByMetadataName = (name: string): string => {
    const item = content.find(item => item.metadata?.name === name)
    return item?.content || ''
  }

  // Helper function to get content object by subsection
  const getContent = (subsection?: string): any => {
    if (!subsection) {
      return content[0] || null
    }
    return content.find(item => item.subsection === subsection) || null
  }

  // Helper function to get content value by subsection
  const getContentValue = (subsection?: string): string => {
    const item = getContent(subsection)
    return item?.content || ''
  }

  // Helper function to get metadata by subsection
  const getMetadata = (subsection?: string): any => {
    const item = getContent(subsection)
    return item?.metadata || {}
  }

  // Function to refresh content
  const refreshContent = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return {
    content,
    loading,
    error,
    refreshContent,
    getContent,
    getContentValue,
    getMetadata,
    getContentByMetadataName
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
    const keysToDelete = Array.from(contentCache.keys()).filter(key => 
      key === section || key.startsWith(section + '-')
    )
    keysToDelete.forEach(key => contentCache.delete(key))
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
    
    contentCache.forEach((value, key) => {
      if (now - value.timestamp > CACHE_DURATION) {
        stats.expired++
      } else {
        stats.valid++
      }
    })
    
    return stats
  }
}
