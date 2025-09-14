'use client'

import { useWebsiteContent } from '../../hooks/useWebsiteContent'

interface SubpageContentProps {
  section: string
  subsection: string
  fallback?: React.ReactNode
  className?: string
}

export default function SubpageContent({ 
  section, 
  subsection, 
  fallback = null,
  className = "prose prose-lg max-w-none"
}: SubpageContentProps) {
  const { content, loading, error } = useWebsiteContent(section)
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        Error loading content: {error}
      </div>
    )
  }
  
  // Filter content by subsection
  const subpageContent = content.filter(item => item.subsection === subsection)
  
  if (subpageContent.length === 0) {
    return fallback || (
      <div className="text-gray-500 italic">
        Content for this section is being prepared.
      </div>
    )
  }
  
  return (
    <div className={className}>
      {subpageContent.map((item, index) => (
        <div key={item.id} className="mb-6">
          {item.contentType === 'text' ? (
            <div 
              className="text-secondary-600 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: item.content.replace(/\n\n/g, '</p><p class="text-secondary-600 leading-relaxed mb-6">').replace(/^/, '<p class="text-secondary-600 leading-relaxed mb-6">').replace(/$/, '</p>') }}
            />
          ) : item.contentType === 'html' ? (
            <div 
              className="text-secondary-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ) : (
            <p className="text-secondary-600 leading-relaxed">
              {item.content}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
