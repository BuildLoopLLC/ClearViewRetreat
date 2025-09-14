'use client'

import SubpageLayout from '@/components/ui/SubpageLayout'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

export default function GratitudePage() {
  const { content: gratitudeContent, loading, error } = useWebsiteContent('about', 'gratitude')
  
  if (loading) {
    return (
      <SubpageLayout
        title="With Gratitude"
        subtitle="Expressing our thanks to those who have supported our mission"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'With Gratitude', href: '/about/gratitude' }
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
        title="With Gratitude"
        subtitle="Expressing our thanks to those who have supported our mission"
        breadcrumbs={[
          { name: 'About', href: '/about' },
          { name: 'With Gratitude', href: '/about/gratitude' }
        ]}
      >
        <div className="text-center py-8">
          <p className="text-red-600">Error loading gratitude information: {error}</p>
        </div>
      </SubpageLayout>
    )
  }

  return (
    <SubpageLayout
      title="With Gratitude"
      subtitle="Expressing our thanks to those who have supported our mission"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'With Gratitude', href: '/about/gratitude' }
      ]}
    >
      <div className="max-w-6xl mx-auto">
        {/* Introduction */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 md:p-12">
            {gratitudeContent && gratitudeContent.find(c => c.metadata?.name === 'Gratitude Introduction')?.content && (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: gratitudeContent.find(c => c.metadata?.name === 'Gratitude Introduction')?.content || '' 
                }}
              />
            )}
          </div>
        </div>

        {/* Individual Supporters */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-8 py-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white text-center">
                Individual Supporters
              </h3>
            </div>
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-3 md:gap-4 max-w-6xl mx-auto">
                {gratitudeContent && gratitudeContent.find(c => c.metadata?.name === 'Individual Supporters')?.content && (
                  <>
                    {(() => {
                      try {
                        const supporters = JSON.parse(gratitudeContent.find(c => c.metadata?.name === 'Individual Supporters')?.content || '[]')
                        return supporters.map((supporter: string, index: number) => (
                          <div key={index} className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                            <span className="text-secondary-800 font-medium">{supporter}</span>
                          </div>
                        ))
                      } catch (e) {
                        return <div className="text-red-600">Error parsing supporters list</div>
                      }
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Boy Scouts Section */}
        {gratitudeContent && gratitudeContent.find(c => c.metadata?.name === 'Boy Scouts Section')?.content && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div 
                  className="prose prose-lg max-w-none text-white"
                  dangerouslySetInnerHTML={{ 
                    __html: gratitudeContent.find(c => c.metadata?.name === 'Boy Scouts Section')?.content || '' 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Accord Section */}
        {gratitudeContent && gratitudeContent.find(c => c.metadata?.name === 'Global Accord Section')?.content && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                <div 
                  className="prose prose-lg max-w-none text-white"
                  dangerouslySetInnerHTML={{ 
                    __html: gratitudeContent.find(c => c.metadata?.name === 'Global Accord Section')?.content || '' 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {gratitudeContent && gratitudeContent.find(c => c.metadata?.name === 'Call to Action')?.content && (
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: gratitudeContent.find(c => c.metadata?.name === 'Call to Action')?.content || '' 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </SubpageLayout>
  )
}