import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Helper function to log activities
async function logActivity(activityData: {
  action: string
  item: string
  section?: string
  user: string
  details?: string
  type: 'content' | 'blog' | 'event' | 'gallery' | 'category' | 'user'
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    })
    
    if (!response.ok) {
      console.error('Failed to log activity:', await response.text())
    }
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

// Cache duration: 5 minutes (same as client-side)
const CACHE_DURATION = 5 * 60

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const subsection = searchParams.get('subsection')
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section parameter is required' },
        { status: 400 }
      )
    }

    // Query Firestore directly using admin SDK
    let query = db.collection('websiteContent').where('section', '==', section)
    
    // Add subsection filter if provided
    if (subsection) {
      query = query.where('subsection', '==', subsection)
    }
    
    const snapshot = await query.get()
    
    const content = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Sort by order
    const sortedContent = content.sort((a, b) => (a.order || 0) - (b.order || 0))
    
    // Create response with caching headers
    const response = NextResponse.json(sortedContent)
    
    // Set cache headers
    response.headers.set('Cache-Control', `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`)
    response.headers.set('CDN-Cache-Control', `public, max-age=${CACHE_DURATION}`)
    response.headers.set('Vercel-CDN-Cache-Control', `public, max-age=${CACHE_DURATION}`)
    
    return response
  } catch (error: any) {
    console.error('Error fetching website content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Add required fields
    const contentData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Create Firestore document using admin SDK
    const docRef = await db.collection('websiteContent').add(contentData)
    
    // Log activity
    await logActivity({
      action: 'Content created',
      item: contentData.name || 'New content item',
      section: contentData.section,
      user: contentData.user || 'admin@clearviewretreat.com',
      details: `Created new ${contentData.section || 'content'} item`,
      type: 'content'
    })
    
    // Return success response with the new document ID
    const response = NextResponse.json({ 
      success: true, 
      id: docRef.id 
    })
    
    // Clear cache for the updated section by setting no-cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('Error creating website content:', error)
    return NextResponse.json(
      { error: 'Failed to create content' },
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
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }

    const updates = await request.json()
    
    // Get the current document to determine section and item name
    const docSnapshot = await db.collection('websiteContent').doc(id).get()
    const currentData = docSnapshot.data()
    
    // Update Firestore document directly using admin SDK
    await db.collection('websiteContent').doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    
    // Log activity
    await logActivity({
      action: 'Content updated',
      item: updates.name || currentData?.name || 'Content item',
      section: currentData?.section,
      user: updates.user || 'admin@clearviewretreat.com',
      details: `Updated ${updates.name || currentData?.name || 'content item'}`,
      type: 'content'
    })
    
    // Return success response
    const response = NextResponse.json({ success: true })
    
    // Clear cache for the updated section by setting no-cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('Error updating website content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
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
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }

    // Get the document before deleting to log activity
    const docSnapshot = await db.collection('websiteContent').doc(id).get()
    const docData = docSnapshot.data()
    
    // Delete Firestore document using admin SDK
    await db.collection('websiteContent').doc(id).delete()
    
    // Log activity
    await logActivity({
      action: 'Content deleted',
      item: docData?.name || 'Content item',
      section: docData?.section,
      user: 'admin@clearviewretreat.com', // No user info available for DELETE
      details: `Deleted ${docData?.name || 'content item'}`,
      type: 'content'
    })
    
    // Return success response
    const response = NextResponse.json({ success: true })
    
    // Clear cache for the updated section by setting no-cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error: any) {
    console.error('Error deleting website content:', error)
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}
