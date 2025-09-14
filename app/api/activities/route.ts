import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

interface Activity {
  id: string
  action: string
  item: string
  section?: string
  user: string
  timestamp: string
  details?: string
  type: 'content' | 'blog' | 'event' | 'gallery' | 'category' | 'user'
  createdAt?: string
  updatedAt?: string
}

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch activities from Firebase
    const activitiesSnapshot = await db
      .collection('activities')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)
      .get()

    const activities: Activity[] = []
    activitiesSnapshot.forEach((doc) => {
      const data = doc.data()
      activities.push({
        id: doc.id,
        ...data,
      } as Activity)
    })

    return NextResponse.json(activities, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.action || !data.item || !data.user) {
      return NextResponse.json(
        { error: 'Action, item, and user are required' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const newActivity: Omit<Activity, 'id'> = {
      action: data.action,
      item: data.item,
      section: data.section,
      user: data.user,
      timestamp: now,
      details: data.details,
      type: data.type || 'content',
      createdAt: now,
      updatedAt: now
    }

    // Add to Firebase
    const docRef = await db.collection('activities').add(newActivity)
    
    // Get the created document with its ID
    const createdDoc = await docRef.get()
    const createdActivity = {
      id: createdDoc.id,
      ...createdDoc.data()
    } as Activity

    return NextResponse.json(createdActivity, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}

// Helper function to log activities (can be imported by other API routes)
export async function logActivity(activityData: Omit<Activity, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>) {
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