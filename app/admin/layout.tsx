'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isAdmin, loading, logout, user } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
          <p className="text-xs text-gray-500 mt-2">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If on login page, show the login form
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // If not authenticated, show redirect message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Please sign in to continue...</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // If authenticated but not admin, show access denied message
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Access Denied</h1>
          <p className="text-secondary-600 mb-6">
            You don't have admin privileges to access this area. Please sign in with admin credentials or contact an administrator.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Sign In as Admin
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to Homepage
            </button>
            <button
              onClick={logout}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render admin content
  return <>{children}</>
}
