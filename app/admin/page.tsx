'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  PhotoIcon, 
  UsersIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

// Mock data - in real app this would come from the database
const stats = [
  { name: 'Total Blog Posts', value: '24', icon: DocumentTextIcon, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { name: 'Upcoming Events', value: '8', icon: CalendarIcon, color: 'text-green-600', bgColor: 'bg-green-50' },
  { name: 'Photo Galleries', value: '12', icon: PhotoIcon, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { name: 'Total Users', value: '156', icon: UsersIcon, color: 'text-orange-600', bgColor: 'bg-orange-50' },
]

const quickActions = [
  { name: 'Create Blog Post', href: '/admin/blog/new', icon: DocumentTextIcon, color: 'text-blue-600' },
  { name: 'Add New Event', href: '/admin/events/new', icon: CalendarIcon, color: 'text-green-600' },
  { name: 'Upload Photos', href: '/admin/galleries/new', icon: PhotoIcon, color: 'text-purple-600' },
  { name: 'View Analytics', href: '/admin/analytics', icon: ChartBarIcon, color: 'text-indigo-600' },
  { name: 'Manage Users', href: '/admin/users', icon: UsersIcon, color: 'text-orange-600' },
  { name: 'Site Settings', href: '/admin/settings', icon: CogIcon, color: 'text-gray-600' },
]

export default function AdminDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

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
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
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
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Blog post published', item: 'Spring Renewal Retreat Guide', time: '2 hours ago', user: 'Sarah Johnson' },
              { action: 'Event created', item: 'Summer Family Camp', time: '1 day ago', user: 'Mike Chen' },
              { action: 'Photos uploaded', item: 'Nature Gallery', time: '2 days ago', user: 'Emily Rodriguez' },
              { action: 'User registered', item: 'New retreat participant', time: '3 days ago', user: 'System' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-900">
                    <span className="font-medium">{activity.action}</span>: {activity.item}
                  </p>
                  <p className="text-xs text-secondary-500">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
