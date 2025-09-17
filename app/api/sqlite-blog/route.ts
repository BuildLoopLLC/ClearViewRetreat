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

// GET - Fetch blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')

    const db = getDatabase()
    
    // If ID is provided, fetch single blog post
    if (id) {
      const query = 'SELECT * FROM blog_posts WHERE id = ?'
      const post = db.prepare(query).get(id) as BlogPost | undefined
      
      if (!post) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
      
      // Parse tags from JSON string
      const postWithParsedTags = {
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : []
      }
      
      return NextResponse.json(postWithParsedTags)
    }

    // Build query for multiple blog posts
    let query = 'SELECT * FROM blog_posts WHERE 1=1'
    const params: any[] = []
    
    if (published !== null) {
      query += ' AND published = ?'
      params.push(published === 'true' ? 1 : 0)
    }
    
    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }
    
    query += ' ORDER BY published_at DESC, created_at DESC LIMIT ?'
    params.push(limit)
    
    const posts = db.prepare(query).all(...params) as BlogPost[]
    
    // Parse tags for each post
    const postsWithParsedTags = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    }))
    
    return NextResponse.json(postsWithParsedTags)
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
    const post = select.get(id) as BlogPost
    
    const postWithParsedTags = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    }
    
    return NextResponse.json(postWithParsedTags)
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
    const post = select.get(id) as BlogPost
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    
    const postWithParsedTags = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    }
    
    return NextResponse.json(postWithParsedTags)
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
