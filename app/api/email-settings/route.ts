import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, generateId } from '@/lib/sqlite'
import { testEmailConfig, initializeNotificationSettings } from '@/lib/email'

// GET - Get all email settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const db = getDatabase()
    
    // Initialize default notification settings if needed
    initializeNotificationSettings()

    if (type === 'smtp') {
      // Get SMTP settings
      let settings = db.prepare('SELECT * FROM email_settings WHERE id = ?').get('main') as any
      
      if (!settings) {
        // Create default settings
        db.prepare(`
          INSERT INTO email_settings (id, from_name, smtp_port, smtp_secure, is_configured)
          VALUES ('main', 'Clear View Retreat', 587, 0, 0)
        `).run()
        settings = db.prepare('SELECT * FROM email_settings WHERE id = ?').get('main')
      }
      
      // Don't send password to frontend
      if (settings) {
        settings.smtp_password = settings.smtp_password ? '********' : null
      }
      
      return NextResponse.json(settings)
    }

    if (type === 'notifications') {
      // Get notification settings
      const settings = db.prepare('SELECT * FROM email_notification_settings').all()
      return NextResponse.json(settings)
    }

    if (type === 'recipients') {
      // Get email recipients
      const recipients = db.prepare('SELECT * FROM email_recipients ORDER BY created_at DESC').all() as any[]
      return NextResponse.json(recipients.map(r => ({
        ...r,
        notification_types: JSON.parse(r.notification_types || '[]'),
        is_active: Boolean(r.is_active)
      })))
    }

    // Return all settings
    let smtpSettings = db.prepare('SELECT * FROM email_settings WHERE id = ?').get('main') as any
    const notificationSettings = db.prepare('SELECT * FROM email_notification_settings').all()
    const recipients = db.prepare('SELECT * FROM email_recipients ORDER BY created_at DESC').all() as any[]

    if (smtpSettings) {
      smtpSettings.smtp_password = smtpSettings.smtp_password ? '********' : null
    }

    return NextResponse.json({
      smtp: smtpSettings,
      notifications: notificationSettings,
      recipients: recipients.map(r => ({
        ...r,
        notification_types: JSON.parse(r.notification_types || '[]'),
        is_active: Boolean(r.is_active)
      }))
    })
  } catch (error: any) {
    console.error('Error getting email settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create or update settings
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const data = await request.json()

    const db = getDatabase()

    if (type === 'smtp') {
      // Update SMTP settings
      const existing = db.prepare('SELECT * FROM email_settings WHERE id = ?').get('main') as any
      
      // Only update password if it's not masked or empty (keep existing)
      const password = (!data.smtp_password || data.smtp_password === '********')
        ? existing?.smtp_password 
        : data.smtp_password

      console.log('Saving SMTP settings:', {
        host: data.smtp_host,
        port: data.smtp_port,
        user: data.smtp_user,
        receivedPassword: data.smtp_password ? (data.smtp_password === '********' ? 'MASKED' : `NEW (${data.smtp_password.length} chars)`) : 'EMPTY',
        existingPassword: existing?.smtp_password ? `EXISTS (${existing.smtp_password.length} chars)` : 'NONE',
        savingPassword: password ? `SAVING (${password.length} chars)` : 'EMPTY'
      })

      if (existing) {
        db.prepare(`
          UPDATE email_settings 
          SET smtp_host = ?, smtp_port = ?, smtp_secure = ?, 
              smtp_user = ?, smtp_password = ?, from_email = ?, 
              from_name = ?, reply_to = ?, is_configured = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `).run(
          data.smtp_host,
          data.smtp_port || 587,
          data.smtp_secure ? 1 : 0,
          data.smtp_user,
          password,
          data.from_email,
          data.from_name || 'Clear View Retreat',
          data.reply_to,
          data.is_configured ? 1 : 0
        )
        
        // Verify it was saved
        const verify = db.prepare('SELECT smtp_password FROM email_settings WHERE id = ?').get('main') as any
        console.log('Verified saved password:', verify?.smtp_password ? `EXISTS (${verify.smtp_password.length} chars)` : 'EMPTY')
      } else {
        db.prepare(`
          INSERT INTO email_settings 
          (id, smtp_host, smtp_port, smtp_secure, smtp_user, smtp_password, from_email, from_name, reply_to, is_configured)
          VALUES ('main', ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          data.smtp_host,
          data.smtp_port || 587,
          data.smtp_secure ? 1 : 0,
          data.smtp_user,
          password,
          data.from_email,
          data.from_name || 'Clear View Retreat',
          data.reply_to,
          data.is_configured ? 1 : 0
        )
      }

      return NextResponse.json({ success: true })
    }

    if (type === 'notification') {
      // Update specific notification settings
      db.prepare(`
        UPDATE email_notification_settings 
        SET is_enabled = ?, send_to_admin = ?, send_to_user = ?,
            admin_subject_template = ?, user_subject_template = ?,
            admin_body_template = ?, user_body_template = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE notification_type = ?
      `).run(
        data.is_enabled ? 1 : 0,
        data.send_to_admin ? 1 : 0,
        data.send_to_user ? 1 : 0,
        data.admin_subject_template,
        data.user_subject_template,
        data.admin_body_template,
        data.user_body_template,
        data.notification_type
      )

      return NextResponse.json({ success: true })
    }

    if (type === 'recipient') {
      // Add new recipient
      const id = generateId()
      db.prepare(`
        INSERT INTO email_recipients (id, email, name, notification_types, is_active)
        VALUES (?, ?, ?, ?, 1)
      `).run(
        id,
        data.email,
        data.name || null,
        JSON.stringify(data.notification_types || ['event_registration', 'contact_form', 'newsletter_signup', 'volunteer_form'])
      )

      return NextResponse.json({ success: true, id })
    }

    if (type === 'test') {
      // Test email configuration
      const result = await testEmailConfig(data.testEmail)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: any) {
    console.error('Error updating email settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update recipient
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
      UPDATE email_recipients 
      SET email = ?, name = ?, notification_types = ?, is_active = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.email,
      data.name || null,
      JSON.stringify(data.notification_types || []),
      data.is_active ? 1 : 0,
      id
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating recipient:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remove recipient
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const db = getDatabase()
    db.prepare('DELETE FROM email_recipients WHERE id = ?').run(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting recipient:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

