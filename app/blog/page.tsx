'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { BlogPost } from '@/types/firebase'
import BlogPostCard from '@/components/blog/BlogPostCard'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  createdAt: string
  updatedAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null) // Clear any previous errors
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/sqlite-blog?published=true&t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
      }
      const data = await response.json()
      setAllPosts(data)
      setPosts(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleCategoryFilter = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    if (categorySlug === null) {
      setPosts(allPosts)
    } else {
      const filteredPosts = allPosts.filter(post => post.category === categorySlug)
      setPosts(filteredPosts)
    }
  }

  const getCategoryByName = (categorySlug: string) => {
    return categories.find(cat => cat.slug === categorySlug)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-6">
              CVR <span className="text-primary-600">Blog</span>
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
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900">
              CVR <span className="text-primary-600">Blog</span>
            </h1>
            {/* <button
              onClick={fetchPosts}
              disabled={loading}
              className="ml-4 p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Blog Posts"
            >
              <ArrowPathIcon className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} />
            </button> */}
          </div>
          <p className="text-xl text-secondary-600 max-w-5xl mx-auto leading-relaxed">
            Insights, stories, and spiritual guidance from our retreat experiences and community.
          </p>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === null
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                    selectedCategory === category.slug
                      ? 'bg-primary-600 text-white shadow-md'
                      : `${category.color} hover:opacity-80`
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {selectedCategory && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Showing posts in: <span className="font-medium">{getCategoryByName(selectedCategory)?.name}</span>
                </p>
              </div>
            )}
          </div>
        )}
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                {selectedCategory ? 'No Posts in This Category' : 'No Posts Yet'}
              </h3>
              <p className="text-secondary-600">
                {selectedCategory 
                  ? `No blog posts found in the "${getCategoryByName(selectedCategory)?.name}" category. Try selecting a different category or view all posts.`
                  : 'Our blog content will be available here soon. Check back for spiritual insights and retreat stories.'
                }
              </p>
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View All Posts
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => {
              const category = getCategoryByName(post.category)
              return (
                <BlogPostCard 
                  key={post.id} 
                  post={post} 
                  featured={index === 0}
                  category={category}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
