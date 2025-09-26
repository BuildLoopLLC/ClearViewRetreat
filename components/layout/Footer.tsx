'use client'

import Link from 'next/link'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import AFrameIcon from '@/components/ui/AFrameIcon'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Blog', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  about: [
    { name: 'History', href: '/about/history' },
    { name: 'Beliefs', href: '/about/beliefs' },
    { name: 'Board of Trustees', href: '/about/board' },
    { name: 'Founders', href: '/about/founders' },
    { name: 'With Gratitude', href: '/about/gratitude' },
  ],
  events: [
    { name: 'Upcoming Events', href: '/events/upcoming' },
    { name: 'Past Events', href: '/events/past' },
    { name: 'Event Registration', href: '/events/register' },
    { name: 'Event Types', href: '/events/types' },
    { name: 'Testimonials', href: '/events/testimonials' },
  ],
  contact: [
    { name: 'Get in Touch', href: '/contact/contact-us' },
    { name: 'Location & Directions', href: '/contact/location' },
    { name: 'Staff Directory', href: '/contact/staff' },
    { name: 'Volunteer Opportunities', href: '/contact/volunteer' },
    { name: 'Prayer Requests', href: '/contact/prayer' },
  ],
  gallery: [
    { name: 'Retreat Center', href: '/gallery/retreat-center' },
    { name: 'Event Photos', href: '/gallery/events' },
    { name: 'Nature & Grounds', href: '/gallery/nature' },
    { name: 'Community Life', href: '/gallery/community' },
    { name: 'Testimonials Gallery', href: '/gallery/testimonials' },
  ],
}

export default function Footer() {
  const { getContentValue, getMetadata } = useWebsiteContent('footer')
  
  // Get social media links from database
  const getSocialMediaLinks = (): Array<{
    name: string
    href: string
    icon: (props: any) => JSX.Element
  }> => {
    const platforms = ['facebook', 'instagram', 'youtube', 'twitter', 'linkedin']
    const socialLinks: Array<{
      name: string
      href: string
      icon: (props: any) => JSX.Element
    }> = []
    
    platforms.forEach(platform => {
      const url = getContentValue(`social-${platform}-url`)
      const enabled = getContentValue(`social-${platform}-enabled`) === 'true'
      
      if (url && enabled) {
        socialLinks.push({
          name: platform.charAt(0).toUpperCase() + platform.slice(1),
          href: url,
          icon: getSocialIcon(platform)
        })
      }
    })
    
    return socialLinks
  }
  
  const getSocialIcon = (platform: string) => {
    const icons = {
      facebook: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
      instagram: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.047 1.024.06 1.378.06 3.808v.378c0 2.43-.013 2.784-.06 3.808-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.047-1.378.06-3.808.06h-.378c-2.43 0-2.784-.013-3.808-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.378-.06-3.808v-.378c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.023.058-1.37.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.37-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      youtube: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      twitter: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      linkedin: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
            clipRule="evenodd"
          />
        </svg>
      )
    }
    
    return icons[platform as keyof typeof icons] || icons.facebook
  }
  
  const socialLinks = getSocialMediaLinks()
  
  return (
    <footer className="bg-secondary-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand and Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <AFrameIcon className="text-white" size="md" />
              </div>
              <span className="text-3xl font-display font-bold text-white">ClearView</span>
            </div>
            <p className="text-secondary-300 text-lg leading-relaxed">
              {getContentValue('description')}
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">About</h3>
            <h3 className="text-lg font-semibold text-white">{getContentValue('quick-links-title')}</h3>
            <ul className="space-y-3">
              {navigation.about.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Events</h3>
            <ul className="space-y-3">
              {navigation.events.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Contact</h3>
            <h3 className="text-lg font-semibold text-white">{getContentValue('contact-info-title')}</h3>
            <ul className="space-y-3">
              {navigation.contact.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Additional Navigation Row */}
        <div className="mt-16 pt-8 border-t border-secondary-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Gallery Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Gallery</h3>
              <ul className="space-y-2">
                {navigation.gallery.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-lg font-semibold text-white">Get In Touch</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-secondary-300 text-sm">
                      123 Retreat Lane<br />
                      Mountain View, CA 94041
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                  <a
                    href="tel:+1-555-123-4567"
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    (555) 123-4567
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                  <a
                    href="mailto:info@clearviewretreat.org"
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    info@clearviewretreat.org
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 border-t border-secondary-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-400 text-sm">
              {getContentValue('copyright')}
            </p>
            <p className="text-secondary-400 text-sm">
              Made with ❤️ for spiritual renewal and community building
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
