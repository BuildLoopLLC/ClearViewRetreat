'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { BlogPost } from '@/types/firebase'
import BlogPostContent from '@/components/blog/BlogPostContent'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blog/${slug}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog post not found')
        }
        throw new Error('Failed to fetch blog post')
      }
      const data = await response.json()
      setPost(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary-900 mb-6">Post Not Found</h1>
            <p className="text-secondary-600 mb-8">{error}</p>
            <Link
              href="/blog"
              className="btn-primary px-6 py-3 inline-flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Blog post content */}
        <BlogPostContent post={post} />
      </div>
    </div>
  )
}
