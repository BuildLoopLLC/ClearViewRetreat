import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'

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

// GET - Fetch activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const db = getDatabase()
    
    const query = `
      SELECT * FROM activities 
      ORDER BY timestamp DESC 
      LIMIT ? OFFSET ?
    `
    
    const activities = db.prepare(query).all(limit, offset) as Activity[]

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

// POST - Create new activity
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

    const db = getDatabase()
    const id = generateId()
    const now = new Date().toISOString()
    
    const insert = db.prepare(`
      INSERT INTO activities (
        id, action, item, section, user, timestamp, details, type, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    insert.run(
      id,
      data.action,
      data.item,
      data.section || null,
      data.user,
      now,
      data.details || null,
      data.type || 'content',
      now,
      now
    )
    
    // Return the created activity
    const select = db.prepare('SELECT * FROM activities WHERE id = ?')
    const activity = select.get(id) as Activity

    return NextResponse.json(activity, {
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
