import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/sqlite'

// Registration API endpoint for events
export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json()
    
    // Validate required fields
    const requiredFields = ['eventId', 'firstName', 'lastName', 'email', 'phone']
    for (const field of requiredFields) {
      if (!registrationData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const db = getDatabase()
    
    // Table is created by lib/sqlite.ts initialization

    // Insert registration
    const insertStmt = db.prepare(`
      INSERT INTO registrations (
        event_id, user_name, user_email, phone, 
        num_attendees, special_requests, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    const fullName = `${registrationData.firstName} ${registrationData.lastName}`
    const result = insertStmt.run(
      registrationData.eventId,
      fullName,
      registrationData.email,
      registrationData.phone,
      1,
      registrationData.specialRequests || '',
      'confirmed'
    )

    // Update event attendee count
    const updateStmt = db.prepare(`
      UPDATE website_content 
      SET metadata = json_set(metadata, '$.currentAttendees', COALESCE(json_extract(metadata, '$.currentAttendees'), 0) + 1)
      WHERE id = ? AND json_extract(metadata, '$.name') LIKE 'Event%'
    `)
    updateStmt.run(registrationData.eventId)

    return NextResponse.json({ 
      success: true, 
      registrationId: result.lastInsertRowid,
      message: 'Registration successful' 
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Failed to process registration' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    const db = getDatabase()
    
    let query = 'SELECT * FROM registrations'
    let params: any[] = []
    
    if (eventId) {
      query += ' WHERE event_id = ?'
      params.push(eventId)
    }
    
    query += ' ORDER BY created_at DESC'
    
    const stmt = db.prepare(query)
    const registrations = eventId ? stmt.all(eventId) : stmt.all()

    return NextResponse.json({ registrations })

  } catch (error: any) {
    console.error('Get registrations error:', error)
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('id')
    const eventId = searchParams.get('eventId')

    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 })
    }

    const db = getDatabase()
    
    // Delete the registration
    const deleteStmt = db.prepare('DELETE FROM registrations WHERE id = ?')
    const result = deleteStmt.run(parseInt(registrationId))

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    // Update event attendee count if eventId is provided
    if (eventId) {
      const updateStmt = db.prepare(`
        UPDATE website_content 
        SET metadata = json_set(metadata, '$.currentAttendees', 
          CASE 
            WHEN COALESCE(json_extract(metadata, '$.currentAttendees'), 0) > 0 
            THEN COALESCE(json_extract(metadata, '$.currentAttendees'), 0) - 1 
            ELSE 0 
          END)
        WHERE id = ? AND json_extract(metadata, '$.name') LIKE 'Event%'
      `)
      updateStmt.run(eventId)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Registration deleted successfully' 
    })

  } catch (error: any) {
    console.error('Delete registration error:', error)
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('id')
    const updateData = await request.json()

    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 })
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone']
    for (const field of requiredFields) {
      if (!updateData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const db = getDatabase()
    
    // Update the registration
    const fullName = `${updateData.firstName} ${updateData.lastName}`
    const updateStmt = db.prepare(`
      UPDATE registrations 
      SET user_name = ?, user_email = ?, phone = ?, 
          special_requests = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    const result = updateStmt.run(
      fullName,
      updateData.email,
      updateData.phone,
      updateData.specialRequests || '',
      parseInt(registrationId)
    )

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Registration updated successfully' 
    })

  } catch (error: any) {
    console.error('Update registration error:', error)
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
  }
}
