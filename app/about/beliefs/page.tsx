'use client'

import SubpageLayout from '@/components/ui/SubpageLayout'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

export default function BeliefsPage() {
  const { content: beliefsContent, loading, error } = useWebsiteContent('about', 'beliefs')

  // Helper function to get content by metadata name
  const getContentByMetadataName = (name: string): string => {
    if (!beliefsContent) return ''
    const item = beliefsContent.find(item => item.metadata?.name === name)
    return item?.content || ''
  }

  if (loading) {
    return (
      <SubpageLayout
        title="Our Beliefs"
        subtitle="Learn about our core beliefs and theological foundation"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'Beliefs', href: '/about/beliefs' }
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
        title="Our Beliefs"
        subtitle="Learn about our core beliefs and theological foundation"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'Beliefs', href: '/about/beliefs' }
        ]}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-600">Error loading beliefs content. Please try again later.</p>
          </div>
        </div>
      </SubpageLayout>
    )
  }

  return (
    <SubpageLayout
      title="Our Beliefs"
      subtitle="Learn about our core beliefs and theological foundation"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'Beliefs', href: '/about/beliefs' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-16">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 text-center">
            <p className="text-xl text-secondary-600 leading-relaxed italic">
              "{getContentByMetadataName('Beliefs Quote') || 'It is our hope that God\'s church—that is, His people, not some building—would be one body… unified for Him, working for Him, glorifying Him, impassioned for Him.'}"
            </p>
          </div>
        </div>

        {/* Statement of Faith */}
        <div className="space-y-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              {getContentByMetadataName('Statement of Faith Title') || 'Our Statement of Faith'}
            </h3>
            <div 
              className="text-secondary-600 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: getContentByMetadataName('Statement of Faith Content') || 'We believe in God, the Creator of the heavens and earth...' 
              }}
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              {getContentByMetadataName('Core Values Title') || 'Our Core Values'}
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                    {getContentByMetadataName('Core Value 1 Title') || 'Biblical Authority'}
                  </h4>
                  <p className="text-secondary-600 leading-relaxed">
                    {getContentByMetadataName('Core Value 1 Content') || 'We believe the Bible is the inspired, infallible Word of God...'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                    {getContentByMetadataName('Core Value 2 Title') || 'Family Focus'}
                  </h4>
                  <p className="text-secondary-600 leading-relaxed">
                    {getContentByMetadataName('Core Value 2 Content') || 'We believe that strong families are the foundation...'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                    {getContentByMetadataName('Core Value 3 Title') || 'Intentional Relationships'}
                  </h4>
                  <p className="text-secondary-600 leading-relaxed">
                    {getContentByMetadataName('Core Value 3 Content') || 'We believe that meaningful relationships require intentional effort...'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                    {getContentByMetadataName('Core Value 4 Title') || 'Community'}
                  </h4>
                  <p className="text-secondary-600 leading-relaxed">
                    {getContentByMetadataName('Core Value 4 Content') || 'We believe in the importance of Christian community...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              {getContentByMetadataName('Theological Discussion Title') || 'A Note on Theological Discussion'}
            </h3>
            <div 
              className="text-secondary-600 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: getContentByMetadataName('Theological Discussion Content') || 'Of course, there are many issues within the realm of faith...' 
              }}
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
              Have Questions About Our Beliefs?
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              We welcome thoughtful questions and discussions about our theological foundation. 
              If you'd like to learn more about any aspect of our beliefs, please reach out to us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Contact Us
              </a>
              <a
                href="/about"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}