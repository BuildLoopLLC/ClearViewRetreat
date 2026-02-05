'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import AFrameIcon from '@/components/ui/AFrameIcon'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

export default function Hero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const { getContentValue, getMetadata, loading } = useWebsiteContent('hero')
  const { getContentValue: getStatsValue, loading: statsLoading } = useWebsiteContent('statistics')

  const openVideoModal = () => setIsVideoModalOpen(true)
  const closeVideoModal = () => setIsVideoModalOpen(false)

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <>
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-labelledby="hero-heading"
        role="banner"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/90 via-secondary-800/85 to-primary-900/80"></div>
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(images/TNMountains2.jpg)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
              <AFrameIcon size="sm" className="mr-2" />
              {getContentValue('tagline')}
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight text-balance text-white"
            dangerouslySetInnerHTML={{ __html: getContentValue('headline') }}
          />

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto mb-12 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: getContentValue('description') }}
          />

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              className="group inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-600 focus:ring-offset-4 focus:ring-offset-secondary-900 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-h-[56px]"
              aria-label="Explore upcoming events and retreats"
              onClick={() => window.location.href = '/events'}
            >
              <span>{getContentValue('primary_cta')}</span>
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
            </button>
            
            <button
              onClick={openVideoModal}
              className="group inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-4 focus:ring-offset-secondary-900 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-h-[56px]"
              aria-label="Watch our retreat center video"
            >
              <PlayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
              <span>{getContentValue('secondary_cta')}</span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {(() => {
              // Dynamically generate statistics from database content
              const dynamicStats = []
              for (let i = 1; i <= 4; i++) {
                const number = getStatsValue(`hero-stat-${i}-number`)
                const label = getStatsValue(`hero-stat-${i}-label`)
                
                if (number && label) {
                  dynamicStats.push({
                    number,
                    label
                  })
                }
              }
              
              // Fallback to default stats if no database content
              if (dynamicStats.length === 0) {
                return [
                  { number: '500+', label: 'Guests Served' },
                  { number: '25+', label: 'Years Experience' },
                  { number: '50+', label: 'Acres of Nature' },
                  { number: '100%', label: 'Satisfaction' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-sm md:text-base text-white/80">{stat.label}</div>
                  </div>
                ))
              }
              
              return dynamicStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-sm md:text-base text-white/80">{stat.label}</div>
                </div>
              ))
            })()}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              aria-hidden="true"
            />
          </div>
          <span className="sr-only">Scroll down to explore more</span>
        </motion.div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-secondary-900 text-white">
              <h3 className="text-lg font-semibold">Clear View Retreat Video</h3>
              <button
                onClick={closeVideoModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close video modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* Video Content */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${getMetadata('cta-secondary')?.videoUrl?.split('/').pop()}?autoplay=1`}
                title="Clear View Retreat Video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                aria-label="Clear View Retreat promotional video"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
