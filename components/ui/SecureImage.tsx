'use client'

import { useState, useEffect } from 'react'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

interface SecureImageProps {
  src: string
  alt: string
  className?: string
  fallbackIcon?: React.ComponentType<{ className?: string }>
  onError?: () => void
}

export default function SecureImage({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon: FallbackIcon = DocumentTextIcon,
  onError 
}: SecureImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // If the image is already a presigned URL or external URL, use it directly
    if (src.startsWith('http') && (src.includes('X-Amz-') || src.includes('amazonaws.com'))) {
      setImageSrc(src)
      setIsLoading(false)
      return
    }

    // If it's an S3 key, generate a presigned URL
    if (src.startsWith('blog-posts/') || src.startsWith('images/') || src.startsWith('galleries/') || src.startsWith('events/')) {
      const generatePresignedUrl = async () => {
        try {
          const response = await fetch(`/api/image-url?key=${encodeURIComponent(src)}`)
          if (response.ok) {
            const data = await response.json()
            setImageSrc(data.url)
          } else {
            setHasError(true)
          }
        } catch (error) {
          console.error('Error generating presigned URL:', error)
          setHasError(true)
        } finally {
          setIsLoading(false)
        }
      }
      
      generatePresignedUrl()
    } else {
      // Regular URL, use as-is
      setImageSrc(src)
      setIsLoading(false)
    }
  }, [src])

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    onError?.()
  }

  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <FallbackIcon className="h-8 w-8 text-gray-400" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  )
}
