'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isAdmin, loading, logout } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log('🔍 Admin Layout Debug:', { 
      loading, 
      isAuthenticated, 
      isAdmin, 
      pathname,
      timestamp: new Date().toISOString()
    })
    
    if (loading) return

    // If we're on the login page, don't redirect
    if (pathname === '/admin/login') return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login')
      router.push('/admin/login')
      return
    }

    // If authenticated but not admin, redirect to login
    if (!isAdmin) {
      console.log('❌ Authenticated but not admin, redirecting to login')
      router.push('/admin/login')
      return
    }

    console.log('✅ User is authenticated and admin, allowing access')
  }, [isAuthenticated, isAdmin, loading, router, pathname])

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

  // If not authenticated or not admin, don't render anything (redirect will happen)
  if (!isAuthenticated || !isAdmin) {
    return null
  }

  // Render admin content
  return <>{children}</>
}
