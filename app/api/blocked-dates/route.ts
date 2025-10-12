import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/sqlite'

// GET - Fetch all blocked date ranges
export async function GET(request: NextRequest) {
  try {
    const db = getDatabase()
    
    const blockedDates = db.prepare(`
      SELECT * FROM blocked_dates 
      WHERE is_active = 1 
      ORDER BY start_date ASC
    `).all()

    return NextResponse.json(blockedDates)
  } catch (error) {
    console.error('Error fetching blocked dates:', error)
    return NextResponse.json({ error: 'Failed to fetch blocked dates' }, { status: 500 })
  }
}

// POST - Create a new blocked date range
export async function POST(request: NextRequest) {
  try {
    const db = getDatabase()
    const body = await request.json()
    
    const { title, startDate, endDate, reason, isActive = true } = body

    // Validate required fields
    if (!title || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate date range
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({ error: 'Start date must be before end date' }, { status: 400 })
    }

    // Generate ID
    const id = `blocked_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const insertBlockedDate = db.prepare(`
      INSERT INTO blocked_dates (
        id, title, start_date, end_date, reason, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)

    insertBlockedDate.run(
      id,
      title,
      startDate,
      endDate,
      reason || '',
      isActive ? 1 : 0
    )

    return NextResponse.json({ 
      success: true, 
      blockedDate: { id, title, startDate, endDate, reason, isActive }
    })
  } catch (error) {
    console.error('Error creating blocked date:', error)
    return NextResponse.json({ error: 'Failed to create blocked date' }, { status: 500 })
  }
}

// PUT - Update an existing blocked date range
export async function PUT(request: NextRequest) {
  try {
    const db = getDatabase()
    const body = await request.json()
    
    const { id, title, startDate, endDate, reason, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'Blocked date ID is required' }, { status: 400 })
    }

    // Validate date range
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({ error: 'Start date must be before end date' }, { status: 400 })
    }

    const updateBlockedDate = db.prepare(`
      UPDATE blocked_dates 
      SET title = ?, start_date = ?, end_date = ?, 
          reason = ?, is_active = ?, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    const result = updateBlockedDate.run(
      title,
      startDate,
      endDate,
      reason || '',
      isActive ? 1 : 0,
      id
    )

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Blocked date not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating blocked date:', error)
    return NextResponse.json({ error: 'Failed to update blocked date' }, { status: 500 })
  }
}

// DELETE - Delete a blocked date range
export async function DELETE(request: NextRequest) {
  try {
    const db = getDatabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Blocked date ID is required' }, { status: 400 })
    }

    const deleteBlockedDate = db.prepare('DELETE FROM blocked_dates WHERE id = ?')
    const result = deleteBlockedDate.run(id)

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Blocked date not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blocked date:', error)
    return NextResponse.json({ error: 'Failed to delete blocked date' }, { status: 500 })
  }
}
