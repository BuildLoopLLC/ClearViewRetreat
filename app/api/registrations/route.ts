import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'
import { sendNotification } from '@/lib/email'

// Registration API endpoint for events
export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json()
    
    // Validate required fields (phone is optional for group retreat registrations)
    const requiredFields = ['eventId', 'firstName', 'lastName', 'email']
    for (const field of requiredFields) {
      if (!registrationData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const db = getDatabase()
    
    // Check if this is a group retreat registration
    const isGroupRetreat = registrationData.eventId?.startsWith('group-retreat-')
    
    // Disable foreign key constraints to allow group retreat registrations
    // and handle cases where event_id might not exist in events table
    let originalForeignKeys: any = null
    try {
      originalForeignKeys = db.pragma('foreign_keys', { simple: true })
      db.pragma('foreign_keys = OFF')
    } catch (e) {
      // If pragma fails, foreign keys might not be enabled - that's fine
      console.log('Foreign keys pragma not available, continuing...')
    }
    
    // Generate registration ID before try block so it's accessible
    const registrationId = generateId()
    const fullName = `${registrationData.firstName} ${registrationData.lastName}`
    
    try {
      // Insert registration
      const insertStmt = db.prepare(`
        INSERT INTO registrations (
          id, event_id, user_name, user_email, phone, 
          num_attendees, special_requests, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      insertStmt.run(
        registrationId,
        registrationData.eventId,
        fullName,
        registrationData.email,
        registrationData.phone || '',
        1,
        registrationData.specialRequests || '',
        'confirmed'
      )
    } catch (insertError: any) {
      // If insert fails due to foreign key constraint, try to fix the table structure
      if (insertError.message?.includes('FOREIGN KEY') || insertError.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        console.log('Foreign key constraint detected, migrating table structure...')
        try {
          // Recreate table without foreign key constraint
          db.exec(`
            CREATE TABLE IF NOT EXISTS registrations_new (
              id TEXT PRIMARY KEY,
              event_id TEXT NOT NULL,
              user_name TEXT NOT NULL,
              user_email TEXT NOT NULL,
              phone TEXT,
              num_attendees INTEGER DEFAULT 1,
              special_requests TEXT,
              status TEXT DEFAULT 'pending',
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
          `)
          db.exec('INSERT INTO registrations_new SELECT * FROM registrations')
          db.exec('DROP TABLE registrations')
          db.exec('ALTER TABLE registrations_new RENAME TO registrations')
          
          // Retry insert after migration
          const insertStmt = db.prepare(`
            INSERT INTO registrations (
              id, event_id, user_name, user_email, phone, 
              num_attendees, special_requests, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `)
          insertStmt.run(
            registrationId,
            registrationData.eventId,
            fullName,
            registrationData.email,
            registrationData.phone || '',
            1,
            registrationData.specialRequests || '',
            'confirmed'
          )
        } catch (migrationError) {
          console.error('Failed to migrate table:', migrationError)
          throw insertError // Re-throw original error
        }
      } else {
        throw insertError
      }
    } finally {
      // Restore foreign key constraints if we disabled them
      if (originalForeignKeys !== null) {
        try {
          db.pragma(`foreign_keys = ${originalForeignKeys ? 'ON' : 'OFF'}`)
        } catch (e) {
          // Ignore errors restoring pragma
        }
      }
    }

    // Only update event attendee count for actual events (not group retreat registrations)
    if (!isGroupRetreat) {
      try {
        const updateStmt = db.prepare(`
          UPDATE website_content 
          SET metadata = json_set(metadata, '$.currentAttendees', COALESCE(json_extract(metadata, '$.currentAttendees'), 0) + 1)
          WHERE id = ? AND json_extract(metadata, '$.name') LIKE 'Event%'
        `)
        updateStmt.run(registrationData.eventId)
      } catch (e) {
        // Event might not exist in website_content, that's okay
        console.log('Could not update event attendee count:', e)
      }
    }

    // Get event details for email
    let eventTitle = 'Event'
    let eventDate = ''
    
    if (isGroupRetreat) {
      // For group retreat registrations, use the registration type name
      eventTitle = registrationData.registrationTypeName || 'Group Retreat Registration'
      eventDate = 'TBD'
    } else {
      // For regular event registrations, look up event details
      // Try website_content first (most common location for events)
      try {
        const eventContent = db.prepare(
          "SELECT content, metadata FROM website_content WHERE id = ?"
        ).get(registrationData.eventId) as any
        
        if (eventContent?.metadata) {
          const metadata = typeof eventContent.metadata === 'string' 
            ? JSON.parse(eventContent.metadata) 
            : eventContent.metadata
          
          eventTitle = metadata.title || metadata.name || 'Event'
          
          // Format date range if both start and end dates exist
          if (metadata.startDate) {
            const startDate = new Date(metadata.startDate)
            const endDate = metadata.endDate ? new Date(metadata.endDate) : null
            
            if (endDate && startDate.getTime() !== endDate.getTime()) {
              // Date range
              eventDate = `${startDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} - ${endDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}`
            } else {
              // Single date
              eventDate = startDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            }
          } else {
            eventDate = 'TBD'
          }
        }
      } catch (e) {
        console.log('Event not found in website_content, trying events table...', e)
      }
      
      // If not found in website_content, try events table
      if (eventTitle === 'Event' || !eventDate) {
        try {
          const event = db.prepare('SELECT * FROM events WHERE id = ?').get(registrationData.eventId) as any
          if (event) {
            eventTitle = event.title || 'Event'
            
            // Format date range if both start and end dates exist
            if (event.start_date) {
              const startDate = new Date(event.start_date)
              const endDate = event.end_date ? new Date(event.end_date) : null
              
              if (endDate && startDate.getTime() !== endDate.getTime()) {
                // Date range
                eventDate = `${startDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} - ${endDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}`
              } else {
                // Single date
                eventDate = startDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              }
            } else {
              eventDate = 'TBD'
            }
          }
        } catch (e2) {
          console.error('Could not get event details from events table:', e2)
        }
      }
      
      // If still no event found, log for debugging
      if (eventTitle === 'Event') {
        console.warn(`Event not found for eventId: ${registrationData.eventId}`)
      }
    }

    // Ensure eventDate has a value
    const formattedEventDate = eventDate || 'TBD'
    
    // Send email notification
    sendNotification('event_registration', {
      eventTitle: eventTitle || 'Event',
      eventDate: formattedEventDate,
      userName: fullName,
      userEmail: registrationData.email,
      userPhone: registrationData.phone || 'Not provided',
      specialRequests: registrationData.specialRequests || 'None',
      adminUrl: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/registrations`
    }, registrationData.email).catch(err => {
      console.error('Failed to send registration notification:', err)
    })

    return NextResponse.json({ 
      success: true, 
      registrationId: registrationId,
      message: 'Registration successful' 
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Failed to process registration: ' + (error.message || 'Unknown error') }, { status: 500 })
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
    const rawRegistrations = eventId ? stmt.all(eventId) : stmt.all()

    // Transform database format to admin page format
    const registrations = (rawRegistrations as any[]).map((reg: any) => {
      // Parse user_name to get firstName and lastName
      const nameParts = (reg.user_name || '').split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      return {
        id: reg.id,
        eventId: reg.event_id,
        firstName: firstName,
        lastName: lastName,
        email: reg.user_email,
        phone: reg.phone || '',
        emergencyContact: '', // Not stored in current schema
        emergencyPhone: '', // Not stored in current schema
        dietaryRestrictions: '', // Not stored in current schema
        specialRequests: reg.special_requests || '',
        agreeToTerms: false, // Not stored in current schema
        createdAt: reg.created_at || reg.createdAt || ''
      }
    })

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
    
    // Delete the registration (id is TEXT, not INTEGER)
    const deleteStmt = db.prepare('DELETE FROM registrations WHERE id = ?')
    const result = deleteStmt.run(registrationId)

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
      registrationId
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
