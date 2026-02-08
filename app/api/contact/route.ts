import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'
import { sendNotification } from '@/lib/email'

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'message']
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const db = getDatabase()
    const id = generateId()

    // Save contact submission to database
    db.prepare(`
      INSERT INTO contact_submissions 
      (id, first_name, last_name, email, phone, subject, message, newsletter_opt_in, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `).run(
      id,
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone || null,
      formData.subject || 'General Inquiry',
      formData.message,
      formData.newsletterOptIn ? 1 : 0
    )

    // If user opted into newsletter, add to subscribers
    if (formData.newsletterOptIn) {
      try {
        const existingSubscriber = db.prepare(
          'SELECT id FROM newsletter_subscribers WHERE email = ?'
        ).get(formData.email)
        
        if (!existingSubscriber) {
          db.prepare(`
            INSERT INTO newsletter_subscribers 
            (id, email, first_name, last_name, source, is_active)
            VALUES (?, ?, ?, ?, 'contact_form', 1)
          `).run(generateId(), formData.email, formData.firstName, formData.lastName)

          // Send newsletter signup notification
          sendNotification('newsletter_signup', {
            email: formData.email,
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            source: 'Contact Form'
          }, formData.email).catch(err => {
            console.error('Failed to send newsletter notification:', err)
          })
        }
      } catch (e) {
        console.error('Error adding newsletter subscriber:', e)
      }
    }

    // Send contact form notification email
    sendNotification('contact_form', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject || 'General Inquiry',
      message: formData.message,
      newsletterOptIn: formData.newsletterOptIn ? 'Yes' : 'No'
    }, formData.email).catch(err => {
      console.error('Failed to send contact form notification:', err)
    })

    return NextResponse.json({ 
      success: true, 
      submissionId: id,
      message: 'Your message has been received. We\'ll get back to you within 24 hours.'
    })

  } catch (error: any) {
    console.error('Contact form submission error:', error)
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
  }
}

// GET - Get contact submissions (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    const db = getDatabase()
    
    let query = 'SELECT * FROM contact_submissions'
    const params: any[] = []
    
    if (status) {
      query += ' WHERE status = ?'
      params.push(status)
    }
    
    query += ' ORDER BY created_at DESC'
    
    if (limit) {
      query += ' LIMIT ?'
      params.push(parseInt(limit))
    }
    
    const submissions = db.prepare(query).all(...params)

    return NextResponse.json(submissions)

  } catch (error: any) {
    console.error('Get contact submissions error:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

// PUT - Update submission status
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const db = getDatabase()

    db.prepare(`
      UPDATE contact_submissions 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(data.status, id)

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Update submission error:', error)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}

// DELETE - Delete submission
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const db = getDatabase()
    db.prepare('DELETE FROM contact_submissions WHERE id = ?').run(id)

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Delete submission error:', error)
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 })
  }
}

