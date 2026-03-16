import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  mainImage?: string
  thumbnail?: string
  authorName: string
  authorEmail: string
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: string
}

// Helper function to convert database fields to camelCase
function convertDbPostToResponse(post: any): BlogPost {
  // Safely parse tags - ensure it's always an array
  let tags: string[] = []
  if (post.tags) {
    try {
      // If it's already an array, use it directly
      if (Array.isArray(post.tags)) {
        tags = post.tags
      } else if (typeof post.tags === 'string') {
        // Try to parse JSON string
        const parsed = JSON.parse(post.tags)
        tags = Array.isArray(parsed) ? parsed : []
      }
    } catch (error) {
      // If parsing fails, default to empty array
      console.warn('Failed to parse tags for post:', post.id, error)
      tags = []
    }
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    mainImage: post.main_image,
    thumbnail: post.thumbnail,
    authorName: post.author_name,
    authorEmail: post.author_email,
    published: post.published === 1,
    publishedAt: post.published_at,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    tags: tags,
    category: post.category
  }
}

// GET - Fetch blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')

    const db = getDatabase()
    
    // If ID is provided, fetch single blog post by ID
    if (id) {
      const query = 'SELECT * FROM blog_posts WHERE id = ?'
      const post = db.prepare(query).get(id)
      
      if (!post) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
      
      return NextResponse.json(convertDbPostToResponse(post))
    }
    
    // If slug is provided, fetch single blog post by slug
    if (slug) {
      const query = 'SELECT * FROM blog_posts WHERE slug = ?'
      const post = db.prepare(query).get(slug)
      
      if (!post) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
      
      return NextResponse.json(convertDbPostToResponse(post))
    }

    // Pagination and search (only when page is explicitly set)
    const pageParam = searchParams.get('page')
    const pageSizeParam = searchParams.get('pageSize')
    const search = (searchParams.get('search') ?? searchParams.get('q') ?? '').trim()
    const usePagination = pageParam != null && pageParam !== ''
    const page = usePagination ? Math.max(1, parseInt(pageParam, 10) || 1) : 1
    const pageSize = pageSizeParam ? Math.min(100, Math.max(1, parseInt(pageSizeParam, 10) || 12)) : 12

    // Build base WHERE for list
    let where = 'WHERE 1=1'
    const params: any[] = []

    if (published !== null) {
      where += ' AND published = ?'
      params.push(published === 'true' ? 1 : 0)
    }

    if (category) {
      where += ' AND category = ?'
      params.push(category)
    }

    if (search) {
      const term = `%${search}%`
      where += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR tags LIKE ?)'
      params.push(term, term, term, term)
    }

    const orderBy = 'ORDER BY COALESCE(published_at, created_at) DESC, created_at DESC'

    // Paginated response (when ?page= is provided)
    if (usePagination) {
      const countRow = db.prepare(`SELECT COUNT(*) as total FROM blog_posts ${where}`).get(...params) as { total: number }
      const total = countRow.total
      const offset = (page - 1) * pageSize
      const listQuery = `SELECT * FROM blog_posts ${where} ${orderBy} LIMIT ? OFFSET ?`
      const posts = db.prepare(listQuery).all(...params, pageSize, offset)
      const convertedPosts = posts.map((post: any) => convertDbPostToResponse(post))
      return NextResponse.json({
        posts: convertedPosts,
        total,
        page,
        pageSize,
      })
    }

    // Legacy: no page param – return plain array with limit
    const listQuery = `SELECT * FROM blog_posts ${where} ${orderBy} LIMIT ?`
    const posts = db.prepare(listQuery).all(...params, limit)
    const convertedPosts = posts.map((post: any) => convertDbPostToResponse(post))
    return NextResponse.json(convertedPosts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.content || !data.authorName || !data.authorEmail || !data.category) {
      return NextResponse.json(
        { error: 'Title, content, authorName, authorEmail, and category are required' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    const id = generateId()
    const now = new Date().toISOString()
    
    // Generate slug from title
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const insert = db.prepare(`
      INSERT INTO blog_posts (
        id, title, slug, content, excerpt, main_image, thumbnail,
        author_name, author_email, published, published_at,
        created_at, updated_at, tags, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    insert.run(
      id,
      data.title,
      slug,
      data.content,
      data.excerpt || '',
      data.mainImage || null,
      data.thumbnail || null,
      data.authorName,
      data.authorEmail,
      data.published ? 1 : 0,
      data.published ? now : null,
      now,
      now,
      JSON.stringify(data.tags || []),
      data.category
    )
    
    // Return the created post
    const select = db.prepare('SELECT * FROM blog_posts WHERE id = ?')
    const post = select.get(id) as any
    
    const convertedPost = convertDbPostToResponse(post)
    
    return NextResponse.json(convertedPost)
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}

// PUT - Update existing blog post
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 })
    }

    const data = await request.json()
    const db = getDatabase()
    const now = new Date().toISOString()
    
    const update = db.prepare(`
      UPDATE blog_posts SET
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        content = COALESCE(?, content),
        excerpt = COALESCE(?, excerpt),
        main_image = COALESCE(?, main_image),
        thumbnail = COALESCE(?, thumbnail),
        author_name = COALESCE(?, author_name),
        author_email = COALESCE(?, author_email),
        published = COALESCE(?, published),
        published_at = COALESCE(?, published_at),
        updated_at = ?,
        tags = COALESCE(?, tags),
        category = COALESCE(?, category)
      WHERE id = ?
    `)
    
    update.run(
      data.title || null,
      data.slug || null,
      data.content || null,
      data.excerpt || null,
      data.mainImage || null,
      data.thumbnail || null,
      data.authorName || null,
      data.authorEmail || null,
      data.published !== undefined ? (data.published ? 1 : 0) : null,
      data.publishedAt || null,
      now,
      data.tags ? JSON.stringify(data.tags) : null,
      data.category || null,
      id
    )
    
    // Return the updated post
    const select = db.prepare('SELECT * FROM blog_posts WHERE id = ?')
    const post = select.get(id) as any
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    
    const convertedPost = convertDbPostToResponse(post)
    
    return NextResponse.json(convertedPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

// DELETE - Delete blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 })
    }

    const db = getDatabase()
    
    const deleteQuery = db.prepare('DELETE FROM blog_posts WHERE id = ?')
    const result = deleteQuery.run(id)
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
