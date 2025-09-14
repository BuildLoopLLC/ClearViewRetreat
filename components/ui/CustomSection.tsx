'use client'

import { useWebsiteContent } from '../../hooks/useWebsiteContent'
import Image from 'next/image'

interface CustomSectionProps {
  section: string
  subsection?: string
  className?: string
}

export default function CustomSection({ section, subsection, className = '' }: CustomSectionProps) {
  const { content, loading, error } = useWebsiteContent(section, subsection)

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-red-600 ${className}`}>
        Error loading section: {error}
      </div>
    )
  }

  if (!content || content.length === 0) {
    return null
  }

  return (
    <div className={className}>
      {content.map((item) => {
        const hasImage = item.metadata?.hasImage
        const isRichText = item.metadata?.isRichText
        const imageUrl = item.metadata?.imageUrl

        return (
          <div key={item.id} className="mb-8">
            {/* Section with Image */}
            {hasImage && imageUrl && (
              <div className="mb-6">
                <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={item.metadata?.name || 'Section image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            )}

            {/* Section Content */}
            <div className="prose prose-lg max-w-none">
              {isRichText ? (
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              ) : (
                <div className="whitespace-pre-wrap">{item.content}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
