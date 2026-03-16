'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  DocumentTextIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MicrophoneIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { BlogPost } from '@/types/firebase'

export default function BlogManagementPage() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ inserted: number; skipped: number; categoriesAdded: number } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Podcast RSS feed settings
  const [podcastFeedUrl, setPodcastFeedUrl] = useState('')
  const [podcastSettingsLoading, setPodcastSettingsLoading] = useState(true)
  const [podcastSaving, setPodcastSaving] = useState(false)
  const [podcastSyncing, setPodcastSyncing] = useState(false)
  const [podcastLastSynced, setPodcastLastSynced] = useState<string | null>(null)
  const [podcastSyncResult, setPodcastSyncResult] = useState<{ inserted: number; skipped: number } | null>(null)
  const [podcastSyncError, setPodcastSyncError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [page])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/admin/podcast-settings')
        if (cancelled) return
        const data = await res.json()
        if (res.ok) {
          setPodcastFeedUrl(data.feedUrl ?? '')
          setPodcastLastSynced(data.lastSyncedAt ?? null)
        }
      } finally {
        if (!cancelled) setPodcastSettingsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const fetchPosts = async (pageOverride?: number) => {
    const p = pageOverride ?? page
    try {
      setLoading(true)
      const timestamp = new Date().getTime()
      const response = await fetch(
        `/api/sqlite-blog?page=${p}&pageSize=${pageSize}&t=${timestamp}`,
        {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
      }
      const data = await response.json()
      setPosts(data.posts ?? [])
      setTotal(data.total ?? 0)
      if (pageOverride != null) setPage(pageOverride)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    try {
      console.log('Deleting blog post with ID:', id)
      const response = await fetch(`/api/sqlite-blog?id=${id}`, {
        method: 'DELETE'
      })
      
      console.log('Delete response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete error:', errorData)
        throw new Error(errorData.error || 'Failed to delete blog post')
      }
      
      const result = await response.json()
      console.log('Delete result:', result)
      
      // Remove from local state immediately
      const updatedPosts = posts.filter(post => post.id !== id)
      console.log('Updated posts count:', updatedPosts.length)
      setPosts(updatedPosts)
      
      // Also refresh the data to ensure consistency
      console.log('Refreshing posts...')
      await fetchPosts()
    } catch (err: any) {
      console.error('Delete error:', err)
      alert('Failed to delete blog post: ' + err.message)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) return
    setImporting(true)
    setImportError(null)
    setImportResult(null)
    try {
      const formData = new FormData()
      formData.append('file', importFile)
      const res = await fetch('/api/admin/import-wordpress', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Import failed')
      }
      setImportResult({
        inserted: data.inserted,
        skipped: data.skipped,
        categoriesAdded: data.categoriesAdded ?? 0,
      })
      setImportFile(null)
      fileInputRef.current?.form?.reset()
      await fetchPosts(1)
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const handlePodcastSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setPodcastSaving(true)
    setPodcastSyncError(null)
    try {
      const res = await fetch('/api/admin/podcast-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedUrl: podcastFeedUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setPodcastFeedUrl(data.feedUrl ?? '')
      setPodcastLastSynced(data.lastSyncedAt ?? null)
    } catch (err: unknown) {
      setPodcastSyncError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPodcastSaving(false)
    }
  }

  const handlePodcastSync = async () => {
    setPodcastSyncing(true)
    setPodcastSyncError(null)
    setPodcastSyncResult(null)
    try {
      const res = await fetch('/api/admin/podcast-sync', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sync failed')
      if (data.error) {
        setPodcastSyncError(data.error)
      } else {
      setPodcastSyncResult({ inserted: data.inserted, skipped: data.skipped })
      if (data.inserted > 0 || data.skipped >= 0) {
        const settingsRes = await fetch('/api/admin/podcast-settings')
        const settings = await settingsRes.json()
        if (settingsRes.ok && settings.lastSyncedAt) setPodcastLastSynced(settings.lastSyncedAt)
      }
      await fetchPosts(1)
      }
    } catch (err: unknown) {
      setPodcastSyncError(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setPodcastSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Blog Management</h1>
              <p className="text-secondary-600">Manage your blog posts and content</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/blog/new"
                className="btn-primary flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Post</span>
              </Link>
              <Link
                href="/admin/blog/categories"
                className="btn flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <TagIcon className="h-5 w-5" />
                <span>Categories</span>
              </Link>
              <Link
                href="/admin"
                className="btn"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn text-red-600 hover:text-red-700 hover:border-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Import from WordPress + Podcast RSS feed — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Import from WordPress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-w-0">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                <ArrowUpTrayIcon className="h-5 w-5 text-primary-600" />
                Import from WordPress
              </h2>
              <p className="text-sm text-secondary-600 mt-1">
                Upload a WordPress WXR export (XML) to import published posts. Dates, content, images, categories, and tags are preserved. Podcast posts are skipped (use RSS below).
              </p>
            </div>
            <form onSubmit={handleImportSubmit} className="p-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-0">
                <label htmlFor="wordpress-xml" className="block text-sm font-medium text-gray-700 mb-1">
                  XML file
                </label>
                <input
                  ref={fileInputRef}
                  id="wordpress-xml"
                  type="file"
                  accept=".xml,application/xml,text/xml"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    setImportFile(f ?? null)
                    setImportError(null)
                    setImportResult(null)
                  }}
                  disabled={importing}
                />
              </div>
              <button
                type="submit"
                disabled={!importFile || importing}
                className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Importing…
                  </>
                ) : (
                  <>
                    <ArrowUpTrayIcon className="h-4 w-4" />
                    Import
                  </>
                )}
              </button>
            </div>
            {importError && (
              <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-lg p-3">
                <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}
            {importResult && (
              <div className="mt-4 flex items-start gap-2 text-sm text-green-800 bg-green-50 rounded-lg p-3">
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Import complete: <strong>{importResult.inserted}</strong> posts imported, {importResult.skipped} skipped.
                  {importResult.categoriesAdded > 0 && ` ${importResult.categoriesAdded} new categor${importResult.categoriesAdded === 1 ? 'y' : 'ies'} added.`}
                </span>
              </div>
            )}
          </form>
          </div>

          {/* Podcast RSS feed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-w-0">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                <MicrophoneIcon className="h-5 w-5 text-primary-600" />
                Podcast RSS feed
              </h2>
              <p className="text-sm text-secondary-600 mt-1">
                Set an RSS feed URL to pull new podcast episodes into the blog under the Podcast category. Sync on save or manually; for hourly updates use an external cron (see docs).
              </p>
            </div>
            <form onSubmit={handlePodcastSettingsSave} className="p-6">
              {podcastSettingsLoading ? (
                <p className="text-sm text-secondary-500">Loading settings…</p>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-4">
                    <div className="flex-1 min-w-0">
                    <label htmlFor="podcast-feed-url" className="block text-sm font-medium text-gray-700 mb-1">
                      Feed URL
                    </label>
                    <input
                      id="podcast-feed-url"
                      type="url"
                      value={podcastFeedUrl}
                      onChange={(e) => setPodcastFeedUrl(e.target.value)}
                      placeholder="https://feeds.captivate.fm/your-show/"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      disabled={podcastSaving}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={podcastSaving}
                    className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-medium disabled:opacity-50"
                  >
                    {podcastSaving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePodcastSync}
                    disabled={podcastSyncing || !podcastFeedUrl}
                    className="btn flex items-center gap-2 px-5 py-2.5 text-sm font-medium disabled:opacity-50"
                  >
                    {podcastSyncing ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        Syncing…
                      </>
                    ) : (
                      <>
                        <ArrowPathIcon className="h-4 w-4" />
                        Sync now
                      </>
                    )}
                  </button>
                </div>
                {podcastLastSynced && (
                  <p className="mt-3 text-sm text-secondary-500">
                    Last synced: {new Date(podcastLastSynced).toLocaleString()}
                  </p>
                )}
                {podcastSyncError && (
                  <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-lg p-3">
                    <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{podcastSyncError}</span>
                  </div>
                )}
                {podcastSyncResult && (
                  <div className="mt-4 flex items-start gap-2 text-sm text-green-800 bg-green-50 rounded-lg p-3">
                    <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>
                      Sync complete: <strong>{podcastSyncResult.inserted}</strong> new episode{podcastSyncResult.inserted !== 1 ? 's' : ''} added, {podcastSyncResult.skipped} already present.
                    </span>
                  </div>
                )}
              </>
            )}
          </form>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-secondary-900">All Blog Posts</h2>
            {total > 0 && (
              <span className="text-sm text-secondary-500">
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
              </span>
            )}
          </div>
          
          {posts.length === 0 ? (
            <div className="p-6 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first blog post.</p>
              <Link
                href="/admin/blog/new"
                className="btn-primary inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create First Post</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 flex items-start space-x-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        {post.thumbnail ? (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-20 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{post.excerpt}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <span>•</span>
                          <span>{post.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="btn flex items-center space-x-2 px-4 py-2 text-sm"
                        title="View Post"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                      <Link
                        href={`/admin/blog/edit/${post.id}`}
                        className="btn-primary flex items-center space-x-2 px-4 py-2 text-sm"
                        title="Edit Post"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="btn flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:border-red-300"
                        title="Delete Post"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {total > pageSize && (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-secondary-600">
                Page {page} of {Math.ceil(total / pageSize)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="btn flex items-center gap-1 px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className="btn flex items-center gap-1 px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}