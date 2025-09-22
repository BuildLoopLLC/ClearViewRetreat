'use client'

import SubpageLayout from '@/components/ui/SubpageLayout'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

export default function HistoryPage() {
  const { content: historyContent, loading, error } = useWebsiteContent('about', 'history')

  // Helper function to get content by metadata name
  const getContentByMetadataName = (name: string): string => {
    if (!historyContent) return ''
    const item = historyContent.find(item => item.metadata?.name === name)
    return item?.content || ''
  }

  // Helper function to process content and convert newlines to HTML
  const processContent = (content: string): string => {
    if (!content) return ''
    return content
      .replace(/\n\n/g, '</p><p>') // Convert double newlines to paragraph breaks
      .replace(/\n/g, '<br>') // Convert single newlines to line breaks
      .replace(/^/, '<p>') // Add opening paragraph tag
      .replace(/$/, '</p>') // Add closing paragraph tag
  }

  if (loading) {
    return (
      <SubpageLayout
        title="Our History"
        subtitle="Discover the journey and milestones that have shaped our organization"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'History', href: '/about/history' }
        ]}
      >
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </SubpageLayout>
    )
  }

  if (error) {
    return (
      <SubpageLayout
        title="Our History"
        subtitle="Discover the journey and milestones that have shaped our organization"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'History', href: '/about/history' }
        ]}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-600">Error loading history content. Please try again later.</p>
          </div>
        </div>
      </SubpageLayout>
    )
  }

  return (
    <SubpageLayout
      title="Our History"
      subtitle="Discover the journey and milestones that have shaped our organization"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'History', href: '/about/history' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-16">
          <div 
            className="text-xl text-secondary-600 leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ 
              __html: processContent(getContentByMetadataName('History Introduction')) || 'Our organization was founded with a vision to strengthen families and build intentional intimacy through Christ-centered ministry.' 
            }}
          />
        </div>

        {/* Main Story */}
        <div className="space-y-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              {getContentByMetadataName('Foundation Section Title') || 'The Foundation of Intentional Intimacy International'}
            </h3>
            <div 
              className="text-secondary-600 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: processContent(getContentByMetadataName('Foundation Section Content')) || 'Jim and Kim Nestle established Intentional Intimacy International (III) in the spring of 2008...' 
              }}
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              {getContentByMetadataName('Partnership Section Title') || 'Our Partnership with Churches'}
            </h3>
            <div 
              className="text-secondary-600 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: processContent(getContentByMetadataName('Partnership Section Content')) || 'CVR wants to partner with your church leadership...' 
              }}
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              {getContentByMetadataName('Different Section Title') || 'Why We\'re Different'}
            </h3>
            <div 
              className="text-secondary-600 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ 
                __html: processContent(getContentByMetadataName('Different Section Intro')) || 'By bringing families away from familiar, sometimes stressful environments...' 
              }}
            />
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                    {getContentByMetadataName('Different Point 1 Title') || 'Small Group Focus'}
                  </h4>
                  <div 
                    className="text-secondary-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: processContent(getContentByMetadataName('Different Point 1 Content')) || 'We want each group that comes away together to be small...' 
                    }}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                    {getContentByMetadataName('Different Point 2 Title') || 'Easing the Burden on Leaders'}
                  </h4>
                  <div 
                    className="text-secondary-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: processContent(getContentByMetadataName('Different Point 2 Content')) || 'We want to ease the burden on church leaders...' 
                    }}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                    {getContentByMetadataName('Different Point 3 Title') || 'Focus on Relationships'}
                  </h4>
                  <div 
                    className="text-secondary-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: processContent(getContentByMetadataName('Different Point 3 Content')) || 'We want to focus on relationships...' 
                    }}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                    {getContentByMetadataName('Different Point 4 Title') || 'Natural Setting'}
                  </h4>
                  <div 
                    className="text-secondary-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: processContent(getContentByMetadataName('Different Point 4 Content')) || 'We want to provide a natural setting...' 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
              Ready to Experience Our Mission?
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              Join us for a retreat and discover how intentional intimacy can transform your family relationships. 
              We'd love to partner with your church to bring this experience to your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/events"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Explore Our Retreats
              </a>
              <a
                href="/contact"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Partner With Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}