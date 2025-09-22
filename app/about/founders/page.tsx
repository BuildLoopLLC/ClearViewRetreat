'use client'

import SubpageLayout from '@/components/ui/SubpageLayout'
import SubpageContent from '@/components/ui/SubpageContent'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

export default function FoundersPage() {
  const { content: foundersContent, loading, error } = useWebsiteContent('about', 'founders')

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
        title="Our Founders"
        subtitle="Learn about the visionaries who started this ministry"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'Founders', href: '/about/founders' }
        ]}
      >
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-64"></div>
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        </div>
      </SubpageLayout>
    )
  }
  
  if (error) {
    return (
      <SubpageLayout
        title="Our Founders"
        subtitle="Learn about the visionaries who started this ministry"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'Founders', href: '/about/founders' }
        ]}
      >
        <div className="text-center py-8">
          <p className="text-red-600">Error loading founders information: {error}</p>
        </div>
      </SubpageLayout>
    )
  }

  return (
    <SubpageLayout
      title="Our Founders"
      subtitle="Learn about the visionaries who started this ministry"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'Founders', href: '/about/founders' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-16">
          {foundersContent && foundersContent.find(c => c.metadata?.name === 'Founders Introduction')?.content && (
            <div 
              className="text-xl text-secondary-600 leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ 
                __html: processContent(foundersContent.find(c => c.metadata?.name === 'Founders Introduction')?.content || '') 
              }}
            />
          )}
        </div>

        {/* Founders Story */}
        <div className="space-y-8 mb-16">
          {foundersContent && foundersContent.find(c => c.metadata?.name === 'Founders Story')?.content && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: processContent(foundersContent.find(c => c.metadata?.name === 'Founders Story')?.content || '') 
                }}
              />
            </div>
          )}

          {foundersContent && foundersContent.find(c => c.metadata?.name === 'The Vision')?.content && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: processContent(foundersContent.find(c => c.metadata?.name === 'The Vision')?.content || '') 
                }}
              />
            </div>
          )}

          {foundersContent && foundersContent.find(c => c.metadata?.name === 'The Journey')?.content && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: processContent(foundersContent.find(c => c.metadata?.name === 'The Journey')?.content || '') 
                }}
              />
            </div>
          )}
        </div>

        {/* Call to Action */}
        {foundersContent && foundersContent.find(c => c.metadata?.name === 'Call to Action')?.content && (
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: processContent(foundersContent.find(c => c.metadata?.name === 'Call to Action')?.content || '') 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </SubpageLayout>
  )
}