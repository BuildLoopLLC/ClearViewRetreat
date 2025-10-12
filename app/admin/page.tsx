'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  PhotoIcon, 
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  EnvelopeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

// Real-time stats interface
interface DashboardStats {
  blogPosts: number
  events: number
  galleries: number
  users: number
}

// Activity interface
interface Activity {
  id: string
  action: string
  item: string
  section?: string
  user: string
  timestamp: string
  details?: string
  type: 'content' | 'blog' | 'event' | 'gallery' | 'category' | 'user'
}

export default function AdminDashboard() {
  const { user, logout, loading: authLoading, isAdmin } = useAuthContext()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    blogPosts: 0,
    events: 0,
    galleries: 0,
    users: 0
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalActivities, setTotalActivities] = useState(0)
  const hasFetchedData = useRef(false)
  
  const ITEMS_PER_PAGE = 5
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE)


  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/admin/login')
    }
  }, [user, isAdmin, authLoading])

  // Fetch activities with pagination
  const fetchActivities = useCallback(async (page: number = currentPage) => {
    try {
      setActivitiesLoading(true)
      const offset = (page - 1) * ITEMS_PER_PAGE
      const response = await fetch(`/api/sqlite-activities?limit=${ITEMS_PER_PAGE}&offset=${offset}`)
      if (response.ok) {
        const activitiesData = await response.json()
        setActivities(activitiesData)
        
        // Get total count for pagination (fetch a larger sample to estimate)
        const countResponse = await fetch('/api/sqlite-activities?limit=1000')
        if (countResponse.ok) {
          const allActivities = await countResponse.json()
          setTotalActivities(allActivities.length)
        }
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setActivitiesLoading(false)
    }
  }, [currentPage, ITEMS_PER_PAGE])

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Fetch real-time stats and activities
  useEffect(() => {
    
    // Only fetch data if user is authenticated and is admin
    if (authLoading || !user || !isAdmin) {
      return
    }

    // Prevent multiple fetches
    if (hasFetchedData.current) {
      return
    }

    const fetchData = async () => {
      try {
        hasFetchedData.current = true
        setLoading(true)
        const [blogRes, eventsRes, galleriesRes, usersRes] = await Promise.all([
          fetch('/api/sqlite-blog'),
          fetch('/api/events'),
          fetch('/api/sqlite-content?section=galleries'),
          fetch('/api/users?action=count')
        ])

        const [blogData, eventsData, galleriesData, usersData] = await Promise.all([
          blogRes.json(),
          eventsRes.json(),
          galleriesRes.json(),
          usersRes.json()
        ])

        setStats({
          blogPosts: Array.isArray(blogData) ? blogData.length : 0,
          events: Array.isArray(eventsData) ? eventsData.length : 0,
          galleries: Array.isArray(galleriesData) ? galleriesData.length : 0,
          users: usersData.count || 0
        })

        // Fetch activities separately
        await fetchActivities(1)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [authLoading, user, isAdmin]) // Remove fetchActivities dependency

  // Fetch activities when page changes
  useEffect(() => {
    if (hasFetchedData.current) {
      fetchActivities(currentPage)
    }
  }, [currentPage, fetchActivities])

  // Set up polling for activities every 30 seconds
  useEffect(() => {
    // Only set up polling if user is authenticated and is admin
    if (authLoading || !user || !isAdmin) {
      return
    }

    const interval = setInterval(() => fetchActivities(currentPage), 30000)
    return () => clearInterval(interval)
  }, [authLoading, user, isAdmin, currentPage, fetchActivities])

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated or not admin (will redirect)
  if (!user || !isAdmin) {
    return null
  }

  // Helper function to format time ago
  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return time.toLocaleDateString()
  }

  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    const iconClass = "w-2 h-2 rounded-full"
    
    switch (type) {
      case 'content':
        return <div className={`${iconClass} bg-blue-500`}></div>
      case 'blog':
        return <div className={`${iconClass} bg-green-500`}></div>
      case 'event':
        return <div className={`${iconClass} bg-purple-500`}></div>
      case 'gallery':
        return <div className={`${iconClass} bg-pink-500`}></div>
      case 'category':
        return <div className={`${iconClass} bg-orange-500`}></div>
      case 'user':
        return <div className={`${iconClass} bg-indigo-500`}></div>
      default:
        return <div className={`${iconClass} bg-gray-500`}></div>
    }
  }

  const statsData = [
    { name: 'Blog Posts', value: stats.blogPosts.toString(), icon: DocumentTextIcon, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Events', value: stats.events.toString(), icon: CalendarIcon, color: 'text-green-600', bgColor: 'bg-green-50' },
    { name: 'Gallery Photos', value: stats.galleries.toString(), icon: PhotoIcon, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Admin Users', value: stats.users.toString(), icon: UsersIcon, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ]

  const quickActions = [
    { name: 'Manage Blog Posts', href: '/admin/blog', icon: DocumentTextIcon, color: 'text-blue-600' },
    { name: 'Manage Events', href: '/admin/events', icon: CalendarIcon, color: 'text-green-600' },
    { name: 'Calendar Events', href: '/admin/events-management', icon: CalendarIcon, color: 'text-indigo-600' },
    { name: 'Event Registrations', href: '/admin/registrations', icon: UserGroupIcon, color: 'text-emerald-600' },
    { name: 'Manage Photo Gallery', href: '/admin/gallery', icon: PhotoIcon, color: 'text-purple-600' },
    { name: 'Site Settings', href: '/admin/settings', icon: CogIcon, color: 'text-gray-600' },
  ]

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
              <p className="text-secondary-600">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                Admin
              </span>
              <Link
                href="/"
                className="btn"
              >
                View Site
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="group p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <action.icon className={`h-6 w-6 ${action.color} group-hover:scale-110 transition-transform duration-200`} />
                  <span className="font-medium text-secondary-700 group-hover:text-primary-700 transition-colors duration-200">
                    {action.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary-900">Recent Activity</h2>
            <button
              onClick={() => fetchActivities(currentPage)}
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Refresh
            </button>
          </div>
          
          {activitiesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-secondary-900">
                      <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()}{' '}
                      <span className="font-medium">{activity.item}</span>
                      {activity.section && (
                        <span className="text-secondary-500"> in {activity.section}</span>
                      )}
                    </p>
                    <p className="text-xs text-secondary-500 mt-1">
                      {getTimeAgo(activity.timestamp)}
                    </p>
                    {activity.details && (
                      <p className="text-xs text-secondary-400 mt-1 truncate">
                        {activity.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-2 py-1 text-xs rounded ${
                            currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No recent activity</h3>
              <p className="text-sm text-gray-500">Activity will appear here as you make changes to the site.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
