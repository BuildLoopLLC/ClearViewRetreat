import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/sqlite'

// GET - Fetch all events
export async function GET(request: NextRequest) {
  try {
    const db = getDatabase()
    
    const events = db.prepare(`
      SELECT * FROM events 
      ORDER BY start_date ASC
    `).all()

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST - Create a new event
export async function POST(request: NextRequest) {
  try {
    const db = getDatabase()
    const body = await request.json()
    
    const { title, type, startDate, endDate, description, maxAttendees, isActive = true } = body

    // Validate required fields
    if (!title || !type || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate ID
    const id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const insertEvent = db.prepare(`
      INSERT INTO events (
        id, title, type, start_date, end_date, description, 
        max_attendees, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)

    insertEvent.run(
      id,
      title,
      type,
      startDate,
      endDate || startDate, // Use startDate as endDate if not provided
      description || '',
      maxAttendees || null,
      isActive ? 1 : 0
    )

    return NextResponse.json({ 
      success: true, 
      event: { id, title, type, startDate, endDate, description, maxAttendees, isActive }
    })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

// PUT - Update an existing event
export async function PUT(request: NextRequest) {
  try {
    const db = getDatabase()
    const body = await request.json()
    
    const { id, title, type, startDate, endDate, description, maxAttendees, isActive } = body

    console.log('PUT /api/events - Request body:', body)

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    // Validate required fields
    if (!title || !type || !startDate) {
      return NextResponse.json({ error: 'Missing required fields: title, type, startDate' }, { status: 400 })
    }

    // Validate date format
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate || startDate)
    
    console.log('Date validation:', {
      startDate,
      endDate,
      startDateObj: startDateObj.toISOString(),
      endDateObj: endDateObj.toISOString(),
      startValid: !isNaN(startDateObj.getTime()),
      endValid: !isNaN(endDateObj.getTime())
    })
    
    if (isNaN(startDateObj.getTime())) {
      return NextResponse.json({ error: `Invalid start date format: ${startDate}` }, { status: 400 })
    }
    
    if (endDate && isNaN(endDateObj.getTime())) {
      return NextResponse.json({ error: `Invalid end date format: ${endDate}` }, { status: 400 })
    }

    // Validate date range
    if (endDate && startDateObj > endDateObj) {
      return NextResponse.json({ error: `Start date (${startDate}) must be before end date (${endDate})` }, { status: 400 })
    }

    const updateEvent = db.prepare(`
      UPDATE events 
      SET title = ?, type = ?, start_date = ?, end_date = ?, 
          description = ?, max_attendees = ?, is_active = ?, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    const result = updateEvent.run(
      title,
      type,
      startDate,
      endDate || startDate,
      description || '',
      maxAttendees || null,
      isActive ? 1 : 0,
      id
    )

    console.log('Update result:', result)

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

// DELETE - Delete an event
export async function DELETE(request: NextRequest) {
  try {
    const db = getDatabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const deleteEvent = db.prepare('DELETE FROM events WHERE id = ?')
    const result = deleteEvent.run(id)

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
