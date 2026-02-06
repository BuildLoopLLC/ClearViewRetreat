'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import AFrameIcon from '@/components/ui/AFrameIcon'

const navigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'About', 
    href: '/about',
    sublinks: [
      { name: 'History', href: '/about/history' },
      { name: 'Beliefs', href: '/about/beliefs' },
      { name: 'Board of Trustees', href: '/about/board' },
      { name: 'Founders', href: '/about/founders' },
      { name: 'With Gratitude', href: '/about/gratitude' },
    ]
  },
  { 
    name: 'Events', 
    href: '/events',
    sublinks: [
      { name: 'Upcoming Events', href: '/events/upcoming' },
      { name: 'Past Events', href: '/events/past' },
      { name: 'Event Types', href: '/events/types' },
      { name: 'Event Registration', href: '/events/registration' },
      { name: 'Payment', href: '/events/payment' },
    ]
  },
  { name: 'Blog', href: '/blog' },
  { 
    name: 'Gallery', 
    href: '/gallery',
    sublinks: [
      { name: 'Retreat Center', href: '/gallery/retreat-center' },
      { name: 'Event Photos', href: '/gallery/events' },
      { name: 'Nature & Grounds', href: '/gallery/nature' },
      { name: 'Community Life', href: '/gallery/community' },
    ]
  },
  { 
    name: 'Contact', 
    href: '/contact',
    sublinks: [
      { name: 'Location & Directions', href: '/contact/location' },
      { name: 'Staff Directory', href: '/contact/staff' },
      { name: 'Volunteer Opportunities', href: '/contact/volunteer' },
      { name: 'Prayer Requests', href: '/contact/prayer' },
    ]
  },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Clear View Retreat</span>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <AFrameIcon className="text-white" size="sm" />
              </div>
              <span className="text-2xl font-display font-bold text-secondary-900">Clear View</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <div key={item.name} className="relative group">
              <Link
                href={item.href}
                className="flex items-center text-sm font-semibold leading-6 text-secondary-700 hover:text-primary-600 transition-colors duration-200 py-2"
              >
                {item.name}
                {item.sublinks && (
                  <ChevronDownIcon className="ml-1 h-4 w-4 text-secondary-500 group-hover:text-primary-600 transition-transform duration-200 group-hover:rotate-180" />
                )}
              </Link>
              
              {/* Dropdown Menu */}
              {item.sublinks && (
                <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="mt-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="py-1">
                      {item.sublinks.map((sublink) => (
                        <Link
                          key={sublink.href}
                          href={sublink.href}
                          className="block px-4 py-2.5 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-150"
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-secondary-700"
            onClick={() => {
              console.log('Mobile menu button clicked, current state:', mobileMenuOpen)
              setMobileMenuOpen(!mobileMenuOpen)
            }}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu content */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl">
            <div className="h-full flex flex-col bg-white">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Clear View Retreat</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                      <AFrameIcon className="text-white" size="sm" />
                    </div>
                    <span className="text-xl font-display font-bold text-secondary-900">Clear View</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              {/* Navigation */}
              <div className="flex-1 p-6 bg-white">
                <nav className="space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block w-full text-xl font-semibold text-secondary-800 py-3 px-4 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 border border-gray-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
