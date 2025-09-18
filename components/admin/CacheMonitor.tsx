'use client'

import { useState, useEffect } from 'react'
import { cacheManager } from '../../hooks/useWebsiteContentSQLite'

export default function CacheMonitor() {
  const [cacheStats, setCacheStats] = useState<{
    totalCached: number
    expired: number
    valid: number
  } | null>(null)

  useEffect(() => {
    // Update stats every 10 seconds
    const interval = setInterval(() => {
      setCacheStats(cacheManager.getStats())
    }, 10000)

    // Initial stats
    setCacheStats(cacheManager.getStats())

    return () => clearInterval(interval)
  }, [])

  const handleClearAll = () => {
    cacheManager.clearAll()
    setCacheStats(cacheManager.getStats())
  }

  if (!cacheStats) return null

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Cache Monitor</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">{cacheStats.totalCached}</div>
          <div className="text-sm text-secondary-600">Total Cached</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{cacheStats.valid}</div>
          <div className="text-sm text-secondary-600">Valid</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{cacheStats.expired}</div>
          <div className="text-sm text-secondary-600">Expired</div>
        </div>
      </div>

      <button
        onClick={handleClearAll}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
      >
        Clear All Cache
      </button>

      <div className="mt-4 text-xs text-secondary-500">
        Cache duration: 5 minutes | Auto-refresh: 10s
      </div>
    </div>
  )
}
