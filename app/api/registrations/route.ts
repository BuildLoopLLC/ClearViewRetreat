import { NextRequest, NextResponse } from 'next/server'
import { openDatabase } from '@/lib/sqlite'

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

    const db = await openDatabase()
    
    // Create registrations table if it doesn't exist
    await db.exec(`
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
    const result = await db.run(
      `INSERT INTO registrations (
        eventId, firstName, lastName, email, phone, 
        emergencyContact, emergencyPhone, dietaryRestrictions, 
        specialRequests, agreeToTerms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    )

    // Update event attendee count
    await db.run(
      `UPDATE content 
       SET metadata = json_set(metadata, '$.currentAttendees', COALESCE(json_extract(metadata, '$.currentAttendees'), 0) + 1)
       WHERE id = ? AND json_extract(metadata, '$.name') LIKE 'Event%'`,
      [registrationData.eventId]
    )

    await db.close()

    return NextResponse.json({ 
      success: true, 
      registrationId: result.lastID,
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

    const db = await openDatabase()
    
    let query = 'SELECT * FROM registrations'
    let params: any[] = []
    
    if (eventId) {
      query += ' WHERE eventId = ?'
      params.push(eventId)
    }
    
    query += ' ORDER BY createdAt DESC'
    
    const registrations = await db.all(query, params)
    await db.close()

    return NextResponse.json({ registrations })

  } catch (error: any) {
    console.error('Get registrations error:', error)
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}
