'use client'

import SubpageLayout from '@/components/ui/SubpageLayout'
import { useWebsiteContent } from '@/hooks/useWebsiteContentSQLite'

export default function GratitudePage() {
  const { content: gratitudeContent, loading, error } = useWebsiteContent('about', 'gratitude')

  // Helper function to process content and convert newlines to HTML
  const processContent = (content: string): string => {
    if (!content) return ''
    return content
      .replace(/\n\n/g, '</p><p>') // Convert double newlines to paragraph breaks
      .replace(/\n/g, '<br>') // Convert single newlines to line breaks
      .replace(/^/, '<p>') // Add opening paragraph tag
      .replace(/$/, '</p>') // Add closing paragraph tag
  }

  // Get dynamic gratitude sections (excluding intro and supporters)
  const getDynamicSections = () => {
    if (!gratitudeContent) return []
    return gratitudeContent.filter(item => 
      item.metadata?.name && 
      !['Gratitude Introduction', 'Individual Supporters', 'Call to Action'].includes(item.metadata.name) &&
      item.metadata.name.startsWith('Gratitude Section')
    ).sort((a, b) => (a.order || 0) - (b.order || 0))
  }
  
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
                  __html: processContent(gratitudeContent.find(c => c.metadata?.name === 'Gratitude Introduction')?.content || '') 
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
                        return supporters.map((supporter: any, index: number) => {
                          // Handle both old format (array of strings) and new format (array of objects)
                          const supporterName = typeof supporter === 'string' ? supporter : supporter.name || ''
                          const supporterLink = typeof supporter === 'object' ? supporter.link : ''
                          
                          return (
                            <div key={index} className={`text-center p-3 rounded-lg transition-all duration-200 ${
                              supporterLink 
                                ? 'bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 hover:from-primary-100 hover:to-accent-100 hover:border-primary-300 hover:shadow-md cursor-pointer group' 
                                : 'bg-secondary-50 hover:bg-secondary-100'
                            }`}>
                              {supporterLink ? (
                                <a 
                                  href={supporterLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block text-primary-700 font-medium hover:text-primary-800 transition-colors duration-200 group-hover:scale-105"
                                >
                                  <div className="flex items-center justify-center space-x-2">
                                    <span>{supporterName}</span>
                                    <svg 
                                      className="w-4 h-4 text-primary-500 group-hover:text-primary-600 transition-colors duration-200" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                                      />
                                    </svg>
                                  </div>
                                </a>
                              ) : (
                                <span className="text-secondary-800 font-medium">{supporterName}</span>
                              )}
                            </div>
                          )
                        })
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

        {/* Dynamic Gratitude Sections */}
        {getDynamicSections().map((section, index) => {
          return (
            <div key={section.id} className="mb-16">
              <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 overflow-hidden p-8">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: processContent(section.content || '') 
                  }}
                />
              </div>
            </div>
          )
        })}

      </div>
    </SubpageLayout>
  )
}