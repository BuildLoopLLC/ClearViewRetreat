'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { BlogPost } from '@/types/firebase'
import BlogPostCard from '@/components/blog/BlogPostCard'

const PAGE_SIZE = 12

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
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({
        published: 'true',
        page: String(page),
        pageSize: String(PAGE_SIZE),
        t: String(Date.now()),
      })
      if (selectedCategory) params.set('category', selectedCategory)
      if (searchQuery) params.set('search', searchQuery)
      const response = await fetch(`/api/sqlite-blog?${params}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      })
      if (!response.ok) throw new Error('Failed to fetch blog posts')
      const data = await response.json()
      if (data.posts) {
        setPosts(data.posts)
        setTotal(data.total)
      } else {
        setPosts(Array.isArray(data) ? data : [])
        setTotal(Array.isArray(data) ? data.length : 0)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [page, selectedCategory, searchQuery])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      })
      if (response.ok) setCategories(await response.json())
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCategoryFilter = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput.trim())
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)

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

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8 max-w-xl mx-auto">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search posts by title, excerpt, or content…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-secondary-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Search blog posts"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>

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
            {(selectedCategory || searchQuery) && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  {selectedCategory && (
                    <>Showing posts in: <span className="font-medium">{getCategoryByName(selectedCategory)?.name}</span></>
                  )}
                  {selectedCategory && searchQuery && ' • '}
                  {searchQuery && (
                    <>Search: <span className="font-medium">&quot;{searchQuery}&quot;</span></>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                {searchQuery
                  ? 'No posts match your search'
                  : selectedCategory
                    ? 'No Posts in This Category'
                    : 'No Posts Yet'}
              </h3>
              <p className="text-secondary-600">
                {searchQuery
                  ? `Try different keywords or clear the search.`
                  : selectedCategory
                    ? `No blog posts found in the "${getCategoryByName(selectedCategory)?.name}" category. Try selecting a different category or view all posts.`
                    : 'Our blog content will be available here soon. Check back for spiritual insights and retreat stories.'}
              </p>
              {(selectedCategory || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    setSearchQuery('')
                    setSearchInput('')
                    setPage(1)
                  }}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View All Posts
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-8">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{start}</span>–<span className="font-medium">{end}</span> of <span className="font-medium">{total}</span> posts
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
