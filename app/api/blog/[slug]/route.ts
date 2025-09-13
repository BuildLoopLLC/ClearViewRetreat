import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { BlogPost } from '@/types/firebase'

// Initialize Firestore
const db = adminDb

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Find blog post by slug
    const snapshot = await db.collection('blogPosts')
      .where('slug', '==', slug)
      .where('published', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    const doc = snapshot.docs[0]
    const post: BlogPost = {
      id: doc.id,
      ...doc.data()
    } as BlogPost

    return NextResponse.json(post, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}
