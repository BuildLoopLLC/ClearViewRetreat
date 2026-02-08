import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'
import { sendNotification } from '@/lib/email'

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const db = getDatabase()

    // Check if already subscribed
    const existing = db.prepare(
      'SELECT id, is_active FROM newsletter_subscribers WHERE email = ?'
    ).get(data.email) as any

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json({ 
          success: true, 
          message: 'You\'re already subscribed to our newsletter!' 
        })
      } else {
        // Reactivate subscription
        db.prepare(`
          UPDATE newsletter_subscribers 
          SET is_active = 1, unsubscribed_at = NULL, 
              first_name = COALESCE(?, first_name),
              last_name = COALESCE(?, last_name),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(data.firstName || null, data.lastName || null, existing.id)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Welcome back! Your subscription has been reactivated.' 
        })
      }
    }

    // Create new subscription
    const id = generateId()
    db.prepare(`
      INSERT INTO newsletter_subscribers 
      (id, email, first_name, last_name, source, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(
      id,
      data.email,
      data.firstName || null,
      data.lastName || null,
      data.source || 'website'
    )

    // Send notification
    sendNotification('newsletter_signup', {
      email: data.email,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      source: data.source || 'Website'
    }, data.email).catch(err => {
      console.error('Failed to send newsletter notification:', err)
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for subscribing! You\'ll receive updates about retreats and ministry news.' 
    })

  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}

// GET - Get all subscribers (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') !== 'false'

    const db = getDatabase()
    
    let query = 'SELECT * FROM newsletter_subscribers'
    if (activeOnly) {
      query += ' WHERE is_active = 1'
    }
    query += ' ORDER BY created_at DESC'
    
    const subscribers = db.prepare(query).all()

    return NextResponse.json(subscribers)

  } catch (error: any) {
    console.error('Get subscribers error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

// DELETE - Unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const id = searchParams.get('id')

    if (!email && !id) {
      return NextResponse.json({ error: 'Email or ID required' }, { status: 400 })
    }

    const db = getDatabase()

    if (id) {
      db.prepare(`
        UPDATE newsletter_subscribers 
        SET is_active = 0, unsubscribed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(id)
    } else {
      db.prepare(`
        UPDATE newsletter_subscribers 
        SET is_active = 0, unsubscribed_at = CURRENT_TIMESTAMP
        WHERE email = ?
      `).run(email)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'You have been unsubscribed from our newsletter.' 
    })

  } catch (error: any) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }
}

