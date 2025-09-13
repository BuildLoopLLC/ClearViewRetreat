import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

interface Activity {
  id: string
  action: string
  item: string
  section?: string
  user: string
  timestamp: string
  details?: string
  type: 'content' | 'blog' | 'event' | 'gallery' | 'category' | 'user'
}

// In-memory storage for demo purposes
// In production, this would be stored in Firestore
let activities: Activity[] = [
  {
    id: 'act-1',
    action: 'Content updated',
    item: 'Hero section',
    section: 'hero',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    details: 'Updated primary CTA button text',
    type: 'content'
  },
  {
    id: 'act-2',
    action: 'Content updated',
    item: 'About section',
    section: 'about',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    details: 'Updated mission statement',
    type: 'content'
  },
  {
    id: 'act-3',
    action: 'Content updated',
    item: 'Features section',
    section: 'features',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    details: 'Added new retreat feature',
    type: 'content'
  },
  {
    id: 'act-4',
    action: 'Blog post created',
    item: 'Welcome to ClearView Retreat',
    section: 'blog',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    details: 'Published new blog post about our retreat center',
    type: 'blog'
  },
  {
    id: 'act-5',
    action: 'Event created',
    item: 'Spring Wellness Retreat',
    section: 'events',
    user: 'admin@clearviewretreat.com',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    details: 'Scheduled new wellness retreat for April',
    type: 'event'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')

    let filteredActivities = activities

    // Filter by type if specified
    if (type) {
      filteredActivities = activities.filter(activity => activity.type === type)
    }

    // Sort by timestamp (newest first) and limit results
    const sortedActivities = filteredActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    return NextResponse.json(sortedActivities, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
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

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      action: data.action,
      item: data.item,
      section: data.section,
      user: data.user,
      timestamp: new Date().toISOString(),
      details: data.details,
      type: data.type || 'content'
    }

    // Add to beginning of array (newest first)
    activities.unshift(newActivity)

    // Keep only last 100 activities to prevent memory issues
    if (activities.length > 100) {
      activities = activities.slice(0, 100)
    }

    return NextResponse.json(newActivity, {
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
export async function logActivity(activityData: Omit<Activity, 'id' | 'timestamp'>) {
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
