'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

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

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory)

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
              Photo{' '}
              <span className="text-primary-600">Gallery</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Take a visual journey through ClearView Retreat and see the beauty, 
              community, and spiritual atmosphere that awaits you.
            </p>
          </motion.div>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url('${image.url}')` }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold text-sm mb-1 text-white/80">{image.title}</h3>
                    <p className="text-xs text-white/80">{image.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/gallery"
                className="btn bg-white text-secondary-700 hover:bg-secondary-50 text-lg px-8 py-4"
              >
                View Full Gallery
              </a>
              <a
                href="/contact"
                className="btn-outline border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-primary-400 transition-colors duration-200"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            
            <div className="relative">
              <div 
                className="w-full h-96 md:h-[600px] bg-cover bg-center bg-no-repeat rounded-lg"
                style={{ backgroundImage: `url('${selectedImage.url}')` }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                <p className="text-white/90">{selectedImage.description}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
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
