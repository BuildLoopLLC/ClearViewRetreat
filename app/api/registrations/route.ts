import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/sqlite'

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json()
    
    // Validate required fields
    const requiredFields = ['eventId', 'firstName', 'lastName', 'email', 'phone', 'emergencyContact', 'emergencyPhone', 'agreeToTerms']
    for (const field of requiredFields) {
      if (!registrationData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const db = getDatabase()
    
    // Create registrations table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        emergencyContact TEXT NOT NULL,
        emergencyPhone TEXT NOT NULL,
        dietaryRestrictions TEXT,
        specialRequests TEXT,
        agreeToTerms BOOLEAN NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert registration
    const insertStmt = db.prepare(`
      INSERT INTO registrations (
        eventId, firstName, lastName, email, phone, 
        emergencyContact, emergencyPhone, dietaryRestrictions, 
        specialRequests, agreeToTerms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = insertStmt.run(
      registrationData.eventId,
      registrationData.firstName,
      registrationData.lastName,
      registrationData.email,
      registrationData.phone,
      registrationData.emergencyContact,
      registrationData.emergencyPhone,
      registrationData.dietaryRestrictions || '',
      registrationData.specialRequests || '',
      registrationData.agreeToTerms ? 1 : 0
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
      query += ' WHERE eventId = ?'
      params.push(eventId)
    }
    
    query += ' ORDER BY createdAt DESC'
    
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
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'emergencyContact', 'emergencyPhone', 'agreeToTerms']
    for (const field of requiredFields) {
      if (!updateData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const db = getDatabase()
    
    // Update the registration
    const updateStmt = db.prepare(`
      UPDATE registrations 
      SET firstName = ?, lastName = ?, email = ?, phone = ?, 
          emergencyContact = ?, emergencyPhone = ?, dietaryRestrictions = ?, 
          specialRequests = ?, agreeToTerms = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    const result = updateStmt.run(
      updateData.firstName,
      updateData.lastName,
      updateData.email,
      updateData.phone,
      updateData.emergencyContact,
      updateData.emergencyPhone,
      updateData.dietaryRestrictions || '',
      updateData.specialRequests || '',
      updateData.agreeToTerms ? 1 : 0,
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
