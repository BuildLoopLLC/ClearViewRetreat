'use client'

import SubpageLayout from '@/components/ui/SubpageLayout'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

export default function AttractionsPage() {
  const { content: attractionsContent, loading, error } = useWebsiteContent('about', 'attractions')

  // Helper function to get content by metadata name
  const getContentByMetadataName = (name: string): string => {
    if (!attractionsContent) return ''
    const item = attractionsContent.find(item => item.metadata?.name === name)
    return item?.content || ''
  }

  // Get the main rich text content
  const getMainContent = (): string => {
    if (!attractionsContent || attractionsContent.length === 0) return ''
    // Look for specific content item or return the first one
    const mainContent = attractionsContent.find(item => 
      item.metadata?.name === 'Main Content' || 
      item.metadata?.name === 'Area Attractions Content' ||
      item.contentType === 'richtext'
    )
    return mainContent?.content || attractionsContent[0]?.content || ''
  }

  if (loading) {
    return (
      <SubpageLayout
        title="Area Attractions"
        subtitle="Discover the beauty and activities around Clear View Retreat"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'Area Attractions', href: '/about/attractions' }
        ]}
      >
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </SubpageLayout>
    )
  }

  if (error) {
    return (
      <SubpageLayout
        title="Area Attractions"
        subtitle="Discover the beauty and activities around Clear View Retreat"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'Area Attractions', href: '/about/attractions' }
        ]}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-600">Error loading content. Please try again later.</p>
          </div>
        </div>
      </SubpageLayout>
    )
  }

  const mainContent = getMainContent()

  return (
    <SubpageLayout
      title="Area Attractions"
      subtitle="Discover the beauty and activities around Clear View Retreat"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'Area Attractions', href: '/about/attractions' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Content - Rich Text from Database */}
        {mainContent ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 mb-16">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-secondary-900 prose-p:text-secondary-600 prose-a:text-primary-600 prose-strong:text-secondary-900 prose-ul:text-secondary-600 prose-ol:text-secondary-600"
              dangerouslySetInnerHTML={{ __html: mainContent }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 mb-16">
            <div className="text-center py-12">
              <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Content Coming Soon</h3>
              <p className="text-secondary-600 max-w-md mx-auto">
                Information about local area attractions will be added here. 
                Check back soon to discover all the wonderful things to see and do near Clear View Retreat.
              </p>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
              Plan Your Visit
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              Ready to experience Clear View Retreat and explore the beautiful surrounding area? 
              We'd love to help you plan an unforgettable visit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/events"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                View Upcoming Retreats
              </a>
              <a
                href="/contact/location"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}

