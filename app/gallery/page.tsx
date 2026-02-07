'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PhotoIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

// Gallery types with preview images
const gallerySubpages = [
  {
    id: 'retreat-center',
    title: 'Retreat Center',
    href: '/gallery/retreat-center',
    description: 'Explore our beautiful retreat center and facilities, including the main lodge, chapel, and meeting spaces.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    imageCount: null
  },
  {
    id: 'events',
    title: 'Event Photos',
    href: '/gallery/events',
    description: 'View photos from our seminars, workshops, retreats, and special gatherings.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    imageCount: null
  },
  {
    id: 'nature',
    title: 'Nature & Grounds',
    href: '/gallery/nature',
    description: 'Experience the natural beauty of our surroundings, trails, and landscapes.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    imageCount: null
  },
  {
    id: 'community',
    title: 'Community Life',
    href: '/gallery/community',
    description: 'See the life and fellowship that happens here—shared meals, worship, and connections.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=2232&q=80',
    imageCount: null
  },
  {
    id: 'cabins',
    title: 'Cabins',
    href: '/gallery/cabins',
    description: 'Discover our cozy cabin accommodations nestled in the peaceful surroundings.',
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    imageCount: null
  }
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/20 mb-8">
              <PhotoIcon className="h-10 w-10 text-primary-400" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Photo Gallery
            </h1>
            <p className="text-xl md:text-2xl text-secondary-200 max-w-3xl mx-auto leading-relaxed">
              Explore the beauty of Clear View Retreat through our collection of photographs 
              capturing moments, nature, and the spirit of our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              Browse Our Galleries
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Select a gallery below to explore photos from different aspects of life at Clear View Retreat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallerySubpages.map((gallery, index) => (
              <motion.div
                key={gallery.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={gallery.href}
                  className="group block h-full"
                >
                  <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                        style={{ backgroundImage: `url('${gallery.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-primary-200 transition-colors">
                          {gallery.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="p-6">
                      <p className="text-secondary-600 mb-4 line-clamp-2">
                        {gallery.description}
                      </p>
                      
                      <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                        <span>View Gallery</span>
                        <ArrowRightIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-4">
              Experience It for Yourself
            </h2>
            <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
              Photos can only capture so much. We invite you to visit Clear View Retreat 
              and experience the peace, beauty, and community firsthand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="btn-primary px-8 py-4 text-lg"
              >
                Upcoming Events
              </Link>
              <Link
                href="/contact"
                className="btn px-8 py-4 text-lg"
              >
                Plan Your Visit
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
