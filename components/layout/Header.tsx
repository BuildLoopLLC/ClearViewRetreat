'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import AFrameIcon from '@/components/ui/AFrameIcon'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Events', href: '/events' },
  { name: 'Blog', href: '/blog' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
]

const adminNavigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Blog Posts', href: '/admin/blog' },
  { name: 'Events', href: '/admin/events' },
  { name: 'Galleries', href: '/admin/galleries' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const { data: session } = useSession()

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">ClearView Retreat</span>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <AFrameIcon className="text-white" size="sm" />
              </div>
              <span className="text-2xl font-display font-bold text-secondary-900">ClearView</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-secondary-700 hover:text-primary-600 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="flex items-center space-x-2 text-sm font-semibold text-secondary-700 hover:text-primary-600 transition-colors duration-200"
              >
                <UserIcon className="h-5 w-5" />
                <span>{session.user?.name}</span>
              </button>

              <AnimatePresence>
                {adminMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    {isAdmin && adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        signOut()
                        setAdminMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-white text-secondary-900 border-2 border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:border-primary-600 shadow-sm hover:shadow-md min-h-[44px]"
              aria-label="Sign in to your account"
              role="button"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Sign In</span>
              </span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-secondary-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">ClearView Retreat</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <span className="text-xl font-display font-bold text-secondary-900">ClearView</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-secondary-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-secondary-900 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    {session ? (
                      <div className="space-y-2">
                        <div className="px-3 py-2 text-sm text-secondary-600">
                          Signed in as {session.user?.name}
                        </div>
                        {isAdmin && adminNavigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-secondary-900 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                        <button
                          onClick={() => {
                            signOut()
                            setMobileMenuOpen(false)
                          }}
                          className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-secondary-900 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/auth/signin"
                        className="btn-primary w-full justify-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
