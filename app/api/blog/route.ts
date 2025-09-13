import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { BlogPost } from '@/types/firebase'

// Initialize Firestore
const db = adminDb

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')

    // If ID is provided, fetch single blog post
    if (id) {
      const postDoc = await db.collection('blogPosts').doc(id).get()
      
      if (!postDoc.exists) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        )
      }

      const post: BlogPost = {
        id: postDoc.id,
        ...postDoc.data()
      } as BlogPost

      return NextResponse.json(post, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
    }

    // For now, fetch all posts and filter in memory to avoid index requirements
    // TODO: Create Firestore composite index for better performance
    let query = db.collection('blogPosts').orderBy('createdAt', 'desc').limit(100) // Increased limit for filtering

    const snapshot = await query.get()
    let posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[]

    // Filter by published status
    if (published !== null) {
      posts = posts.filter(post => post.published === (published === 'true'))
    }

    // Filter by category
    if (category) {
      posts = posts.filter(post => post.category === category)
    }

    // Apply final limit
    posts = posts.slice(0, limit)

    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPost = await db.collection('blogPosts')
      .where('slug', '==', data.slug)
      .limit(1)
      .get()
    
    if (!existingPost.empty) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      )
    }

    // Create blog post
    const blogPostData = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt || '',
      mainImage: data.mainImage || '',
      thumbnail: data.thumbnail || '',
      authorName: data.authorName || 'Admin',
      authorEmail: data.authorEmail || 'admin@clearviewretreat.com',
      published: data.published || false,
      publishedAt: data.published ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
      category: data.category || 'general'
    }

    const docRef = await db.collection('blogPosts').add(blogPostData)
    const newPost: BlogPost = {
      id: docRef.id,
      ...blogPostData
    }

    return NextResponse.json(newPost, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      )
    }

    const data = await request.json()

    // Check if blog post exists
    const postDoc = await db.collection('blogPosts').doc(id).get()
    if (!postDoc.exists) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Check if slug is being changed and if new slug already exists
    if (data.slug && data.slug !== postDoc.data()?.slug) {
      const existingPost = await db.collection('blogPosts')
        .where('slug', '==', data.slug)
        .limit(1)
        .get()
      
      if (!existingPost.empty) {
        return NextResponse.json(
          { error: 'A blog post with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update blog post
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
      publishedAt: data.published && !postDoc.data()?.published ? new Date().toISOString() : postDoc.data()?.publishedAt,
      tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : postDoc.data()?.tags || []
    }

    await db.collection('blogPosts').doc(id).update(updateData)
    
    const updatedPost: BlogPost = {
      id,
      ...postDoc.data(),
      ...updateData
    } as BlogPost

    return NextResponse.json(updatedPost, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      )
    }

    // Check if blog post exists
    const postDoc = await db.collection('blogPosts').doc(id).get()
    if (!postDoc.exists) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Delete blog post
    await db.collection('blogPosts').doc(id).delete()

    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
