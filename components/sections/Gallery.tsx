'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

// Mock gallery data - in real app this would come from the database
const galleryImages = [
  {
    id: 1,
    title: 'Sunrise Over the Mountains',
    description: 'The breathtaking view from our main lodge at dawn.',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Nature',
  },
  {
    id: 2,
    title: 'Prayer Garden',
    description: 'A peaceful space for reflection and meditation.',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    category: 'Facilities',
  },
  {
    id: 3,
    title: 'Community Worship',
    description: 'Gathering together in praise and worship.',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Community',
  },
  {
    id: 4,
    title: 'Hiking Trails',
    description: 'Explore God\'s creation on our scenic trails.',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    category: 'Nature',
  },
  {
    id: 5,
    title: 'Dining Hall',
    description: 'Sharing meals and building relationships.',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Facilities',
  },
  {
    id: 6,
    title: 'Sunset Reflections',
    description: 'Evening peace and tranquility.',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    category: 'Nature',
  },
  {
    id: 7,
    title: 'Bible Study',
    description: 'Deepening faith through study and discussion.',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Community',
  },
  {
    id: 8,
    title: 'Wildlife',
    description: 'God\'s creatures in their natural habitat.',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    category: 'Nature',
  },
]

const categories = ['All', 'Nature', 'Facilities', 'Community']

interface GalleryProps {
  showViewFullGallery?: boolean
}

export default function Gallery({ showViewFullGallery = true }: GalleryProps) {
  const { getContentValue, loading } = useWebsiteContent('gallery')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)

  // Handle escape key to close modal and prevent body scroll
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedImage) {
        setSelectedImage(null)
      }
    }

    if (selectedImage) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory)



  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              {getContentValue('title')}
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              {getContentValue('subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-4 mb-16 relative z-10"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer select-none ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Filter status indicator */}
          {selectedCategory !== 'All' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-secondary-600 bg-secondary-100 px-4 py-2 rounded-full"
            >
              Showing {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'} in {selectedCategory}
            </motion.div>
          )}
        </motion.div>

        {/* Visual separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-secondary-200 to-transparent mb-16"></div>

        {/* Gallery Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer focus-within:ring-4 focus-within:ring-primary-600 focus-within:ring-offset-4 focus-within:outline-none rounded-xl"
                onClick={() => setSelectedImage(image)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedImage(image)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${image.title} in full size`}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url('${image.url}')` }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end pointer-events-none">
                    <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-semibold text-sm mb-1 text-white/80">{image.title}</h3>
                      <p className="text-xs text-white/80">{image.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-secondary-600 to-secondary-800 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 text-white/80">
              Experience the Beauty for Yourself
            </h3>
            <p className="text-lg text-secondary-200 mb-8 max-w-2xl mx-auto">
              These photos only capture a glimpse of what ClearView Retreat has to offer. 
              Come visit us and create your own memories in this beautiful place.
            </p>
            <div className={`flex ${showViewFullGallery ? 'flex-col sm:flex-row gap-4 justify-center' : 'justify-center'}`}>
              {showViewFullGallery && (
                <a
                  href="/gallery"
                  className="btn bg-white text-secondary-700 hover:bg-secondary-50 text-lg px-8 py-4"
                >
                  {getContentValue('cta')}
                </a>
              )}
              <a
                href="/contact"
                className={`btn ${showViewFullGallery ? 'btn-outline border-white/30 text-white hover:bg-white/10' : 'bg-white text-secondary-700 hover:bg-secondary-50'} text-lg px-8 py-4`}
              >
                Plan Your Visit
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close image modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            {/* Image container */}
            <div className="relative w-full h-full max-h-[80vh]">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              
              {/* Image info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                <p className="text-white/90 mb-3">{selectedImage.description}</p>
                <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm rounded-full font-medium">
                  {selectedImage.category}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  )
}
