'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlogPost } from '@/types/firebase'
import BlogPostCard from '@/components/blog/BlogPostCard'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog?published=true')
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
      }
      const data = await response.json()
      setPosts(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-6">
              Our <span className="text-primary-600">Blog</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Insights, stories, and spiritual guidance from our retreat experiences and community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary-900 mb-6">Error Loading Blog</h1>
            <p className="text-secondary-600 mb-8">{error}</p>
            <button
              onClick={fetchPosts}
              className="btn-primary px-6 py-3"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-6">
            Our <span className="text-primary-600">Blog</span>
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Insights, stories, and spiritual guidance from our retreat experiences and community.
          </p>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                No Posts Yet
              </h3>
              <p className="text-secondary-600">
                Our blog content will be available here soon. Check back for spiritual insights and retreat stories.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogPostCard 
                key={post.id} 
                post={post} 
                featured={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
